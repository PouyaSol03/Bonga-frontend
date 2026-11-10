import { type ChatMessage } from "../api/chat.service";
import { ChatBubble } from "./ChatBubble";
import { formatChatMessageTime, readChatMessageTime } from "./chatDates";
import { ChatImageBubble } from "./ChatImageBubble";
import { ChatLocationBubble } from "./ChatLocationBubble";
import {
  readChatMessageAttachment,
  readChatMessageBody,
  readChatMessageLocation,
  readChatMessageType,
} from "./messageContent";
import { isOutgoingChatMessage, isReadChatMessage } from "./messageIdentity";
import { type SentChatMessage } from "./types";

export function SentChatMessageBubble({ message }: { message: SentChatMessage }) {
  const time = formatChatMessageTime();

  if (message.type === "image") {
    return <ChatImageBubble fileName={message.fileName} imageUrl={message.imageUrl} time={time} />;
  }

  if (message.type === "location") {
    return <ChatLocationBubble mapsUrl={message.mapsUrl} time={time} />;
  }

  return (
    <ChatBubble direction="outgoing" time={time}>
      {message.text}
    </ChatBubble>
  );
}

export function ChatApiMessageBubble({
  currentUserId,
  forceRead,
  message,
}: {
  currentUserId: string;
  forceRead: boolean;
  message: ChatMessage;
}) {
  const direction = isOutgoingChatMessage(message, currentUserId) ? "outgoing" : "incoming";
  const isRead = forceRead || isReadChatMessage(message);
  const time = readChatMessageTime(message);
  const type = readChatMessageType(message);

  if (type === "image") {
    const attachment = readChatMessageAttachment(message);

    if (!attachment.imageUrl) return null;

    return (
      <ChatImageBubble
        direction={direction}
        fileName={attachment.fileName}
        imageUrl={attachment.imageUrl}
        isRead={isRead}
        time={time}
      />
    );
  }

  if (type === "location") {
    const location = readChatMessageLocation(message);

    if (!location.mapsUrl) return null;

    return (
      <ChatLocationBubble
        direction={direction}
        isRead={isRead}
        mapsUrl={location.mapsUrl}
        time={time}
      />
    );
  }

  const body = readChatMessageBody(message);

  if (!body) return null;

  return (
    <ChatBubble direction={direction} isRead={isRead} time={time}>
      {body}
    </ChatBubble>
  );
}
