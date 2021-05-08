import { Server } from '@hapi/hapi';
import { bootstrap } from '../../index';
import {
  login,
  longMovies,
  premiumUserLoginData,
  truncateAllTables,
} from './helpers';

describe('Premium user flow', () => {
  let server: Server;
  beforeEach(async () => {
    server = new Server({
      port: 0,
    });
    await bootstrap(server);
    await truncateAllTables(server.plugins.typeorm);
  });

  it('Adds many movies to database', async () => {
    expect.assertions(longMovies.length);
    const { headers } = await login(server, premiumUserLoginData);
    for (const title of longMovies) {
      const res = await server.inject({
        method: 'POST',
        url: '/movies',
        headers,
        payload: {
          title,
        },
      });
      expect(res.statusCode).toEqual(200);
    }
  });

  afterEach(async () => {
    await server.stop();
  });
});
