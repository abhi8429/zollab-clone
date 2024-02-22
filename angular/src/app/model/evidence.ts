export interface Evidence {
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
  url?: string;
}
