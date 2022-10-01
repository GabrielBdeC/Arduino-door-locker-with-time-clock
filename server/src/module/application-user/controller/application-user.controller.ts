import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
  public async getAll(): Promise<ApplicationUserDto[]> {
    return this.applicationUserService
      .getAll()
      .then((applicationUserList: ApplicationUser[]) =>
        applicationUserList.map((applicationUser: ApplicationUser) =>
          this.applicationUserDataConverter.toDto(applicationUser),
        ),
      );
  }

  @Get('/:uuid')
  public async getOne(
    @Param('uuid') uuid: string,
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
    @Param('uuid') uuid: string,
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
    @Param('uuid') uuid: string,
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
