import { Server } from '@hapi/hapi';
import { countBy } from 'lodash';
import { bootstrap } from '../../index';
import {
  basicUserLoginData,
  login,
  longMovies,
  premiumUserLoginData,
  truncateAllTables,
} from './helpers';

describe('Mixed flow', () => {
  let server: Server;
  beforeAll(async () => {
    server = new Server({
      port: 0,
    });
    await bootstrap(server);
    await truncateAllTables(server.plugins.typeorm);
  });

  it('Keeps separate track for premium and basic user', async () => {
    const { headers: basicHeaders } = await login(server, basicUserLoginData);
    const { headers: premiumHeaders } = await login(
      server,
      premiumUserLoginData,
    );
    const results: number[] = [];
    for (const title of longMovies) {
      for (const headers of [basicHeaders, premiumHeaders]) {
        const res = await server.inject({
          method: 'POST',
          url: '/movies',
          headers,
          payload: {
            title,
          },
        });
        results.push(res.statusCode);
      }
    }
    expect(countBy(results)).toEqual({
      200: 15,
      425: 5,
    });
  });

  afterAll(async () => {
    await server.stop();
  });
});
