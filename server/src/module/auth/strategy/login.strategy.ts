import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ApplicationUser } from '../../application-user/entity/application-user.entity';
import { LoginDataConverter } from '../data-converter/login.data-converter';
import { LoginModel } from '../model/login.model';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy, 'login') {
  constructor(
    private loginDataConverter: LoginDataConverter,
    private authService: AuthService,
  ) {
    super({ usernameField: 'login' });
  }

  public async validate(login: string, password: string): Promise<any> {
    const loginModel: LoginModel = this.loginDataConverter.toModel({
      login: login,
      password: password,
    });
    this.authService
      .validateUser(loginModel)
      .then((applicationUser: ApplicationUser) => {
        if (!applicationUser) {
          throw new UnauthorizedException();
        }
        return applicationUser;
      });
  }
}
