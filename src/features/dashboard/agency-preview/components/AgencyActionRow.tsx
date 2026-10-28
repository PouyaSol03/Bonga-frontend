import type { ReactNode } from "react";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";

interface AgencyActionRowProps {
  icon: ReactNode;
  onClick?: () => void;
  title: string;
}

export function AgencyActionRow({ icon, onClick, title }: AgencyActionRowProps) {
  return (
    <Button
      unstyled
      className="bg-surface-container-lowest flex w-full items-center gap-3 p-4 text-right"
      onClick={onClick}
      type="button"
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface-var grid h-6 w-6 place-items-center"
      >
        {icon}
      </Typography>
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className="text-on-surface min-w-0 flex-1"
      >
        {title}
      </Typography>
      <LinearArrowLeft1 className="text-on-surface-var h-6 w-6" />
    </Button>
  );
}
