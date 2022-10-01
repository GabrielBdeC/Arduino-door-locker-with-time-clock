import { CommonEntity } from '../../../common/entity/common.entity';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import * as argon2 from 'argon2';
import { ApplicationUserType } from '../type/application-user.type';

@Entity({
  name: 'application_user',
})
export class ApplicationUser extends CommonEntity {
  @PrimaryGeneratedColumn({
    name: 'application_user_id',
  })
  public id: number;

  @Column({
    name: 'application_user_uuid',
    type: 'varchar',
    length: 32,
    nullable: false,
    unique: true,
    comment: 'used in DTO',
  })
  public uuid: string;

  @Column({
    name: 'login',
    type: 'varchar',
    length: 84,
    unique: true,
    nullable: false,
  })
  public username: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 128,
    nullable: false,
    comment: 'ARGON2',
  })
  public password: string;

  @Column({
    name: 'application_user_type',
    type: 'enum',
    enum: ApplicationUserType,
    default: ApplicationUserType.USER,
  })
  public applicationUserType: ApplicationUserType;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuid4().replace(/-/g, '').toUpperCase();
  }

  @BeforeInsert()
  async hashPassword() {
    console.log(await argon2.hash(this.password));
    this.password = await argon2.hash(this.password);
  }
}
