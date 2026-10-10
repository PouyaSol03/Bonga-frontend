import { createContext } from "react";

import type { ToastItem, ToastVariant } from "./Toast";

export type ShowToast = (
  message: string,
  title?: string,
  variant?: ToastVariant,
) => void;

export type ToastContextValue = {
  dismissToast: () => void;
  showToast: ShowToast;
  showToastItem: (toast: ToastItem) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
