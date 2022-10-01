import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { ApplicationUser } from '../entity/application-user.entity';

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

  public async save(
    applicationUser: ApplicationUser,
  ): Promise<ApplicationUser> {
    return this.applicationUserRepository.save(applicationUser);
  }

  public async remove(
    applicationUser: ApplicationUser,
  ): Promise<ApplicationUser> {
    return this.applicationUserRepository.softRemove(applicationUser);
  }
}
