import { CacheModule, Module } from '@nestjs/common';
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
import { LockerGateway } from './gateway/locker.gateway';
import { DoorLockerUserService } from './service/door-locker-user.service';
import { LockerWsService } from './service/locker-ws.service';

@Module({
  controllers: [DoorLockerUserController, LockerController],
  imports: [
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forFeature([DoorLockerUser, LockerEntity]),
    CommonModule,
  ],
  providers: [
    DoorLockerUserService,
    DoorLockerUserDataConverter,
    DoorLockerUserAbilityFactory,
    LockerDataConverter,
    LockerAbilityFactory,
    LockerGateway,
    LockerWsService,
  ],
  exports: [TypeOrmModule, DoorLockerUserService, DoorLockerUserDataConverter],
})
export class DoorLockerModule {}
