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
}

export interface TeamMember extends Member {

}

export interface Avatars {
  "250X250"?: string;
  ORIGINAL?: string;
  "50X50"?: string;
  "150X150"?: string;
}

export interface Extras {
  TEAM_MEMBER_ROLES?: string[];
}


export enum TEAM_MEMBER_TYPES {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  GUEST = 'Guest',
}
