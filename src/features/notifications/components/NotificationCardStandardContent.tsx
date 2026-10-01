import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import type { NotificationItem } from "../api/notification.service";
import {
  formatNotificationTime,
  getNotificationActionLabel,
} from "../notificationRouting";
import { getNotificationDiamondColor } from "../notificationDiamond";
import { NotificationActionButton } from "./NotificationActionButton";

export function NotificationCardStandardContent({
  item,
  onOpen,
}: {
  item: NotificationItem;
  onOpen: () => void;
}) {
  const isUnread = item.is_read === false;
  const isTradeApproval =
    item.title === "نتیجه معامله نیاز به تأیید دارد" ||
    item.type === "trade_result_needs_approval";
  const actionLabel = getNotificationActionLabel(item);
  const diamondColor = getNotificationDiamondColor(item);

  return (
    <>
      <div className="flex items-start justify-between gap-3 [direction:ltr]">
        <time className="shrink-0 pt-0.5 text-xs font-normal leading-4 text-outline">
          {formatNotificationTime(item.created_at)}
        </time>

        <div className="min-w-0 flex-1 text-right [direction:rtl]">
          <div className="flex items-center justify-start gap-2">
            {diamondColor ? (
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className={`h-3 w-3 shrink-0 rotate-45 rounded-[2px] ${diamondColor}`}
                aria-hidden="true"
              />
            ) : null}
            <Typography
              as="h2"
              variant="title"
              size="small"
              weight="semibold"
              className={`m-0 truncate text-sm leading-6 ${
                isUnread
                  ? "font-bold text-on-surface"
                  : "font-semibold text-on-surface-var"
              }`}
            >
              {item.title || "اعلان جدید"}
            </Typography>
            {isUnread ? (
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="h-2 w-2 shrink-0 rounded-full bg-error"
                aria-label="خوانده نشده"
              />
            ) : null}
          </div>

          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="mt-2 line-clamp-2 text-xs font-normal leading-5 text-on-surface-var"
          >
            {item.description || "برای مشاهده جزئیات اعلان را باز کنید."}
          </Typography>
        </div>
      </div>

      {isTradeApproval ? (
        <div className="mt-auto flex items-center justify-start gap-2 [direction:rtl]">
          <Button
            unstyled
            className="h-7 w-[76px] shrink-0 rounded-lg bg-primary px-2 text-center text-xs font-medium leading-4 text-on-primary active:opacity-80 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            onPointerDown={(event) => event.stopPropagation()}
            type="button"
          >
            <Typography as="span" variant="label" size="small" weight="medium">
              تایید
            </Typography>
          </Button>
          <Button
            unstyled
            className="h-7 w-[76px] shrink-0 rounded-lg border border-primary bg-surface-container-lowest px-2 text-center text-xs font-medium leading-4 text-primary active:bg-surface-container focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            onPointerDown={(event) => event.stopPropagation()}
            type="button"
          >
            <Typography as="span" variant="label" size="small" weight="medium">
              عدم تایید
            </Typography>
          </Button>
        </div>
      ) : actionLabel ? (
        <div className="mt-auto flex justify-start [direction:rtl]">
          <NotificationActionButton label={actionLabel} onClick={onOpen} />
        </div>
      ) : null}
    </>
  );
}
