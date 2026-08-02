import { useCallback, useEffect, useRef, useState } from "react";

export function useTransientNotice(duration = 2200) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const showNotice = useCallback(
    (nextMessage: string) => {
      setMessage(nextMessage);

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        setMessage(null);
        timerRef.current = null;
      }, duration);
    },
    [duration],
  );

  return { message, showNotice };
}
