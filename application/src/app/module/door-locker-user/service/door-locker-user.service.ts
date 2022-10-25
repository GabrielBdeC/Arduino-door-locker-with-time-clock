import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../core/service/base.service';
import { DoorLockerUser } from '../model/door-locker-user.model';

@Injectable()
export class DoorLockerUserService extends BaseService<DoorLockerUser> {
  constructor(protected override http: HttpClient) {
    super(http);
    this.url = `${this.url}/v1/door_locker_user`;
  }
}
