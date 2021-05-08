import { Server } from '@hapi/hapi';
import { notNull } from '../../helpers';
import { bootstrap } from '../../index';
import {
  basicUserLoginData,
  login,
  shortMovies,
  truncateAllTables,
} from './helpers';

describe('Basic user flow', () => {
  let server: Server;
  beforeEach(async () => {
    server = new Server({
      port: 0,
    });
    await bootstrap(server);
    await truncateAllTables(server.plugins.typeorm);
  });

  it('Adds movie to database', async () => {
    expect.assertions(3);
    const { headers } = await login(server, basicUserLoginData);
    const res = await server.inject({
      method: 'POST',
      url: '/movies',
      headers,
      payload: {
        title: 'Batman',
      },
    });
    expect(res.statusCode).toEqual(200);
    const addedMovies = await server.inject({
      method: 'GET',
      url: '/movies',
      headers,
    });
    expect(addedMovies.statusCode).toEqual(200);
    const { movies } = notNull<any>(addedMovies.result);
    expect(movies).toHaveLength(1);
  });

  it('Adds many movie to database', async () => {
    expect.assertions(shortMovies.length);
    const { headers } = await login(server, basicUserLoginData);
    for (const title of shortMovies) {
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

  it('Fails after 5th movie added to database', async () => {
    expect.assertions(8);
    const { headers } = await login(server, basicUserLoginData);
    for (const title of shortMovies) {
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
    const failingTitle = 'Batman: Under the Red Hood';
    const res = await server.inject({
      method: 'POST',
      url: '/movies',
      headers,
      payload: {
        title: failingTitle,
      },
    });
    expect(res.statusCode).toEqual(425);

    const addedMovies = await server.inject({
      method: 'GET',
      url: '/movies',
      headers,
    });
    expect(addedMovies.statusCode).toEqual(200);
    const { movies: actualMovies } = notNull<any>(addedMovies.result);
    expect(actualMovies).toHaveLength(5);
  });

  afterEach(async () => {
    await server.stop();
  });
});
