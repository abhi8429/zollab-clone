import {Role} from "./role";
import {Member} from "./team-member";

export interface ProjectMember extends Member {

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


export enum PROJECT_MEMBER_TYPES {
  OWNER = 'Owner',
  EDITOR = 'Editor',
  APPROVER = 'Approver',
  VIEWER = 'Viewer',
  CREATOR = 'Creator'
}
