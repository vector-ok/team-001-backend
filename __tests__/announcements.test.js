import request from 'supertest';

import app from '../src/app';
import AnnounceModel from '../src/models/announceModel';
import { bearer, createToken } from './helpers/tokens';
import { clearDatabase, startDatabase, stopDatabase } from './helpers/database';

const announcementPayload = {
  title: 'Bootcamp starts Monday',
  description: 'All trainees should be online by 9am',
  postedBy: 'Grace',
  trainee: true,
  admin: false
};

let token;

beforeAll(async () => {
  await startDatabase();
  token = createToken();
});
afterAll(stopDatabase);
afterEach(clearDatabase);

describe('announcements API', () => {
  it('creates an announcement', async () => {
    const response = await request(app)
      .post('/api/announcement')
      .set('Authorization', bearer(token))
      .send(announcementPayload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Announcement post successful!' });
    expect(await AnnounceModel.countDocuments()).toBe(1);
  });

  it('rejects unauthenticated writes', async () => {
    const response = await request(app).post('/api/announcement').send(announcementPayload);

    expect(response.status).toBe(401);
  });

  it('rejects payloads without a description', async () => {
    const response = await request(app)
      .post('/api/announcement')
      .set('Authorization', bearer(token))
      .send({ title: 'Missing body' });

    expect(response.status).toBe(400);
    expect(response.body.details.map((detail) => detail.field)).toContain('description');
  });

  it('lists announcements', async () => {
    await AnnounceModel.create([announcementPayload, { ...announcementPayload, title: 'Second notice' }]);

    const response = await request(app).get('/api/announcement');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('returns a single announcement', async () => {
    const announcement = await AnnounceModel.create(announcementPayload);

    const response = await request(app).get(`/api/announcement/${announcement._id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(announcementPayload.title);
  });

  it('returns 404 for an unknown announcement', async () => {
    const response = await request(app).get('/api/announcement/64b7f0e7f1f1f1f1f1f1f1f1');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Announcement not found.');
  });

  it('updates an announcement', async () => {
    const announcement = await AnnounceModel.create(announcementPayload);

    const response = await request(app)
      .put(`/api/announcement/${announcement._id}`)
      .set('Authorization', bearer(token))
      .send({ title: 'Bootcamp starts Tuesday' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Announcement updated successfully!' });
    expect((await AnnounceModel.findById(announcement._id)).title).toBe('Bootcamp starts Tuesday');
  });

  it('deletes an announcement', async () => {
    const announcement = await AnnounceModel.create(announcementPayload);

    const response = await request(app)
      .delete(`/api/announcement/${announcement._id}`)
      .set('Authorization', bearer(token));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Announcement deleted!' });
    expect(await AnnounceModel.findById(announcement._id)).toBeNull();
  });
});
