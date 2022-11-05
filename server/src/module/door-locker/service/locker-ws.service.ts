import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class LockerWsService {
  private readonly subjectLocker = new Subject<string>();
  public readonly subjectLockerObservable = this.subjectLocker.asObservable();

  public sendMessage(value: string): void {
    this.subjectLocker.next(value);
  }
}
