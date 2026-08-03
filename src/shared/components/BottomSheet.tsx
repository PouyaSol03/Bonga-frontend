import type { ComponentType, ReactNode, SVGProps } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "motion/react";
import LinearArrowRight2 from "../icons/LinearArrowRight2";
import LinearTick from "../icons/LinearTick";
import { IconButton } from "../ui/IconButton";
import { ListItem } from "../ui/ListItem";
import { Typography } from "../ui/Typography";
import { Button } from "../ui/Button";

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
type BottomSheetVariant = "actions" | "form" | "confirm" | "media" | "full-height";

type BottomSheetProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  handleClassName?: string;
  headerClassName?: string;
  headerButtonAriaLabel?: string;
  headerButtonIcon?: ReactNode;
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
  titleIcon?: ReactNode;
  titleAlign?: SheetAlign;
  variant?: BottomSheetVariant;
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

const variantHeightClassName: Record<BottomSheetVariant, string> = {
  actions: "h-auto max-h-[calc(100svh-56px)]",
  confirm: "h-auto max-h-[calc(100svh-56px)] pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
  form: "h-auto max-h-[calc(100svh-56px)] pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
  "full-height": "h-[min(100svh,640px)]",
  media: "h-auto max-h-[calc(100svh-56px)] pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
};

const variantPaddingClassName: Record<BottomSheetVariant, string> = {
  actions: "pt-4",
  confirm: "pt-3",
  form: "pt-3",
  "full-height": "flex flex-col",
  media: "pt-3",
};

export function BottomSheet({
  ariaLabel,
  children,
  className = "",
  contentClassName = "",
  handleClassName = "h-1 w-[56px] rounded-full bg-[#e0e0e0]",
  headerClassName = "",
  headerButtonAriaLabel = "بازگشت",
  headerButtonIcon,
  heightClassName,
  isOpen,
  onBack,
  onClose,
  panelPaddingClassName,
  scrimClassName = "bg-black/60",
  showBackButton = true,
  showHandle = true,
  showHeader = true,
  showHeaderDivider = false,
  title,
  titleIcon,
  titleAlign = "right",
  variant = "actions",
  zIndexClassName = "z-[1000]",
}: BottomSheetProps) {
  const isCenterTitle = titleAlign === "center";
  const dragControls = useDragControls();
  const resolvedHeightClassName = heightClassName ?? variantHeightClassName[variant];
  const resolvedPanelPaddingClassName = panelPaddingClassName ?? variantPaddingClassName[variant];
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
          <Button unstyled
            aria-label={ariaLabel}
            className={`absolute inset-0 z-0 cursor-default ${scrimClassName}`}
            onClick={onClose}
            type="button"
          />

          <motion.section
            animate={{ y: 0 }}
            aria-label={ariaLabel}
            aria-modal="true"
            className={`relative z-10 flex w-full max-w-[500px] flex-col overflow-hidden rounded-t-[20px] bg-white ${resolvedPanelPaddingClassName} ${resolvedHeightClassName} ${className}`}
            style={{ maxHeight: "calc(100dvh - 56px)" }}
            exit={{ y: "100%" }}
            initial={{ y: "100%" }}
            role="dialog"
            transition={panelTransition}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragControls={dragControls}
            dragElastic={{ top: 0, bottom: 0.82 }}
            dragListener={false}
            onDragEnd={(_, info) => {
              const shouldClose = info.offset.y > 110 || info.velocity.y > 720;
              if (shouldClose) onClose();
            }}
          >
            {showHandle ? (
              <div aria-hidden="true" className="relative h-1 w-full shrink-0">
                <div
                  className="absolute inset-x-0 -inset-y-3 z-20 flex cursor-grab touch-none items-center justify-center active:cursor-grabbing"
                  onPointerDown={(event) => dragControls.start(event)}
                >
                  <Typography as="span" variant="body" size="medium" weight="regular"
                    className={`mx-auto block ${handleClassName}`}
                  />
                </div>
              </div>
            ) : null}

            {showHeader ? (
              <>
                <header
                  className={`flex shrink-0 items-center gap-2 px-4 ${showHandle ? "mt-4" : ""} ${headerClassName}`}
                >
                  {showBackButton ? (
                    <IconButton
                      aria-label={headerButtonAriaLabel}
                      className="text-[#4d4d4d]"
                      onClick={onBack ?? onClose}
                      size="dense"
                    >
                      {headerButtonIcon ?? (
                        <LinearArrowRight2 className="h-6 w-6 text-[#4D4D4D]" />
                      )}
                    </IconButton>
                  ) : null}

                  {titleIcon ? (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[#4d4d4d]">
                      {titleIcon}
                    </span>
                  ) : null}

                  <Typography as="h2" variant="label" size="large" weight="medium"
                    className={`m-0 min-w-0 flex-1 text-[#1a1a1a] ${isCenterTitle ? "text-center" : "text-right"
                      }`}
                  >
                    {title ?? ariaLabel}
                  </Typography>

                  {showBackButton && isCenterTitle ? (
                    <Typography as="span" variant="body" size="medium" weight="regular" className="h-10 w-10 shrink-0" />
                  ) : null}
                </header>

                {showHeaderDivider ? (
                  <div className="shrink-0 px-4 pt-3">
                    <div className="h-px bg-[#f0f0f0]" />
                  </div>
                ) : null}
              </>
            ) : null}

            <div
              className={`min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain ${contentClassName}`}
            >
              {children}
            </div>
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
            <ListItem
              align={isCenter ? "center" : "right"}
              className={itemClassName}
              disabled={!isInteractive}
              onClick={() => onSelect?.(item)}
              selected={isSelected}
              tabIndex={isOpen && isInteractive ? 0 : -1}
              title={item.title}
              leading={Icon ? <Icon className="h-6 w-6 shrink-0 text-[#4d4d4d]" /> : undefined}
              trailing={showCheckIcon && isSelected ? <LinearTick aria-hidden="true" className="h-5 w-5" /> : undefined}
            >
            </ListItem>

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
