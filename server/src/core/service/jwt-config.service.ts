import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JWTConfigService implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}
  public createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      },
    };
  }
}
