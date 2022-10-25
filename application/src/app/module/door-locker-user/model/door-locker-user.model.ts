import { Base } from 'src/app/core/model/base.model';

export class DoorLockerUser extends Base {
  public name: string;
  public institutionCode: string;
  public rfid: string;
  public authorization: boolean;
}
