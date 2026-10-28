import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTransientNotice } from "../../../shared/hooks/useTransientNotice";
import {
  useBlockChatMutation,
  useDeleteChatMutation,
  useUnblockChatMutation,
} from "../api/chat.hooks";
import { readPathBoolean } from "./readChatValues";

import { type ChatThread } from "../api/chat.service";

export function useChatModeration({
  routeThread,
  chatThread,
  activeThreadId,
  setDraftMessage,
  setIsSendFileSheetOpen,
  setIsSettingsSheetOpen,
  setIsBlockConfirmSheetOpen,
}: {
  routeThread?: ChatThread;
  chatThread?: ChatThread;
  activeThreadId: string;
  setDraftMessage: (value: string) => void;
  setIsSendFileSheetOpen: (open: boolean) => void;
  setIsSettingsSheetOpen: (open: boolean) => void;
  setIsBlockConfirmSheetOpen: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { showNotice } = useTransientNotice();
  const [blockedByMe, setBlockedByMe] = useState(
    () => readPathBoolean(routeThread, ["blocked_by_me", "blockedByMe"]) ?? false,
  );
  const [blockedMe, setBlockedMe] = useState(
    () => readPathBoolean(routeThread, ["blocked_me", "blockedMe"]) ?? false,
  );
  const [isBlocked, setIsBlocked] = useState(
    () => readPathBoolean(routeThread, ["is_blocked", "isBlocked", "blocked"]) ?? false,
  );
  const blockChatMutation = useBlockChatMutation();
  const unblockChatMutation = useUnblockChatMutation();
  const deleteChatMutation = useDeleteChatMutation();
  const isChatBlocked = isBlocked || blockedByMe || blockedMe;

  useEffect(() => {
    if (!chatThread) return;

    const nextBlockedByMe = readPathBoolean(chatThread, ["blocked_by_me", "blockedByMe"]) ?? false;
    const nextBlockedMe = readPathBoolean(chatThread, ["blocked_me", "blockedMe"]) ?? false;
    const nextIsBlocked =
      readPathBoolean(chatThread, ["is_blocked", "isBlocked", "blocked"]) ??
      (nextBlockedByMe || nextBlockedMe);

    setBlockedByMe(nextBlockedByMe);
    setBlockedMe(nextBlockedMe);
    setIsBlocked(nextIsBlocked);
  }, [chatThread]);

  const navigateToChatHome = () => {
    navigate("/chat");
  };

  const confirmBlockChat = () => {
    if (!activeThreadId || blockChatMutation.isPending) return;

    blockChatMutation.mutate(activeThreadId, {
      onError: () => {
        showNotice("مسدود کردن گفتگو با خطا مواجه شد");
      },
      onSuccess: () => {
        setBlockedByMe(true);
        setIsBlocked(true);
        setDraftMessage("");
        setIsSendFileSheetOpen(false);
        setIsBlockConfirmSheetOpen(false);
      },
    });
  };

  const unblockCurrentChat = () => {
    if (!activeThreadId || unblockChatMutation.isPending) return;

    unblockChatMutation.mutate(activeThreadId, {
      onError: () => {
        showNotice("رفع مسدودیت گفتگو با خطا مواجه شد");
      },
      onSuccess: () => {
        setBlockedByMe(false);
        setIsBlocked(blockedMe);
      },
    });
  };

  const handleSettingsSelect = (id: string, title: string) => {
    setIsSettingsSheetOpen(false);

    if (!activeThreadId) {
      showNotice("ابتدا گفتگو را باز کنید");
      return;
    }

    if (id === "block") {
      setIsBlockConfirmSheetOpen(true);
      return;
    }

    if (id === "unblock") {
      unblockCurrentChat();
      return;
    }

    if (id === "delete") {
      deleteChatMutation.mutate(activeThreadId, {
        onError: () => {
          showNotice("حذف گفتگو با خطا مواجه شد");
        },
        onSuccess: () => {
          showNotice("گفتگو حذف شد");
          navigateToChatHome();
        },
      });
      return;
    }

    if (id === "report") {
      navigate(`/chat/${encodeURIComponent(activeThreadId)}/report`, {
        state: { returnTo: window.location.pathname },
      });
      return;
    }

    showNotice(`${title} انتخاب شد`);
  };

  return {
    blockedByMe,
    blockedMe,
    isChatBlocked,
    blockChatMutation,
    unblockChatMutation,
    confirmBlockChat,
    unblockCurrentChat,
    handleSettingsSelect,
  };
}
