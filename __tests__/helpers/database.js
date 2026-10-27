const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { connect, disconnect } = require('../../src/db');

let server;

/**
 * Boots a throwaway MongoDB for a suite. Model.init() makes sure the unique
 * indexes exist before the tests start writing duplicates.
 */
const startDatabase = async () => {
  server = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } });
  await connect(server.getUri('betalife_test'));
  await Promise.all(mongoose.modelNames().map((name) => mongoose.model(name).init()));
};

const clearDatabase = async () => {
  const { collections } = mongoose.connection;

  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
};

const stopDatabase = async () => {
  await disconnect();
  if (server) await server.stop();
};

module.exports = { startDatabase, clearDatabase, stopDatabase };
