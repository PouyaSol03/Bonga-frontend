import type { ReactNode } from "react";
import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBarLayoutProvider } from "../../shared/components/TopBar";
import { BottomNavigation } from "../layout/BottomNavigation";
import type { AppChromeConfig } from "./routeChrome";

export function renderWithChrome(
  page: ReactNode,
  chromeConfig: AppChromeConfig,
  canonicalPath: string,
  fullPath?: string,
): ReactNode {
  if (!chromeConfig.wrapInShell) {
    return page;
  }

  return (
    <PageFrame className={chromeConfig.frameClassName} variant="flush">
      {chromeConfig.topBar ? (
        <TopBarLayoutProvider
          defaultTopBar={chromeConfig.topBar}
          resetKey={fullPath ?? canonicalPath}
        >
          <div
            className={
              chromeConfig.contentClassName ?? "flex h-full min-h-0 flex-1 flex-col overflow-hidden"
            }
          >
            {page}
          </div>
        </TopBarLayoutProvider>
      ) : (
        <div
          className={
            chromeConfig.contentClassName ?? "flex h-full min-h-0 flex-1 flex-col overflow-hidden"
          }
        >
          {page}
        </div>
      )}
      {chromeConfig.bottomNavigationKey ? (
        <BottomNavigation activeKey={chromeConfig.bottomNavigationKey} />
      ) : null}
    </PageFrame>
  );
}
