import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validateOrReject } from 'class-validator';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { User } from '../../auth/model/user.model';
import { Repository } from 'typeorm';
import { applicationUserValidationOptions } from '../costant/application-user-validation-options.constant';
import { ApplicationUser } from '../entity/application-user.entity';
import { ApplicationUserAction } from '../type/application-user.action';

@Injectable()
export class ApplicationUserService {
  constructor(
    @InjectRepository(ApplicationUser)
    private applicationUserRepository: Repository<ApplicationUser>,
  ) {}

  public async getAll(
    options: IPaginationOptions,
  ): Promise<Pagination<ApplicationUser>> {
    const query = this.applicationUserRepository
      .createQueryBuilder('applicationUser')
      .select()
      .orderBy('applicationUser.createdAt', 'ASC');
    return paginate<ApplicationUser>(query, options);
  }

  public async getByLogin(alogin: string): Promise<ApplicationUser> {
    return this.applicationUserRepository.findOneByOrFail({
      login: alogin,
    });
  }

  public async getOne(
    applicationUser: ApplicationUser,
  ): Promise<ApplicationUser> {
    return this.applicationUserRepository.findOneByOrFail({
      uuid: applicationUser.uuid,
    });
  }

  public async create(
    applicationUser: ApplicationUser,
    user: User,
  ): Promise<ApplicationUser> {
    const applicationUserCreator: ApplicationUser = new ApplicationUser();
    applicationUserCreator.id = user.id;
    applicationUser.createdBy = applicationUserCreator;
    await validateOrReject(
      applicationUser,
      applicationUserValidationOptions[ApplicationUserAction.CREATE],
    );
    return this.applicationUserRepository
      .createQueryBuilder()
      .insert()
      .values(applicationUser)
      .returning('*')
      .execute()
      .then((el) => <ApplicationUser>el.generatedMaps[0]);
  }

  public async update(
    applicationUser: ApplicationUser,
    user: User,
  ): Promise<ApplicationUser> {
    delete applicationUser.login;
    if (
      user.uuid == applicationUser.uuid &&
      applicationUser.applicationUserType &&
      user.applicationUserType != applicationUser.applicationUserType
    ) {
      throw new BadRequestException(
        "You can't change own Application User Type",
      );
    }
    const applicationUserChanger: ApplicationUser = new ApplicationUser();
    applicationUserChanger.id = user.id;
    applicationUser.changedBy = applicationUserChanger;
    await validateOrReject(
      applicationUser,
      applicationUserValidationOptions[ApplicationUserAction.UPDATE],
    );
    return this.applicationUserRepository
      .createQueryBuilder()
      .update(applicationUser)
      .where('uuid = :uuid', { uuid: applicationUser.uuid })
      .execute()
      .then(() => {
        return this.getOne(applicationUser);
      });
  }

  public async remove(applicationUser: ApplicationUser, user: User) {
    await validateOrReject(
      applicationUser,
      applicationUserValidationOptions[ApplicationUserAction.REMOVE],
    );
    const applicationUserDeleter: ApplicationUser = new ApplicationUser();
    applicationUserDeleter.id = user.id;
    return this.applicationUserRepository
      .createQueryBuilder()
      .update(ApplicationUser)
      .set({ deletedBy: applicationUserDeleter })
      .where('uuid = :uuid', { uuid: applicationUser.uuid })
      .execute()
      .then(() => {
        this.applicationUserRepository
          .createQueryBuilder()
          .softDelete()
          .from(ApplicationUser)
          .where('uuid = :uuid', { uuid: applicationUser.uuid })
          .execute();
      });
  }
}
