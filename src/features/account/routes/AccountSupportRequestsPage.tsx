import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSupportRequests } from "../../support/api/support-request.service";
import { getRequestErrorState } from "../../../shared/components/ErrorState";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearAdd from "../../../shared/icons/LinearAdd";
import { NEW_REQUEST_PATH, SUPPORT_PATH, SupportRequestCard, SupportRequestTabs, SupportRequestsEmptyState, mapSupportRequest } from "../accountSupportRequestViews";
import type { SupportRequestFilter } from "../accountSupportRequestViews";
import { Typography } from "../../../shared/ui/Typography";

export function AccountSupportRequestsPage() {
  const [activeFilter, setActiveFilter] = useState<SupportRequestFilter>("all");
  const requestsQuery = useQuery({
    queryFn: () => getSupportRequests({ page: 1, perPage: 100 }),
    queryKey: ["support-requests", "account"],
  });
  const requests = useMemo(
    () => (requestsQuery.data?.data ?? []).map(mapSupportRequest),
    [requestsQuery.data?.data],
  );
  const filteredRequests = useMemo(
    () =>
      activeFilter === "all"
        ? requests
        : requests.filter((request) => request.status === activeFilter),
    [activeFilter, requests],
  );
  const RequestErrorState = requestsQuery.isError
    ? getRequestErrorState(requestsQuery.error)
    : null;

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <TopBar
        backTo={SUPPORT_PATH}
        className="border-b border-[#e6e6e6]"
        heightClassName="h-[52px]"
       
        reserveStartSpace
        title="درخواست‌های من"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <SupportRequestTabs
        activeFilter={activeFilter}
        onChange={setActiveFilter}
      />

      <main
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto bg-white px-3 pb-[76px] ${
          requests.length === 0 ? "pt-0" : "pt-3"
        }`}
      >
        {requestsQuery.isLoading ? (
          <Typography as="p" variant="body" size="medium" weight="regular" className="w-full py-16 text-center text-sm text-[#808080]">در حال دریافت درخواست‌ها...</Typography>
        ) : RequestErrorState ? (
          <RequestErrorState onRetry={() => void requestsQuery.refetch()} />
        ) : requests.length === 0 ? (
          <SupportRequestsEmptyState />
        ) : (
          <>
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <SupportRequestCard key={request.id} request={request} />
              ))}
            </div>

            {filteredRequests.length === 0 ? (
              <SearchEmptyState description="فیلتر وضعیت را تغییر دهید و دوباره تلاش کنید." />
            ) : null}
          </>
        )}
      </main>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-white px-3 pb-2.5 pt-2">
        <RouteLink
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0759cf] px-4 text-sm font-semibold leading-5 text-white no-underline outline-none active:bg-[#0048b5] focus-visible:ring-3 focus-visible:ring-[#0759cf40]"
          to={NEW_REQUEST_PATH}
        >
          <LinearAdd className="h-4.5 w-4.5" />
          <Typography as="span" variant="body" size="medium" weight="regular">ایجاد درخواست جدید</Typography>
        </RouteLink>
      </div>
    </PageFrame>
  );
}
