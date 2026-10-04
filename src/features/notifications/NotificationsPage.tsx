import { PageFrame } from "../../shared/layout/PageFrame";
import { Typography } from "../../shared/ui/Typography";
import { getRequestErrorState } from "../../shared/components/ErrorState";
import { useNotificationsController } from "./useNotificationsController";
import { NotificationHeader } from "./components/NotificationHeader";
import { NotificationFilterBar } from "./components/NotificationFilterBar";
import { NotificationFilterSheet } from "./components/NotificationFilterSheet";
import { NotificationSettingsSheet } from "./components/NotificationSettingsSheet";
import { NotificationsEmptyState } from "./components/NotificationsEmptyState";
import { SwipeableNotificationCard } from "./components/SwipeableNotificationCard";
import { getAgencyConsultantRequestDisplayState } from "./components/AgencyConsultantRequestCardContent";
import { navigateTo } from "./notificationRouting";

// Re-exports for backward compatibility and storybook
export { NotificationHeader } from "./components/NotificationHeader";
export { NotificationFilterBar } from "./components/NotificationFilterBar";
export { NotificationFilterSheet } from "./components/NotificationFilterSheet";
export { NotificationSettingsSheet } from "./components/NotificationSettingsSheet";
export { NotificationsEmptyState } from "./components/NotificationsEmptyState";
export { SwipeableNotificationCard } from "./components/SwipeableNotificationCard";
export { NotificationActionButton } from "./components/NotificationActionButton";
export {
  AgencyConsultantRequestCardContent,
  AgencyConsultantRequestDescription,
  getAgencyConsultantRequestDisplayState,
} from "./components/AgencyConsultantRequestCardContent";
export { NotificationManagementPage } from "./NotificationManagementPage";
export {
  formatNotificationTime,
  getNotificationActionLabel,
  getNotificationPath,
  navigateTo,
} from "./notificationRouting";
export {
  categoryColorClassNames,
  notificationFilterOptions,
  type AgencyConsultantRequestDecision,
  type AgencyConsultantRequestDisplayState,
} from "./types";

export function NotificationsPage() {
  const {
    agencyRequestActionNotificationId,
    agencyRequestDecisions,
    clearReadNotifications,
    deleteMutation,
    handleAgencyConsultantRequestDecision,
    isClearingRead,
    isFilterSheetOpen,
    isSettingsSheetOpen,
    loadMoreSentinelRef,
    markAllRead,
    markAllReadMutation,
    markAllUnread,
    notifications,
    notificationsQuery,
    observeNotificationNode,
    openNotification,
    refreshNotifications,
    removeFilter,
    selectedFilterIds,
    selectedFilters,
    setIsFilterSheetOpen,
    setIsSettingsSheetOpen,
    setMarkAllUnread,
    toggleFilter,
    visibleNotifications,
  } = useNotificationsController();

  const ErrorState = getRequestErrorState(notificationsQuery.error);
  const isFilteredEmpty =
    selectedFilterIds.size > 0 && visibleNotifications.length === 0;

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
      variant="flush"
    >
      <NotificationHeader
        onOpenSettings={() => setIsSettingsSheetOpen(true)}
        onRefresh={() => void refreshNotifications()}
      />
      <NotificationFilterBar
        onOpenFilters={() => setIsFilterSheetOpen(true)}
        onRemoveFilter={removeFilter}
        selectedFilters={selectedFilters}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-surface-container-lowest pb-5 [-webkit-overflow-scrolling:touch]">
        {notificationsQuery.isLoading ? (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="py-16 text-center text-sm text-outline"
          >
            در حال دریافت اعلان‌ها...
          </Typography>
        ) : null}

        {notificationsQuery.isError ? (
          <ErrorState
            className="h-full min-h-0 flex-1"
            onRetry={() => void refreshNotifications()}
          />
        ) : null}

        {!notificationsQuery.isLoading &&
          !notificationsQuery.isError &&
          visibleNotifications.map((notification, index) => {
            const shouldAttachLoadMoreRef =
              index === Math.max(visibleNotifications.length - 10, 0) &&
              notificationsQuery.hasNextPage &&
              !notificationsQuery.isFetchingNextPage;

            return (
              <div
                key={String(notification.id)}
                ref={(node) => {
                  if (shouldAttachLoadMoreRef) loadMoreSentinelRef(node);
                  observeNotificationNode(
                    node,
                    String(notification.id),
                    notification.is_read,
                  );
                }}
              >
                <SwipeableNotificationCard
                  agencyRequestDecision={
                    agencyRequestDecisions[String(notification.id)] ??
                    getAgencyConsultantRequestDisplayState(notification)
                  }
                  isDeleting={
                    deleteMutation.isPending &&
                    deleteMutation.variables === String(notification.id)
                  }
                  isRespondingToAgencyRequest={
                    agencyRequestActionNotificationId === String(notification.id)
                  }
                  item={notification}
                  onAgencyRequestDecision={(decision) =>
                    void handleAgencyConsultantRequestDecision(
                      notification,
                      decision,
                    )
                  }
                  onDelete={() => void deleteMutation.mutate(String(notification.id))}
                  onOpen={() => void openNotification(notification)}
                />
              </div>
            );
          })}

        {!notificationsQuery.isLoading &&
          !notificationsQuery.isError &&
          (notifications.length === 0 || isFilteredEmpty) ? (
          <NotificationsEmptyState isFiltered={isFilteredEmpty} />
        ) : null}
      </main>

      <NotificationFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        onToggle={toggleFilter}
        selectedFilterIds={selectedFilterIds}
      />
      <NotificationSettingsSheet
        isClearingRead={isClearingRead}
        isMarkingAllRead={markAllReadMutation.isPending}
        isOpen={isSettingsSheetOpen}
        markAllUnread={markAllUnread}
        onClearRead={() => {
          void clearReadNotifications();
          setIsSettingsSheetOpen(false);
        }}
        onClose={() => setIsSettingsSheetOpen(false)}
        onMarkAllRead={() => {
          void markAllRead();
          setIsSettingsSheetOpen(false);
        }}
        onMarkAllUnreadChange={setMarkAllUnread}
        onManage={() => {
          setIsSettingsSheetOpen(false);
          navigateTo("/notifications/settings");
        }}
      />
    </PageFrame>
  );
}
