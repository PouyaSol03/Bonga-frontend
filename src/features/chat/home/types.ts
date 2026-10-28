import { type ChatCategory, type ChatThread } from "../api/chat.service";

export type ChatItem = {
  adCategory: string;
  adLabel: string;
  adTitle: string;
  badgeCount?: string;
  category?: ChatCategory;
  date: string;
  detailPath?: string;
  detailState?: { thread?: ChatThread; threadId: string };
  highlighted?: boolean;
  id?: string;
  imageUrl?: string;
  isBlocked?: boolean;
  message: string;
  userName: string;
};

export type SentChatMessage =
  | { id: string; type: "text"; text: string }
  | { id: string; type: "image"; imageUrl: string; attachmentUrl: string; fileName: string }
  | { id: string; type: "location"; latitude: number; longitude: number; mapsUrl: string };
