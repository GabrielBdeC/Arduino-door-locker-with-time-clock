import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { Login } from '../model/login.model';

@Injectable()
export class LoginDataConverter {
  public toModel(dto: LoginDto): Login {
    const login: Login = new Login();
    login.login = dto.login;
    login.password = dto.password;
    return login;
  }
}
