import { useCallback } from "react";
import { useToast } from "./useToast";
import type { ToastVariant } from "../components/Toast";

export function useTransientNotice(_duration = 2200) {
  const { showToast } = useToast();

  const showNotice = useCallback(
    (nextMessage: string | null | undefined, variant?: ToastVariant) => {
      if (!nextMessage) return;
      const isError = /خطا|ناموفق|اشتباه|نشد|امکان‌پذیر نیست|معتبر نیست/.test(nextMessage);
      const resolvedVariant: ToastVariant = variant ?? (isError ? "error" : "success");

      showToast(nextMessage, undefined, resolvedVariant);
    },
    [showToast],
  );

  return { message: null, showNotice };
}
