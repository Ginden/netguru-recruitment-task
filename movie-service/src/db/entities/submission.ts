import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Basic } from './basic';
import { Movie } from './movie';

@Entity()
export class Submission extends Basic {
  @PrimaryColumn({ type: 'int' })
  public submittedBy!: number;

  @ManyToOne(() => Movie, undefined, { primary: true })
  public movie!: Movie;
}
