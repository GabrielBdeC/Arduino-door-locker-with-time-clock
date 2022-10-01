import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApplicationUserModule } from '../application-user/application-user.module';
import { AuthController } from './controller/auth.controller';
import { LoginDataConverter } from './data-converter/login.data-converter';
import { AuthService } from './service/auth.service';
import { LoginStrategy } from './strategy/login.strategy';
import { UserDataConverter } from './data-converter/user.data-converter';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { JWTConfigService } from '../../core/services/jwt-config.service';

@Module({
  imports: [
    PassportModule,
    ApplicationUserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JWTConfigService,
    }),
  ],
  providers: [
    LoginStrategy,
    JwtStrategy,
    LoginDataConverter,
    UserDataConverter,
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
