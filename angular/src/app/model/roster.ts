import {ProfileList} from "./profile-list";

export interface Roster {
  id?: number;
  name?: string;
  updatedAt?: string;
  userId?: number;
  logoId?: number;
  inviteCode?: string;
  rosterLogo?: string;
  encodedInviteCode?: string;
  isSelected?: boolean;
}

export interface PublicRoster {
  roster?: Roster;
  profiles?: ProfileList;
}
