import "leaflet/dist/leaflet.css";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode } from "react";
import { CrmHeader } from "./layout/CrmHeader";
import { CrmSidebar } from "./layout/CrmSidebar";
import { useCrmShell } from "./layout/useCrmShell";

export { mapCrmAdvertiseToCard } from "./layout/advertiseFormatters";
export {
  advertiseStatusOptions,
  DEFAULT_CENTER,
  DEFAULT_COUNTRY_ID,
  ghostButtonClassName,
  inputClassName,
  userRoleOptions,
} from "./layout/constants";
export {
  cleanEmptyValues,
  formatMoney,
  fullName,
  readText,
  stringifyValue,
} from "./layout/recordFormatters";
export type { ConfirmState, CrmRoutePageProps, EditorState } from "./layout/types";

import type { CrmRoutePageProps, CrmSection } from "./layout/types";

export {
  consultantAgencyId,
  consultantAgencyName,
  consultantApiIdentifier,
  consultantStatusLabel,
  consultantStatusTone,
  consultantStatusValue,
} from "./layout/consultantFormatters";
export { normalizeCrmUserRoleSlug, userRoleSlugs } from "./layout/userRoles";

export function CrmLayout({
  contentKey,
  embeddedContent,
  renderContent,
  section = "advertises",
}: {
  contentKey?: string;
  embeddedContent?: ReactNode;
  renderContent?: (props: CrmRoutePageProps) => ReactNode;
  section?: CrmSection;
} = {}) {
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    prefersReducedMotion,
    refreshNonce,
    setRefreshNonce,
    toast,
    isDesktop,
    notify,
    visibleNavigationItems,
    roleLabel,
    profileName,
    isDark,
    toggleTheme,
    pendingCounts,
  } = useCrmShell();
  if (!isDesktop) return <DesktopRequiredPage />;

  return (
    <div
      className="flex h-screen w-full flex-col overflow-hidden bg-[#f3f3f3] text-[#1a1a1a]"
      dir="rtl"
    >
      <CrmHeader
        isDark={isDark}
        toggleTheme={toggleTheme}
        onRefresh={() => setRefreshNonce((value) => value + 1)}
        profileName={profileName}
        roleLabel={roleLabel}
      />

      <div className="flex min-h-0 flex-1 gap-6 overflow-hidden p-6">
        <CrmSidebar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((value) => !value)}
          roleLabel={roleLabel}
          visibleNavigationItems={visibleNavigationItems}
          section={section}
          pendingCounts={pendingCounts}
        />

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="h-full min-h-0"
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.995 }}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.995 }}
              key={embeddedContent ? "advertise-editor" : (contentKey ?? section)}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: "easeOut" }}
            >
              {embeddedContent ? (
                <div className="h-full min-h-0 w-full overflow-hidden rounded-xl bg-white">
                  {embeddedContent}
                </div>
              ) : renderContent ? (
                renderContent({ notify, refreshNonce })
              ) : null}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {toast ? <Toast key={toast.id} toast={toast} /> : null}
    </div>
  );
}

import { DesktopRequiredPage } from "./layout/DesktopRequiredPage";

export { AgencyAgentsModal } from "./layout/AgencyAgentsModal";

export { CategoryTree } from "./layout/CategoryTree";

export { AdvertiseFormCard } from "./layout/AdvertiseFormCard";

export { EditorModal } from "./layout/EditorModal";

export { ConfirmModal } from "./layout/ConfirmModal";

export { parseMapPointValue } from "./layout/mapFormatters";

export { Panel } from "./layout/Panel";

export { PanelHeader } from "./layout/Panel";

export { FilterField } from "./layout/FilterField";

export { TableHead } from "./layout/TableCells";

export { TableCell } from "./layout/TableCells";

export { TableLoadingRows } from "./layout/TableCells";

export { TableEmptyRow } from "./layout/TableCells";

export { SearchTableEmptyRow } from "./layout/TableCells";

export { agencyStatusTextTone, normalizeAgencyStatus } from "./layout/agencyFormatters";
export { StatusBadge } from "./layout/StatusBadges";

export { UserStatusBadge } from "./layout/StatusBadges";

export { PrimaryButton } from "./layout/ActionButtons";

export { SmallActionButton } from "./layout/ActionButtons";

export { CrmSelect } from "./layout/CrmSelect";

export { TextLink } from "./layout/ActionButtons";

export { EmptyState } from "./layout/EmptyState";

export { ListSkeleton } from "./layout/Skeletons";

export { FormCardSkeleton } from "./layout/Skeletons";

import { Toast } from "./layout/Toast";

export { CrmIcon } from "./layout/CrmIcon";
export { useQueryErrorToast } from "./layout/useQueryErrorToast";
