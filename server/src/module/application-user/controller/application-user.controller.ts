import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UUIDPipe } from '../../../common/pipe/uuid.pipe';
import { ApplicationUserDataConverter } from '../data-converter/application-user.data-converter';
import { ApplicationUserDto } from '../dto/application-user.dto';
import { ApplicationUser } from '../entity/application-user.entity';
import { ApplicationUserService } from '../service/application-user.service';

@Controller('v1/application_user')
export class ApplicationUserController {
  constructor(
    private applicationUserService: ApplicationUserService,
    private applicationUserDataConverter: ApplicationUserDataConverter,
  ) {}

  @Get()
  public async getAll(
    @Query('numberPage', new DefaultValuePipe(1), ParseIntPipe)
    page = 1,
    @Query('pageItems', new DefaultValuePipe(30), ParseIntPipe)
    limit = 30,
  ): Promise<Pagination<ApplicationUserDto>> {
    limit = limit > 100 ? 100 : limit;
    return this.applicationUserService.getAll({ page, limit }).then(
      (applicationUserList: Pagination<ApplicationUser>) =>
        new Pagination<ApplicationUserDto>(
          applicationUserList.items.map((applicationUser: ApplicationUser) =>
            this.applicationUserDataConverter.toDto(applicationUser),
          ),
          applicationUserList.meta,
          applicationUserList.links,
        ),
    );
  }

  @Get('/:uuid')
  public async getOne(
    @Param('uuid', new UUIDPipe()) uuid: string,
  ): Promise<ApplicationUserDto> {
    const applicationUserSearch: ApplicationUser = new ApplicationUser();
    applicationUserSearch.uuid = uuid;
    return this.applicationUserService
      .getOne(applicationUserSearch)
      .then((applicationUser: ApplicationUser) =>
        this.applicationUserDataConverter.toDto(applicationUser),
      );
  }

  @Get('/login/:login')
  public async getOneByLogin(
    @Param('login') login: string,
  ): Promise<ApplicationUserDto> {
    return this.applicationUserService
      .getByLogin(login)
      .then((applicationUser: ApplicationUser) =>
        this.applicationUserDataConverter.toDto(applicationUser),
      );
  }

  @Post()
  public async create(
    @Body() applicationUserDto: ApplicationUserDto,
  ): Promise<ApplicationUserDto> {
    const applicationUser: ApplicationUser =
      this.applicationUserDataConverter.toEntity(applicationUserDto);
    return this.applicationUserService
      .save(applicationUser)
      .then((applicationUser: ApplicationUser) =>
        this.applicationUserDataConverter.toDto(applicationUser),
      );
  }

  @Put('/:uuid')
  public async update(
    @Param('uuid', new UUIDPipe()) uuid: string,
    @Body() applicationUserDto: ApplicationUserDto,
  ): Promise<ApplicationUserDto> {
    const applicationUser: ApplicationUser =
      this.applicationUserDataConverter.toEntity(applicationUserDto);
    applicationUser.uuid = uuid;
    return this.applicationUserService
      .save(applicationUser)
      .then((applicationUser: ApplicationUser) =>
        this.applicationUserDataConverter.toDto(applicationUser),
      );
  }

  @Delete('/:uuid')
  public async remove(
    @Param('uuid', new UUIDPipe()) uuid: string,
    @Body() applicationUserDto: ApplicationUserDto,
  ) {
    const applicationUser: ApplicationUser =
      this.applicationUserDataConverter.toEntity(applicationUserDto);
    applicationUser.uuid = uuid;
    this.applicationUserService
      .remove(applicationUser)
      .then((applicationUser: ApplicationUser) =>
        this.applicationUserDataConverter.toDto(applicationUser),
      );
  }
}
