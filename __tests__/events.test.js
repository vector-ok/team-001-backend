import request from 'supertest';
import fs from 'fs';
import path from 'path';

import app from '../src/app';
import EventModel from '../src/models/eventModel';
import { bearer, createToken } from './helpers/tokens';
import { clearDatabase, startDatabase, stopDatabase } from './helpers/database';

const eventPayload = {
  title: 'Career fair',
  description: 'Meet employers from across the country',
  category: 'career',
  location: 'Lagos',
  imageUrl: 'photo.jpg',
  startDate: '2024-05-01',
  postedBy: 'Ada'
};

let token;

beforeAll(async () => {
  await startDatabase();
  token = createToken();
});
afterAll(stopDatabase);
afterEach(clearDatabase);

describe('POST /api/events', () => {
  it('requires authentication', async () => {
    const response = await request(app).post('/api/events').send(eventPayload);

    expect(response.status).toBe(401);
    expect(await EventModel.countDocuments()).toBe(0);
  });

  it('creates an event and stores an absolute image url', async () => {
    const response = await request(app).post('/api/events').set('Authorization', bearer(token)).send(eventPayload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Event post successful!' });

    const stored = await EventModel.findOne({ title: eventPayload.title });
    expect(stored.category).toBe('career');
    expect(stored.imageUrl).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/images\/photo\.jpg$/);
    expect(stored.startDate).toBeInstanceOf(Date);
  });

  it('keeps absolute image urls untouched', async () => {
    await request(app)
      .post('/api/events')
      .set('Authorization', bearer(token))
      .send({ ...eventPayload, imageUrl: 'https://cdn.example.com/photo.jpg' });

    const stored = await EventModel.findOne({ title: eventPayload.title });
    expect(stored.imageUrl).toBe('https://cdn.example.com/photo.jpg');
  });

  it('returns 400 when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/events')
      .set('Authorization', bearer(token))
      .send({ title: 'Only a title' });

    expect(response.status).toBe(400);
    expect(response.body.details.map((detail) => detail.field)).toEqual(
      expect.arrayContaining(['description', 'category'])
    );
  });

  it('stores an uploaded banner and links it to the event', async () => {
    const response = await request(app)
      .post('/api/events')
      .set('Authorization', bearer(token))
      .field('title', 'Hackathon')
      .field('description', 'Build something in a weekend')
      .field('category', 'career')
      .attach('image', Buffer.from('fake-banner'), 'banner.png');

    expect(response.status).toBe(201);

    const stored = await EventModel.findOne({ title: 'Hackathon' });
    expect(stored.imageUrl).toMatch(/\/images\/banner_\d+\.png$/);

    fs.unlinkSync(path.join(__dirname, '..', 'src', 'images', path.basename(stored.imageUrl)));
  });
});

describe('GET /api/events', () => {
  it('lists every event', async () => {
    await EventModel.create([eventPayload, { ...eventPayload, title: 'Hackathon' }]);

    const response = await request(app).get('/api/events');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('returns a single event', async () => {
    const event = await EventModel.create(eventPayload);

    const response = await request(app).get(`/api/events/${event._id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(eventPayload.title);
  });

  it('returns 404 for an unknown event', async () => {
    const response = await request(app).get('/api/events/64b7f0e7f1f1f1f1f1f1f1f1');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Event not found.');
  });

  it('returns 400 for a malformed id', async () => {
    const response = await request(app).get('/api/events/not-an-id');

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid value for _id');
  });
});

describe('PUT /api/events/:id', () => {
  it('updates the fields that were sent', async () => {
    const event = await EventModel.create(eventPayload);

    const response = await request(app)
      .put(`/api/events/${event._id}`)
      .set('Authorization', bearer(token))
      .send({ title: 'Career fair 2024' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Event updated successfully!' });

    const updated = await EventModel.findById(event._id);
    expect(updated.title).toBe('Career fair 2024');
    expect(updated.description).toBe(eventPayload.description);
  });

  it('accepts the legacy eventModel payload', async () => {
    const event = await EventModel.create(eventPayload);

    const response = await request(app)
      .put(`/api/events/${event._id}`)
      .set('Authorization', bearer(token))
      .send({ eventModel: JSON.stringify({ title: 'Renamed', category: 'career' }) });

    expect(response.status).toBe(200);
    expect((await EventModel.findById(event._id)).title).toBe('Renamed');
  });

  it('rejects malformed eventModel json', async () => {
    const event = await EventModel.create(eventPayload);

    const response = await request(app)
      .put(`/api/events/${event._id}`)
      .set('Authorization', bearer(token))
      .send({ eventModel: 'not json' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('eventModel must be valid JSON.');
  });

  it('returns 404 for an unknown event', async () => {
    const response = await request(app)
      .put('/api/events/64b7f0e7f1f1f1f1f1f1f1f1')
      .set('Authorization', bearer(token))
      .send({ title: 'Renamed' });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /api/events/:id', () => {
  it('deletes an event', async () => {
    const event = await EventModel.create(eventPayload);

    const response = await request(app).delete(`/api/events/${event._id}`).set('Authorization', bearer(token));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Event deleted!' });
    expect(await EventModel.findById(event._id)).toBeNull();
  });

  it('returns 404 when the event is already gone', async () => {
    const response = await request(app)
      .delete('/api/events/64b7f0e7f1f1f1f1f1f1f1f1')
      .set('Authorization', bearer(token));

    expect(response.status).toBe(404);
  });
});
