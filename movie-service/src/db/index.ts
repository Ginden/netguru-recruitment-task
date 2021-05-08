import { BaseEntity } from 'typeorm';
import { Movie } from './entities/movie';
import { Submission } from './entities/submission';

export const entities: typeof BaseEntity[] = [Movie, Submission];
