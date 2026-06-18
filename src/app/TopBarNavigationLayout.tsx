import type { ReactNode } from "react";
import { PageFrame } from "./PageFrame";

type TopBarNavigationLayoutProps = {
  activeKey?: string;
  children: ReactNode;
  contentClassName?: string;
  fixedAfterTopBar?: ReactNode;
  frameClassName?: string;
  overlay?: ReactNode;
  topBar: ReactNode;
};

export function TopBarNavigationLayout({
  children,
  contentClassName = "",
  fixedAfterTopBar,
  frameClassName = "",
  overlay,
  topBar,
}: TopBarNavigationLayoutProps) {
  return (
    <PageFrame
      className={`flex min-h-0 flex-col overflow-hidden ${frameClassName}`}
      variant="flush"
    >
      {topBar}
      {fixedAfterTopBar}

      <main
        className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden ${contentClassName}`}
      >
        {children}
      </main>

      {overlay}
    </PageFrame>
  );
}
