const express = require('express');

const app = express();
const mongoose = require('mongoose');
const router = require('./routes/route');

const PORT = process.env.PORT || 3500;
const dbConnect = require('./config/db');
require('dotenv').config();
// cors

// logger

// middleware
dbConnect();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// router
app.use(router);

app.get('/health', (req, res) => {
  res.status(200).json({
    successful: true,
    timestamp: Date.now(),
    status: 200,
  });
});

// catch all request
app.all('*', (req, res) => {
  res.status(404).json({
    error: '404 Not Found',
    timestamp: Date.now(),
    status: 400,
  });
});

// error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const error = err.message || '500 Internal Server Error';
  const { data } = err;
  res.status(status).json({
    error,
    timestamp: Date.now(),
    status,
    message: data,
  });
});

mongoose.connection.once('open', () => {
  console.log('Mongo DB Connected Successfully!');
  app.listen(PORT, () => console.log(`Server is running! ${PORT}`));
});
