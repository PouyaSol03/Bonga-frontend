import { useCallback, useEffect, useRef, useState } from "react";

export function useChatScroll(messageCount: number, sentCount: number) {
  const chatScrollRef = useRef<HTMLElement | null>(null);
  const [, setHasMoreMessagesBelow] = useState(false);
  const updateScrollShadow = useCallback(() => {
    const scrollElement = chatScrollRef.current;
    if (!scrollElement) return;
    const distanceFromBottom =
      scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
    setHasMoreMessagesBelow(distanceFromBottom > 8);
  }, []);

  useEffect(() => {
    updateScrollShadow();
    const frame = window.requestAnimationFrame(updateScrollShadow);
    window.addEventListener("resize", updateScrollShadow);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateScrollShadow);
    };
  }, [messageCount, sentCount, updateScrollShadow]);

  useEffect(() => {
    const scrollElement = chatScrollRef.current;
    if (!scrollElement) return;

    scrollElement.scrollTo({ top: scrollElement.scrollHeight, behavior: "smooth" });
  }, [messageCount, sentCount]);

  return { chatScrollRef, updateScrollShadow };
}
