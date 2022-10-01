import { CommonDto } from '../../../common/dto/common.dto';

export class ApplicationUserDto extends CommonDto {
  public username: string;
  public password: string;
  public applicationUserType: string;
}
