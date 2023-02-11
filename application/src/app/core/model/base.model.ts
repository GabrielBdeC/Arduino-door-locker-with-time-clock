export class Base {
  uuid?: string;
  createdAt?: string;
}

export class BaseResponsePaginated<T extends Base> {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  items: T[];
}