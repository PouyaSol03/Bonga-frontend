import type { ReactNode } from 'react'

type PageFrameProps = {
  children: ReactNode
  className?: string
  dir?: 'rtl' | 'ltr'
  variant?: 'standard' | 'flush'
}

export function PageFrame({
  children,
  className = '',
  dir = 'rtl',
  variant = 'standard',
}: PageFrameProps) {
  const baseClasses = 'h-full min-h-0 w-full bg-surface-container-lowest text-on-surface'
  const variantClasses = variant === 'standard' ? 'flex flex-col px-4 py-6' : 'p-0'
  const classes = [baseClasses, variantClasses, className].filter(Boolean).join(' ')

  return (
    <div className={classes} dir={dir}>
      {children}
    </div>
  )
}
