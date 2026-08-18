import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { pushRoute } from './navigation'

type RouteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string
  state?: unknown
}

export function RouteLink({ to, state, onClick, children, ...props }: RouteLinkProps) {
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
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
