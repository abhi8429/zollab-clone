export interface Notification {
  id?: number;
  userId?: number;
  channelNotification?: ChannelNotification;
  dealNotification?: DealNotification;
  deliverableNotification?: DeliverableNotification;
  applicationNotificationSchedule?: ApplicationNotificationSchedule;
  updatedAt?: string;
}

export interface ApplicationNotificationSchedule {
  language?: string;
  startTime?: string;
  endTime?: string;
}

export interface ChannelNotification {
  channelDirectMessages?: ChannelDirectMessages;
}

export enum ChannelDirectMessages {
  AllMessages = "AllMessages",
  DirectMessages = "DirectMessages",
}

export interface DealNotification {
  newOneAdded?: boolean;
  changeInStatus?: boolean;
  descriptionUpdated?: boolean;
  pricingUpdated?: boolean;
  startDateUpdated?: boolean;
  expiryDateUpdated?: boolean;
  priorityUpdated?: boolean;
}

export interface DeliverableNotification {
  newOneAdded?: boolean;
  changeInStatus?: boolean;
  reviewerAdded?: boolean;
  descriptionUpdated?: boolean;
  priorityUpdated?: boolean;
  evidenceAdded?: boolean;
  evidenceUpdated?: boolean;
  overdueReminder?: boolean;
}
