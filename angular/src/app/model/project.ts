import {List} from "./list";
import {Deliverable} from "./deliverable";
import { ProjectMember } from "./project-member";

export interface Project {
  id?: number;
  title?: string;
  addedBy?: number;
  budget?: number;
  budgetPrivate?: boolean;
  usageExpiration?: boolean;
  paymentTerm?: string;
  expirationFromFirstUseAt?: string;
  status?: string;
  projectStartedAt?: string;
  firstUseAt?: string;
  deliverables?: Deliverable[];
  projectEmailContractId?: number;
  projectMemberImage?: any;
  memberIds?: any[];
}

export interface ProjectEmailContract {
  id?: number;
  userId? : number,
  contentId? : number,
  fileName? : string,
  processed? : boolean,
  projectId? : number,
  updatedAt? : string,
}

export interface ProjectList extends List {
  projects?: Project[];
}



