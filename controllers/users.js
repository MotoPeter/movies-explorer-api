/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { httpConstants } = require('../utils/constants');
const NotFoundError = require('../errors/notfound-error');
const BadRequest = require('../errors/badrequest-error');
const ConflictError = require('../errors/conflict-error');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const getUser = (req, res, next) => {
  const userId = req.params.userId ? req.params.userId : req.user._id;
  User.findById(userId)
    .orFail(() => new NotFoundError(`Пользователь id: ${userId} не найден`))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequest(`Некорректные данные: ${userId}`));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then(() => res.status(httpConstants.HTTP_STATUS_CREATED).send({
      email, name,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные'));
      } if (err.code === 11000) {
        return next(new ConflictError(`Пользователь с email '${email}' уже существует.`));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          `Пользователь id: ${req.user._id} не найден`,
        );
      }
      return res.send(user);
    })
    .catch((err) => {
      // eslint-disable-next-line no-constant-condition
      if (err.name === 'ValidationError' || 'CastError') {
        return next(new BadRequest('Некорректные данные'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password, name } = req.body;
  return User.findUserByCredentials(email, password, name)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  login,
};
