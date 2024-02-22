import {Profile} from "./roster-profile";

export interface ProfileList {
  content?: Content[];
  pageable?: Pageable;
  last?: boolean;
  totalPages?: number;
  totalElements?: number;
  sort?: Sort;
  first?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
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

export interface Content {
  id?: number;
  profile?: Profile;
  notes?: string;
}
