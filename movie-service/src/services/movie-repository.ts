import { tooEarly } from '@hapi/boom';
import { UserCredentials } from '@hapi/hapi';
import { pick } from 'lodash';
import { EntityRepository, Repository } from 'typeorm';
import { Movie } from '../db/entities/movie';
import { OmdbMovieDetails } from './omdb-api';

export type SanitizedMovie = Pick<
  Movie,
  'title' | 'released' | 'genre' | 'director' | 'details' | 'imdbId'
>;

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  #perMonthBasicUserLimit = 5;

  public async saveMovieSubmitedByUser(
    user: UserCredentials,
    movieDetails: OmdbMovieDetails,
  ): Promise<void> {
    if (!(await this.isUserAllowedToSubmitMovie(user))) {
      throw tooEarly();
    }
    const {
      Title: title,
      Released: released,
      Genre: genre,
      Director: director,
      imdbID: imdbId,
      ...details
    } = movieDetails;

    const m = this.create({
      title,
      released,
      genre,
      director,
      imdbId,
      details: details as object,
      submittedBy: user.userId,
    });
    await this.save(m);
  }

  async listMoviesByUser(user: UserCredentials): Promise<SanitizedMovie[]> {
    const movies = await this.find({
      where: {
        submittedBy: user.userId,
      },
    });
    return movies.map((m) =>
      pick(m, ['title', 'released', 'genre', 'director', 'details', 'imdbId']),
    );
  }

  private async isUserAllowedToSubmitMovie(
    user: UserCredentials,
  ): Promise<boolean> {
    if (user.role === 'premium') {
      return true;
    }
    const moviesSubmitedThisMonth = await this.manager
      .createQueryBuilder(Movie, 'movie')
      .where(`"createdAt" >= date_trunc('month', current_date)`)
      .andWhere(
        `"createdAt" < (date_trunc('month', current_date) + INTERVAL '1 MONTH')`,
      )
      .andWhere(`"submittedBy" = :userId`, { userId: user.userId })
      .getCount();
    console.log({
      'this.#perMonthBasicUserLimit': this.#perMonthBasicUserLimit,
      moviesSubmitedThisMonth,
    });
    return moviesSubmitedThisMonth <= this.#perMonthBasicUserLimit;
  }
}
