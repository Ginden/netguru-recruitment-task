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

let i = 0;

export const typeormPlugin: ServerRegisterPluginObject<PostgresConnectionOptions> = {
  plugin: {
    register: async (server: Server, options): Promise<void> => {
      const connection = await createConnection({
        ...options,
        name: `server_connection_${++i}`,
      });
      server.plugins.typeorm = connection;
      server.ext('onRequest', (request, h) => {
        request.plugins.typeorm = connection;
        return h.continue;
      });
      server.ext('onPreStop', () => {
        connection.close();
      });
    },
    name: 'typeorm',
  },
  options: {
    logging: 'all',
    synchronize: true, // Proper production system would use migrations
    ...get<PostgresConnectionOptions>('typeorm'),
    entities: entities,
  },
};
