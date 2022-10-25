import { Base } from "../../../core/model/base.model"
import { ApplicationUserType } from "../type/application-user.type";

export class ApplicationUserModel extends Base {
  public login: string;
  public password: string;
  public applicationUserType: ApplicationUserType;
}
