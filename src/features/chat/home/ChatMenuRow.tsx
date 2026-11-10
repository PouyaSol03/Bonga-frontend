import { type ReactNode } from "react";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

export function ChatMenuRow({
  children,
  compact = false,
  icon,
  onClick,
  trailing,
}: {
  children: ReactNode;
  compact?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  trailing?: ReactNode;
}) {
  const content = (
    <>
      {icon ? (
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var grid h-6 w-6 shrink-0 place-items-center"
        >
          {icon}
        </Typography>
      ) : null}
      <Typography
        as="span"
        variant="body"
        size="large"
        weight="regular"
        className="min-w-0 flex-1 text-base leading-6 font-normal"
      >
        {children}
      </Typography>
      {trailing ? (
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="grid shrink-0 place-items-center"
        >
          {trailing}
        </Typography>
      ) : null}
    </>
  );

  const className = `flex ${compact ? "h-14" : "h-[72px]"} w-full items-center gap-3 bg-surface-container-lowest px-4 text-right text-on-surface focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-primary/40`;

  if (!onClick) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Button unstyled className={className} onClick={onClick} type="button">
      {content}
    </Button>
  );
}

export function ChatMenuDivider() {
  return (
    <div className="px-4">
      <div className="bg-surface-container h-px" />
    </div>
  );
}
