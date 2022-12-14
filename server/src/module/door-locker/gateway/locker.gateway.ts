import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { map, Observable, tap } from 'rxjs';
import { Server } from 'ws';
import { LockerWsService } from '../service/locker-ws.service';
import { LockerWsDto } from '../dto/locker-ws.dto';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@WebSocketGateway({ path: '/api/door_locker/v1/locker' })
export class LockerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private lockerWsService: LockerWsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @WebSocketServer()
  server: Server;

  public async handleConnection(server: Server) {
    if (this.server.clients.size > 1) {
      this.server.emit('Only one request allowed at same');
      server.close();
    } else {
      this.server.emit(
        JSON.stringify({
          event: 'connection',
          message: 'opened',
        }),
      );
      this.lockerWsService.subjectLockerObservable.pipe(
        map((value: string) => value),
      );
      await this.cacheManager.set('wsClients', this.server.clients.size, {
        ttl: 0,
      });
    }
  }

  @SubscribeMessage('rfid')
  handleMessage(server: Server): Observable<WsResponse<string>> {
    return this.lockerWsService.subjectLockerObservable.pipe(
      map(
        (value: string): LockerWsDto => ({
          event: 'rfid',
          data: value,
        }),
      ),
      tap((lockerWsDto: LockerWsDto) => {
        if (lockerWsDto.data == 'closed') {
          server.close();
        }
      }),
    );
  }

  public async handleDisconnect() {
    await this.cacheManager.set('wsClients', this.server.clients.size, {
      ttl: 0,
    });
  }
}
