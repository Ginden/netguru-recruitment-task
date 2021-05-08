import { Server, ServerRegisterPluginObject } from '@hapi/hapi';
import { get } from 'config';
import { Connection, createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { entities } from '../../db';

declare module '@hapi/hapi' {
  interface PluginProperties {
    typeorm: Connection;
  }
  interface PluginsStates {
    typeorm: Connection;
  }
}

export const typeormPlugin: ServerRegisterPluginObject<PostgresConnectionOptions> = {
  plugin: {
    register: async (server: Server, options): Promise<void> => {
      console.error(options);
      const connection = await createConnection(options);
      server.plugins.typeorm = connection;
      server.ext('onRequest', (request, h) => {
        request.plugins.typeorm = connection;
        return h.continue;
      });
    },
    name: 'typeorm',
  },
  options: {
    ...get<PostgresConnectionOptions>('typeorm'),
    logging: 'all',
    entities: entities,
    synchronize: true, // Proper production system would use migrations
  },
};
