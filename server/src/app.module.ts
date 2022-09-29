import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DoorLockerUserModule } from './modules/door-locker-user/door-locker-user.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';

@Module({
  imports: [AuthModule, DoorLockerUserModule, HealthCheckModule],
})
export class AppModule {}
