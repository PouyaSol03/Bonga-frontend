import type { ReactNode } from "react";
import { PageFrame } from "./PageFrame";

type TopBarNavigationLayoutProps = {
  activeKey?: string;
  children: ReactNode;
  contentClassName?: string;
  fixedAfterTopBar?: ReactNode;
  frameClassName?: string;
  hideTopBar?: boolean;
  overlay?: ReactNode;
  topBar?: ReactNode;
};

export function TopBarNavigationLayout({
  children,
  contentClassName = "",
  fixedAfterTopBar,
  frameClassName = "",
  hideTopBar = false,
  overlay,
  topBar,
}: TopBarNavigationLayoutProps) {
  return (
    <PageFrame
      className={`flex min-h-0 flex-col overflow-hidden ${frameClassName}`}
      variant="flush"
    >
      {hideTopBar ? null : topBar}
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
