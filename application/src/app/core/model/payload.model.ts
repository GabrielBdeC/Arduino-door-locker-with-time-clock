import { ApplicationUserType } from "../../module/application-user/type/application-user.type";

export class Payload {
  public uuid: string;
  public login: string;
  public applicationUserType: ApplicationUserType;
  public accessToken: string;
}
