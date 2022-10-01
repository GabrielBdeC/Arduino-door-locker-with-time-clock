import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationUserController } from './controller/application-user.controller';
import { ApplicationUserDataConverter } from './data-converter/application-user.data-converter';
import { ApplicationUser } from './entity/application-user.entity';
import { ApplicationUserService } from './service/application-user.service';

@Module({
  controllers: [ApplicationUserController],
  imports: [TypeOrmModule.forFeature([ApplicationUser])],
  providers: [ApplicationUserService, ApplicationUserDataConverter],
})
export class ApplicationUserModule {}
