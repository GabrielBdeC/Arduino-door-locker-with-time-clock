import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class CommonEntity {
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'changed_at',
    type: 'timestamp',
    nullable: true,
  })
  public changedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  public deletedAt: Date;
}
