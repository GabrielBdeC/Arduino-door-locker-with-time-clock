import { Module } from '@nestjs/common';
import { UUIDPipe } from './pipe/uuid.pipe';

@Module({
  providers: [UUIDPipe],
  exports: [UUIDPipe],
})
export class CommonModule {}
