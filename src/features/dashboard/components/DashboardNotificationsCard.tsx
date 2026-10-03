import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import type { NotificationItem } from "../../notifications/api/notification.service";
import {
  getNotificationPath,
  navigateTo,
} from "../../notifications/notificationRouting";
import { NotificationCardStandardContent } from "../../notifications/components/NotificationCardStandardContent";

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
  viewAllTo = "/notifications",
}: DashboardNotificationsCardProps) {
  const notificationList =
    Array.isArray(items) && items.length > 0
      ? items
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
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-primary"
          >
            مشاهده همه
          </Typography>
          <LinearArrowLeft1 className="h-3.5 w-3.5" />
        </RouteLink>
      </div>

      {/* Notifications List - Exact match to NotificationsPage standard UI */}
      <div className="flex flex-col">
        {notificationList.map((item, idx) => {
          const isLast = idx === notificationList.length - 1;
          const actionPath = getNotificationPath(item);
          const handleOpen = () => {
            if (actionPath) {
              navigateTo(actionPath);
            } else {
              navigateTo("/notifications");
            }
          };

          return (
            <article
              key={String(item.id ?? idx)}
              className={`flex flex-col py-3.5 cursor-pointer transition-colors hover:bg-surface-container-low/40 rounded-lg px-2 -mx-2 ${
                !isLast ? "border-b border-surface-container-high" : ""
              }`}
              onClick={handleOpen}
            >
              <NotificationCardStandardContent item={item} onOpen={handleOpen} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
