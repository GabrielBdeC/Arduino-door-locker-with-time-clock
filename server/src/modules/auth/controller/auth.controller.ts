import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';

const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNhYWFhYTQ1NnNkc2FkYXNkYXNkYXNkYXNkYXNkYXNkNzg5MCIsIm5hbWUiOiJKb2hhc2Rhc2Rhc2Rhc2Rhc2Rhc3Z2dnZ2dnZ2dm4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.OARZIdBaLnYR5qKB1xR3b8AmqJ8fZsMRYiy6zSZEgcs';

@Controller('v1/auth')
export class AuthController {
  @Post('/login')
  public login(@Body() loginDto: LoginDto): string {
    if (loginDto.username == 'arduino' && loginDto.password == 'arduino') {
      return jwt;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Post('/logout')
  @HttpCode(204)
  public logout() {
    return;
  }

  @Get('/protected_check')
  public check(@Headers() headers): string {
    if (headers['authorization'] == `Bearer ${jwt}`) {
      return 'OK';
    } else {
      throw new UnauthorizedException();
    }
  }
}
