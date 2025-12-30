export interface Attachment {
  type: "image" | "video" | "audio";
  url: string;
  filename: string;
}

export interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatarUrl?: string;
  isMine: boolean;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  name: string;
  avatarUrl: string;
  messages: Message[];
}

export interface TranscriptData {
  conversations: Conversation[];
}
