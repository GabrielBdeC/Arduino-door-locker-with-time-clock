import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  BeforeSoftRemove,
} from 'typeorm';

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

  @BeforeInsert()
  @BeforeUpdate()
  @BeforeSoftRemove()
  public removeTimeBaseColumns() {
    delete this.createdAt;
    delete this.changedAt;
    delete this.deletedAt;
  }
}
