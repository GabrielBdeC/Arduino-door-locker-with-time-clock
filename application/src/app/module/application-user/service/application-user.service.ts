import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../core/service/base.service';
import { ApplicationUserModel } from '../model/application-user.model';

@Injectable()
export class ApplicationUserService extends BaseService<ApplicationUserModel> {
  constructor(protected override http: HttpClient) {
    super(http);
    this.url = `${this.url}/v1/application_user`;
  }
}
