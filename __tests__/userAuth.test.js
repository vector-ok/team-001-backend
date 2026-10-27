import request from 'supertest';

import app from '../src/app';
import UserModel from '../src/models/user';
import { verifyPassword } from '../src/services/authService';
import { bearer, createToken } from './helpers/tokens';
import { clearDatabase, startDatabase, stopDatabase } from './helpers/database';

const signupPayload = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  password: 'secret123',
  phoneNumber: '08012345678',
  city: 'Lagos'
};

beforeAll(startDatabase);
afterAll(stopDatabase);
afterEach(clearDatabase);

describe('POST /api/auth/signup', () => {
  it('creates a user and hashes the password', async () => {
    const response = await request(app).post('/api/auth/signup').send(signupPayload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User added successfully' });

    const stored = await UserModel.findOne({ email: signupPayload.email });
    expect(stored).not.toBeNull();
    expect(stored.password).not.toBe(signupPayload.password);
    expect(await verifyPassword(signupPayload.password, stored.password)).toBe(true);
  });

  it('returns 400 with the offending fields when the payload is invalid', async () => {
    const response = await request(app).post('/api/auth/signup').send({ email: 'not-an-email' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid request payload.');
    expect(response.body.details.map((detail) => detail.field)).toEqual(
      expect.arrayContaining(['firstName', 'lastName', 'email', 'password'])
    );
  });

  it('returns 409 when the email is already registered', async () => {
    await request(app).post('/api/auth/signup').send(signupPayload);
    const response = await request(app).post('/api/auth/signup').send(signupPayload);

    expect(response.status).toBe(409);
    expect(response.body.message).toContain('email');
  });

  it('drops fields the schema does not declare', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ ...signupPayload, isAdmin: true });

    const stored = await UserModel.findOne({ email: signupPayload.email });
    expect(stored.isAdmin).toBeUndefined();
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/signup').send(signupPayload);
  });

  it('returns the profile plus a token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: signupPayload.email, password: signupPayload.password });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.userId).toEqual(expect.any(String));
    expect(response.body.firstName).toBe('Ada');
    expect(response.body).not.toHaveProperty('password');
  });

  it('rejects a wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: signupPayload.email, password: 'wrong-password' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect username or password!');
  });

  it('rejects unknown accounts', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: signupPayload.password });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('User not found!');
  });
});

describe('PUT /api/auth/updateUser/:id', () => {
  const update = (id, body, token) => {
    const httpRequest = request(app).put(`/api/auth/updateUser/${id}`).send(body);
    return token ? httpRequest.set('Authorization', bearer(token)) : httpRequest;
  };

  it('requires a bearer token', async () => {
    const stored = await UserModel.create({ ...signupPayload });

    const response = await update(stored._id, { city: 'Abuja' });

    expect(response.status).toBe(401);
  });

  it('updates the profile without touching the password', async () => {
    const stored = await UserModel.create({ ...signupPayload });
    const token = createToken({ userId: stored._id.toString() });

    const response = await update(stored._id, { city: 'Abuja' }, token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User updated successfully' });

    const updated = await UserModel.findById(stored._id);
    expect(updated.city).toBe('Abuja');
    expect(updated.password).toBe(stored.password);
  });

  it('re-hashes a new password', async () => {
    const stored = await UserModel.create({ ...signupPayload });
    const token = createToken({ userId: stored._id.toString() });

    await update(stored._id, { password: 'brand-new-pass' }, token);

    const updated = await UserModel.findById(stored._id);
    expect(await verifyPassword('brand-new-pass', updated.password)).toBe(true);
  });

  it('refuses to update an account as an admin', async () => {
    const stored = await UserModel.create({ ...signupPayload });
    const token = createToken({ userId: stored._id.toString() });

    const response = await update(stored._id, { role: 'admin' }, token);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Log in as user!');
  });

  it('returns 404 for an unknown account', async () => {
    const token = createToken();

    const response = await update('64b7f0e7f1f1f1f1f1f1f1f1', { city: 'Abuja' }, token);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Account not found.');
  });
});
