import { Typography } from "../../../shared/ui/Typography";
import { type ChatMessage } from "../api/chat.service";
import { ChatDateChip } from "./ChatBubble";
import { ChatApiMessageBubble, SentChatMessageBubble } from "./ChatMessageBubble";
import { getChatMessageId } from "./messageIdentity";
import { type SentChatMessage } from "./types";

export function ChatTimeline({
  isLoading,
  apiMessages,
  sentMessages,
  currentUserId,
  forceRead,
}: {
  isLoading: boolean;
  apiMessages: ChatMessage[];
  sentMessages: SentChatMessage[];
  currentUserId: string;
  forceRead: boolean;
}) {
  return (
          <div className="space-y-3">
            {isLoading && apiMessages.length === 0 ? (
              <Typography
                as="p"
                variant="body"
                size="small"
                weight="regular"
                className="text-outline py-6 text-center text-xs"
              >
                در حال دریافت پیام‌ها...
              </Typography>
            ) : null}

            {!isLoading && apiMessages.length === 0 ? (
              <>
                <ChatDateChip />
                <Typography
                  as="p"
                  variant="body"
                  size="small"
                  weight="regular"
                  className="text-outline mx-auto w-full py-6 text-center text-xs"
                >
                  هنوز پیامی در این گفتگو ثبت نشده است.
                </Typography>
              </>
            ) : null}

            {apiMessages.map((apiMessage, index) => (
              <ChatApiMessageBubble
                currentUserId={currentUserId}
                forceRead={forceRead}
                key={getChatMessageId(apiMessage, index)}
                message={apiMessage}
              />
            ))}

            {sentMessages.map((sentMessage) => (
              <SentChatMessageBubble message={sentMessage} key={sentMessage.id} />
            ))}
          </div>
  );
}
