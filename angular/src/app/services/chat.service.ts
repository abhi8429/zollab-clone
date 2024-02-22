import {Injectable} from '@angular/core';
import {
  GroupChannel,
  GroupChannelCreateParams,
  GroupChannelListOrder,
  GroupChannelListQuery,
  GroupChannelListQueryParams,
  GroupChannelModule,
  HiddenChannelFilter,
  PinnedMessageListQueryParams
} from "@sendbird/chat/groupChannel";
import {OpenChannelModule} from "@sendbird/chat/openChannel";
import SendbirdChat, {LogLevel} from "@sendbird/chat";
import {
  FileMessageCreateParams,
  MentionType,
  MessageTypeFilter,
  PreviousMessageListQueryParams,
  PushNotificationDeliveryOption,
  ThreadedMessageListParams,
  UserMessageCreateParams,
  UserMessageUpdateParams
} from "@sendbird/chat/message";
import {UserMessage} from "@sendbird/chat/lib/__definition";
import {GroupMessage} from "../model/group-message";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  sb: any;

  constructor() {
    this.init();
  }

  init() {
    console.debug("Connecting To SendBird....");
    const params = {
      appId: '4EDFC200-A951-471C-A763-630F89CBDEF1',
      modules: [
        new GroupChannelModule(),
        new OpenChannelModule(),
      ]
    }
    this.sb = SendbirdChat.init(params);
    this.sb.logLevel = LogLevel.ERROR
  }

  login(username: string) {
    return this.sb.connect(username.toString());
  }

  isConnected() {
    return this.sb && this.sb.currentUser && this.sb.currentUser.userId;
  }

  getConnectedUser() {
    return this.sb && this.sb.currentUser ? this.sb.currentUser : null;
  }

  getGroupChannelList(workspaceId: number) {
    const params: GroupChannelListQueryParams = {
      includeEmpty: true,
      hiddenChannelFilter: HiddenChannelFilter.ALL,
      metadataKey: 'WORKSPACE_ID',
      metadataValues: [workspaceId.toString()],
      limit: 50,
      order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
    };
    const groupChannelListQuery: GroupChannelListQuery = this.sb.groupChannel.createMyGroupChannelListQuery(params);

    return groupChannelListQuery.next()
  }
  createChannel(channelName: string, channelDescription: string) {
    const params: GroupChannelCreateParams = {
      name: channelName,
      data: channelDescription,
      operatorUserIds: [this.sb.currentUser.userId]
    };
    return this.sb.groupChannel.createChannel(params);
  }
  createChannelMeta(channel: GroupChannel, workspaceId: number) {
    const mData = {
      WORKSPACE_ID: workspaceId.toString()
    };
    return channel.createMetaData(mData);
  }

  sendMessage(channel: GroupChannel, message: string, parentMessageId: number = 0, data = {}) {
    let params: UserMessageCreateParams = {
      message
    }
    if (parentMessageId > 0) {
      params.parentMessageId = parentMessageId;
    }
    if (data !== '{}') {
      params.data = JSON.stringify(data);
    }
    return channel.sendUserMessage(params);
  }

  sendFileMessage(channel: GroupChannel, file: File, parentMessageId: number = 0) {
    const fileMessage: FileMessageCreateParams = {
      file: file,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      mentionType: MentionType.CHANNEL, // Either USERS or CHANNEL
      requireAuth: false,
      pushNotificationDeliveryOption: PushNotificationDeliveryOption.DEFAULT
    }
    if (parentMessageId > 0) {
      fileMessage.parentMessageId = parentMessageId;
    }
    return channel.sendFileMessage(fileMessage)
  }

  getChannelMessages(channel: GroupChannel, messageCount: number) {
    let params: PreviousMessageListQueryParams = {
      limit: messageCount || 20,
      includeThreadInfo: true,
      messageTypeFilter: MessageTypeFilter.ALL,
      includeReactions: true
    };
    const messageListQuery = channel.createPreviousMessageListQuery(params);
    return messageListQuery.load();
  }

  getThreadMessages(message: UserMessage) {
    let params: ThreadedMessageListParams = {
      prevResultSize: 20,
      nextResultSize: 20,
    }
    return message.getThreadedMessagesByTimestamp(message.createdAt, params)
  }

  inviteToGroupChannel(channel: GroupChannel, users: string[]) {
    return channel.inviteWithUserIds(users);
  }

  deleteMessage(channel: GroupChannel, message: GroupMessage) {
    return channel.deleteMessage(message);
  }

  pinMessage(channel: GroupChannel, message: GroupMessage, pinned: boolean) {
    if(pinned)
      return channel.pinMessage(message.messageId);
    else
      return channel.unpinMessage(message.messageId);
  }

  getPinnedChannelMessages(channel: GroupChannel) {
    let params: PinnedMessageListQueryParams = {
      limit: 50,
      includeMetaArray: true,
      includeReactions: true,
      includeParentMessageInfo: true,
      includeThreadInfo: true,
      includePollDetails: true,
    };
    const messageListQuery = channel.createPinnedMessageListQuery(params);
    return messageListQuery.next();
  }

  async sendEmoji(channel: GroupChannel, message: GroupMessage, emojiKey: string) {
    const reactionEvent = await channel.addReaction(message, emojiKey);
    message.applyReactionEvent(reactionEvent);
  }

  async removeEmoji(channel: GroupChannel, message: GroupMessage, emojiKey: string) {
    const reactionEvent = await channel.deleteReaction(message, emojiKey);
    message.applyReactionEvent(reactionEvent);
  }

  updateMessage(channel: GroupChannel, message: GroupMessage, text: string) {
    const params: UserMessageUpdateParams = {
      message: text,
    };
    return channel.updateUserMessage(message.messageId, params);
  }
}
