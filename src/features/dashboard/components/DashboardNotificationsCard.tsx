import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import { useNotificationsInfiniteQuery } from "../../notifications/api/notification.hooks";
import type { NotificationItem } from "../../notifications/api/notification.service";
import {
  formatNotificationTime,
  getNotificationActionLabel,
  getNotificationPath,
} from "../../notifications/notificationRouting";
import { getNotificationDiamondColor } from "../../notifications/notificationDiamond";

export type DashboardNotificationItem = NotificationItem;

export interface DashboardNotificationsCardProps {
  items?: NotificationItem[];
  viewAllTo?: string;
}

const defaultNotifications: NotificationItem[] = [
  {
    id: "notif_deal",
    title: "نتیجه معامله نیاز به تأیید دارد",
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    description: "لطفاً نتیجه معامله ثبت‌شده را بررسی و تأیید کنید.",
    category: "trades",
    type: "deal_approval",
    is_read: false,
  },
  {
    id: "notif_pub",
    title: "آگهی شما منتشر شد",
    created_at: new Date(Date.now() - 3600000 * 22).toISOString(),
    description: "آگهی «آپارتمان ۱۲۰ متری سعادت‌آباد» با موفقیت منتشر شد.",
    category: "advertise",
    type: "ad_published",
    is_read: true,
    payload: { target: "advertise", advertise_id: "1" },
  },
  {
    id: "notif_stop",
    title: "انتشار آگهی متوقف شد",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    description: "درخواست توقف انتشار آگهی شما تأیید شد.",
    category: "advertise",
    type: "ad_stopped",
    is_read: true,
    payload: { target: "advertise", advertise_id: "2" },
  },
];

export function DashboardNotificationsCard({
  items,
  viewAllTo = "/account/dashboard/messages",
}: DashboardNotificationsCardProps) {
  const { data } = useNotificationsInfiniteQuery({ perPage: 3 });
  const serverNotifications = data?.pages?.[0]?.data;
  const notificationList =
    items && items.length > 0
      ? items
      : serverNotifications && serverNotifications.length > 0
        ? serverNotifications.slice(0, 3)
        : defaultNotifications;

  return (
    <section className="w-full rounded-[16px] bg-surface-container-lowest p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="semibold"
          className="text-on-surface"
        >
          آخرین اعلان‌ها
        </Typography>
        <RouteLink
          className="flex items-center gap-1 text-primary hover:underline"
          to={viewAllTo}
        >
          <Typography as="span" variant="label" size="small" weight="medium" className="text-primary">
            مشاهده همه
          </Typography>
          <LinearArrowLeft1 className="h-3.5 w-3.5" />
        </RouteLink>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col">
        {notificationList.map((item, idx) => {
          const isLast = idx === notificationList.length - 1;
          const diamondColor = getNotificationDiamondColor(item);
          const timeText = item.created_at ? formatNotificationTime(item.created_at) : "";
          const actionLabel = getNotificationActionLabel(item);
          const actionPath = getNotificationPath(item);
          const isTradeApproval = item.category === "trades" || item.type === "deal_approval";

          return (
            <article
              key={String(item.id ?? idx)}
              className={`flex flex-col py-3 ${!isLast ? "border-b border-surface-container-high" : ""}`}
            >
              {/* Top row: Status/Diamond + Title + Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {diamondColor ? (
                    <span className={`h-2 w-2 shrink-0 rotate-45 rounded-[2px] ${diamondColor}`} />
                  ) : null}
                  {!item.is_read ? (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-error" />
                  ) : null}
                  <Typography
                    as="h3"
                    variant="label"
                    size="medium"
                    weight="semibold"
                    className="text-on-surface"
                  >
                    {item.title || "اعلان جدید"}
                  </Typography>
                </div>
                {timeText ? (
                  <Typography
                    as="span"
                    variant="body"
                    size="small"
                    weight="regular"
                    className="text-outline"
                  >
                    {timeText}
                  </Typography>
                ) : null}
              </div>

              {/* Subtitle / Description */}
              {item.description ? (
                <Typography
                  as="p"
                  variant="body"
                  size="small"
                  weight="regular"
                  className="mt-1 leading-relaxed text-on-surface-var"
                >
                  {item.description}
                </Typography>
              ) : null}

              {/* Actions */}
              {isTradeApproval ? (
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-7 items-center justify-center rounded-[8px] bg-primary px-4 transition hover:opacity-90 active:scale-95 cursor-pointer border-none"
                  >
                    <Typography as="span" variant="label" size="small" weight="medium" className="text-on-primary">
                      تایید
                    </Typography>
                  </button>
                  <button
                    type="button"
                    className="flex h-7 items-center justify-center rounded-[8px] border border-surface-container-highest bg-surface-container-lowest px-3 transition hover:bg-surface-container-low active:scale-95 cursor-pointer"
                  >
                    <Typography as="span" variant="label" size="small" weight="medium" className="text-on-surface">
                      عدم تایید
                    </Typography>
                  </button>
                </div>
              ) : actionLabel && actionPath ? (
                <div className="mt-2 flex justify-start">
                  <RouteLink
                    to={actionPath}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Typography as="span" variant="label" size="small" weight="semibold" className="text-primary">
                      {actionLabel}
                    </Typography>
                    <LinearArrowLeft1 className="h-3 w-3" />
                  </RouteLink>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
