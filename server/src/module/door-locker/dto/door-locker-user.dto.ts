import { CommonDto } from '../../../common/dto/common.dto';

export class DoorLockerUserDto extends CommonDto {
  public name: string;
  public institutionCode: string;
  public rfid: string;
  public authorization: boolean;
}
