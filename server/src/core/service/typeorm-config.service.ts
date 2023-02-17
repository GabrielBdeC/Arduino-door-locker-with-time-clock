import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor() { }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return TypeOrmConfigService.dataSourceOptions();
  }

  public static dataSourceOptions(): DataSourceOptions {
    return {
      type: 'mariadb',
      host: process.env.TYPEORM_HOST || 'localhost',
      port: Number(process.env.TYPEORM_PORT) || 3306,
      username: process.env.TYPEORM_USERNAME || 'root',
      password: process.env.TYPEORM_PASSWORD || '',
      database: process.env.TYPEORM_DATABASE || 'locker_db',
      entities: [
        `${__dirname}/../../module/*/entity/*.entity.js`,
        `${__dirname}/../../common/entity/*.entity.js`,
      ],
      migrations: [`${__dirname}/../../migration/locker_db/*.js`],
      synchronize: false,
    };
  }
}
