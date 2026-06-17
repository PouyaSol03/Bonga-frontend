import type { ComponentType, ReactNode, SVGProps } from "react";
import { AnimatePresence, motion } from "motion/react";
import { quickEase, softSpring } from "../lib/motion";

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

type BottomSheetActionListProps = {
  align?: SheetAlign;
  isInteractive?: boolean;
  isOpen: boolean;
  items: BottomSheetAction[];
  itemClassName?: string;
  onSelect?: (item: BottomSheetAction) => void;
  selectedId?: string;
  showCheckIcon?: boolean;
  showDividers?: boolean;
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
  panelPaddingClassName = "pt-5",
  scrimClassName = "bg-black/60",
  showBackButton = true,
  showHandle = true,
  showHeader = true,
  showHeaderDivider = false,
  title,
  titleAlign = "right",
  zIndexClassName = "z-50",
}: BottomSheetProps) {
  const isCenterTitle = titleAlign === "center";

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className={`absolute inset-0 ${zIndexClassName} flex items-end justify-center overflow-hidden`}
          dir="rtl"
          exit={{ opacity: 0, transition: { duration: 0.18, ease: quickEase } }}
          initial={{ opacity: 0 }}
        >
          <button
            aria-label={`Ø¨Ø³ØªÙ† ${ariaLabel}`}
            className={`absolute inset-0 cursor-default ${scrimClassName}`}
            onClick={onClose}
            type="button"
          />

          <motion.section
            animate={{ y: 0, transition: { ...softSpring, type: "spring" } }}
            aria-label={ariaLabel}
            aria-modal="true"
            className={`relative z-10 w-full max-w-[500px] overflow-hidden bg-white ${panelPaddingClassName} ${heightClassName} ${className}`}
            exit={{ y: "100%", transition: { duration: 0.24, ease: quickEase } }}
            initial={{ y: "100%" }}
            role="dialog"
          >
            {showHandle ? (
              <motion.span
                animate={{ opacity: 1, scaleX: 1 }}
                aria-hidden="true"
                className={`mx-auto block ${handleClassName}`}
                initial={{ opacity: 0, scaleX: 0.72 }}
                transition={{ delay: 0.08, duration: 0.22, ease: quickEase }}
              />
            ) : null}

            {showHeader ? (
              <>
                <header
                  className={`flex h-10 items-center gap-2 px-4 ${showHandle ? "mt-5" : "mt-0"
                    }`}
                >
                  {showBackButton ? (
                    <motion.button
                      aria-label="Ø¨Ø§Ø²Ú¯Ø´Øª"
                      className="grid h-10 w-10 shrink-0 place-items-center text-[#4d4d4d] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
                      onClick={onBack ?? onClose}
                      type="button"
                      whileTap={{ scale: 0.92 }}
                    >
                      <span className="block h-6 w-6">
                        <BottomSheetBackIcon />
                      </span>
                    </motion.button>
                  ) : null}

                  <h2
                    className={`m-0 min-w-0 flex-1 text-xl font-semibold leading-7 text-[#1a1a1a] ${isCenterTitle ? "text-center" : "text-right"
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
    </AnimatePresence>
  );
}

export function BottomSheetActionList({
  align = "right",
  isInteractive = true,
  isOpen,
  items,
  itemClassName = "",
  onSelect,
  selectedId,
  showCheckIcon = false,
  showDividers = true,
}: BottomSheetActionListProps) {
  const isCenter = align === "center";

  return (
    <div>
      {items.map((item, index) => {
        const Icon = item.Icon;
        const isSelected = item.id === selectedId;

        return (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 8 }}
            key={item.id}
            transition={{ delay: index * 0.035, duration: 0.2, ease: quickEase }}
          >
            <motion.button
              className={`relative flex h-12 w-full items-center gap-3 bg-white px-4 text-base font-normal leading-6 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440] ${isCenter
                ? "justify-center text-center"
                : "justify-start text-right"
                } ${isSelected ? "text-[#0048c4]" : "text-[#1a1a1a]"
                } ${itemClassName}`}
              disabled={!isInteractive}
              onClick={() => onSelect?.(item)}
              tabIndex={isOpen && isInteractive ? 0 : -1}
              type="button"
              whileTap={isInteractive ? { scale: 0.98 } : undefined}
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
            </motion.button>

            {showDividers && index < items.length - 1 ? (
              <div className="px-4 py-2">
                <div className="h-px bg-[#cccccc]" />
              </div>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}
