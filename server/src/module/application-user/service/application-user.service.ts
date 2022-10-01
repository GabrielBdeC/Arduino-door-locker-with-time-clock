import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationUser } from '../entity/application-user.entity';

@Injectable()
export class ApplicationUserService {
  constructor(
    @InjectRepository(ApplicationUser)
    private applicationUserRepository: Repository<ApplicationUser>,
  ) {}

  public async getAll(): Promise<ApplicationUser[]> {
    return this.applicationUserRepository.find();
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
