import { useEffect } from "react";

import { useChatUnreadCountQuery } from "../api/chat.hooks";
import { Typography } from "../../../shared/ui/Typography";

type BottomNavigationUnreadChatBadgeProps = {
  activeKey: string;
};

export function BottomNavigationUnreadChatBadge({
  activeKey,
}: BottomNavigationUnreadChatBadgeProps) {
  const { data: unreadChatsCount = 0, refetch: refetchUnreadChatsCount } =
    useChatUnreadCountQuery();

  useEffect(() => {
    void refetchUnreadChatsCount();
  }, [activeKey, refetchUnreadChatsCount]);

  useEffect(() => {
    function handleRouteChange() {
      void refetchUnreadChatsCount();
    }

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [refetchUnreadChatsCount]);

  if (unreadChatsCount <= 0) return null;

  return (
    <Typography
      as="span"
      variant="body"
      size="small"
      weight="medium"
      aria-hidden="true"
      className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef1f1f] ring-2 ring-white"
    />
  );
}
