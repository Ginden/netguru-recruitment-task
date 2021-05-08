import { notFound } from '@hapi/boom';
import { get } from 'config';
import fetch from 'node-fetch';
import { notNull } from '../helpers';

export type OmdbMovieDetails = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: 'True' | 'False';
};

export type OmdbIdTitleSearch = (
  | { i: string; t?: never }
  | { t: string; i?: never }
  | { i: string; t: string }
) & {
  type?: 'movie' | 'series' | 'episode'; // Type of result to return.
  y?: string;
  plot?: 'short' | 'full';
  r?: 'json' | 'xml';
  v?: '1';
};

function filterObject<T extends Record<string, string | undefined>>(
  v: T,
): Partial<Record<keyof T, string>> {
  return Object.fromEntries(
    Object.entries(v).filter(([, v]) => v != null),
  ) as any;
}

export class OmdbApi {
  readonly #domain: string = 'https://www.omdbapi.com/';
  readonly #apiKey: string;
  readonly #fetch: typeof fetch;

  constructor(
    apiKey: string = get<string>('omdb.apiKey'),
    customFetch: typeof fetch = fetch,
  ) {
    notNull(apiKey);
    this.#apiKey = apiKey;
    this.#fetch = customFetch;
  }

  async getByTitleOrId(v: OmdbIdTitleSearch): Promise<OmdbMovieDetails> {
    const queryString = new URLSearchParams({
      ...filterObject(v),
      apikey: this.#apiKey,
    });
    const url = new URL(`?${queryString}`, this.#domain);
    const httpResponse = await this.#fetch(url);
    if (httpResponse.status >= 400) {
      throw new Error(
        `API returned ${httpResponse.status} (${httpResponse.statusText})`,
      );
    }
    const response = await httpResponse.json();
    if (response.Response === 'False') {
      throw notFound();
    }
    return response;
  }
}
