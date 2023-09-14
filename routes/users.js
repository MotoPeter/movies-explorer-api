/* eslint-disable import/no-extraneous-dependencies */
const userRouter = require('express').Router();
const celebrate = require('../middlewares/celebrate');
const {
  getUser,
  updateUser,
} = require('../controllers/users');

userRouter.get('/me', celebrate.getUser, getUser);

userRouter.patch('/me', celebrate.updateUser, updateUser);

module.exports = userRouter;
