import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApplicationUserModule } from '../application-user/application-user.module';
import { AuthController } from './controller/auth.controller';
import { LoginDataConverter } from './data-converter/login.data-converter';
import { AuthService } from './service/auth.service';
import { LoginStrategy } from './strategy/login.strategy';

@Module({
  imports: [PassportModule, ApplicationUserModule],
  providers: [LoginStrategy, LoginDataConverter, LoginStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
