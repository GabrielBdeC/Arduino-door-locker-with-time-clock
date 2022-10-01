import { Injectable } from '@nestjs/common';
import { ApplicationUserDto } from '../dto/application-user.dto';
import { ApplicationUser } from '../entity/application-user.entity';
import { ApplicationUserType } from '../type/application-user.type';

@Injectable()
export class ApplicationUserDataConverter {
  public toDto(entity: ApplicationUser): ApplicationUserDto {
    const dto: ApplicationUserDto = new ApplicationUserDto();
    dto.uuid = entity.uuid;
    dto.createdAt = entity.createdAt.toISOString();
    dto.username = entity.username;
    dto.password = entity.password;
    dto.applicationUserType = entity.applicationUserType.toString();
    return dto;
  }
  public toEntity(dto: ApplicationUserDto): ApplicationUser {
    const entity: ApplicationUser = new ApplicationUser();
    if ('uuid' in dto) {
      entity.uuid = dto.uuid;
    }
    if ('createdAt' in dto) {
      entity.createdAt = new Date(dto.createdAt);
    }
    if ('username' in dto) {
      entity.username = dto.username;
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
