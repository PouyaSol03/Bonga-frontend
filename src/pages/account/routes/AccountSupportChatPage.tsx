import { useChatsQuery } from "../../../core/hooks/chat.hooks";
import { useMemo } from "react";
import type { ChatMessage } from "../../../core/services/chat.service";
import { PageFrame } from "../../../app/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import LinearMoreVertical from "../../../shared/icons/LinearMoreVertical";
import { RouteLink } from "../../../app/router/RouteLink";
import { ConversationCard, SUPPORT_NEW_CHAT_PATH, SupportChatsEmptyState, WelcomeCard, asChatRecord, formatSupportConversationDate, isOpenSupportThread, readChatPathText, readSupportMessageBody, readSupportThreadId } from "../accountSupportViews";
import type { Conversation } from "../accountSupportViews";
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

        return [{
          date: formatSupportConversationDate(
            readChatPathText(lastMessage, ["created_at", "createdAt", "sent_at", "sentAt"]) ||
              readChatPathText(thread, ["updated_at", "updatedAt", "created_at", "createdAt"]),
          ),
          id,
          isOpen: isOpenSupportThread(thread),
          message: readSupportMessageBody((lastMessage ?? {}) as ChatMessage) || "گفتگو با پشتیبانی",
          thread,
        }];
      }),
    [supportChatsQuery.data?.data],
  );

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
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

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white px-4 pb-[88px] pt-4">
        <WelcomeCard />

        <section
          aria-labelledby="recent-support-conversations"
          className="mt-6 flex min-h-0 flex-1 flex-col"
        >
          <Typography as="h2" variant="title" size="medium" weight="semibold"
            className="m-0 text-right text-base font-semibold leading-6 text-[#4d4d4d]"
            id="recent-support-conversations"
          >
            گفتگوهای اخیر
          </Typography>

          {supportChatsQuery.isLoading ? (
            <Typography as="p" variant="body" size="medium" weight="regular" className="py-12 text-center text-sm text-[#808080]">در حال دریافت گفتگوها...</Typography>
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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-white px-4 pb-3 pt-3">
        <RouteLink
          className="pointer-events-auto flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] px-4 text-sm font-semibold leading-5 text-white no-underline outline-none active:bg-[#003da7] focus-visible:ring-3 focus-visible:ring-[#0048c440]"
          to={SUPPORT_NEW_CHAT_PATH}
        >
          شروع گفتگوی جدید
        </RouteLink>
      </div>
    </PageFrame>
  );
}
