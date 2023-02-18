import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Base, BaseResponsePaginated } from '../model/base.model';

@Injectable()
export abstract class BaseService<T extends Base> {
  protected url: string = 'http://localhost:9228/api/door_locker';

  constructor(protected http: HttpClient) { }

  public getAll(numberPage: number | void, pageItems: number | void): Observable<BaseResponsePaginated<T>> {
    let params: HttpParams = new HttpParams();
    if (numberPage) {
      params = params.set('numberPage', numberPage);
    }
    if (pageItems) {
      params = params.set('pageItems', pageItems);
    }
    return this.http.get<BaseResponsePaginated<T>>(this.url, { params });
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
