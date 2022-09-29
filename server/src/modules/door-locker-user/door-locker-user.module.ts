import { Module } from '@nestjs/common';
import { LockerController } from './controller/locker.controller';

@Module({
  controllers: [LockerController],
})
export class DoorLockerUserModule {}
