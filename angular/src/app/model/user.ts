export interface User {
  id?: number;
  email?: string;
  password?: string;
  newPassword?: string;
  accountExpired?: boolean;
  accountLocked?: boolean;
  credentialsExpired?: boolean;
  enabled?: boolean;
  countryCode?: null;
  phone?: null;
  name?: null;
  urlSuffix?: null;
  monthlyPrice?: null;
  annuallyPrice?: null;
  handle?: null;
  invitee?: null;
  attributes?: null;
  newUser?: boolean;
  stripeMonthlySubPriceId?: null;
  stripeAnnualSubPriceId?: null;
  agency?: null;
  preCheck?: boolean;
  stripeCustomerId?: null;
  bio?: null;
  customRequestMinPrice?: number;
  status?: string;
  customerPlatforms?: null;
  influencerPlatforms?: null;
  influencerLinks?: any[];
  avatars?: Avatars;
  provider?: string;
  username?: string;
  customer?: boolean;
  influencer?: boolean;
  active?: boolean;
}

export interface Avatars {
  "250X250"?: null;
  "ORIGINAL"?: null;
  "50X50"?: null;
  "150X150"?: null;
}
