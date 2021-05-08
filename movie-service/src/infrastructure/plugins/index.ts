import { ServerRegisterPluginObject } from '@hapi/hapi';
import HapiPino from 'hapi-pino';
import HapiInert from '@hapi/inert';
import HapiVision from '@hapi/vision';
import { docsPlugin } from './docs';
import { typeormPlugin } from './database';
import { authPlugin } from './auth';

export const plugins: ServerRegisterPluginObject<any>[] = [
  authPlugin,
  {
    plugin: HapiPino,
    options: {
      redact: ['req.headers.authorization'],
      logQueryParams: true,
      logRequestComplete: false,
    },
  },
  {
    plugin: HapiInert,
  },
  {
    plugin: HapiVision,
  },
  docsPlugin,
  typeormPlugin,
];
