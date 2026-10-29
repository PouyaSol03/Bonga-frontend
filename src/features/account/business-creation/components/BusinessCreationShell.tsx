import type { ReactNode } from "react";
import { TopBar } from "../../../../shared/components/TopBar";
import { PageFrame } from "../../../../shared/layout/PageFrame";

export function BusinessCreationShell({
  bottomBar,
  children,
}: {
  bottomBar: ReactNode;
  children: ReactNode;
}) {
  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account" title="ایجاد کسب و کار" />
      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pt-4 pb-4 [-webkit-overflow-scrolling:touch]">
        {children}
      </main>
      <div className="bg-surface-container-lowest relative z-20 shrink-0 shadow-sm">
        {bottomBar}
      </div>
    </PageFrame>
  );
}
