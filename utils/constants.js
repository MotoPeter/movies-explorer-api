const httpConstants = require('http2').constants;

const allowedCors = [
  'http://localhost:3001',
  'https://localhost:3001',
  'http://localhost:3000',
  'https://localhost:3000',
  'https://me.motopeter.nomoredomainsrocks.ru',
  'http://me.motopeter.nomoredomainsrocks.ru',
  'https://api.me.motopeter.nomoredomainsrocks.ru',
  'http://api.me.motopeter.nomoredomainsrocks.ru',

];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  httpConstants,
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};
