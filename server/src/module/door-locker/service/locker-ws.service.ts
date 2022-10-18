import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { LockerWsDto } from '../dto/locker-ws.dto';

@Injectable()
export class LockerWsService {
  private readonly subjectLocker = new Subject<LockerWsDto>();
  public readonly subjectLockerObservable = this.subjectLocker.asObservable();

  public sendMessage(value: LockerWsDto): void {
    this.subjectLocker.next(value);
  }
}
