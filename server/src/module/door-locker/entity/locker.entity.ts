import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumberString, IsOptional } from 'class-validator';
import { DoorLockerUserAction } from '../type/door-locker-user.action';

@Entity({
  name: 'door_locker_user',
})
export class LockerEntity {
  @PrimaryGeneratedColumn({
    name: 'door_locker_user_id',
  })
  public id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 84,
    nullable: false,
  })
  public name: string;

  @Column({
    name: `rfid`,
    type: 'varchar',
    length: 88,
    comment: 'SHA512',
    unique: true,
    nullable: false,
  })
  @IsNumberString()
  public rfid: string;

  @Column({
    name: `authorization`,
    type: 'boolean',
    nullable: false,
    default: false,
  })
  public authorization: boolean;
}
