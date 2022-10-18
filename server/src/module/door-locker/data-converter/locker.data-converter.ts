import { Injectable } from '@nestjs/common';
import { LockerDto } from '../dto/locker.dto';
import { LockerEntity } from '../entity/locker.entity';

@Injectable()
export class LockerDataConverter {
  public toDto(entity: LockerEntity): LockerDto {
    const dto: LockerDto = new LockerDto();
    dto.name = entity.name;
    return dto;
  }

  public toEntity(dto: LockerDto): LockerEntity {
    const entity: LockerEntity = new LockerEntity();
    entity.rfid = dto.rfid;
    return entity;
  }
}
