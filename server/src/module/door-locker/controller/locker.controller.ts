import {
  BadRequestException,
  Body,
  CACHE_MANAGER,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LockerDataConverter } from '../data-converter/locker.data-converter';
import { LockerDto } from '../dto/locker.dto';
import { LockerEntity } from '../entity/locker.entity';
import { LockerGuard } from '../guard/locker.guard';
import { DoorLockerUserService } from '../service/door-locker-user.service';
import { Cache } from 'cache-manager';
import { EntityNotFoundError } from 'typeorm';
import { LockerWsService } from '../service/locker-ws.service';

@Controller('v1/locker')
@UseGuards(LockerGuard)
export class LockerController {
  constructor(
    private doorLockerUserService: DoorLockerUserService,
    private lockerDataConverter: LockerDataConverter,
    private lockerWsService: LockerWsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  public async unlock(
    @Body() lockerDto: LockerDto,
  ): Promise<LockerDto | string> {
    const lockerEntity: LockerEntity =
      this.lockerDataConverter.toEntity(lockerDto);
    if (await this.cacheManager.get('wsClients')) {
      return this.doorLockerUserService
        .getByRfid(lockerEntity)
        .then(() => {
          this.lockerWsService.sendMessage('error');
          throw new BadRequestException('Rfid already stored');
        })
        .catch(async (err) => {
          if (err instanceof EntityNotFoundError) {
            await this.cacheManager.set('rfid', lockerDto.rfid, {
              ttl: 0,
            });
            this.lockerWsService.sendMessage('success');
            return 'STORED';
          } else {
            throw err;
          }
        });
    } else {
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
}
