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
import { ApplicationUserDataConverter } from '../data-converter/application-user.data-converter';
import { ApplicationUserDto } from '../dto/application-user.dto';
import { ApplicationUser } from '../entity/application-user.entity';
import { ApplicationUserService } from '../service/application-user.service';
import { ApplicationUserAbilities } from '../decorator/application-user-abilities.decorator';
import { ApplicationUserAction } from '../type/application-user.action';
import { ApplicationUserGuard } from '../guard/application-user.guard';
import { UUIDPipe } from '../../../common/pipe/uuid.pipe';

@UseGuards(ApplicationUserGuard)
@Controller('v1/application_user')
export class ApplicationUserController {
  constructor(
    private applicationUserService: ApplicationUserService,
    private applicationUserDataConverter: ApplicationUserDataConverter,
  ) {}

  @Get()
  @ApplicationUserAbilities(ApplicationUserAction.GET)
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
  @ApplicationUserAbilities(ApplicationUserAction.GET)
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

  @Post()
  @ApplicationUserAbilities(ApplicationUserAction.CREATE)
  public async create(
    @Body() applicationUserDto: ApplicationUserDto,
    @Req() req,
  ): Promise<ApplicationUserDto> {
    const applicationUser: ApplicationUser =
      this.applicationUserDataConverter.toEntity(applicationUserDto);
    return this.applicationUserService
      .create(applicationUser, req.user)
      .then((applicationUser: ApplicationUser) =>
        this.applicationUserDataConverter.toDto(applicationUser),
      );
  }

  @Put('/:uuid')
  @ApplicationUserAbilities(ApplicationUserAction.UPDATE)
  public async update(
    @Param('uuid', new UUIDPipe()) uuid: string,
    @Body() applicationUserDto: ApplicationUserDto,
    @Req() req,
  ): Promise<ApplicationUserDto> {
    const applicationUser: ApplicationUser =
      this.applicationUserDataConverter.toEntity(applicationUserDto);
    applicationUser.uuid = uuid;
    return this.applicationUserService
      .update(applicationUser, req.user)
      .then((applicationUser: ApplicationUser) =>
        this.applicationUserDataConverter.toDto(applicationUser),
      );
  }

  @Delete('/:uuid')
  @ApplicationUserAbilities(ApplicationUserAction.REMOVE)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(
    @Param('uuid', new UUIDPipe()) uuid: string,
    @Req() req,
  ): Promise<void> {
    const applicationUser: ApplicationUser = new ApplicationUser();
    applicationUser.uuid = uuid;
    return this.applicationUserService.remove(applicationUser, req.user);
  }
}
