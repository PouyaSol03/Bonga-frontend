import { useEffect } from "react";
import { useToast } from "../hooks/useToast";

export function TransientNotice({
  message,
}: {
  message?: string | null;
  className?: string;
}) {
  const { showToast } = useToast();

  useEffect(() => {
    if (message) {
      const isError = /خطا|ناموفق|اشتباه|نشد|امکان‌پذیر نیست|معتبر نیست/.test(message);
      showToast(message, undefined, isError ? "error" : "success");
    }
  }, [message, showToast]);

  return null;
}
