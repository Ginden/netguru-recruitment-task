import { Lifecycle, RouteOptionsValidate, ServerRoute } from '@hapi/hapi';
import { object, ObjectSchema, string } from 'joi';
import { authorizationHeadersRequired, notNull } from '../../helpers';
import { MovieRepository } from '../../services/movie-repository';
import { OmdbApiClient } from '../../services/omdb-api-client';

export const submitMovieHandler: Lifecycle.Method = async (request, h) => {
  const { title } = request.payload as { title: string };
  const omdbApi = new OmdbApiClient();
  const imdbMovieDetails = await omdbApi.getByTitleOrId({ t: title });
  await request.plugins.typeorm.transaction((t) => {
    return t
      .getCustomRepository(MovieRepository)
      .saveMovieSubmittedByUser(
        notNull(request.auth.credentials.user),
        imdbMovieDetails,
      );
  });

  return h.response({
    status: 'OK',
  });
};

const submitMovieRequestValidator: RouteOptionsValidate = {
  headers: authorizationHeadersRequired,
  payload: object({
    title: string().required().example('Sound of Metal'),
  }).label('SubmitMoviePayload'),
};

const submitMovieResponse: ObjectSchema = object({
  status: string().valid('OK').required(),
}).label('SubmitMovieResponse');

export const submitMovieRoute: ServerRoute = {
  path: '/movies',
  method: 'POST',
  handler: submitMovieHandler,
  options: {
    validate: submitMovieRequestValidator,
    response: {
      schema: submitMovieResponse,
    },
    tags: ['api'],
  },
};
