import { Suspense } from 'react'
import { getStoredAuthSession } from '../../shared/auth/auth-storage'
import LinearNotification from '../../shared/icons/LinearNotification'
import { Typography } from '../../shared/ui/Typography'
import { lazyNamed } from './types'

const UnreadNotificationBadge = lazyNamed(
  () => import('../../features/notifications/components/UnreadNotificationBadge'),
  'UnreadNotificationBadge',
)

export function NotificationTopBarIcon() {
  const hasAuthSession = Boolean(getStoredAuthSession())

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
          <UnreadNotificationBadge
            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-error ring-2 ring-surface-container"
          />
        </Suspense>
      ) : null}
    </Typography>
  )
}
