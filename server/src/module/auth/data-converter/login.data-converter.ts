import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { LoginModel } from '../model/login.model';

@Injectable()
export class LoginDataConverter {
  public toModel(dto: LoginDto): LoginModel {
    const loginModel: LoginModel = new LoginModel();
    loginModel.login = dto.login;
    loginModel.password = dto.password;
    return loginModel;
  }
}
