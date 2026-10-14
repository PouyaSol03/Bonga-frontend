import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSupportRequests } from "../../support/api/support-request.service";
import { getRequestErrorState } from "../../../shared/components/ErrorState";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { Link } from "react-router";
import LinearAdd from "../../../shared/icons/LinearAdd";
import {
  NEW_REQUEST_PATH,
  SUPPORT_PATH,
  SupportRequestCard,
  SupportRequestTabs,
  SupportRequestsEmptyState,
  mapSupportRequest, type SupportRequestFilter 
} from "../accountSupportRequestViews";

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
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden"
      variant="flush"
    >
      <TopBar
        backTo={SUPPORT_PATH}
        className="border-outline-var border-b"
        heightClassName="h-[52px]"

        reserveStartSpace
        title="درخواست‌های من"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <SupportRequestTabs activeFilter={activeFilter} onChange={setActiveFilter} />

      <main
        className={`bg-surface-container-lowest flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-[76px] ${
          requests.length === 0 ? "pt-0" : "pt-3"
        }`}
      >
        {requestsQuery.isLoading ? (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-outline w-full py-16 text-center text-sm"
          >
            در حال دریافت درخواست‌ها...
          </Typography>
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

      <div className="bg-surface-container-lowest absolute inset-x-0 bottom-0 z-20 px-3 pt-2 pb-2.5">
        <Link
          className="bg-primary text-on-primary focus-visible:ring-primary/20 flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm leading-5 font-semibold no-underline outline-none focus-visible:ring-3 active:opacity-80"
          to={NEW_REQUEST_PATH}
        >
          <LinearAdd className="h-4.5 w-4.5" />
          <Typography as="span" variant="body" size="medium" weight="regular">
            ایجاد درخواست جدید
          </Typography>
        </Link>
      </div>
    </PageFrame>
  );
}
