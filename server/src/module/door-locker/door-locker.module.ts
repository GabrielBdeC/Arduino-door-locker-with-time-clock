import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { DoorLockerUserAbilityFactory } from './ability/door-locker-user.ability-factory';
import { LockerAbilityFactory } from './ability/locker.ability-factory';
import { DoorLockerUserController } from './controller/door-locker-user.controller';
import { LockerController } from './controller/locker.controller';
import { DoorLockerUserDataConverter } from './data-converter/door-locker-user.data-converter';
import { LockerDataConverter } from './data-converter/locker.data-converter';
import { DoorLockerUser } from './entity/door-locker-user.entity';
import { LockerEntity } from './entity/locker.entity';
import { DoorLockerUserService } from './service/door-locker-user.service';

@Module({
  controllers: [DoorLockerUserController, LockerController],
  imports: [
    TypeOrmModule.forFeature([DoorLockerUser, LockerEntity]),
    CommonModule,
  ],
  providers: [
    DoorLockerUserService,
    DoorLockerUserDataConverter,
    DoorLockerUserAbilityFactory,
    LockerDataConverter,
    LockerAbilityFactory,
  ],
  exports: [TypeOrmModule, DoorLockerUserService, DoorLockerUserDataConverter],
})
export class DoorLockerModule {}
