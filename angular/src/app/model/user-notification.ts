export interface UserNotification {
  key?: UserNotificationKey
  receivedAt?: string
  read?: boolean
  messageAsText?: string
  metaData?: [key: string]
}

export interface UserNotificationKey {
  userId?: number
  id?: string
}
