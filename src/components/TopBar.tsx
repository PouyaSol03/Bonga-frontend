import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getStoredBackTarget, pushRoute } from "../routes/navigation";
import { RouteLink } from "../routes/RouteLink";
import LinearSearch from "./(icons)/LinearSearch";

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
  onSavedClick?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
  isSavedDisabled?: boolean;
  savedCount?: number;
  savedLabel?: string;
};

export type TopBarProps = {
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
  placement?: "layout" | "inline";
  reserveEndSpace?: boolean;
  reserveStartSpace?: boolean;
  search?: TopBarSearch;
  showBack?: boolean;
  startSlot?: ReactNode;
  title?: string;
  titleClassName?: string;
};

type LayoutTopBarProps = Omit<TopBarProps, "placement">;

type TopBarLayoutContextValue = {
  setTopBar: (props: LayoutTopBarProps | null) => void;
};

type RegisteredTopBar = {
  resetKey: string;
  props: LayoutTopBarProps;
};

const TopBarLayoutContext = createContext<TopBarLayoutContextValue | null>(null);

function TopBarBookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill={filled ? "#1a1a1a" : "none"}
      viewBox="0 0 24 24"
    >
      <path
        d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z"
        stroke="#1a1a1a"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

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

function TopBarIconButton({ action }: { action: TopBarAction }) {
  const className =
    "grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#1a1a1a0a]";

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
    "grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#4d4d4d] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#1a1a1a0a]";

  return (
    <button
      aria-label={backLabel}
      className={className}
      onClick={() => {
        if (onBack) {
          onBack();
          return;
        }

        const storedBackTarget = getStoredBackTarget();

        if (storedBackTarget) {
          pushRoute(storedBackTarget.backTo, storedBackTarget.backState ?? backState, { rememberCurrent: false });
          return;
        }

        if (backTo) {
          pushRoute(backTo, backState, { rememberCurrent: false });
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
  const hasSavedAction = Boolean(search.onSavedClick);

  return (
    <div
      className="relative flex h-12 w-full min-w-0 items-center overflow-hidden rounded-xl border border-[#808080] bg-white text-right text-sm font-normal leading-5 text-[#a6a6a6] focus-within:outline-3 focus-within:outline-offset-[-3px] focus-within:outline-[#0048c440]"
      dir="rtl"
    >
      {hasSavedAction ? (
        <button
          aria-label={search.savedLabel ?? "جستجوی ذخیره شده"}
          aria-pressed={search.isSaved}
          className="relative grid h-12 w-12 shrink-0 place-items-center bg-transparent text-[#1a1a1a] transition-colors [-webkit-tap-highlight-color:transparent] active:bg-transparent focus:bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
          disabled={search.isSaving || search.isSavedDisabled}
          onClick={(event) => {
            event.stopPropagation();
            search.onSavedClick?.();
          }}
          type="button"
        >
          <TopBarBookmarkIcon filled={Boolean(search.isSaved)} />
          {search.savedCount && search.savedCount > 0 ? (
            <span className="absolute right-1 top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#0048c4] px-1 text-[10px] font-bold leading-4 text-white">
              {search.savedCount > 99
                ? "۹۹+"
                : new Intl.NumberFormat("fa-IR").format(search.savedCount)}
            </span>
          ) : null}
        </button>
      ) : null}

      <button
        aria-label={search.label}
        className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-2 bg-transparent py-0 pl-3 pr-0 text-right text-sm font-normal leading-5 text-[#a6a6a6]"
        onClick={search.onClick}
        type="button"
      >
        <span className="min-w-0 flex-1 truncate text-right">{search.label}</span>
        <span className="shrink-0 text-[#808080]">
          <LinearSearch className="h-5 w-5" />
        </span>
      </button>
    </div>
  );
}

function TopBarView({
  actions = [],
  backIconDirection = "right",
  backLabel,
  backState,
  backTo,
  centerSlot,
  centerClassName = "px-2",
  className = "",
  contentClassName = "px-2",
  heightClassName = "h-14",
  onBack,
  reserveEndSpace = false,
  reserveStartSpace = false,
  search,
  showBack = true,
  startSlot,
  title,
  titleClassName = "text-base font-semibold leading-6",
}: LayoutTopBarProps) {
  const hasStartSlot = startSlot !== undefined || actions.length > 0;
  const hasBack = showBack && (backTo || onBack || getStoredBackTarget());

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

export function TopBar({ placement = "layout", ...props }: TopBarProps) {
  const layoutContext = useContext(TopBarLayoutContext);
  const shouldUseLayout = Boolean(layoutContext && placement === "layout");

  useLayoutEffect(() => {
    if (!shouldUseLayout || !layoutContext) return;

    layoutContext.setTopBar(props);

    return () => layoutContext.setTopBar(null);
  }, [
    layoutContext,
    shouldUseLayout,
    props.actions,
    props.backIconDirection,
    props.backLabel,
    props.backState,
    props.backTo,
    props.centerClassName,
    props.centerSlot,
    props.className,
    props.contentClassName,
    props.heightClassName,
    props.onBack,
    props.reserveEndSpace,
    props.reserveStartSpace,
    props.search,
    props.showBack,
    props.startSlot,
    props.title,
    props.titleClassName,
  ]);

  if (shouldUseLayout) {
    return null;
  }

  return <TopBarView {...props} />;
}

export function TopBarLayoutProvider({
  children,
  defaultTopBar,
  resetKey,
}: {
  children: ReactNode;
  defaultTopBar: LayoutTopBarProps;
  resetKey: string;
}) {
  const [registeredTopBar, setRegisteredTopBar] = useState<RegisteredTopBar | null>(null);
  const setTopBar = useCallback(
    (props: LayoutTopBarProps | null) => {
      setRegisteredTopBar(props ? { props, resetKey } : null);
    },
    [resetKey],
  );
  const contextValue = useMemo<TopBarLayoutContextValue>(
    () => ({ setTopBar }),
    [setTopBar],
  );
  const topBar =
    registeredTopBar?.resetKey === resetKey ? registeredTopBar.props : defaultTopBar;

  return (
    <TopBarLayoutContext.Provider value={contextValue}>
      <TopBarView {...topBar} />
      {children}
    </TopBarLayoutContext.Provider>
  );
}
