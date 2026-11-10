import { useChatsQuery } from "../../chat/api/chat.hooks";
import { useMemo } from "react";
import type { ChatMessage } from "../../chat/api/chat.service";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import LinearMoreVertical from "../../../shared/icons/LinearMoreVertical";
import { Link } from "react-router";
import {
  ConversationCard,
  SUPPORT_NEW_CHAT_PATH,
  SupportChatsEmptyState,
  WelcomeCard,
  asChatRecord,
  formatSupportConversationDate,
  isOpenSupportThread,
  readChatPathText,
  readSupportMessageBody,
  readSupportThreadId, type Conversation 
} from "../accountSupportViews";

import { Typography } from "../../../shared/ui/Typography";

export function AccountSupportChatPage() {
  const supportChatsQuery = useChatsQuery({
    category: "support",
    page: 1,
    perPage: 50,
  });
  const conversations = useMemo<Conversation[]>(
    () =>
      (supportChatsQuery.data?.data ?? []).flatMap((thread) => {
        const id = readSupportThreadId(thread);
        if (!id) return [];

        const lastMessage = asChatRecord(thread.last_message ?? thread.message);

        return [
          {
            date: formatSupportConversationDate(
              readChatPathText(lastMessage, ["created_at", "createdAt", "sent_at", "sentAt"]) ||
                readChatPathText(thread, ["updated_at", "updatedAt", "created_at", "createdAt"]),
            ),
            id,
            isOpen: isOpenSupportThread(thread),
            message:
              readSupportMessageBody((lastMessage ?? {}) as ChatMessage) || "گفتگو با پشتیبانی",
            thread,
          },
        ];
      }),
    [supportChatsQuery.data?.data],
  );

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <LinearMoreVertical className="h-6 w-6" />,
            id: "support-menu",
            label: "گزینه‌های گفتگو",
          },
        ]}
        backTo="/account/support"
        centerClassName="px-2 text-center"

        reserveStartSpace
        title="گفتگو با پشتیبانی"
        titleClassName="text-center text-base font-semibold leading-6"
      />

      <main className="bg-surface-container-lowest flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-4 pb-[88px]">
        <WelcomeCard />

        <section
          aria-labelledby="recent-support-conversations"
          className="mt-6 flex min-h-0 flex-1 flex-col"
        >
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="text-on-surface-var m-0 text-right text-base leading-6 font-semibold"
            id="recent-support-conversations"
          >
            گفتگوهای اخیر
          </Typography>

          {supportChatsQuery.isLoading ? (
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-outline py-12 text-center text-sm"
            >
              در حال دریافت گفتگوها...
            </Typography>
          ) : conversations.length === 0 ? (
            <SupportChatsEmptyState />
          ) : (
            <div className="mt-4 space-y-4">
              {conversations.map((conversation) => (
                <ConversationCard conversation={conversation} key={conversation.id} />
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="bg-surface-container-lowest pointer-events-none absolute inset-x-0 bottom-0 px-4 pt-3 pb-3">
        <Link
          className="bg-primary text-on-primary focus-visible:ring-primary/20 pointer-events-auto flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm leading-5 font-semibold no-underline outline-none focus-visible:ring-3 active:opacity-80"
          to={SUPPORT_NEW_CHAT_PATH}
        >
          شروع گفتگوی جدید
        </Link>
      </div>
    </PageFrame>
  );
}
