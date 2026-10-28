import NavHomeIcon from "../../../shared/icons/NavHomeIcon";
import { Typography } from "../../../shared/ui/Typography";
import { BlockedIcon } from "./listIcons";

export function UnreadBadge({ count }: { count?: string }) {
  if (!count) return null;

  return (
    <Typography
      as="span"
      variant="label"
      size="small"
      weight="medium"
      className="bg-primary grid h-4 min-w-3.5 place-items-center rounded-full px-1 text-xs leading-4 font-medium text-white"
    >
      {count}
    </Typography>
  );
}

export function BlockedBadge() {
  return (
    <Typography
      as="span"
      variant="body"
      size="small"
      weight="regular"
      className="bg-error-container/30 text-error flex h-5 items-center gap-1 rounded-lg px-2 text-xs leading-4 font-normal"
    >
      <BlockedIcon className="text-outline h-3 w-3" />
      <Typography as="span" variant="body" size="medium" weight="regular">
        مسدود
      </Typography>
    </Typography>
  );
}

export function SystemChatIcon() {
  return (
    <Typography
      as="span"
      variant="body"
      size="medium"
      weight="regular"
      aria-hidden="true"
      className="bg-primary grid h-5 w-5 shrink-0 place-items-center rounded-xl text-white"
    >
      <NavHomeIcon active color="currentColor" duotoneOpacity={0.24} size={30} strokeWidth={2} />
    </Typography>
  );
}
