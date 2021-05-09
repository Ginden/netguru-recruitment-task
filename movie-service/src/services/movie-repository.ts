import { tooEarly } from '@hapi/boom';
import { UserCredentials } from '@hapi/hapi';
import { pick } from 'lodash';
import { EntityRepository, Repository } from 'typeorm';
import { Movie } from '../db/entities/movie';
import { Submission } from '../db/entities/submission';
import { OmdbMovieDetails } from './omdb-api-client';

export type SanitizedMovie = Pick<
  Movie,
  'title' | 'released' | 'genre' | 'director' | 'details' | 'imdbId'
>;

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  #perMonthBasicUserLimit = 5;

  public async saveMovieSubmittedByUser(
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

    const m =
      (await this.findOne({ where: { imdbId } })) ??
      this.create({
        title,
        released,
        genre,
        director,
        imdbId,
        details: details as any,
      });
    await this.save(m);
    const submission = this.manager.getRepository(Submission).create({
      movie: m,
      submittedBy: user.userId,
    });
    await this.manager.getRepository(Submission).save(submission);
  }

  async listMoviesByUser(user: UserCredentials): Promise<SanitizedMovie[]> {
    const movies = await this.manager.getRepository(Submission).find({
      where: {
        submittedBy: user.userId,
      },
      relations: ['movie'],
    });
    return movies
      .map((m) => m.movie)
      .map((m) =>
        pick(m, [
          'title',
          'released',
          'genre',
          'director',
          'details',
          'imdbId',
        ]),
      );
  }

  public async isUserAllowedToSubmitMovie(
    user: UserCredentials,
  ): Promise<boolean> {
    if (user.role === 'premium') {
      return true;
    }
    const moviesSubmitedThisMonth = await this.manager
      .createQueryBuilder(Submission, 'sub')
      .where(`"createdAt" >= date_trunc('month', current_date)`)
      .andWhere(
        `"createdAt" < (date_trunc('month', current_date) + INTERVAL '1 MONTH')`,
      )
      .andWhere(`"submittedBy" = :userId`, { userId: user.userId })
      .getCount();

    return moviesSubmitedThisMonth < this.#perMonthBasicUserLimit;
  }
}
