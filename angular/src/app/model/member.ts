import {Role} from "./role";

export interface Member {
  id?: number;
  memberId?: number;
  addedBy?: number;
  entityType?: string;
  entityId?: number;
  addedAt?: Date;
  memberName?: string;
  memberEmail?: string;
  avatars?: Avatars;
  role?: Role;
  memberUrl?: string
}

export interface Avatars {
  "250X250"?: string;
  ORIGINAL?: string;
  "50X50"?: string;
  "150X150"?: string;
}

export interface Extras {
  WORKSPACE_ROLES?: string[];
}


export enum MEMBER_TYPES {
  OWNER = 'Owner',
  MANAGER = 'Manager',
  REVIEWER = 'Reviewer',
  CREATORS = 'Creators'
}
