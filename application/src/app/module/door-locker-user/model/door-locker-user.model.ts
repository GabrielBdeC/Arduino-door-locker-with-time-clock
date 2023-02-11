import { Base, BaseResponsePaginated } from 'src/app/core/model/base.model';

export class DoorLockerUser extends Base {
  public name: string;
  public institutionCode: string;
  public authorization: boolean;
}

export class DoorLockerUserPaginated extends BaseResponsePaginated<DoorLockerUser>{ };