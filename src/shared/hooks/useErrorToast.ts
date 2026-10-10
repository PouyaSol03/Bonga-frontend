import { useEffect } from "react";

import { getApiErrorMessage } from "../api/api";
import { useToast } from "./useToast";

// Shows an error toast each time a new error object arrives (e.g. a failed
// query result). Pass null/undefined while there is no error.
export function useErrorToast(error: unknown, fallback: string) {
  const { showToast } = useToast();

  useEffect(() => {
    if (!error) return;

    showToast(getApiErrorMessage(error, fallback), "خطا", "error");
  }, [error, fallback, showToast]);
}
