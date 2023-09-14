const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movie');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const celebrate = require('../middlewares/celebrate');
const NotFoundError = require('../errors/notfound-error');

router.post('/signin', celebrate.login, login);
router.post('/signup', celebrate.createUser, createUser);

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.use('*', auth, (req, res, next) => next(new NotFoundError('Некорректный путь')));

module.exports = router;
