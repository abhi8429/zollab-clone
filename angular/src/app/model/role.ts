export interface Role {
  id?: number;
  roleName?: string;
  userDefined?: boolean;
  memberCount?: number;
  updatedAt?: Date;
  roleDesc?: string;
}

export interface RolePermission {
  "MANAGE DEALS"?: ManageDeal[];
  "MANAGE WORKSPACE"?: ManageWorkspace[];
  "MANAGE DELIVERABLES"?: ManageDeliverable[];
}

export interface ManageDeal {
  Deals?: AllDeals;
  "Deal status"?: AllDeals;
  "Linked deliverables"?: AllDeals;
  "All Deals"?: AllDeals;
}

export interface AllDeals {
  read?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface ManageDeliverable {
  Deliverable?: AllDeals;
  "All deliverables"?: AllDeals;
  "Deliverable status"?: AllDeals;
  "Deliverable status - In progress"?: AllDeals;
  "Deliverable status - In review"?: AllDeals;
  "Deliverable status - Approved"?: AllDeals;
  "Deliverable status - Changes needed"?: AllDeals;
  "Deliverable status - Done"?: AllDeals;
  "Evidence required list"?: AllDeals;
  Evidences?: AllDeals;
}

export interface ManageWorkspace {
  Workspaces?: AllDeals;
  Channels?: AllDeals;
  Members?: AllDeals;
  Roles?: AllDeals;
  "Direct Messaging"?: AllDeals;
  "Leave workspace"?: AllDeals;
}
