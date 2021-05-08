import { BaseEntity } from 'typeorm';
import { Movie } from './entities/movie';

export const entities: typeof BaseEntity[] = [Movie];
