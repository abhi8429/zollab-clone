import {List} from "./list";

export interface Deal {
  id?: number;
  summary?: string;
  addedBy?: number;
  price?: number;
  startedAt?: string;
  expiredAt?: string;
  description?: string;
  tagsAsList?: string[];
  status?: string;
  notification?: boolean;
  deleted?: boolean;
  encodedInviteCode?: string;
  inviteCode?: string;
  idOfWorkspace?: number;
  reviewerId?: number;
}

export interface DealList extends List {
  content?: Deal[];
}

export interface FilterMeta {
  statues?: string[];
  expiry?: Date[];
  tags?: string[];
}


export interface Attachment {
  id?: number;
  contentId?: number;
  entityId?: number;
  entityType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  addedBy?: number;
  title?: string;
  fileName?: string;
  ext?: string;
  type?: string;
  cdnUrl?: string;
  active?: boolean;
}
