import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { DoorLockerUserModule } from './module/door-locker-user/door-locker-user.module';
import { HealthCheckModule } from './module/health-check/health-check.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './core/services/typeorm-config.service';
import { ApplicationUserModule } from './module/application-user/application-user.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './module/auth/guard/jwt.guard';
import { GlobalExceptionFilter } from './core/filter/global.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [TypeOrmConfigService],
    }),
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
