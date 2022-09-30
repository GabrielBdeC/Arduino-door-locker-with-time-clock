import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DoorLockerUserModule } from './modules/door-locker-user/door-locker-user.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'db_arduino_locker_user',
      password: 'ZGoOJkYuON0KkAa3',
      database: 'db_arduino_locker',
      entities: [],
      synchronize: false,
    }),
    AuthModule,
    DoorLockerUserModule,
    HealthCheckModule,
  ],
})
export class AppModule {}
