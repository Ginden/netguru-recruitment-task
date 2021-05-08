import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Basic extends BaseEntity {
  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
