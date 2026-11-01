import { motion } from "motion/react";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import type { CrmRoutePageProps } from "./CrmLayout";
import { SupportRequestsHeader } from "./support-requests/components/SupportRequestsHeader";
import { SupportRequestsSidebar } from "./support-requests/components/SupportRequestsSidebar";
import { SupportRequestDetailHeader } from "./support-requests/components/SupportRequestDetailHeader";
import { SupportRequestConversation } from "./support-requests/components/SupportRequestConversation";
import { useCrmSupportRequests } from "./support-requests/useCrmSupportRequests";

export function CrmSupportRequestsView(props: CrmRoutePageProps) {
  const { notify } = props;
  const s = useCrmSupportRequests(props);

  return (
    <section className="flex h-full min-h-0 flex-col gap-4" dir="rtl">
      <SupportRequestsHeader
        counts={s.counts}
        onRefresh={() =>
          void s.requestsQuery.refetch().then(() => notify("فهرست درخواست‌ها بروزرسانی شد."))
        }
      />

      <div className="flex min-h-0 flex-1 gap-4">
        <SupportRequestsSidebar
          activeFilter={s.activeFilter}
          category={s.category}
          filteredRequests={s.filteredRequests}
          hasNextPage={s.hasNextPage}
          isError={s.requestsQuery.isError}
          isLoading={s.requestsQuery.isLoading}
          onCategoryChange={s.setCategory}
          onFilterChange={(filter) => {
            s.setActiveFilter(filter);
            s.setPage(1);
          }}
          onPageChange={s.setPage}
          onPriorityChange={(value) => {
            s.setPriority(value);
            s.setPage(1);
          }}
          onRetry={() => void s.requestsQuery.refetch()}
          onSearchChange={s.setSearchQuery}
          onSelectRequest={s.setSelectedRequestId}
          page={s.page}
          priority={s.priority}
          searchQuery={s.searchQuery}
          selectedRequestId={s.selectedRequestId}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          {!s.selectedRequest ? (
            <SearchEmptyState
              className="h-full min-h-0 flex-1"
              description="برای مشاهده جزئیات، یک درخواست را انتخاب کنید."
              title="درخواستی انتخاب نشده است"
            />
          ) : (
            <motion.div
              className="flex min-h-0 flex-1 flex-col"
              key={s.selectedRequest.id}
              initial={s.prefersReducedMotion ? undefined : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <SupportRequestDetailHeader
                assignUserId={s.assignUserId}
                isAssignPending={s.isAssignPending}
                isStatusPending={s.isStatusPending}
                onAssignChange={s.setAssignUserId}
                onAssignSubmit={s.assignRequest}
                onCloseRequest={() => s.changeStatus("closed")}
                onStatusChange={s.changeStatus}
                selectedRequest={s.selectedRequest}
              />

              <SupportRequestConversation
                composerRef={s.chat.composerRef}
                conversationEndRef={s.chat.conversationEndRef}
                draft={s.chat.draft}
                isMessagesLoading={s.chat.isMessagesLoading}
                isSendingMessage={s.chat.isSendingMessage}
                messages={s.chat.messages}
                onDraftChange={s.chat.setDraft}
                onMessagesScroll={s.chat.handleMessagesScroll}
                onSendReply={s.chat.sendReply}
                selectedRequest={s.selectedRequest}
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
