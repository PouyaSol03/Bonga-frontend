import { useCallback, useEffect, useRef } from "react";
import type { NotificationItem } from "./api/notification.service";
import {
  markNotificationsReadInCache,
  useMarkNotificationsReadMutation,
} from "./api/notification.hooks";

export function useNotificationInViewReader({
  setRealtimeNotifications,
}: {
  setRealtimeNotifications?: React.Dispatch<
    React.SetStateAction<NotificationItem[]>
  >;
} = {}) {
  const readIdsRef = useRef<Set<string>>(new Set());
  const pendingIdsRef = useRef<Set<string>>(new Set());
  const debounceTimerRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const markMutation = useMarkNotificationsReadMutation();
  const markMutationRef = useRef(markMutation);
  const setRealtimeNotificationsRef = useRef(setRealtimeNotifications);

  useEffect(() => {
    markMutationRef.current = markMutation;
    setRealtimeNotificationsRef.current = setRealtimeNotifications;
  });

  const flushPending = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const idsToSend = Array.from(pendingIdsRef.current);
    if (idsToSend.length === 0) return;
    pendingIdsRef.current.clear();

    const idSet = new Set(idsToSend);

    setRealtimeNotificationsRef.current?.((current) =>
      current.map((item) =>
        idSet.has(String(item.id)) ? { ...item, is_read: true } : item,
      ),
    );

    markNotificationsReadInCache(idsToSend);

    void markMutationRef.current.mutateAsync(idsToSend).catch(() => {});
  }, []);

  const queueNotificationId = useCallback(
    (id: string) => {
      if (!id || readIdsRef.current.has(id)) return;
      readIdsRef.current.add(id);
      pendingIdsRef.current.add(id);

      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = window.setTimeout(() => {
        debounceTimerRef.current = null;
        flushPending();
      }, 250);
    },
    [flushPending],
  );

  const getObserver = useCallback(() => {
    if (typeof IntersectionObserver === "undefined") return null;
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = (entry.target as HTMLElement).dataset.notificationId;
              if (id) {
                observerRef.current?.unobserve(entry.target);
                queueNotificationId(id);
              }
            }
          });
        },
        { root: null, threshold: 0.2 },
      );
    }
    return observerRef.current;
  }, [queueNotificationId]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      flushPending();
    };
  }, [flushPending]);

  const observeNotificationNode = useCallback(
    (node: HTMLElement | null, id: string, isRead?: boolean) => {
      if (!node) return;

      if (isRead || readIdsRef.current.has(id)) {
        observerRef.current?.unobserve(node);
        return;
      }

      node.dataset.notificationId = id;
      getObserver()?.observe(node);
    },
    [getObserver],
  );

  return {
    observeNotificationNode,
  };
}
