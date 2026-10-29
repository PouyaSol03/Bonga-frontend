import type { ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import LinearArrowLeft1 from "../../../../../shared/icons/LinearArrowLeft1";
import LinearCancel from "../../../../../shared/icons/LinearCancel";

export function ReviewAction({
  icon,
  label,
  onClick,
  state,
  to,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  state?: unknown;
  to?: string;
}) {
  const content = (
    <>
      <LinearArrowLeft1 className="text-on-surface-var h-5 w-5" />
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className="inline-flex items-center gap-2 text-base leading-6 font-medium [direction:rtl]"
      >
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var"
        >
          {icon}
        </Typography>
        {label}
      </Typography>
    </>
  );

  if (onClick) {
    return (
      <Button
        unstyled
        className="text-on-surface flex h-[52px] w-full items-center justify-between no-underline [direction:ltr] active:bg-black/5"
        onClick={onClick}
        type="button"
      >
        {content}
      </Button>
    );
  }

  return (
    <Link
      className="text-on-surface flex h-[52px] w-full items-center justify-between no-underline [direction:ltr] active:bg-black/5"
      state={state}
      to={to || "#"}
    >
      {content}
    </Link>
  );
}

export function RejectAction({ state, to }: { state?: unknown; to: string }) {
  return (
    <Link
      className="bg-surface-container-lowest text-on-surface flex h-[52px] w-full items-center justify-between p-0 no-underline [direction:ltr] active:bg-black/5"
      state={state}
      to={to}
    >
      <LinearArrowLeft1 className="text-on-surface-var h-5 w-5" />
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className="inline-flex items-center gap-2 text-base leading-6 font-medium [direction:rtl]"
      >
        <LinearCancel className="text-on-surface-var h-6 w-6" />
        رد ثبت آگهی
      </Typography>
    </Link>
  );
}
