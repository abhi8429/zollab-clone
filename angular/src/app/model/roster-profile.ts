export interface Profile {
  id?: number;
  handle?: string;
  updatedAt?: string;
  reportPulledAt?: string;
  platformUrls?: Images;
  images?: Images;
  youtubeCount?: number;
  instagramCount?: number;
  tiktokCount?: number;
  twitterCount?: number;
  twitchCount?: number;
}

export interface Images {
  youtube?: string;
  tiktok?: string;
  instagram?: string;
  twitter?: string;
  twitch?: string;
}
