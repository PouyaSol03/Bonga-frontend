import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { CheckIcon } from "./listIcons";

export function ChatListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="bg-surface-container-lowest space-y-px">
      {Array.from({ length: count }).map((_, index) => (
        <div className="border-outline-var h-[140px] animate-pulse border-b px-4 py-4" key={index}>
          <div className="bg-surface-container mb-4 h-5 w-3/4 rounded" />
          <div className="bg-surface-container mb-5 h-4 w-full rounded" />
          <div className="flex items-center gap-3">
            <div className="bg-surface-container h-12 w-[72px] rounded" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="bg-surface-container h-4 w-1/2 rounded" />
              <div className="bg-surface-container h-5 w-4/5 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BulkSelectAllControl({
  checked,
  disabled,
  onToggle,
}: {
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      unstyled
      aria-pressed={checked}
      className="text-on-surface flex h-11 items-center gap-3 text-sm leading-5 font-semibold disabled:opacity-50"
      disabled={disabled}
      onClick={onToggle}
      type="button"
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`grid h-[18px] w-[18px] place-items-center rounded border ${
          checked
            ? "border-outline bg-surface-container-lowest text-on-surface-var"
            : "border-outline bg-surface-container-lowest text-transparent"
        }`}
      >
        <CheckIcon className="h-[14px] w-[14px]" />
      </Typography>
      <Typography as="span" variant="body" size="medium" weight="regular">
        انتخاب همه
      </Typography>
    </Button>
  );
}
