import { ApplicationUserType } from '../../application-user/type/application-user.type';

export class PayloadDto {
  public uuid: string;
  public login: string;
  public applicationUserType: ApplicationUserType;
  public accessToken: string;
}
