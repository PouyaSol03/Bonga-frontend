import type { ReactNode } from "react";

type HorizontalFilterBarProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

/**
 * Shared RTL horizontal rail for top-of-page filters and tabs.
 *
 * The scrollable element itself owns `dir="rtl"`. This keeps the natural
 * swipe/scroll direction consistent across mobile browsers while preserving
 * each page's own filter behavior and button markup.
 */
export function HorizontalFilterBar({
  ariaLabel,
  children,
  className = "",
  contentClassName = "",
}: HorizontalFilterBarProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={`shrink-0 overflow-x-auto overscroll-x-contain px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      dir="rtl"
    >
      <div
        className={`flex w-max min-w-full items-center gap-2 ${contentClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
