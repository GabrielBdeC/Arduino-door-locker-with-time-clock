import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Base, BaseResponsePaginated } from '../model/base.model';

@Injectable()
export abstract class BaseService<T extends Base> {
  protected url: string = 'http://localhost:3000/api/door_locker/v1';

  constructor(protected http: HttpClient) {}

  public getAll(): Observable<BaseResponsePaginated<T>> {
    return this.http.get<BaseResponsePaginated<T>>(this.url);
  }

  public getOne(uuid: string): Observable<T> {
    return this.http.get<T>(`${this.url}/${uuid}`);
  }

  public create(model: T): Observable<T> {
    return this.http.post<T>(this.url, model);
  }

  public update(model: T): Observable<T> {
    return this.http.put<T>(`${this.url}/${model.uuid}`, model);
  }

  public remove(model: T): Observable<T> {
    return this.http.delete<T>(`${this.url}/${model.uuid}`);
  }
}
