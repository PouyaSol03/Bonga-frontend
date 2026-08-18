import { useNotificationUnreadCountQuery } from "../api/notification.hooks";
import { Typography } from "../../../shared/ui/Typography";

type UnreadNotificationBadgeProps = {
  className: string;
  size?: "small" | "medium";
};

export function UnreadNotificationBadge({
  className,
  size = "medium",
}: UnreadNotificationBadgeProps) {
  const { data: unreadNotificationsCount = 0 } = useNotificationUnreadCountQuery({
    enabled: true,
  });

  if (unreadNotificationsCount <= 0) return null;

  return (
    <Typography
      as="span"
      variant="body"
      size={size}
      weight="regular"
      aria-hidden="true"
      className={className}
    />
  );
}
