export interface List {
  pageable?: Pageable;
  totalPages?: number;
  totalElements?: number;
  last?: boolean;
  sort?: Sort;
  numberOfElements?: number;
  first?: boolean;
  size?: number;
  number?: number;
  empty?: boolean;
}

export interface Pageable {
  sort?: Sort;
  pageNumber?: number;
  pageSize?: number;
  offset?: number;
  paged?: boolean;
  unpaged?: boolean;
}

export interface Sort {
  sorted?: boolean;
  unsorted?: boolean;
  empty?: boolean;
}
