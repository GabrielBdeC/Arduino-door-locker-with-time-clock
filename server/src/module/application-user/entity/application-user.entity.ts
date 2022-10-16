import { CommonEntity } from '../../../common/entity/common.entity';
import {
  BeforeInsert,
  BeforeSoftRemove,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import * as argon2 from 'argon2';
import { ApplicationUserType } from '../type/application-user.type';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApplicationUserAction } from '../type/application-user.action';
import { IsDbUUIDv4 } from '../../../common/decorator/IsDbUUIDv4.decorator';

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
  @IsDbUUIDv4({
    groups: [ApplicationUserAction.UPDATE],
  })
  public uuid: string;

  @Column({
    name: 'login',
    type: 'varchar',
    length: 84,
    unique: true,
    nullable: false,
  })
  @IsString({
    message: 'Login value must be a string.',
    groups: [ApplicationUserAction.CREATE],
  })
  @Length(4, 84, { groups: [ApplicationUserAction.CREATE] })
  public login: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 128,
    nullable: false,
    comment: 'ARGON2',
  })
  @IsOptional({
    groups: [ApplicationUserAction.UPDATE],
  })
  @IsString({
    groups: [ApplicationUserAction.CREATE, ApplicationUserAction.UPDATE],
    message: 'Password value must be a string.',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    groups: [ApplicationUserAction.CREATE, ApplicationUserAction.UPDATE],
    message: 'Password too weak.',
  })
  @Length(8, 128, {
    groups: [ApplicationUserAction.CREATE, ApplicationUserAction.UPDATE],
  })
  public password: string;

  @Column({
    name: 'application_user_type',
    type: 'enum',
    enum: ApplicationUserType,
    default: ApplicationUserType.USER,
  })
  @IsOptional({
    groups: [ApplicationUserAction.CREATE, ApplicationUserAction.UPDATE],
  })
  @IsEnum(ApplicationUserType, {
    groups: [ApplicationUserAction.CREATE, ApplicationUserAction.UPDATE],
  })
  public applicationUserType: ApplicationUserType;

  @OneToOne(() => ApplicationUser)
  @JoinColumn({ name: `created_by` })
  public createdBy: ApplicationUser;

  @OneToOne(() => ApplicationUser)
  @JoinColumn({ name: `changed_by` })
  public changedBy: ApplicationUser;

  @OneToOne(() => ApplicationUser)
  @JoinColumn({ name: `deleted_by` })
  public deletedBy: ApplicationUser;

  @BeforeInsert()
  public generateUuid() {
    this.uuid = uuid4().replace(/-/g, '').toUpperCase();
  }

  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @BeforeInsert()
  public removePersonColumnsInInsert() {
    delete this.changedBy;
    delete this.deletedBy;
  }

  @BeforeUpdate()
  public removePersonColumnsInUpdate() {
    delete this.createdBy;
    delete this.deletedBy;
  }

  @BeforeSoftRemove()
  public removePersonColumnsInSoftRemove() {
    delete this.createdBy;
    delete this.changedBy;
  }
}
