import type { ReactNode } from "react";
import { Typography } from "../ui/Typography";

type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  iconClassName?: string;
  iconSrc?: string;
  title: ReactNode;
  titleAs?: "h2" | "h3";
};

/**
 * Shared full-area empty state for mobile app pages.
 *
 * The parent should be a `min-h-0` flex item. When the empty state is visible,
 * the parent scroll container should switch to `overflow-hidden` so the state
 * remains centered in the available viewport instead of creating a fake page
 * scroll.
 */
export function EmptyState({
  action,
  className = "",
  contentClassName = "",
  description,
  iconClassName = "",
  iconSrc,
  title,
  titleAs = "h2",
}: EmptyStateProps) {
  const Title = titleAs;

  return (
    <section
      className={`mx-auto flex h-full min-h-0 w-full flex-1 items-center justify-center overflow-hidden bg-white px-6 text-center ${className}`}
    >
      <div className={`mx-auto flex w-full max-w-[320px] flex-col items-center ${contentClassName}`}>
        {iconSrc ? (
          <img
            alt=""
            aria-hidden="true"
            className={`mb-4 h-[66px] w-[66px] shrink-0 object-contain ${iconClassName}`}
            draggable={false}
            src={iconSrc}
          />
        ) : null}

        <Title className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">
          {title}
        </Title>

        {description ? (
          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-sm font-normal leading-6 text-[#4d4d4d]">
            {description}
          </Typography>
        ) : null}

        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </section>
  );
}
