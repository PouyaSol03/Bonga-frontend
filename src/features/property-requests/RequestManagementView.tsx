import LinearRefresh from "../../shared/icons/LinearRefresh";
import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";
import { REAL_ESTATE_MANAGER } from "../../shared/constants/roles.constants";
import { RequestFilterBottomSheet } from "./RequestFilterBottomSheet";
import { RequestEditBottomSheet } from "./request-management/components/RequestEditBottomSheet";
import { RequestReceivedTab } from "./request-management/components/RequestReceivedTab";
import { RequestRequestsTab } from "./request-management/components/RequestRequestsTab";
import { RequestResultsFilterBar } from "./request-management/components/RequestResultsFilterBar";
import { RequestResultsTab } from "./request-management/components/RequestResultsTab";
import { RequestTabs } from "./request-management/components/RequestTabs";
import type { RequestManagementViewProps } from "./request-management/types";
import { useRequestManagement } from "./request-management/useRequestManagement";

export function RequestManagementView({
  backTo,
  showReceivedTab = false,
  variant = "default",
}: RequestManagementViewProps) {
  const m = useRequestManagement(showReceivedTab);

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: (
              <LinearRefresh
                className={`h-6 w-6 transition-transform ${m.isRefreshing ? "animate-spin" : ""}`}
              />
            ),
            id: "refresh-requests",
            label: "بروزرسانی درخواست‌ها",
            onClick: m.refreshRequests,
          },
        ]}
        backTo={backTo}
        className={
          variant === "account"
            ? "border-outline-var bg-surface-container border-b"
            : "bg-surface-container"
        }
        contentClassName="px-2"
        heightClassName={variant === "account" ? "h-14" : "h-12"}
        centerSlot={
          <Typography
            as="h1"
            variant="title"
            size="medium"
            weight="semibold"
            className="text-on-surface m-0 truncate text-right"
          >
            درخواست‌ها
          </Typography>
        }
      />

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
        <div
          className={variant === "account" ? "bg-surface-container" : "bg-surface-container-lowest"}
        >
          <RequestTabs
            activeTab={m.activeTab}
            hasReceivedIndicator={m.hasNewReceivedRequests}
            onChange={m.changeTab}
            tabs={m.tabs}
            variant={variant}
          />

          {m.activeTab === "results" ? (
            <RequestResultsFilterBar
              activeFilterId={m.activeFilterId}
              activeFilterTitle={m.activeFilterTitle}
              isFilterSheetOpen={m.isFilterSheetOpen}
              isPersonal={m.isPersonal}
              onOpenFilterSheet={() => m.setIsFilterSheetOpen(true)}
              onSelectFilter={m.selectFilter}
              requests={m.requests}
            />
          ) : null}
        </div>

        {m.activeTab === "requests" ? (
          <RequestRequestsTab
            errorDescription={
              m.requestLoadState?.description ??
              "دریافت درخواست‌ها با خطا مواجه شد. از دکمه بروزرسانی استفاده کنید."
            }
            errorTitle={m.requestLoadState?.title ?? "دریافت درخواست‌ها ناموفق بود"}
            isError={m.requestsQuery.isError}
            isLoading={m.requestsQuery.isLoading}
            onCancel={m.cancelRequest}
            onEdit={m.openEditSheet}
            requests={m.requests}
            variant={variant}
          />
        ) : m.activeTab === "results" ? (
          <RequestResultsTab
            activeFilterId={m.activeFilterId}
            errorDescription={
              m.requestLoadState?.description ??
              "دریافت درخواست‌ها با خطا مواجه شد. از دکمه بروزرسانی استفاده کنید."
            }
            errorTitle={m.requestLoadState?.title ?? "دریافت درخواست‌ها ناموفق بود"}
            filteredRequests={m.filteredRequests}
            isError={m.requestsQuery.isError}
            isLoading={m.requestsQuery.isLoading}
            onStatusChange={m.handleResultStatusChange}
            showResultsEmpty={m.showResultsEmpty}
            variant={variant}
          />
        ) : (
          <RequestReceivedTab
            errorDescription={
              m.requestLoadState?.description ?? "دریافت درخواست‌های دریافتی با خطا مواجه شد."
            }
            errorTitle={m.requestLoadState?.title ?? "دریافت درخواست‌ها ناموفق بود"}
            isError={m.requestsQuery.isError}
            isLoading={m.requestsQuery.isLoading}
            isReceivedGuideVisible={m.isReceivedGuideVisible}
            onDelete={m.deleteReceivedRequest}
            onDismissGuide={m.dismissReceivedGuide}
            receivedRequests={m.receivedRequests}
            variant={variant}
          />
        )}
      </main>

      <RequestEditBottomSheet
        isOpen={Boolean(m.editingRequest)}
        onClose={m.closeEditSheet}
        onConfirm={m.confirmEdit}
        onValueChange={m.setEditTitle}
        value={m.editTitle}
      />

      <RequestFilterBottomSheet
        agencyStyle={m.activeRole === REAL_ESTATE_MANAGER}
        isOpen={m.isFilterSheetOpen}
        onClose={() => m.setIsFilterSheetOpen(false)}
        onSelect={(filterId) => m.selectFilter(filterId)}
        requests={m.requests}
        selectedId={m.activeFilterId}
      />
    </PageFrame>
  );
}
