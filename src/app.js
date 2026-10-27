const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');

const { config } = require('./config');
const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { health } = require('./controllers/health');
const { uploadImage } = require('./controllers/images');

const eventRoute = require('./routes/events');
const fundRoute = require('./routes/funds');
const announceRoute = require('./routes/announce');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');

const app = express();

app.disable('x-powered-by');
app.use(requestLogger);

// Set headers to prevent cors error.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json({ limit: '1mb' }));

// handle images.
app.use('/images', express.static(path.join(__dirname, 'images')));
app.post('/images', fileUpload({ createParentPath: true, limits: { fileSize: config.maxUploadBytes } }), uploadImage);

app.get('/health', health);

app.use('/api/events', eventRoute);
app.use('/api/funds', fundRoute);
app.use('/api/announcement', announceRoute);
app.use('/api/auth', userRoute);
app.use('/api/auth', adminRoute);

app.get('/', (req, res) => {
  res.json({
    message: 'You wound up in our backend default home!'
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
