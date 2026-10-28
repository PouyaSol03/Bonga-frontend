import { useEffect, useState } from "react";

export function useActiveChatThread(routeThreadId: string, resolvedThreadId: string) {
  const [activeThreadId, setActiveThreadId] = useState(routeThreadId);
  useEffect(() => {
    if (resolvedThreadId) setActiveThreadId(resolvedThreadId);
  }, [resolvedThreadId]);
  return [activeThreadId, setActiveThreadId] as const;
}
