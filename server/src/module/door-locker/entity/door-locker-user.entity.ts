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
import {
  IsBoolean,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsDbUUIDv4 } from '../../../common/decorator/IsDbUUIDv4.decorator';
import { DoorLockerUserAction } from '../type/door-locker-user.action';
import crypto from 'crypto';
import { ApplicationUser } from '../../application-user/entity/application-user.entity';

@Entity({
  name: 'door_locker_user',
})
export class DoorLockerUser extends CommonEntity {
  @PrimaryGeneratedColumn({
    name: 'door_locker_user_id',
  })
  public id: number;

  @Column({
    name: 'door_locker_user_uuid',
    type: 'varchar',
    length: 32,
    nullable: false,
    unique: true,
    comment: 'used in DTO',
  })
  @IsDbUUIDv4({
    groups: [DoorLockerUserAction.UPDATE],
  })
  public uuid: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 84,
    nullable: false,
  })
  @IsString({
    message: 'Name value must be a string.',
    groups: [DoorLockerUserAction.CREATE, DoorLockerUserAction.UPDATE],
  })
  @Length(4, 84, {
    groups: [DoorLockerUserAction.CREATE, DoorLockerUserAction.UPDATE],
  })
  public name: string;

  @Column({
    name: `institution_code`,
    type: 'varchar',
    length: 8,
    unique: true,
    nullable: false,
  })
  @IsNumberString({ groups: [DoorLockerUserAction.CREATE] })
  public institutionCode: string;

  @Column({
    name: `rfid`,
    type: 'varchar',
    length: 88,
    comment: 'SHA512',
    unique: true,
    nullable: false,
  })
  @IsOptional({
    groups: [DoorLockerUserAction.UPDATE],
  })
  @IsNumberString({
    groups: [DoorLockerUserAction.CREATE, DoorLockerUserAction.UPDATE],
  })
  public rfid: string;

  @Column({
    name: `authorization`,
    type: 'boolean',
    nullable: false,
    default: false,
  })
  @IsOptional({
    groups: [DoorLockerUserAction.UPDATE],
  })
  @IsBoolean({
    groups: [DoorLockerUserAction.CREATE, DoorLockerUserAction.UPDATE],
  })
  public authorization: boolean;

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
  public encryptRfid() {
    this.rfid = crypto.createHash('SHA512').update(this.rfid).digest('base64');
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
