import { Controller, Get } from '@nestjs/common';

@Controller('v1/health_check')
export class HealthCheckController {
  @Get()
  check(): string {
    return 'OK';
  }
}
