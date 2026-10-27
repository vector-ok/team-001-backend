import request from 'supertest';

import app from '../src/app';
import AdminModel from '../src/models/admin';
import { bearer, createToken } from './helpers/tokens';
import { clearDatabase, startDatabase, stopDatabase } from './helpers/database';

const adminPayload = {
  firstName: 'Grace',
  lastName: 'Hopper',
  email: 'grace@example.com',
  password: 'secret123',
  phoneNumber: '08012345678',
  role: 'admin'
};

beforeAll(startDatabase);
afterAll(stopDatabase);
afterEach(clearDatabase);

describe('POST /api/auth/admin/signup', () => {
  it('creates an admin', async () => {
    const response = await request(app).post('/api/auth/admin/signup').send(adminPayload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Admin added successfully' });
    expect(await AdminModel.countDocuments()).toBe(1);
  });

  it('rejects payloads without the admin role', async () => {
    const { role, ...withoutRole } = adminPayload;

    const response = await request(app).post('/api/auth/admin/signup').send(withoutRole);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Permission denied!');
  });

  it('rejects non admin roles', async () => {
    const response = await request(app)
      .post('/api/auth/admin/signup')
      .send({ ...adminPayload, role: 'trainee' });

    expect(response.status).toBe(401);
    expect(await AdminModel.countDocuments()).toBe(0);
  });

  it('returns 400 for an invalid payload', async () => {
    const response = await request(app)
      .post('/api/auth/admin/signup')
      .send({ ...adminPayload, password: 'short' });

    expect(response.status).toBe(400);
    expect(response.body.details.map((detail) => detail.field)).toContain('password');
  });
});

describe('POST /api/auth/admin/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/admin/signup').send(adminPayload);
  });

  it('returns the admin profile and a token', async () => {
    const response = await request(app)
      .post('/api/auth/admin/login')
      .send({ email: adminPayload.email, password: adminPayload.password, role: 'admin' });

    expect(response.status).toBe(200);
    expect(response.body.adminId).toEqual(expect.any(String));
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.role).toBe('admin');
  });

  it('rejects logins that do not claim the admin role', async () => {
    const response = await request(app)
      .post('/api/auth/admin/login')
      .send({ email: adminPayload.email, password: adminPayload.password, role: 'trainee' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Admin not found!');
  });

  it('rejects a wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/admin/login')
      .send({ email: adminPayload.email, password: 'wrong-password', role: 'admin' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect admin name or password!');
  });

  it('rejects unknown emails', async () => {
    const response = await request(app)
      .post('/api/auth/admin/login')
      .send({ email: 'nobody@example.com', password: adminPayload.password, role: 'admin' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Admin not found!');
  });
});

describe('PUT /api/auth/admin/updateAdmin/:id', () => {
  it('updates an admin when authorised', async () => {
    const admin = await AdminModel.create({ ...adminPayload, password: 'hashed' });
    const token = createToken({ adminId: admin._id.toString(), userId: undefined });

    const response = await request(app)
      .put(`/api/auth/admin/updateAdmin/${admin._id}`)
      .set('Authorization', bearer(token))
      .send({ city: 'Abuja', role: 'admin' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Admin updated successfully' });

    const updated = await AdminModel.findById(admin._id);
    expect(updated.city).toBe('Abuja');
  });

  it('requires a token', async () => {
    const admin = await AdminModel.create({ ...adminPayload, password: 'hashed' });

    const response = await request(app)
      .put(`/api/auth/admin/updateAdmin/${admin._id}`)
      .send({ city: 'Abuja', role: 'admin' });

    expect(response.status).toBe(401);
  });
});
