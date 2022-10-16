import { Injectable } from '@nestjs/common';
import { isValidDate } from 'src/common/util/date.util';
import { UUIDPipe } from '../../../common/pipe/uuid.pipe';
import { DoorLockerUserDto } from '../dto/door-locker-user.dto';
import { DoorLockerUser } from '../entity/door-locker-user.entity';

@Injectable()
export class DoorLockerUserDataConverter {
  constructor(private uuidPipe: UUIDPipe) {}

  public toDto(entity: DoorLockerUser): DoorLockerUserDto {
    const dto: DoorLockerUserDto = new DoorLockerUserDto();
    dto.uuid = this.uuidPipe.format(entity.uuid);
    dto.createdAt = entity.createdAt.toISOString();
    dto.name = entity.name;
    dto.institutionCode = entity.institutionCode;
    dto.authorization = !!entity.authorization;
    return dto;
  }

  public toEntity(dto: DoorLockerUserDto): DoorLockerUser {
    const entity: DoorLockerUser = new DoorLockerUser();
    if (dto.uuid) {
      entity.uuid = this.uuidPipe.unformat(dto.uuid);
    }
    const tempCreatedAt = new Date(dto.createdAt);
    if (isValidDate(tempCreatedAt)) {
      entity.createdAt = tempCreatedAt;
    }
    entity.name = dto.name;
    entity.institutionCode = dto.institutionCode;
    entity.rfid = dto.rfid;
    entity.authorization = dto.authorization;
    return entity;
  }
}
