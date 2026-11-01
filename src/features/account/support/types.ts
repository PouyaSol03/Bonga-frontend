import type { ComponentType, SVGProps } from "react";
import type { ChatThread } from "../../chat/api/chat.service";

export const SUPPORT_CHAT_PATH = "/account/support/chat";
export const SUPPORT_NEW_CHAT_PATH = "/account/support/chat/new";

export type SupportIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type SupportMenuItemProps = {
  description: string;
  icon: SupportIcon;
  showDivider?: boolean;
  title: string;
  to?: string;
};

export type Conversation = {
  date: string;
  id: string;
  isOpen: boolean;
  message: string;
  thread: ChatThread;
};

export type SupportChatMessage = {
  attachmentUrl?: string;
  direction: "incoming" | "outgoing";
  fileName?: string;
  id: string;
  mimeType?: string;
  sender?: string;
  text: string;
  threadId: string;
  time: string;
  type: "file" | "image" | "text";
};
