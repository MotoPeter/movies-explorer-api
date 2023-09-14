const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const UnauthorizedError = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: [30, 'Максимальная длинна 30 символов'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Некорректный формат email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      // проверяем хеши паролей]
      if (!matched) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль.'));
      }

      return user; // теперь user доступен
    });
  });
};

module.exports = mongoose.model('user', userSchema);
