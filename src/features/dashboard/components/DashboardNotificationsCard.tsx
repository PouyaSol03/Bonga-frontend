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

export function DashboardNotificationsCard({
  items,
  viewAllTo = "/notifications",
}: DashboardNotificationsCardProps) {
  const notificationList = Array.isArray(items) ? items : [];

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
          className="flex items-center gap-1 text-primary"
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
        {notificationList.length > 0 ? (
          notificationList.map((item, idx) => {
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
                className={`flex flex-col py-3.5 cursor-pointer transition-colors rounded-lg px-2 -mx-2 ${
                  !isLast ? "border-b border-surface-container-high" : ""
                }`}
                onClick={handleOpen}
              >
                <NotificationCardStandardContent item={item} onOpen={handleOpen} />
              </article>
            );
          })
        ) : (
          <div className="py-6 text-center text-outline text-body-sm">
            اعلانی وجود ندارد
          </div>
        )}
      </div>
    </section>
  );
}
