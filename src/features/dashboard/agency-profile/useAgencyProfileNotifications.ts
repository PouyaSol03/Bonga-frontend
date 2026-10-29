import { useState, useEffect, useCallback } from "react";
import type { AgencyProfileToast } from "./types";

export function useAgencyProfileNotifications() {
  const [toast, setToast] = useState<AgencyProfileToast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback(
    (
      message: string,
      title = "موفقیت",
      variant: "error" | "success" | "info" | "warning" = "success",
    ) => setToast({ message, title, variant }),
    [],
  );

  return { setToast, showToast, toast };
}
