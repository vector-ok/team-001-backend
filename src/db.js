const mongoose = require('mongoose');
const { config } = require('./config');
const logger = require('./utils/logger');

/**
 * Opens the MongoDB connection. Kept out of src/app.js so the Express app can
 * be imported by tests without needing a live database.
 */
const connect = async (uri = config.mongoUri) => {
  if (!uri) {
    throw new Error('MongoDB connection string is missing. Set STRING in your environment.');
  }

  if (mongoose.connection.readyState === 1) return mongoose.connection;

  await mongoose.connect(uri);
  logger.info({ database: mongoose.connection.name }, 'Connected to MongoDB');
  return mongoose.connection;
};

const disconnect = async () => {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB');
};

module.exports = { connect, disconnect };
