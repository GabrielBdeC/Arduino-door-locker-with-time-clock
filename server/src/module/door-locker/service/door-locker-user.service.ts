import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validateOrReject } from 'class-validator';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { User } from '../../auth/model/user.model';
import { Repository } from 'typeorm';
import { doorLockerUserValidationOptions } from '../costant/door-locker-user-validation-options.constant';
import { DoorLockerUser } from '../entity/door-locker-user.entity';
import { DoorLockerUserAction } from '../type/door-locker-user.action';
import { ApplicationUser } from '../../application-user/entity/application-user.entity';
import { LockerEntity } from '../entity/locker.entity';
import { commonValidationOptions } from '../../../common/constant/common-validation-options.constant';
import crypto from 'crypto';

@Injectable()
export class DoorLockerUserService {
  constructor(
    @InjectRepository(DoorLockerUser)
    private doorLockerUserRepository: Repository<DoorLockerUser>,
  ) {}

  public async getByRfid(lockerEntity: LockerEntity): Promise<DoorLockerUser> {
    await validateOrReject(lockerEntity, commonValidationOptions);
    lockerEntity.rfid = crypto
      .createHash('SHA512')
      .update(lockerEntity.rfid)
      .digest('base64');
    return this.doorLockerUserRepository.findOneByOrFail({
      rfid: lockerEntity.rfid,
    });
  }

  public async getAll(
    options: IPaginationOptions,
  ): Promise<Pagination<DoorLockerUser>> {
    const query = this.doorLockerUserRepository
      .createQueryBuilder('doorLockerUser')
      .select()
      .orderBy('doorLockerUser.createdAt', 'ASC');
    return paginate<DoorLockerUser>(query, options);
  }
  public async getOne(doorLockerUser: DoorLockerUser): Promise<DoorLockerUser> {
    return this.doorLockerUserRepository.findOneByOrFail({
      uuid: doorLockerUser.uuid,
    });
  }

  public async create(
    doorLockerUser: DoorLockerUser,
    user: User,
  ): Promise<DoorLockerUser> {
    const doorLockerUserCreator: ApplicationUser = new ApplicationUser();
    doorLockerUserCreator.id = user.id;
    doorLockerUser.createdBy = doorLockerUserCreator;
    await validateOrReject(
      doorLockerUser,
      doorLockerUserValidationOptions[DoorLockerUserAction.CREATE],
    );
    return this.doorLockerUserRepository
      .createQueryBuilder()
      .insert()
      .values(doorLockerUser)
      .returning('*')
      .execute()
      .then((el) => <DoorLockerUser>el.generatedMaps[0]);
  }

  public async update(
    doorLockerUser: DoorLockerUser,
    user: User,
  ): Promise<DoorLockerUser> {
    delete doorLockerUser.institutionCode;
    const doorLockerUserChanger: ApplicationUser = new ApplicationUser();
    doorLockerUserChanger.id = user.id;
    doorLockerUser.changedBy = doorLockerUserChanger;
    await validateOrReject(
      doorLockerUser,
      doorLockerUserValidationOptions[DoorLockerUserAction.UPDATE],
    );
    return this.doorLockerUserRepository
      .createQueryBuilder()
      .update(doorLockerUser)
      .where('uuid = :uuid', { uuid: doorLockerUser.uuid })
      .execute()
      .then(() => {
        return this.getOne(doorLockerUser);
      });
  }

  public async remove(
    doorLockerUser: DoorLockerUser,
    user: User,
  ): Promise<void> {
    const doorLockerUserDeleter: DoorLockerUser = new DoorLockerUser();
    doorLockerUserDeleter.id = user.id;
    return this.doorLockerUserRepository
      .createQueryBuilder()
      .update(DoorLockerUser)
      .set({ deletedBy: doorLockerUserDeleter })
      .where('uuid = :uuid', { uuid: doorLockerUser.uuid })
      .execute()
      .then(() => {
        this.doorLockerUserRepository
          .createQueryBuilder()
          .softDelete()
          .from(DoorLockerUser)
          .where('uuid = :uuid', { uuid: doorLockerUser.uuid })
          .execute();
      });
  }
}
