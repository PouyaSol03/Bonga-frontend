import type { ReactElement } from "react";

export function MobileAppShell({ children }: { children: ReactElement }) {
  return (
    <main className="bg-surface-container flex h-screen max-h-screen justify-center overflow-hidden">
      <section
        className="bg-surface-container-lowest h-[100svh] max-h-[100svh] w-[min(100vw,var(--mobile-frame-max-width))] overflow-hidden shadow-[0_22px_70px_rgba(15,23,42,0.16)]"
        aria-label="neshoono real estate mobile frame"
      >
        {children}
      </section>
    </main>
  );
}
