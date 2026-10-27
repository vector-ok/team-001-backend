const http = require('http');
const app = require('./app');
const { config, assertConfig } = require('./config');
const { connect, disconnect } = require('./db');
const logger = require('./utils/logger');

const start = async () => {
  assertConfig();
  await connect();

  app.set('port', config.port);
  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(config.port, resolve);
  });

  logger.info({ port: config.port, env: config.nodeEnv }, 'Betalife API is listening');

  let closing = false;
  const shutDown = (signal) => {
    if (closing) return;
    closing = true;

    logger.info({ signal }, 'Shutting down');
    server.close(async () => {
      await disconnect();
      process.exit(0);
    });
  };

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => shutDown(signal));
  });
};

start().catch((error) => {
  logger.fatal({ err: error }, 'Unable to start the API');
  process.exit(1);
});
