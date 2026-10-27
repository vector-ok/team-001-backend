const mongoose = require('mongoose');

const CONNECTION_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

/**
 * Liveness probe used by the platform. It reports the Mongoose readyState so a
 * load balancer can tell an unhealthy instance from a healthy one.
 */
const health = (req, res) => {
  const { readyState } = mongoose.connection;

  res.status(200).json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    database: {
      state: CONNECTION_STATES[readyState] || 'unknown',
      readyState
    }
  });
};

module.exports = { health };
