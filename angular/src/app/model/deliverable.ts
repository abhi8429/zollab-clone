import {List} from "./list";
import {FormControl, FormGroup} from "@angular/forms";

export interface Deliverable {
  id?: number;
  creatorId?: number;
  reviewerId?: number;
  priority?: string;
  startedAt?: Date;
  expiredAt?: Date;
  description?: string;
  summary?: string;
  addedBy?: number;
  repeat?: string;
  dueAt?: Date;
  notification?: boolean;
  statusLabel?: string;
  status?: string;
  reviewerRequired?: boolean;
  summaryOfDeal?: string;
  idOfDeal?: number;
  changedRequestedReason?: string;
  creatorObj?: userObj;
  reviewerObj?: userObj;
  repeatConf?: RepeatConf;
  childs?: Child[];
  idOfWorkspace?: number;
  repeatLabel?: string;
}


export interface Child {
  id?: number;
  description?: string;
  priority?: string;
  summary?: string;
  creatorId?: number;
  createdAt?: string;
  updatedAt?: string;
  reviewerId?: number;
  reviewerRequired?: boolean;
  notification?: boolean;
  status?: string;
  statusLabel?: string;
  summaryOfDeal?: string;
  idOfDeal?: number;
}

export interface RepeatConf {
  schType?: string;
  timeZone?: string;
  timeHrs?: string;
  timeMins?: string;
  timeSecs?: string;
  schEndsType?: string;
  date?: string;
  schEndsDate?: string;
  monthDay?: string;
  day?: string;
  schEndsOccurences?: number
}

export interface userObj {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  avatars?: Avatars;
}

export interface Avatars {
  "250X250"?: null;
  ORIGINAL?: null;
  "50X50"?: null;
  "150X150"?: null;
}

export interface DeliverableList extends List {
  content?: Deliverable[];
}

export interface FilterMeta {
  statues?: string[];
  dueOn?: Date[];
}


export interface DeliverableForm {
  summary: FormControl<string>;
  description: FormControl<string>;
  creatorId: FormControl<number>;
  dealId: FormControl<number>;
  priority: FormControl<string>;
  reviewerRequired: FormControl<boolean>;
  repeatConf?: FormGroup
}

export interface DraftPost {
  id?: number;
  entityId?: number;
  entityType?: string;
  url?: string;
  cdnUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  addedBy?: number;
  active?: boolean;
  type?: string;
  ext?: string;
  fileName?: string;
}

