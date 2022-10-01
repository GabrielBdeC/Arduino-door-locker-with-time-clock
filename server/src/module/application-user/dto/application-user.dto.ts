import { CommonDto } from '../../../common/dto/common.dto';

export class ApplicationUserDto extends CommonDto {
  public login: string;
  public password: string;
  public applicationUserType: string;
}
