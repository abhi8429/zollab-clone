export interface Report {
  impressions?: number;
  engagements?: number;
  engagementRate?: number;
  contents?: Content[];
  summary?: string;
}

export interface Content {
  displayImage: string | undefined;
  work_platform?: WorkPlatform;
  platform_content_id?: string;
  format?: string;
  type?: string;
  url: string;
  media_url?: string;
  duration?: number;
  description?: string;
  thumbnail_url?: string;
  title?: string;
  engagement?: Engagement;
}

export interface Engagement {
  like_count?: number;
  comment_count?: number;
  view_count?: number;
  share_count?: number;
  engagementRate?: number;
}

export interface WorkPlatform {
  id?: string;
  name?: string;
  logo_url?: string;
}
