import { getChatCategory, getParticipantName } from "./participantMetadata";
import { useActiveChatThread } from "./useActiveChatThread";
import { ChatImageInputs } from "./ChatImageInputs";
import { ChatTimeline } from "./ChatTimeline";
import { useMemo, useState } from "react";
import { useTransientNotice } from "../../../shared/hooks/useTransientNotice";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { useChatEntryQuery, useChatMessagesQuery } from "../api/chat.hooks";
import { type ChatMessage } from "../api/chat.service";
import { BlockChatConfirmBottomSheet } from "./BlockChatConfirmBottomSheet";
import { ChatBlockedFooter } from "./ChatBlockedFooter";
import { ChatComposer } from "./ChatComposer";
import { ChatDetailHeader } from "./ChatDetailHeader";
import { ChatParticipantAvailabilityCard } from "./ChatParticipantAvailabilityCard";
import { ChatPropertyStrip } from "./ChatPropertyStrip";
import { ChatSettingsBottomSheet } from "./ChatSettingsBottomSheet";
import { dedupeChatMessages } from "./messageIdentity";
import { readPathRecord } from "./readChatValues";
import {
  getChatRouteStateThread,
  getChatRouteStateThreadId,
  getChatRouteThreadId,
  readCurrentUserId,
} from "./routeState";
import { SendFileBottomSheet } from "./SendFileBottomSheet";
import { readChatThreadId } from "./threadMetadata";
import { useChatAttachments } from "./useChatAttachments";
import { useChatDraft } from "./useChatDraft";
import { useChatModeration } from "./useChatModeration";
import { useChatScroll } from "./useChatScroll";
import { useChatSocket } from "./useChatSocket";

export function UserChatDetailPage() {
  const routeThreadId = getChatRouteStateThreadId() || getChatRouteThreadId();
  const routeThread = getChatRouteStateThread();
  const [isSendFileSheetOpen, setIsSendFileSheetOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [isBlockConfirmSheetOpen, setIsBlockConfirmSheetOpen] = useState(false);

  const { showNotice } = useTransientNotice();
  const currentUserId = useMemo(() => readCurrentUserId(), []);
  const chatEntryQuery = useChatEntryQuery({
    initialThread: routeThread,
    threadId: routeThreadId,
  });
  const chatThread = chatEntryQuery.data ?? routeThread;
  const resolvedThreadId = readChatThreadId(chatThread) || routeThreadId;
  const [activeThreadId, setActiveThreadId] = useActiveChatThread(routeThreadId, resolvedThreadId);
  const chatCategory = getChatCategory(chatThread);
  const messagesQuery = useChatMessagesQuery(activeThreadId || null);
  const {
    liveMessages,
    readThreadIds,
    sentMessages,
    setSentMessages,
    pendingOutgoingAttachmentsRef,
    pendingOutgoingLocationsRef,
    pendingOutgoingBodiesRef,
  } = useChatSocket({
    activeThreadId,
    chatCategory,
    currentUserId,
    setActiveThreadId,
    refetch: messagesQuery.refetch,
    showNotice,
  });
  const apiMessages = useMemo(() => {
    const lastMessage = readPathRecord(chatThread, ["last_message", "lastMessage"]);

    return dedupeChatMessages([
      ...(messagesQuery.data ?? []),
      ...(lastMessage ? [lastMessage as ChatMessage] : []),
      ...liveMessages,
    ]);
  }, [chatThread, liveMessages, messagesQuery.data]);
  const { chatScrollRef, updateScrollShadow } = useChatScroll(
    apiMessages.length,
    sentMessages.length,
  );

  const [draftMessage, setDraftMessage] = useState("");
  const {
    blockedByMe,
    blockedMe,
    isChatBlocked,
    blockChatMutation,
    unblockChatMutation,
    confirmBlockChat,
    unblockCurrentChat,
    handleSettingsSelect,
  } = useChatModeration({
    routeThread,
    chatThread,
    activeThreadId,
    setDraftMessage,
    setIsSendFileSheetOpen,
    setIsSettingsSheetOpen,
    setIsBlockConfirmSheetOpen,
  });
  const { changeDraftMessage, sendMessage } = useChatDraft({
    activeThreadId,
    chatCategory,
    isChatBlocked,
    pendingOutgoingBodiesRef,
    setSentMessages,
    showNotice,
    draftMessage,
    setDraftMessage,
  });

  const { cameraInputRef, galleryInputRef, sendImageFiles, handleSendFileSelect } =
    useChatAttachments({
      activeThreadId,
      chatCategory,
      setSentMessages,
      pendingOutgoingAttachmentsRef,
      pendingOutgoingLocationsRef,
      showNotice,
      setIsSendFileSheetOpen,
    });

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <ChatDetailHeader
        onOpenMenu={() => setIsSettingsSheetOpen(true)}
        title={getParticipantName(chatThread)}
      />
      <ChatPropertyStrip thread={chatThread} />

      <div className="bg-surface-container-lowest relative min-h-0 flex-1">
        <main
          ref={chatScrollRef}
          onScroll={updateScrollShadow}
          className={`bg-surface-container-lowest h-full overflow-y-auto px-4 pt-4 ${isChatBlocked ? "pb-[84px]" : "pb-[92px]"}`}
        >
          <ChatParticipantAvailabilityCard availability={chatThread?.participant?.availability} />

          <ChatTimeline
            isLoading={messagesQuery.isLoading}
            apiMessages={apiMessages}
            sentMessages={sentMessages}
            currentUserId={currentUserId}
            forceRead={readThreadIds.has(activeThreadId)}
          />
        </main>
      </div>

      <ChatImageInputs
        cameraInputRef={cameraInputRef}
        galleryInputRef={galleryInputRef}
        sendImageFiles={sendImageFiles}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[15px] bg-[linear-gradient(180deg,transparent_0%,var(--color-surface-container-lowest)_100%)]"
      />

      <div className="absolute inset-x-0 bottom-0 z-30">
        {isChatBlocked ? (
          <ChatBlockedFooter
            blockedMe={blockedMe && !blockedByMe}
            isPending={unblockChatMutation.isPending}
            onUnblock={unblockCurrentChat}
          />
        ) : (
          <ChatComposer
            message={draftMessage}
            onChangeMessage={changeDraftMessage}
            onOpenAttach={() => setIsSendFileSheetOpen(true)}
            onSend={() => sendMessage()}
          />
        )}
      </div>
      <SendFileBottomSheet
        isOpen={!isChatBlocked && isSendFileSheetOpen}
        onClose={() => setIsSendFileSheetOpen(false)}
        onSelect={handleSendFileSelect}
      />
      <ChatSettingsBottomSheet
        isBlockedByMe={blockedByMe}
        isOpen={isSettingsSheetOpen}
        onClose={() => setIsSettingsSheetOpen(false)}
        onSelect={handleSettingsSelect}
      />
      <BlockChatConfirmBottomSheet
        isOpen={isBlockConfirmSheetOpen}
        isPending={blockChatMutation.isPending}
        onCancel={() => {
          if (!blockChatMutation.isPending) setIsBlockConfirmSheetOpen(false);
        }}
        onConfirm={confirmBlockChat}
      />
    </PageFrame>
  );
}
