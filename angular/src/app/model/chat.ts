import {ZollabContent} from "./zollab-content";

export interface Chat {
  count?: number
  upCount?: number
  downCount?: number
  content?: Content[]
  hasMoreUpElement?: boolean
  hasMoreDownElement?: boolean
  fetchOrder?: string
}

export interface Content {
  key: Key
  sentAt?: string
  star?: any
  pinned?: boolean
  messageAsText?: string
  metaData?: {[key: string]: any},
  zollabContent?: ZollabContent,
  zollabContentId?: number,
  clicked?:boolean
  memberName?: string
  parentMessage?: any
  systemMessage?: boolean
}

export interface Key {
  teamId?: number
  projectId?: number
  id?: string
  sentBy?: number
}
