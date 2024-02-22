import {BaseMessage} from "@sendbird/chat/message";
import {Sender} from "@sendbird/chat/lib/__definition";

export declare class GroupMessage extends BaseMessage {
  readonly message?: string;
  readonly sender?: Sender;
  pinned?: boolean;
}
