import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { connect, disconnect } from '../src/db';

describe('db module', () => {
  it('refuses to connect without a connection string', async () => {
    await expect(connect('')).rejects.toThrow(/connection string is missing/i);
  });

  it('connects and disconnects', async () => {
    const server = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } });

    try {
      const connection = await connect(server.getUri('db_module_test'));
      expect(connection.readyState).toBe(1);

      await disconnect();
      expect(mongoose.connection.readyState).toBe(0);
    } finally {
      await server.stop();
    }
  });
});
