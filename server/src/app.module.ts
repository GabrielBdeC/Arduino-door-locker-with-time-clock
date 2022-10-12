import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { DoorLockerUserModule } from './module/door-locker-user/door-locker-user.module';
import { HealthCheckModule } from './module/health-check/health-check.module';
import { ApplicationUserModule } from './module/application-user/application-user.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './module/auth/guard/jwt.guard';
import { GlobalExceptionFilter } from './core/filter/global.filter';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    ApplicationUserModule,
    DoorLockerUserModule,
    HealthCheckModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
