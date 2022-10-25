import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../model/login.model';
import { map, Observable } from 'rxjs';
import { Payload } from '../model/payload.model';

@Injectable()
export class AuthService {
  private cachePayload: Observable<Payload>;

  private baseURL: string =
    'http://localhost:3000/api/door_locker/v1/auth/login';
  
  constructor(
    private http: HttpClient
  ) {}

  public login(login: Login): Observable<Payload> {
    return this.http.post<Payload>(this.baseURL, login).pipe(
      map((el: Payload) => {
        this.setCachePayload(el);
        return el;
      })
    );
  }

  public logout() {
    this.clearCachePayload();
  }

  public getPayload(): Payload {
    return <Payload>JSON.parse(<string>localStorage.getItem('payload'));
  }

  private clearCachePayload() {
    localStorage.removeItem('payload');
  }

  private setCachePayload(payload: Payload) {
    localStorage.setItem('payload', JSON.stringify(payload));
  }
}
