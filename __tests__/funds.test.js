import request from 'supertest';

import app from '../src/app';
import FundModel from '../src/models/fundModel';
import { bearer, createToken } from './helpers/tokens';
import { clearDatabase, startDatabase, stopDatabase } from './helpers/database';

const fundPayload = {
  title: 'Youth grant',
  description: 'Funding for young founders',
  website: 'https://example.com/grant',
  fundingBody: 'Acme Foundation'
};

let token;

beforeAll(async () => {
  await startDatabase();
  token = createToken();
});
afterAll(stopDatabase);
afterEach(clearDatabase);

describe('funds API', () => {
  it('rejects unauthenticated writes', async () => {
    const response = await request(app).post('/api/funds').send(fundPayload);

    expect(response.status).toBe(401);
  });

  it('creates a fund', async () => {
    const response = await request(app).post('/api/funds').set('Authorization', bearer(token)).send(fundPayload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Funding post successful!' });
    expect(await FundModel.countDocuments()).toBe(1);
  });

  it('accepts a client supplied id', async () => {
    const id = '64b7f0e7f1f1f1f1f1f1f1f1';

    await request(app)
      .post('/api/funds')
      .set('Authorization', bearer(token))
      .send({ ...fundPayload, id });

    const stored = await FundModel.findById(id);
    expect(stored).not.toBeNull();
  });

  it('rejects invalid ids', async () => {
    const response = await request(app)
      .post('/api/funds')
      .set('Authorization', bearer(token))
      .send({ ...fundPayload, id: 'abc' });

    expect(response.status).toBe(400);
    expect(response.body.details.map((detail) => detail.field)).toContain('id');
  });

  it('returns 400 when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/funds')
      .set('Authorization', bearer(token))
      .send({ title: 'No description' });

    expect(response.status).toBe(400);
    expect(response.body.details.map((detail) => detail.field)).toContain('description');
  });

  it('lists funds', async () => {
    await FundModel.create([fundPayload, { ...fundPayload, title: 'Second grant' }]);

    const response = await request(app).get('/api/funds');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('returns a single fund', async () => {
    const fund = await FundModel.create(fundPayload);

    const response = await request(app).get(`/api/funds/${fund._id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(fundPayload.title);
  });

  it('returns 404 for an unknown fund', async () => {
    const response = await request(app).get('/api/funds/64b7f0e7f1f1f1f1f1f1f1f1');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Fund not found.');
  });

  it('updates a fund', async () => {
    const fund = await FundModel.create(fundPayload);

    const response = await request(app)
      .put(`/api/funds/${fund._id}`)
      .set('Authorization', bearer(token))
      .send({ title: 'Youth grant 2024' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Funding updated successfully!' });

    const updated = await FundModel.findById(fund._id);
    expect(updated.title).toBe('Youth grant 2024');
    expect(updated.fundingBody).toBe(fundPayload.fundingBody);
  });

  it('deletes a fund', async () => {
    const fund = await FundModel.create(fundPayload);

    const response = await request(app).delete(`/api/funds/${fund._id}`).set('Authorization', bearer(token));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Fund deleted!' });
    expect(await FundModel.findById(fund._id)).toBeNull();
  });
});
