import {
  ResponseToolkit,
  ServerRegisterPluginObject,
  Request,
  UserCredentials,
} from '@hapi/hapi';
import { get } from 'config';
import HapiAuthJwt, { ValidationResult } from 'hapi-auth-jwt2';
import { attempt, number, object, string } from 'joi';

declare module '@hapi/hapi' {
  interface UserCredentials {
    userId: number;
    role: 'basic' | 'premium';
  }
}

const validTokenSchema = object<UserCredentials>({
  userId: number().integer().positive(),
  role: string().valid('basic', 'premium'),
}).unknown(true);

async function validate(
  decoded: Record<string, unknown>,
): Promise<ValidationResult> {
  attempt(decoded, validTokenSchema);
  const validatedUser: UserCredentials = decoded as any;
  return {
    isValid: true,
    credentials: {
      user: {
        userId: validatedUser.userId,
        role: validatedUser.role,
      },
    },
  };
}

export const authPlugin: ServerRegisterPluginObject<HapiAuthJwt.Options> = {
  plugin: {
    register: async (server, options) => {
      await server.register(HapiAuthJwt);
      const authOptions: HapiAuthJwt.Options = {
        ...options,
      };
      server.auth.strategy('jwt', 'jwt', authOptions);
      server.auth.default('jwt');
    },
    name: 'auth',
  },
  options: {
    key: get<string>('jwt.secret'),
    validate: validate,
  },
};
