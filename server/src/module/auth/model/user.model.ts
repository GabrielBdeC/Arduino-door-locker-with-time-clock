import { ApplicationUserType } from '../../application-user/type/application-user.type';

export class User {
  public id: number;
  public uuid: string;
  public login: string;
  public applicationUserType: ApplicationUserType;
}
