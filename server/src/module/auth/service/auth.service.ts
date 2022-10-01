import { Injectable } from '@nestjs/common';
import { ApplicationUser } from '../../application-user/entity/application-user.entity';
import { ApplicationUserService } from '../../../module/application-user/service/application-user.service';
import { LoginModel } from '../model/login.model';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private applicationUserService: ApplicationUserService) {}

  public async validateUser(loginModel: LoginModel): Promise<ApplicationUser> {
    return this.applicationUserService
      .getByLogin(loginModel.login)
      .then((applicationUser: ApplicationUser) =>
        argon2
          .verify(applicationUser.password, loginModel.password)
          .then((result: boolean) => (result == true ? applicationUser : null)),
      );
  }
}
