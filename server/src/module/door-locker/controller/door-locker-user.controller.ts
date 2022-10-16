import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DoorLockerUserDataConverter } from '../data-converter/door-locker-user.data-converter';
import { DoorLockerUserDto } from '../dto/door-locker-user.dto';
import { DoorLockerUser } from '../entity/door-locker-user.entity';
import { DoorLockerUserService } from '../service/door-locker-user.service';
import { DoorLockerUserAbilities } from '../decorator/door-locker-user-abilities.decorator';
import { DoorLockerUserAction } from '../type/door-locker-user.action';
import { DoorLockerUserGuard } from '../guard/door-locker-user.guard';
import { UUIDPipe } from '../../../common/pipe/uuid.pipe';

@UseGuards(DoorLockerUserGuard)
@Controller('v1/door_locker_user')
export class DoorLockerUserController {
  constructor(
    private doorLockerUserService: DoorLockerUserService,
    private doorLockerUserDataConverter: DoorLockerUserDataConverter,
  ) {}

  @Get()
  @DoorLockerUserAbilities(DoorLockerUserAction.GET)
  public async getAll(
    @Query('numberPage', new DefaultValuePipe(1), ParseIntPipe)
    page = 1,
    @Query('pageItems', new DefaultValuePipe(30), ParseIntPipe)
    limit = 30,
  ): Promise<Pagination<DoorLockerUserDto>> {
    limit = limit > 100 ? 100 : limit;
    return this.doorLockerUserService.getAll({ page, limit }).then(
      (doorLockerUserList: Pagination<DoorLockerUser>) =>
        new Pagination<DoorLockerUserDto>(
          doorLockerUserList.items.map((doorLockerUser: DoorLockerUser) =>
            this.doorLockerUserDataConverter.toDto(doorLockerUser),
          ),
          doorLockerUserList.meta,
          doorLockerUserList.links,
        ),
    );
  }

  @Get('/:uuid')
  @DoorLockerUserAbilities(DoorLockerUserAction.GET)
  public async getOne(
    @Param('uuid', new UUIDPipe()) uuid: string,
  ): Promise<DoorLockerUserDto> {
    const doorLockerUserSearch: DoorLockerUser = new DoorLockerUser();
    doorLockerUserSearch.uuid = uuid;
    return this.doorLockerUserService
      .getOne(doorLockerUserSearch)
      .then((doorLockerUser: DoorLockerUser) =>
        this.doorLockerUserDataConverter.toDto(doorLockerUser),
      );
  }

  @Post()
  @DoorLockerUserAbilities(DoorLockerUserAction.CREATE)
  public async create(
    @Body() doorLockerUserDto: DoorLockerUserDto,
    @Req() req,
  ): Promise<DoorLockerUserDto> {
    const doorLockerUser: DoorLockerUser =
      this.doorLockerUserDataConverter.toEntity(doorLockerUserDto);
    return this.doorLockerUserService
      .create(doorLockerUser, req.user)
      .then((doorLockerUser: DoorLockerUser) =>
        this.doorLockerUserDataConverter.toDto(doorLockerUser),
      );
  }

  @Put('/:uuid')
  @DoorLockerUserAbilities(DoorLockerUserAction.UPDATE)
  public async update(
    @Param('uuid', new UUIDPipe()) uuid: string,
    @Body() doorLockerUserDto: DoorLockerUserDto,
    @Req() req,
  ): Promise<DoorLockerUserDto> {
    const doorLockerUser: DoorLockerUser =
      this.doorLockerUserDataConverter.toEntity(doorLockerUserDto);
    doorLockerUser.uuid = uuid;
    return this.doorLockerUserService
      .update(doorLockerUser, req.user)
      .then((doorLockerUser: DoorLockerUser) =>
        this.doorLockerUserDataConverter.toDto(doorLockerUser),
      );
  }

  @Delete('/:uuid')
  @DoorLockerUserAbilities(DoorLockerUserAction.REMOVE)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(
    @Param('uuid', new UUIDPipe()) uuid: string,
    @Req() req,
  ): Promise<void> {
    const doorLockerUser: DoorLockerUser = new DoorLockerUser();
    doorLockerUser.uuid = uuid;
    return this.doorLockerUserService.remove(doorLockerUser, req.user);
  }
}
