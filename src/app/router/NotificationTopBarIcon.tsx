import { Suspense } from "react";
import { getStoredAuthSession } from "../../shared/auth/auth-storage";
import LinearNotification from "../../shared/icons/LinearNotification";
import { Typography } from "../../shared/ui/Typography";
import { lazyNamed } from "./types";

const UnreadNotificationBadge = lazyNamed(
  () => import("../../features/notifications/components/UnreadNotificationBadge"),
  "UnreadNotificationBadge",
);

export function NotificationTopBarIcon() {
  const hasAuthSession = Boolean(getStoredAuthSession());

  return (
    <Typography
      as="span"
      variant="body"
      size="medium"
      weight="regular"
      className="relative grid h-6 w-6 place-items-center"
    >
      <LinearNotification className="h-6 w-6" />
      {hasAuthSession ? (
        <Suspense fallback={null}>
          <UnreadNotificationBadge className="bg-error ring-surface-container absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2" />
        </Suspense>
      ) : null}
    </Typography>
  );
}
