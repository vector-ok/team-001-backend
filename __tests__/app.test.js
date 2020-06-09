import app from '../src/app';

describe('app module', () => {
  test('it exists', async () => {
    await expect(app).toBeDefined();
  });
});
