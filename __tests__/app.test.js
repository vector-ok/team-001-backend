import request from 'supertest';
import fs from 'fs';
import path from 'path';

import app from '../src/app';

describe('app shell', () => {
  it('serves the default home route', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('You wound up in our backend default home!');
  });

  it('reports health with the database readyState', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.database).toEqual({
      state: expect.any(String),
      readyState: expect.any(Number)
    });
  });

  it('allows cross origin requests to the API', async () => {
    const response = await request(app).get('/health');

    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.headers['access-control-allow-methods']).toContain('DELETE');
  });

  it('answers unknown routes with a JSON 404', async () => {
    const response = await request(app).get('/nope');

    expect(response.status).toBe(404);
    expect(response.body.message).toContain('was not found');
  });

  it('rejects malformed JSON bodies', async () => {
    const response = await request(app).post('/images').set('Content-Type', 'application/json').send('{"broken"');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Request body is not valid JSON.');
  });

  it('rejects an image upload without a file', async () => {
    const response = await request(app).post('/images');

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('No image uploaded');
  });

  it('stores an uploaded image', async () => {
    const stored = path.join(__dirname, '..', 'src', 'images', 'test-upload.png');

    const response = await request(app)
      .post('/images')
      .attach('image', Buffer.from('not-really-a-png'), 'test-upload.png');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'File uploaded!',
      file: 'test-upload.png'
    });
    expect(fs.existsSync(stored)).toBe(true);

    fs.unlinkSync(stored);
  });
});
