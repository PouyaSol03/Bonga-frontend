import type { ComponentType, ReactNode, SVGProps } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import LinearArrowRight2 from "./(icons)/LinearArrowRight2";

type SheetIconProps = SVGProps<SVGSVGElement> & {
  className?: string;
};

export type BottomSheetAction = {
  id: string;
  title: string;
  description?: string;
  Icon?: ComponentType<SheetIconProps>;
};

type SheetAlign = "right" | "center";

type BottomSheetProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  handleClassName?: string;
  heightClassName?: string;
  isOpen: boolean;
  onBack?: () => void;
  onClose: () => void;
  panelPaddingClassName?: string;
  scrimClassName?: string;
  showBackButton?: boolean;
  showHandle?: boolean;
  showHeader?: boolean;
  showHeaderDivider?: boolean;
  title?: string;
  titleAlign?: SheetAlign;
  zIndexClassName?: string;
};

type BottomSheetActionListProps<TItem extends BottomSheetAction> = {
  align?: SheetAlign;
  isInteractive?: boolean;
  isOpen: boolean;
  items: TItem[];
  itemClassName?: string;
  onSelect?: (item: TItem) => void;
  selectedId?: string;
  showCheckIcon?: boolean;
  showDividers?: boolean;
};

function BottomSheetCheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
      <path
        d="M4.5 10.2l3.4 3.4 7.6-8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function BottomSheet({
  ariaLabel,
  children,
  className = "",
  contentClassName = "",
  handleClassName = "h-1 w-[42px] rounded-full bg-[#e0e0e0]",
  heightClassName = "h-[298px]",
  isOpen,
  onBack,
  onClose,
  panelPaddingClassName = "pt-4",
  scrimClassName = "bg-black/60",
  showBackButton = true,
  showHandle = true,
  showHeader = true,
  showHeaderDivider = false,
  title,
  titleAlign = "right",
  zIndexClassName = "z-[1000]",
}: BottomSheetProps) {
  const isCenterTitle = titleAlign === "center";
  const shouldReduceMotion = useReducedMotion();
  const scrimTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: "easeOut" as const };
  const panelTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 360, damping: 34, mass: 0.9 };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className={`fixed inset-0 ${zIndexClassName} isolate flex items-end justify-center overflow-hidden`}
          dir="rtl"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={scrimTransition}
        >
          <button
            aria-label={ariaLabel}
            className={`absolute inset-0 z-0 cursor-default ${scrimClassName}`}
            onClick={onClose}
            type="button"
          />

          <motion.section
            animate={{ y: 0 }}
            aria-label={ariaLabel}
            aria-modal="true"
            className={`relative z-10 w-full max-w-[500px] overflow-hidden rounded-t-[20px] bg-white ${panelPaddingClassName} ${heightClassName} ${className}`}
            exit={{ y: "100%" }}
            initial={{ y: "100%" }}
            role="dialog"
            transition={panelTransition}
          >
            {showHandle ? (
              <span
                aria-hidden="true"
                className={`mx-auto block ${handleClassName}`}
              />
            ) : null}

            {showHeader ? (
              <>
                <header
                  className={`flex h-12 items-center gap-4 px-4 `}
                >
                  {showBackButton ? (
                    <button
                      aria-label="بازگشت"
                      className="grid shrink-0 place-items-center text-[#4d4d4d] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
                      onClick={onBack ?? onClose}
                      type="button"
                    >
                        <LinearArrowRight2  className="h-6 w-6 text-[#4D4D4D]"/>
                    </button>
                  ) : null}

                  <h2
                    className={`m-0 min-w-0 flex-1 text-base font-semibold leading-6 text-[#1a1a1a] ${isCenterTitle ? "text-center" : "text-right"
                      }`}
                  >
                    {title ?? ariaLabel}
                  </h2>

                  {showBackButton && isCenterTitle ? (
                    <span className="h-10 w-10 shrink-0" />
                  ) : null}
                </header>

                {showHeaderDivider ? (
                  <div className="px-4 pt-3">
                    <div className="h-px bg-[#e6e6e6]" />
                  </div>
                ) : null}
              </>
            ) : null}

            <div className={contentClassName}>{children}</div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export function BottomSheetActionList<TItem extends BottomSheetAction>({
  align = "right",
  isInteractive = true,
  isOpen,
  items,
  itemClassName = "",
  onSelect,
  selectedId,
  showCheckIcon = false,
  showDividers = true,
}: BottomSheetActionListProps<TItem>) {
  const isCenter = align === "center";

  return (
    <div>
      {items.map((item, index) => {
        const Icon = item.Icon;
        const isSelected = item.id === selectedId;

        return (
          <div key={item.id}>
            <button
              className={`relative flex h-12 w-full items-center gap-3 bg-white px-4 text-base font-normal leading-6 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440] ${isCenter
                ? "justify-center text-center"
                : "justify-start text-right"
                } ${isSelected ? "text-[#0048c4]" : "text-[#1a1a1a]"
                } ${itemClassName}`}
              disabled={!isInteractive}
              onClick={() => onSelect?.(item)}
              tabIndex={isOpen && isInteractive ? 0 : -1}
              type="button"
            >
              {showCheckIcon && isSelected ? (
                <span className="absolute right-4 grid h-5 w-5 place-items-center">
                  <BottomSheetCheckIcon />
                </span>
              ) : null}

              {Icon ? (
                <Icon className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
              ) : null}

              <span className={isCenter ? "" : "min-w-0 flex-1 truncate"}>
                {item.title}
              </span>
            </button>

            {showDividers && index < items.length - 1 ? (
              <div className="px-4 py-2">
                <div className="h-px bg-[#F0F0F0]" />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
