
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
// const app = async () => '#BuildforSDG'

const eventRoute = require('./routes/events');
const fundRoute = require('./routes/funds');
const announceRoute = require('./routes/announce');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');

const app = express();

const CONNECTION_STRING = process.env.STRING;

mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to database MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

// Set headers to prevent cors error
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/events', eventRoute);
app.use('/api/funds', fundRoute);
app.use('/api/announcement', announceRoute);
app.use('/api/auth', userRoute);
app.use('/api/auth', adminRoute);

module.exports = app;
