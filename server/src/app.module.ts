import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { DoorLockerUserModule } from './module/door-locker-user/door-locker-user.module';
import { HealthCheckModule } from './module/health-check/health-check.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './core/services/typeorm-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [TypeOrmConfigService],
    }),
    AuthModule,
    DoorLockerUserModule,
    HealthCheckModule,
  ],
})
export class AppModule {}
