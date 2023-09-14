const BadRequest = require('../errors/badrequest-error');
const ForbidenError = require('../errors/forbiden-error');
const NotFoundError = require('../errors/notfound-error');
const Movie = require('../models/movie');
const { httpConstants } = require('../utils/constants');

const getMovies = (_req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((next));
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.findById(req.params._id)
    .orFail(() => new NotFoundError(`Фильм id: ${req.params._id} не найден`))
    .then((movie) => {
      if (movie.owner.toString() !== owner) {
        throw new ForbidenError('У вас нет прав на удаление фильма');
      }
      return Movie.findByIdAndRemove(req.params._id);
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequest(`Некорректные данные: ${req.params._id}`));
      }
      return next(err);
    });
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(httpConstants.HTTP_STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
};
