import { Lifecycle, RouteOptionsValidate, ServerRoute } from '@hapi/hapi';
import { array, object, ObjectSchema, string } from 'joi';
import { authorizationHeadersRequired, notNull } from '../../../helpers';
import {
  MovieRepository,
  SanitizedMovie,
} from '../../../services/movie-repository';
import { OmdbApi } from '../../../services/omdb-api';

export const listMoviesHandler: Lifecycle.Method = async (request, h) => {
  const movies = await request.plugins.typeorm
    .getCustomRepository(MovieRepository)
    .listMoviesByUser(notNull(request.auth.credentials.user));
  return h.response({ movies });
};

const listMoviesRequestValidator: RouteOptionsValidate = {
  headers: authorizationHeadersRequired,
};

const listMoviesResponse: ObjectSchema = object({
  movies: array().items(
    object<SanitizedMovie>({
      details: object().unknown(),
      director: string(),
      genre: string(),
      released: string(),
      title: string(),
      imdbId: string(),
    }).label('Movie'),
  ),
}).label('ListMoviesResponse');

export const listMoviesRoute: ServerRoute = {
  path: '/movies',
  method: 'GET',
  handler: listMoviesHandler,
  options: {
    validate: listMoviesRequestValidator,
    response: {
      schema: listMoviesResponse,
    },
    tags: ['api'],
  },
};
