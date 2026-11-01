import { useEffect, useState } from "react";

type ActionToast = {
  message: string;
  title: string;
  variant: "error" | "success" | "info" | "warning";
};

export function useViewAdToast() {
  const [toast, setToast] = useState<ActionToast | null>(null);
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);
  const showToast = (
    message: string,
    title = "انجام شد",
    variant: "error" | "success" | "info" | "warning" = "success",
  ) => {
    setToast({ message, title, variant });
  };

  return { toast, showToast, dismissToast: () => setToast(null) };
}

export type ShowViewAdToast = ReturnType<typeof useViewAdToast>["showToast"];
