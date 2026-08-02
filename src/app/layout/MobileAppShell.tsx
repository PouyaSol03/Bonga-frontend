import type { ReactElement } from 'react'

export function MobileAppShell({ children }: { children: ReactElement }) {
  return (
    <main className="flex h-screen max-h-screen justify-center overflow-hidden bg-[#eef3fb]">
      <section
        className="h-[100svh] max-h-[100svh] w-[min(100vw,var(--mobile-frame-max-width))] overflow-hidden bg-white shadow-[0_22px_70px_rgba(15,23,42,0.16)]"
        aria-label="Bonga real estate mobile frame"
      >
        {children}
      </section>
    </main>
  )
}
