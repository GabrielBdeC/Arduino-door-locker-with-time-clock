import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ApplicationUser } from '../../application-user/entity/application-user.entity';
import { LoginDataConverter } from '../data-converter/login.data-converter';
import { UserDataConverter } from '../data-converter/user.data-converter';
import { Login } from '../model/login.model';
import { User } from '../model/user.model';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy, 'login') {
  constructor(
    private authService: AuthService,
    private loginDataConverter: LoginDataConverter,
    private userDataConverter: UserDataConverter,
  ) {
    super({ usernameField: 'login' });
  }

  public async validate(login: string, password: string): Promise<User> {
    const loginModel: Login = this.loginDataConverter.toModel({
      login: login,
      password: password,
    });
    return this.authService
      .validateUser(loginModel)
      .then((applicationUser: ApplicationUser) => {
        if (!applicationUser) {
          throw new BadRequestException('Invalid credential');
        }
        return this.userDataConverter.toUser(applicationUser);
      });
  }
}
