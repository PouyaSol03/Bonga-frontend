import { Link } from "react-router";
import { useNotificationUnreadCountQuery } from "../../../notifications/api/notification.hooks";
import { getStoredAuthSession } from "../../../../shared/auth/auth-storage";
import LinearNotification from "../../../../shared/icons/LinearNotification";
import { Typography } from "../../../../shared/ui/Typography";

export function AccountNotificationButton() {
  const { data: unreadNotificationsCount = 0 } = useNotificationUnreadCountQuery({
    enabled: Boolean(getStoredAuthSession()),
  });

  return (
    <Link
      aria-label="اعلان‌ها"
      className="text-on-surface focus-visible:outline-primary/25 relative grid h-10 w-10 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-2"
      to="/notifications"
    >
      <LinearNotification className="h-6 w-6" />
      {unreadNotificationsCount > 0 ? (
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          aria-hidden="true"
          className="bg-error ring-surface-container-lowest absolute top-2 right-2 h-2.5 w-2.5 rounded-full ring-2"
        />
      ) : null}
    </Link>
  );
}
