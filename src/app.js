const express = require('express');
// const app = async () => '#BuildforSDG';

const app = express();

app.use((req, res) => {
  res.json({
    message: 'Express app request was successful!'
  });
});

module.exports = app;
