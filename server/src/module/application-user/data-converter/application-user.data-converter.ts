import { Injectable } from '@nestjs/common';
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
    if ('uuid' in dto) {
      entity.uuid = this.uuidPipe.unformat(dto.uuid);
    }
    if ('createdAt' in dto) {
      entity.createdAt = new Date(dto.createdAt);
    }
    if ('login' in dto) {
      entity.login = dto.login;
    }
    if ('password' in dto) {
      entity.password = dto.password;
    }
    if ('applicationUserType' in dto) {
      entity.applicationUserType = ApplicationUserType[dto.applicationUserType];
    }
    return entity;
  }
}
