import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthCheck } from '../entity/health-check.entity';

@Injectable()
export class HealthCheckService {
  constructor(
    @InjectRepository(HealthCheck)
    private pointRepository: Repository<HealthCheck>,
  ) {}

  public async test(): Promise<HealthCheck[]> {
    return this.pointRepository.find();
  }
}
