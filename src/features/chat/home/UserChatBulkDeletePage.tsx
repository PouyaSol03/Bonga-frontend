import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { RequestErrorState } from "../../../shared/components/ErrorState";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { useChatsQuery, useDeleteChatsMutation } from "../api/chat.hooks";
import { ChatCard } from "./ChatCard";
import { BulkSelectAllControl, ChatListSkeleton } from "./ChatListControls";
import { ChatMenuBottomSheet } from "./ChatMenuBottomSheet";
import { ChatPageShell } from "./ChatPageShell";
import { MoreVerticalIcon } from "./listIcons";
import { mapChatThreadToChatItem } from "./mapChatThread";

export function UserChatBulkDeletePage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBlocked, setShowBlocked] = useState(false);
  const [showMyAds, setShowMyAds] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<Set<string>>(() => new Set());
  const [deleteError, setDeleteError] = useState("");
  const {
    data: chatsPage,
    error,
    isError,
    isLoading,
    refetch,
  } = useChatsQuery({
    blocked: showBlocked ? true : undefined,
    filter: showMyAds ? "my_ads" : undefined,
    page: 1,
    perPage: 50,
  });
  const deleteChatsMutation = useDeleteChatsMutation();
  const chats = useMemo(
    () => (chatsPage?.data ?? []).map(mapChatThreadToChatItem),
    [chatsPage?.data],
  );
  const selectableChatIds = useMemo(
    () => chats.map((item) => item.id).filter((id): id is string => Boolean(id)),
    [chats],
  );
  const areAllSelected =
    selectableChatIds.length > 0 && selectableChatIds.every((id) => selectedChatIds.has(id));

  const toggleSelectedChat = useCallback((id: string) => {
    if (!id) return;

    setSelectedChatIds((current) => {
      const next = new Set(current);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedChatIds((current) => {
      const alreadySelected =
        selectableChatIds.length > 0 && selectableChatIds.every((id) => current.has(id));

      return alreadySelected ? new Set() : new Set(selectableChatIds);
    });
  }, [selectableChatIds]);

  const deleteSelectedChats = useCallback(() => {
    const threadIds = [...selectedChatIds];
    if (threadIds.length === 0 || deleteChatsMutation.isPending) return;

    setDeleteError("");
    deleteChatsMutation.mutate(threadIds, {
      onError: () => {
        setDeleteError("حذف گفتگوها با خطا مواجه شد. دوباره تلاش کنید.");
      },
      onSuccess: () => {
        navigate("/chat", { replace: true });
      },
    });
  }, [deleteChatsMutation, navigate, selectedChatIds]);

  const handleMenuSelect = useCallback(
    (id: string) => {
      setIsMenuOpen(false);

      if (id === "hours") {
        navigate("/chat/response-time");
        return;
      }

      if (id === "rename") {
        navigate("/chat/rename");
      }
    },
    [navigate],
  );

  return (
    <ChatPageShell
      action={
        <Button
          unstyled
          aria-label="گزینه‌های بیشتر"
          className="text-on-surface focus-visible:outline-primary/40 active:bg-surface-container grid h-10 w-10 shrink-0 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
          onClick={() => setIsMenuOpen(true)}
          type="button"
        >
          <MoreVerticalIcon className="h-6 w-6" />
        </Button>
      }
      title="حذف گروهی چت‌ها"
    >
      <main className="bg-surface-container-lowest flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-[72px]">
        {isLoading && chats.length === 0 ? <ChatListSkeleton count={5} /> : null}
        {isError && chats.length === 0 ? (
          <RequestErrorState error={error} className="h-full min-h-0 flex-1" onRetry={() => void refetch()} />
        ) : null}
        {chats.map((item, index) => {
          const chatId = item.id ?? "";

          return (
            <ChatCard
              chatId={chatId}
              index={index}
              isBulkDeleteMode
              isSelected={Boolean(chatId && selectedChatIds.has(chatId))}
              item={item}
              key={chatId || `chat-${index}`}
              onToggleSelected={toggleSelectedChat}
            />
          );
        })}
        {!isLoading && !isError && chats.length === 0 ? (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-outline mx-auto flex min-h-0 w-full flex-1 items-center justify-center px-4 text-center text-sm"
          >
            گفتگویی برای حذف وجود ندارد
          </Typography>
        ) : null}
      </main>

      <footer className="border-outline-var bg-surface-container-lowest absolute inset-x-0 bottom-0 z-20 h-[72px] border-t px-4 shadow-[0_-8px_22px_rgba(0,0,0,0.06)]">
        {deleteError ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="bg-surface-container-lowest text-error absolute inset-x-4 bottom-full mb-2 rounded-lg px-3 py-2 text-center text-xs leading-5 shadow-sm"
          >
            {deleteError}
          </Typography>
        ) : null}
        <div className="flex h-full items-center justify-between gap-4 [direction:ltr]">
          <Button
            unstyled
            className="bg-primary h-[42px] w-[191px] shrink-0 rounded-lg px-6 text-sm leading-5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            disabled={selectedChatIds.size === 0 || deleteChatsMutation.isPending}
            onClick={deleteSelectedChats}
            type="button"
          >
            {deleteChatsMutation.isPending ? "در حال حذف..." : "حذف"}
          </Button>
          <BulkSelectAllControl
            checked={areAllSelected}
            disabled={selectableChatIds.length === 0 || deleteChatsMutation.isPending}
            onToggle={toggleSelectAll}
          />
        </div>
      </footer>

      <ChatMenuBottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onShowBlockedChange={(checked) => {
          setShowBlocked(checked);
          setSelectedChatIds(new Set());
        }}
        onShowMyAdsChange={(checked) => {
          setShowMyAds(checked);
          setSelectedChatIds(new Set());
        }}
        onSelect={handleMenuSelect}
        showBlocked={showBlocked}
        showMyAds={showMyAds}
      />
    </ChatPageShell>
  );
}
