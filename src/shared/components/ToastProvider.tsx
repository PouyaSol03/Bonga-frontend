import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { Toast, type ToastItem } from "./Toast";
import { ToastContext, type ShowToast } from "./toastContext";

const TOAST_DURATION_MS = 3200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastItem | null>(null);
  // Bumped on every show so repeating the same message restarts the timer.
  const [toastId, setToastId] = useState(0);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [toast, toastId]);

  const showToastItem = useCallback((item: ToastItem) => {
    setToast(item);
    setToastId((id) => id + 1);
  }, []);

  const showToast = useCallback<ShowToast>(
    (message, title, variant = "success") => {
      showToastItem({ message, title, variant });
    },
    [showToastItem],
  );

  const dismissToast = useCallback(() => setToast(null), []);

  const value = useMemo(
    () => ({ dismissToast, showToast, showToastItem }),
    [dismissToast, showToast, showToastItem],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast onDismiss={dismissToast} toast={toast} />
    </ToastContext.Provider>
  );
}
