export interface LivePost {
  id?: number;
  entityId?: number;
  entityType?: string;
  url?: string;
  createdAt?: Date;
  updatedAt?: Date;
  addedBy?: number;
  type?: string;
  active?: boolean;
}
