import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LockerDataConverter } from '../data-converter/locker.data-converter';
import { LockerDto } from '../dto/locker.dto';
import { LockerEntity } from '../entity/locker.entity';
import { LockerGuard } from '../guard/locker.guard';
import { DoorLockerUserService } from '../service/door-locker-user.service';

@Controller('v1/locker')
@UseGuards(LockerGuard)
export class LockerController {
  constructor(
    private doorLockerUserService: DoorLockerUserService,
    private lockerDataConverter: LockerDataConverter,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  public async unlock(@Body() lockerDto: LockerDto): Promise<LockerDto> {
    const lockerEntity: LockerEntity =
      this.lockerDataConverter.toEntity(lockerDto);
    return this.doorLockerUserService
      .getByRfid(lockerEntity)
      .then((lockerEntity: LockerEntity) => {
        if (lockerEntity.authorization) {
          return this.lockerDataConverter.toDto(lockerEntity);
        } else {
          throw new ForbiddenException('RFID without authorization');
        }
      });
  }
}
