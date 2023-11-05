/* eslint-disable linebreak-style */
/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes');
const errorHandler = require('./middlewares/error-handler');
require('dotenv').config();
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');
const { limiter } = require('./middlewares/limiter');

const { PORT = 3001, DB_URL = 'mongodb://127.0.0.1:27017/moviesdb' } = process.env;

const app = express();

app.use(helmet());

app.use(limiter);

app.use(bodyParser.json());

app.use(requestLogger);

app.use(cors);

app.use(router);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to moviesdb');
  });

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
