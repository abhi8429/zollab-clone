export interface ZollabContent {
  id?: number;
  contentId?: number;
  entityId?: number;
  entityType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  addedBy?: number;
  title?: string;
  description?: string;
  fileName?: string;
  ext?: string;
  type?: string;
  cdnUrl?: string;
  active?: boolean;
  url?: string;
  reportData?: Date;
  reportPulledAt?: Date;
  reportStatus?: string;
}

export enum ContentType {
  VIDEO,
  IMAGE,
  APPLICATION,
  TEXT,
  AUDIO,
  URL
}
