import fetch from 'node-fetch';
import { notNull } from '../helpers';

export class AuthService {
  readonly #domain: string = 'http://auth-service/';
  readonly #fetch: typeof fetch;

  constructor(customFetch: typeof fetch = fetch) {
    this.#fetch = customFetch;
  }

  async authenticate(username: string, password: string): Promise<string> {
    const url = new URL('/auth', this.#domain);
    const httpResponse = await this.#fetch(url, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (httpResponse.status >= 400) {
      throw new Error(
        `API returned ${httpResponse.status} (${httpResponse.statusText})`,
      );
    }
    const response = await httpResponse.json();
    return notNull(response.token);
  }
}
