import fetch from 'node-fetch';
import { OmdbApiClient } from '../../services/omdb-api-client';

describe('OmdbApiClient', () => {
  it('Throws on empty apiKey given', () => {
    expect.assertions(1);
    expect(() => new OmdbApiClient(null as any)).toThrow();
  });

  it('Throws on falsy response', async () => {
    expect.assertions(1);
    const mockFetch: jest.MockedFunction<typeof fetch> = jest.fn() as any;
    mockFetch.mockImplementation(() => {
      const mockHttpResponse = {
        status: 200,
        json: () => Promise.resolve({ Response: 'False' }),
      };
      return mockHttpResponse as any;
    });
    const omdbApiClient = new OmdbApiClient('TEST', mockFetch);
    await expect(omdbApiClient.getByTitleOrId({ t: 'TEST' })).rejects.toThrow();
  });

  it('Throws on 451 HTTP Status code', async () => {
    expect.assertions(1);
    const mockFetch: jest.MockedFunction<typeof fetch> = jest.fn() as any;
    mockFetch.mockImplementation(() => {
      const mockHttpResponse = {
        status: 451,
        json: () => Promise.resolve({ Response: 'True' }),
      };
      return mockHttpResponse as any;
    });
    const omdbApiClient = new OmdbApiClient('TEST', mockFetch);
    await expect(omdbApiClient.getByTitleOrId({ t: 'TEST' })).rejects.toThrow();
  });

  it('Returns object on 200 + Response = "true"', async () => {
    expect.assertions(1);
    const mockFetch: jest.MockedFunction<typeof fetch> = jest.fn() as any;
    const obj = { Response: 'True' };
    mockFetch.mockImplementation(() => {
      const mockHttpResponse = {
        status: 200,
        json: () => Promise.resolve({ ...obj }),
      };
      return mockHttpResponse as any;
    });
    const omdbApiClient = new OmdbApiClient('TEST', mockFetch);
    await expect(omdbApiClient.getByTitleOrId({ t: 'TEST' })).resolves.toEqual(
      obj,
    );
  });
});
