import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'health_check',
})
export class HealthCheck {
  @PrimaryGeneratedColumn({ name: 'health_check_id', type: 'int' })
  public id: number;
}
