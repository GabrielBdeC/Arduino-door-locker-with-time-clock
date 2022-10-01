import { Injectable } from '@nestjs/common';
import { ApplicationUser } from '../../application-user/entity/application-user.entity';
import { User } from '../model/user.model';

@Injectable()
export class UserDataConverter {
  public toUser(applicationUser: ApplicationUser): User {
    const user: User = new User();
    user.id = applicationUser.id;
    user.uuid = applicationUser.uuid;
    user.login = applicationUser.login;
    user.applicationUserType = applicationUser.applicationUserType;
    return user;
  }
}
