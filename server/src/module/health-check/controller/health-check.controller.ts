import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { Public } from '../../../core/decorator/public.decorator';
import { HealthCheckService } from '../service/health-check.service';

@Controller('v1/health_check')
export class HealthCheckController {
  constructor(private healthCheckService: HealthCheckService) {}

  @Get()
  @Public()
  public async get(): Promise<string> {
    return this.healthCheckService
      .test()
      .catch(() => {
        throw new InternalServerErrorException('Database Error');
      })
      .then(() => {
        return 'OK';
      });
  }
}
