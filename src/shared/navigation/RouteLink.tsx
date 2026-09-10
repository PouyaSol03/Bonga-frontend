import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { prefetchRoute, pushRoute } from './navigation'

type RouteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string
  state?: unknown
}

export function RouteLink({
  to,
  state,
  onClick,
  onMouseEnter,
  onTouchStart,
  children,
  ...props
}: RouteLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.button !== 0
    ) {
      return
    }

    event.preventDefault()
    pushRoute(to, state)
  }

  return (
    <a
      href={to}
      onClick={handleClick}
      onMouseEnter={(event) => {
        prefetchRoute(to)
        onMouseEnter?.(event)
      }}
      onTouchStart={(event) => {
        prefetchRoute(to)
        onTouchStart?.(event)
      }}
      {...props}
    >
      {children}
    </a>
  )
}
