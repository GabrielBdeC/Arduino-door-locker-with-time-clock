import { Injectable } from '@nestjs/common';
import { ApplicationUser } from '../../application-user/entity/application-user.entity';
import { ApplicationUserService } from '../../../module/application-user/service/application-user.service';
import { Login } from '../model/login.model';
import { JwtService } from '@nestjs/jwt';
import { User } from '../model/user.model';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private applicationUserService: ApplicationUserService,
    private jwtService: JwtService,
  ) { }

  public async validateUser(login: Login): Promise<ApplicationUser> {
    return this.applicationUserService
      .getByLogin(login.login)
      .then((applicationUser: ApplicationUser) =>
        argon2
          .verify(applicationUser.password, login.password)
          .then((result: boolean) => (result == true ? applicationUser : null)),
      );
  }

  public async login(user: User) {
    return this.jwtService.sign({ user });
  }
}
