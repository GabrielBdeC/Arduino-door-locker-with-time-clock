import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from '../service/health-check.service';

@Controller('v1/health_check')
export class HealthCheckController {
  constructor(private healthCheckService: HealthCheckService) {}

  @Get()
  public async get(): Promise<string> {
    return this.healthCheckService.test().then(() => {
      return 'OK';
    });
  }
}
