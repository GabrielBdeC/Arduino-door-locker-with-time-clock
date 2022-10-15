import { Injectable } from '@nestjs/common';
import { isValidDate } from 'src/common/util/date.util';
import { UUIDPipe } from '../../../common/pipe/uuid.pipe';
import { ApplicationUserDto } from '../dto/application-user.dto';
import { ApplicationUser } from '../entity/application-user.entity';
import { ApplicationUserType } from '../type/application-user.type';

@Injectable()
export class ApplicationUserDataConverter {
  constructor(private uuidPipe: UUIDPipe) {}

  public toDto(entity: ApplicationUser): ApplicationUserDto {
    const dto: ApplicationUserDto = new ApplicationUserDto();
    dto.uuid = this.uuidPipe.format(entity.uuid);
    dto.createdAt = entity.createdAt.toISOString();
    dto.login = entity.login;
    dto.applicationUserType = entity.applicationUserType.toString();
    return dto;
  }

  public toEntity(dto: ApplicationUserDto): ApplicationUser {
    const entity: ApplicationUser = new ApplicationUser();
    if (dto.uuid) {
      entity.uuid = this.uuidPipe.unformat(dto.uuid);
    }
    const tempCreatedAt = new Date(dto.createdAt);
    if (isValidDate(tempCreatedAt)) {
      entity.createdAt = tempCreatedAt;
    }
    entity.login = dto.login;
    entity.password = dto.password;
    if (dto.applicationUserType) {
      entity.applicationUserType = ApplicationUserType[dto.applicationUserType];
    }
    return entity;
  }
}
