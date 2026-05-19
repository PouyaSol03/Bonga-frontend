import type { ComponentType, ReactNode, SVGProps } from "react";

type SheetIconProps = SVGProps<SVGSVGElement> & {
  className?: string;
};

export type BottomSheetAction = {
  id: string;
  title: string;
  description?: string;
  Icon?: ComponentType<SheetIconProps>;
};

type BottomSheetProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  heightClassName?: string;
  isOpen: boolean;
  onBack?: () => void;
  onClose: () => void;
  scrimClassName?: string;
  showHeader?: boolean;
  title?: string;
  zIndexClassName?: string;
};

type BottomSheetActionListProps = {
  isInteractive?: boolean;
  isOpen: boolean;
  items: BottomSheetAction[];
  onSelect?: (item: BottomSheetAction) => void;
};

function BottomSheetBackIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function BottomSheet({
  ariaLabel,
  children,
  className = "",
  contentClassName = "",
  heightClassName = "h-[298px]",
  isOpen,
  onBack,
  onClose,
  scrimClassName = "bg-black/60",
  showHeader = true,
  title,
  zIndexClassName = "z-50",
}: BottomSheetProps) {
  return (
    <div
      aria-hidden={!isOpen}
      className={`absolute inset-0 ${zIndexClassName} flex items-end justify-center overflow-hidden transition-[opacity,visibility] duration-200 ease-out ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
      dir="rtl"
    >
      <button
        aria-label={`بستن ${ariaLabel}`}
        className={`absolute inset-0 cursor-default ${scrimClassName}`}
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
        type="button"
      />

      <section
        aria-label={ariaLabel}
        aria-modal="true"
        className={`relative z-10 w-full max-w-[500px] overflow-hidden rounded-t-[28px] bg-white pt-5 transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } ${heightClassName} ${className}`}
        role="dialog"
      >
        <span
          aria-hidden="true"
          className="mx-auto block h-1 w-[72px] rounded-full bg-[#cccccc]"
        />

        {showHeader ? (
          <header className="mt-5 flex h-10 items-center gap-2 px-4 text-right">
            <button
              aria-label="بازگشت"
              className="grid h-10 w-10 shrink-0 place-items-center text-[#4d4d4d] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
              onClick={onBack ?? onClose}
              tabIndex={isOpen ? 0 : -1}
              type="button"
            >
              <span className="block h-6 w-6">
                <BottomSheetBackIcon />
              </span>
            </button>

            <h2 className="m-0 min-w-0 flex-1 text-right text-xl font-semibold leading-7 text-[#1a1a1a]">
              {title ?? ariaLabel}
            </h2>
          </header>
        ) : null}

        <div className={contentClassName}>{children}</div>
      </section>
    </div>
  );
}

export function BottomSheetActionList({
  isInteractive = true,
  isOpen,
  items,
  onSelect,
}: BottomSheetActionListProps) {
  return (
    <div>
      {items.map((item, index) => {
        const Icon = item.Icon;

        return (
          <div key={item.id}>
            <button
              className="flex h-12 w-full items-center gap-3 bg-white px-4 text-right text-base font-normal leading-6 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
              disabled={!isInteractive}
              onClick={() => onSelect?.(item)}
              tabIndex={isOpen && isInteractive ? 0 : -1}
              type="button"
            >
              {Icon ? <Icon className="h-6 w-6 shrink-0 text-[#4d4d4d]" /> : null}
              <span className="min-w-0 flex-1 truncate">{item.title}</span>
            </button>

            {index < items.length - 1 ? (
              <div className="px-4 py-2">
                <div className="h-px bg-[#cccccc]" />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
