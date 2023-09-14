const httpConstants = require('http2').constants;

const allowedCors = [
  'http://localhost:3001',
  'https://localhost:3001',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  httpConstants,
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};