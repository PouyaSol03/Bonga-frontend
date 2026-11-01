import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { RequestErrorState } from "../../../shared/components/ErrorState";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { REAL_ESTATE_MANAGER, SUPER_ADMIN } from "../../../shared/constants/roles.constants";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";
import { useTransientNotice } from "../../../shared/hooks/useTransientNotice";
import { TopBarNavigationLayout } from "../../../shared/layout/TopBarNavigationLayout";
import { Typography } from "../../../shared/ui/Typography";
import { useMyAgencyProfileQuery } from "../../account/api/account.hooks";
import { useChatsQuery } from "../api/chat.hooks";
import { type ChatFilter } from "../api/chat.service";
import { ChatCard } from "./ChatCard";
import { ChatHeader, ChatSearchHeader } from "./ChatHeaders";
import { ChatListSkeleton } from "./ChatListControls";
import { ChatMenuBottomSheet } from "./ChatMenuBottomSheet";
import { FilterTabs } from "./FilterTabs";
import { mapChatThreadToChatItem } from "./mapChatThread";
import { CHAT_RENAME_NOTICE_STORAGE_KEY } from "./routeState";

export function UserChatHomePage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ChatFilter | null>(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const filterParam = searchParams.get("filter");
      if (filterParam === "support") return "support";
    }
    return null;
  });
  const [showBlocked, setShowBlocked] = useState(false);
  const [query, setQuery] = useState("");
  const deferredSearch = useDebouncedValue(query.trim(), 300);
  const { showNotice } = useTransientNotice();

  const authSession = getStoredAuthSession();
  const activeRole = getActiveAuthRole(authSession);
  const isManagerRole = activeRole === REAL_ESTATE_MANAGER;
  const { data: myAgency } = useMyAgencyProfileQuery({
    enabled: isManagerRole,
  });

  const showSupportFilter = useMemo(() => {
    if (activeRole === SUPER_ADMIN) return true;
    if (
      authSession?.roles.some(
        (r) =>
          (r.slug as string) === "support" ||
          (r.slug as string) === "crm_support" ||
          r.slug === "super-admin",
      )
    ) {
      return true;
    }
    if (isManagerRole) {
      if (authSession?.managerPermissions?.support) return true;
      if (myAgency?.membership?.permissions?.support) return true;
    }
    return false;
  }, [activeRole, authSession, isManagerRole, myAgency]);

  useEffect(() => {
    const notice = window.sessionStorage.getItem(CHAT_RENAME_NOTICE_STORAGE_KEY);
    if (!notice) return;

    window.sessionStorage.removeItem(CHAT_RENAME_NOTICE_STORAGE_KEY);
    showNotice(notice);
  }, [showNotice]);
  const {
    data: chatsPage,
    error: chatsError,
    isError: isChatsError,
    isLoading: isChatsLoading,
    refetch: refetchChats,
  } = useChatsQuery({
    blocked: showBlocked ? true : undefined,
    category: activeFilter === "support" ? "agency_support" : undefined,
    filter: activeFilter ?? undefined,
    page: 1,
    perPage: 10,
    search: deferredSearch || undefined,
  });
  const chats = useMemo(
    () => (chatsPage?.data ?? []).map(mapChatThreadToChatItem),
    [chatsPage?.data],
  );

  const handleMenuSelect = useCallback(
    (id: string) => {
      setIsMenuOpen(false);

      if (id === "hours") {
        navigate("/chat/response-time");
        return;
      }

      if (id === "rename") {
        navigate("/chat/rename");
        return;
      }

      if (id === "bulk-delete") {
        navigate("/chat/bulk-delete");
      }
    },
    [navigate],
  );

  const visibleChats = chats;

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
    setQuery("");
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setQuery("");
  }, []);

  const selectFilter = useCallback((filter: ChatFilter) => {
    setActiveFilter((current) => (current === filter ? null : filter));
  }, []);

  return (
    <TopBarNavigationLayout
      activeKey="chat"
      contentClassName="flex flex-col bg-surface-container-lowest"
      fixedAfterTopBar={
        <FilterTabs
          activeFilter={activeFilter}
          onSelect={selectFilter}
          showSupportFilter={showSupportFilter}
        />
      }
      frameClassName="relative bg-outline-var text-on-surface [direction:rtl]"
      overlay={
        <ChatMenuBottomSheet
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onShowBlockedChange={setShowBlocked}
          onShowMyAdsChange={(checked) => {
            setActiveFilter(checked ? "my_ads" : null);
          }}
          onSelect={handleMenuSelect}
          showBlocked={showBlocked}
          showMyAds={activeFilter === "my_ads"}
        />
      }
      topBar={
        isSearchOpen ? (
          <ChatSearchHeader onClose={closeSearch} onQueryChange={setQuery} query={query} />
        ) : (
          <ChatHeader onOpenMenu={() => setIsMenuOpen(true)} onOpenSearch={openSearch} />
        )
      }
    >
      {isChatsLoading && chats.length === 0 ? <ChatListSkeleton /> : null}
      {isChatsError && chats.length === 0 ? (
        <RequestErrorState error={chatsError} className="h-full min-h-0 flex-1" onRetry={() => void refetchChats()} />
      ) : null}
      {visibleChats.map((item, index) => {
        const chatId = item.id ?? String(index);

        return (
          <ChatCard
            chatId={chatId}
            index={index}
            isBulkDeleteMode={false}
            isSelected={false}
            item={item}
            key={chatId}
            onToggleSelected={() => undefined}
          />
        );
      })}
      {!isChatsLoading && !isChatsError && visibleChats.length === 0 ? (
        query.trim() || activeFilter ? (
          <SearchEmptyState />
        ) : (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-outline mx-auto flex min-h-0 w-full flex-1 items-center justify-center px-4 text-center text-sm"
          >
            هنوز گفتگویی ندارید.
          </Typography>
        )
      ) : null}
    </TopBarNavigationLayout>
  );
}
