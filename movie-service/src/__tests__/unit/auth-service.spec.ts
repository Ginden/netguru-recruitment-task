import fetch from 'node-fetch';
import { AuthService } from '../../services/auth-service';
import MockedFunction = jest.MockedFunction;

describe('AuthService', () => {
  it('Correctly extracts token from response', async () => {
    expect.assertions(4);
    const testToken = Math.random().toString();
    const mockFetch: MockedFunction<typeof fetch> = jest.fn() as any;
    mockFetch.mockImplementation((requestInfo, init) => {
      expect(typeof init!.body).toEqual('string');
      expect(init!.method).toEqual('POST');
      const mockHttpResponse = {
        status: 200,
        json: () => Promise.resolve({ token: testToken }),
      };
      return mockHttpResponse as any;
    });
    const authService = new AuthService(mockFetch);
    const returnedToken = await authService.authenticate('foo', 'bar');
    expect(returnedToken).toEqual(testToken);
    expect(mockFetch).toBeCalledTimes(1);
  });

  it('Throws on 451 HTTP status code', async () => {
    expect.assertions(1);
    const mockFetch: MockedFunction<typeof fetch> = jest.fn() as any;
    mockFetch.mockImplementation(() => {
      const mockHttpResponse = {
        status: 451,
        json: () => Promise.resolve({ error: 'foo' }),
      };
      return mockHttpResponse as any;
    });
    const authService = new AuthService(mockFetch);
    await expect(authService.authenticate('foo', 'bar')).rejects.toThrow();
  });
});
