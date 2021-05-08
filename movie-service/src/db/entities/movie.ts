import { Column, Entity, Index, PrimaryColumn } from 'typeorm/index';
import { Basic } from './basic';

@Entity()
@Index(['submittedBy'])
export class Movie extends Basic {
  @PrimaryColumn({
    type: 'text',
  })
  public imdbId!: string;

  @Column({
    type: 'int',
  })
  public submittedBy!: number;

  @Column({
    type: 'text',
  })
  public title!: string;

  @Column({
    type: 'text',
  })
  public released!: string;

  @Column({
    type: 'text',
  })
  public genre!: string;

  @Column({
    type: 'text',
  })
  public director!: string;

  @Column({
    type: 'jsonb',
  })
  public details: Record<string, unknown> = {};
}
