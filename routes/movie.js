const movieRouter = require('express').Router();
const celebrate = require('../middlewares/celebrate');
const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);

movieRouter.delete('/:_id', celebrate.getMovie, deleteMovie);

movieRouter.post('/', celebrate.createMovie, createMovie);

module.exports = movieRouter;
