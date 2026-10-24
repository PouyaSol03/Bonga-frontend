import { Typography } from "../../../shared/ui/Typography";
import { Link, useNavigate } from "react-router";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import type { NotificationItem } from "../../notifications/api/notification.service";
import { getNotificationPath } from "../../notifications/notificationRouting";
import { NotificationCardStandardContent } from "../../notifications/components/NotificationCardStandardContent";

export interface DashboardNotificationsCardProps {
  items?: NotificationItem[];
  viewAllTo?: string;
}

export function DashboardNotificationsCard({
  items,
  viewAllTo = "/notifications",
}: DashboardNotificationsCardProps) {
  const navigate = useNavigate();
  const notificationList = Array.isArray(items) ? items : [];

  return (
    <section className="bg-surface-container-lowest w-full rounded-[16px] p-4 shadow-sm [direction:rtl]">
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
        <Link className="text-primary flex items-center gap-1" to={viewAllTo}>
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
        </Link>
      </div>

      {/* Notifications List - Exact match to NotificationsPage standard UI */}
      <div className="flex flex-col">
        {notificationList.length > 0 ? (
          notificationList.map((item, idx) => {
            const isLast = idx === notificationList.length - 1;
            const actionPath = getNotificationPath(item);
            const handleOpen = () => {
              if (actionPath) {
                navigate(actionPath);
              } else {
                navigate("/notifications");
              }
            };

            return (
              <article
                key={String(item.id ?? idx)}
                className={`-mx-2 flex cursor-pointer flex-col rounded-lg px-2 py-3.5 transition-colors ${
                  !isLast ? "border-surface-container-high border-b" : ""
                }`}
                onClick={handleOpen}
              >
                <NotificationCardStandardContent item={item} onOpen={handleOpen} />
              </article>
            );
          })
        ) : (
          <div className="text-outline text-body-sm py-6 text-center">اعلانی وجود ندارد</div>
        )}
      </div>
    </section>
  );
}
