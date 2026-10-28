import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { ArrowDownIcon, CloseIcon } from "./listIcons";

export function ResponseTimeSelectBox({
  label,
  onClick,
  onClear,
  value,
}: {
  label: string;
  onClick: () => void;
  onClear?: () => void;
  value?: string;
}) {
  const hasValue = Boolean(value);

  return (
    <div className="border-outline-var bg-surface-container-lowest flex h-14 min-w-0 flex-1 items-center rounded-lg border px-2">
      <Button
        unstyled
        className="focus-visible:outline-primary/40 flex h-full min-w-0 flex-1 items-center gap-2 px-1 text-right focus-visible:outline-3 focus-visible:outline-offset-[-2px]"
        onClick={onClick}
        type="button"
      >
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="min-w-0 flex-1 text-right"
        >
          {hasValue ? (
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="flex min-w-0 flex-col gap-0.5"
            >
              <Typography
                as="span"
                variant="body"
                size="small"
                weight="regular"
                className="text-outline truncate text-[10px] leading-4 font-normal"
              >
                {label}
              </Typography>
              <Typography
                as="span"
                variant="label"
                size="small"
                weight="medium"
                className="text-on-surface truncate text-xs leading-4 font-medium"
              >
                {value}
              </Typography>
            </Typography>
          ) : (
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="text-outline block truncate text-xs leading-4 font-normal"
            >
              {label}
            </Typography>
          )}
        </Typography>

        {!hasValue ? <ArrowDownIcon className="text-on-surface-var h-4 w-4 shrink-0" /> : null}
      </Button>

      {hasValue && onClear ? (
        <Button
          unstyled
          aria-label={`پاک کردن ${label}`}
          className="text-outline focus-visible:outline-primary grid h-7 w-7 shrink-0 place-items-center rounded-full focus-visible:outline-2"
          onClick={onClear}
          type="button"
        >
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="border-outline-var grid h-5 w-5 place-items-center rounded-full border"
          >
            <CloseIcon className="h-3 w-3" />
          </Typography>
        </Button>
      ) : null}
    </div>
  );
}
