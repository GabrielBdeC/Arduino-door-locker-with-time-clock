import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import cleanDeep from 'clean-deep';

export interface ResponsePaginated<T> {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  items: T[];
}

@Injectable()
export class DTOCleanerInteceptor<T>
  implements
    NestInterceptor<
      T | string | Pagination<T>,
      T | string | ResponsePaginated<T>
    >
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | ResponsePaginated<T>> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'string') {
          return data;
        } else if (data instanceof Pagination) {
          return {
            totalItems: data.meta.totalItems,
            itemCount: data.meta.itemCount,
            itemsPerPage: data.meta.itemsPerPage,
            totalPages: data.meta.totalPages,
            currentPage: data.meta.currentPage,
            items: data.items.map((el: T) => <T>cleanDeep(el)),
          };
        }
        return <T>cleanDeep(data);
      }),
    );
  }
}
