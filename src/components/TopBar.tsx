import type { ReactNode } from "react";

import { RouteLink } from "../routes/RouteLink";

export type TopBarAction = {
  icon: ReactNode;
  id: string;
  label: string;
  onClick?: () => void;
  state?: unknown;
  to?: string;
};

type TopBarSearch = {
  label: string;
  onClick?: () => void;
  savedCount?: number;
};

type TopBarProps = {
  actions?: TopBarAction[];
  backIconDirection?: "left" | "right";
  backLabel?: string;
  backState?: unknown;
  backTo?: string;
  centerSlot?: ReactNode;
  centerClassName?: string;
  className?: string;
  contentClassName?: string;
  heightClassName?: string;
  onBack?: () => void;
  reserveEndSpace?: boolean;
  reserveStartSpace?: boolean;
  search?: TopBarSearch;
  showBack?: boolean;
  startSlot?: ReactNode;
  title?: string;
  titleClassName?: string;
};

function TopBarBackIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  const path =
    direction === "left"
      ? "M9 7L4 12L9 17M4 12H20"
      : "M15 7L20 12L15 17M20 12H4";

  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d={path}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TopBarBookmarkIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 4.75h10a1 1 0 0 1 1 1v14l-6-3.5-6 3.5v-14a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function TopBarIconButton({ action }: { action: TopBarAction }) {
  const className =
    "grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#1a1a1a0a]";

  if (action.to) {
    return (
      <RouteLink aria-label={action.label} className={className} state={action.state} to={action.to}>
        {action.icon}
      </RouteLink>
    );
  }

  return (
    <button
      aria-label={action.label}
      className={className}
      onClick={action.onClick}
      type="button"
    >
      {action.icon}
    </button>
  );
}

function TopBarBackButton({
  backIconDirection,
  backLabel = "بازگشت",
  backState,
  backTo,
  onBack,
}: Pick<TopBarProps, "backIconDirection" | "backLabel" | "backState" | "backTo" | "onBack">) {
  const className =
    "grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#4d4d4d] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#1a1a1a0a]";

  return (
    <button
      aria-label={backLabel}
      className={className}
      onClick={() => {
        if (onBack) {
          onBack();
          return;
        }

        if (backTo) {
          window.history.pushState(backState ?? {}, "", backTo);
          window.dispatchEvent(new PopStateEvent("popstate"));
          return;
        }

        if (window.history.length > 1) {
          window.history.back();
        }
      }}
      type="button"
    >
      <TopBarBackIcon direction={backIconDirection} />
    </button>
  );
}

function TopBarSearchButton({ search }: { search: TopBarSearch }) {
  return (
    <button
      aria-label={search.label}
      className="relative flex h-12 w-full min-w-0 items-center rounded-xl border border-[#808080] bg-white px-3 text-right text-sm font-normal leading-5 text-[#a6a6a6] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
      onClick={search.onClick}
      type="button"
    >
      <span className="shrink-0 text-[#808080]">
        <TopBarBookmarkIcon />
      </span>
      <span className="mx-3 h-6 w-px shrink-0 bg-[#cccccc]" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-center">{search.label}</span>
      {search.savedCount ? (
        <span className="sr-only">{search.savedCount} آگهی ذخیره شده</span>
      ) : null}
    </button>
  );
}

export function TopBar({
  actions = [],
  backIconDirection = "right",
  backLabel,
  backState,
  backTo,
  centerSlot,
  centerClassName = "px-2",
  className = "",
  contentClassName = "px-1",
  heightClassName = "h-14",
  onBack,
  reserveEndSpace = false,
  reserveStartSpace = false,
  search,
  showBack = true,
  startSlot,
  title,
  titleClassName = "text-base font-semibold leading-6",
}: TopBarProps) {
  const hasStartSlot = startSlot !== undefined || actions.length > 0;
  const hasBack = showBack && (backTo || onBack);

  return (
    <header
      className={`shrink-0 bg-[#f0f0f0] ${heightClassName} ${className}`}
      dir="rtl"
    >
      <div className={`flex h-full min-w-0 items-center [direction:ltr] ${contentClassName}`}>
        {hasStartSlot || reserveStartSpace ? (
          <div className="flex h-12 min-w-12 shrink-0 items-center">
            {startSlot ??
              actions.map((action) => (
                <TopBarIconButton action={action} key={action.id} />
              ))}
          </div>
        ) : null}

        <div className={`min-w-0 flex-1 [direction:rtl] ${centerClassName}`}>
          {centerSlot ? (
            centerSlot
          ) : search ? (
            <TopBarSearchButton search={search} />
          ) : title ? (
            <h1
              className={`m-0 truncate text-right text-[#1a1a1a] ${titleClassName}`}
            >
              {title}
            </h1>
          ) : null}
        </div>

        {hasBack ? (
          <TopBarBackButton
            backIconDirection={backIconDirection}
            backLabel={backLabel}
            backState={backState}
            backTo={backTo}
            onBack={onBack}
          />
        ) : reserveEndSpace ? (
          <div className="h-12 w-12 shrink-0" />
        ) : null}
      </div>
    </header>
  );
}
