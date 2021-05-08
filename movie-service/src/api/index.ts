import { ServerRoute } from '@hapi/hapi';
import { authRoute } from './auth/login';
import { listMoviesRoute } from './movies/list-movies';
import { submitMovieRoute } from './movies/submit-movie';

export const routes: ServerRoute[] = [
  authRoute,
  submitMovieRoute,
  listMoviesRoute,
];
