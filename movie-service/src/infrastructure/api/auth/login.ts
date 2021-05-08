import { Lifecycle, RouteOptionsValidate, ServerRoute } from '@hapi/hapi';
import { object, ObjectSchema, string } from 'joi';
import { authorizationHeadersRequired } from '../../../helpers';
import { Auth } from '../../../services/auth';

export const authHandler: Lifecycle.Method = async (request, h) => {
  const { username, password } = request.payload as {
    username: string;
    password: string;
  };
  const authService = new Auth();
  const token = await authService.authenticate(username, password);
  return h.response({
    token,
  });
};

const authRequestValidator: RouteOptionsValidate = {
  payload: object({
    username: string().required(),
    password: string().required(),
  }).label('AuthPayload'),
};

const authResponse: ObjectSchema = object({
  token: string(),
}).label('AuthResponse');

export const authRoute: ServerRoute = {
  path: '/auth',
  method: 'POST',
  handler: authHandler,
  options: {
    validate: authRequestValidator,
    response: {
      schema: authResponse,
    },
    auth: false,
    tags: ['api'],
  },
};
