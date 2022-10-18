import { Injectable } from '@nestjs/common';
import { UUIDPipe } from '../../../common/pipe/uuid.pipe';
import { ApplicationUser } from '../../application-user/entity/application-user.entity';
import { PayloadDto } from '../dto/payload.dto';
import { User } from '../model/user.model';

@Injectable()
export class UserDataConverter {
  constructor(private uuidPipe: UUIDPipe) {}
  public toUser(applicationUser: ApplicationUser): User {
    const user: User = new User();
    user.id = applicationUser.id;
    user.uuid = applicationUser.uuid;
    user.login = applicationUser.login;
    user.applicationUserType = applicationUser.applicationUserType;
    return user;
  }

  public toPayloadDto(user: User, accessToken: string): PayloadDto {
    const payloadDto: PayloadDto = new PayloadDto();
    payloadDto.uuid = this.uuidPipe.format(user.uuid);
    payloadDto.login = user.login;
    payloadDto.applicationUserType = user.applicationUserType;
    payloadDto.accessToken = accessToken;
    return payloadDto;
  }
}
