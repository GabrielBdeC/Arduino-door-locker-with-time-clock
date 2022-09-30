import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheckController } from './controller/health-check.controller';
import { HealthCheck } from './entity/health-check.entity';
import { HealthCheckService } from './service/health-check.service';

@Module({
  controllers: [HealthCheckController],
  imports: [TypeOrmModule.forFeature([HealthCheck])],
  providers: [HealthCheckService],
})
export class HealthCheckModule {}
