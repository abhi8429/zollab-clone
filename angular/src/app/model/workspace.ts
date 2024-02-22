export interface Workspace {
  id?: number;
  name?: string;
  userId?: number;
  status?: Status;
  updatedAt?: Date;
  allowJoin?: boolean;
  inviteCode?: string;
  encodedInviteCode?: string;
  deleted?: boolean;
  logoId?: number;
  workspaceLogo?: string;
}

export enum Status {
  Active = "Active",
}
