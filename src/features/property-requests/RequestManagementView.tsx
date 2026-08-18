import { useCallback, useEffect, useMemo, useState } from "react";

import { getApiErrorMessage } from "../../shared/api/api";
import { PageFrame } from "../../shared/layout/PageFrame";
import LinearArrowDown1 from "../../shared/icons/LinearArrowDown1";
import LinearCancel from "../../shared/icons/LinearCancel";
import LinearCity from "../../shared/icons/LinearCity";
import LinearDelete from "../../shared/icons/LinearDelete";
import LinearEdit2 from "../../shared/icons/LinearEdit2";
import LinearInfoCircle from "../../shared/icons/LinearInfoCircle";
import LinearRefresh from "../../shared/icons/LinearRefresh";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { RadioIndicator } from "../../shared/components/RadioIndicator";
import { TopBar } from "../../shared/components/TopBar";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import {
  useDeletePropertyRequestMutation,
  usePropertyRequestsQuery,
  useRenamePropertyRequestMutation,
} from "./api/property-request.hooks";
import {
  getCollapsedPropertyRequestDetails,
  getPropertyRequestDetails,
  toPersianDigits,
  type PropertySearchRequest,
} from "./api/property-request.service";
import {
  PropertyRequestResults,
  type PropertyRequestResultsStatus,
} from "./PropertyRequestResults";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

type RequestManagementTab = "received" | "requests" | "results";
type RequestFilterId = "all" | string;

type RequestManagementViewProps = {
  backTo: string;
  showReceivedTab?: boolean;
  variant?: "account" | "default";
};

type RequestTabItem = {
  id: RequestManagementTab;
  label: string;
};

type RequestFilterOption = {
  id: RequestFilterId;
  label: string;
};

type RequestToast = {
  message: string;
  title: string;
  variant: "error" | "success" | "info" | "warning";
};

const receivedRequestsGuideStorageKey =
  "bonga-received-requests-guide-dismissed";

function getRequestCreatedAt(request: PropertySearchRequest) {
  const createdAt = new Date(request.createdAt);

  return Number.isNaN(createdAt.getTime()) ? null : createdAt;
}

function isReceivedRequestNew(request: PropertySearchRequest) {
  if (request.isNew) return true;

  const createdAt = getRequestCreatedAt(request);
  if (!createdAt) return false;

  const age = Date.now() - createdAt.getTime();
  return age >= 0 && age < 24 * 60 * 60 * 1000;
}

function formatReceivedRequestDate(request: PropertySearchRequest) {
  const createdAt = getRequestCreatedAt(request);
  if (!createdAt) return "";

  const age = Math.max(0, Date.now() - createdAt.getTime());
  const hours = Math.floor(age / (60 * 60 * 1000));
  const days = Math.floor(age / (24 * 60 * 60 * 1000));

  if (hours < 1) return "امروز";
  if (hours < 24) return `${toPersianDigits(hours)} ساعت پیش`;
  if (days < 7) return `${toPersianDigits(days)} روز پیش`;
  if (days < 14) return "هفته پیش";

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(createdAt)
    .replace(/[\u200e\u200f]/g, "");
}

function getReceivedRequestDetailPriority(detail: string) {
  if (detail.includes("خوابه") || detail === "بدون اتاق") return 0;
  if (detail.startsWith("سال ساخت")) return 1;
  if (
    detail.startsWith("قیمت") ||
    detail.startsWith("رهن") ||
    detail.startsWith("اجاره")
  ) {
    return 2;
  }
  if (detail.startsWith("متراژ")) return 3;
  if (detail.startsWith("محله")) return 4;
  return 5;
}

function getReceivedRequestDetails(
  request: PropertySearchRequest,
  maxVisibleItems = 6,
) {
  const details = getPropertyRequestDetails(request)
    .map((detail, index) => ({ detail, index }))
    .sort(
      (left, right) =>
        getReceivedRequestDetailPriority(left.detail) -
          getReceivedRequestDetailPriority(right.detail) ||
        left.index - right.index,
    )
    .map(({ detail }) => detail);
  const safeMaxVisibleItems = Math.max(1, Math.floor(maxVisibleItems));

  if (details.length <= safeMaxVisibleItems) {
    return { hiddenCount: 0, visibleDetails: details };
  }

  const visibleDetailCount = Math.max(0, safeMaxVisibleItems - 1);

  return {
    hiddenCount: details.length - visibleDetailCount,
    visibleDetails: details.slice(0, visibleDetailCount),
  };
}

function getTabs(showReceivedTab: boolean): RequestTabItem[] {
  return showReceivedTab
    ? [
        { id: "results", label: "نتایج" },
        { id: "requests", label: "درخواست‌ها" },
        { id: "received", label: "دریافتی‌ها" },
      ]
    : [
        { id: "results", label: "نتایج" },
        { id: "requests", label: "درخواست‌ها" },
      ];
}

function getInitialRequestTab(showReceivedTab: boolean): RequestManagementTab {
  const requestedTab = new URLSearchParams(window.location.search).get("tab");

  if (requestedTab === "results" || requestedTab === "requests") {
    return requestedTab;
  }
  if (requestedTab === "received" && showReceivedTab) return "received";

  return showReceivedTab ? "results" : "requests";
}

function getRequestFilterOptions(
  requests: PropertySearchRequest[],
): RequestFilterOption[] {
  return [
    { id: "all", label: "همه" },
    ...requests.map((request) => ({ id: request.id, label: request.title })),
  ];
}

export function RequestManagementView({
  backTo,
  showReceivedTab = false,
  variant = "default",
}: RequestManagementViewProps) {
  const [activeTab, setActiveTab] = useState<RequestManagementTab>(() =>
    getInitialRequestTab(showReceivedTab),
  );
  const [filters, setFilters] = useState<Record<RequestManagementTab, RequestFilterId>>({
    received: "all",
    requests: "all",
    results: "all",
  });
  const requestsQuery = usePropertyRequestsQuery(1, 20);
  const renameRequestMutation = useRenamePropertyRequestMutation();
  const deleteRequestMutation = useDeletePropertyRequestMutation();
  const requests = useMemo(
    () => requestsQuery.data?.data ?? [],
    [requestsQuery.data?.data],
  );
  const requestLoadState = requestsQuery.isLoading
    ? {
        description: "در حال دریافت درخواست‌های شما هستیم.",
        title: "در حال بارگذاری درخواست‌ها",
      }
    : requestsQuery.isError
      ? {
          description: getApiErrorMessage(
            requestsQuery.error,
            "دریافت درخواست‌ها با خطا مواجه شد. از دکمه بروزرسانی استفاده کنید.",
          ),
          title: "دریافت درخواست‌ها ناموفق بود",
        }
      : null;
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [toast, setToast] = useState<RequestToast | null>(null);
  const [dismissedReceivedRequestIds, setDismissedReceivedRequestIds] = useState<
    Set<string>
  >(() => new Set());
  const [isReceivedGuideVisible, setIsReceivedGuideVisible] = useState(() => {
    try {
      return (
        window.sessionStorage.getItem(receivedRequestsGuideStorageKey) !== "1"
      );
    } catch {
      return true;
    }
  });
  const [resultStatuses, setResultStatuses] = useState<
    Record<string, PropertyRequestResultsStatus>
  >({});
  const tabs = useMemo(() => getTabs(showReceivedTab), [showReceivedTab]);
  const requestFilterOptions = useMemo(
    () => getRequestFilterOptions(requests),
    [requests],
  );
  const activeFilterId = filters[activeTab];
  const activeFilterLabel =
    requestFilterOptions.find((option) => option.id === activeFilterId)?.label ??
    requestFilterOptions[0]?.label ??
    "همه";
  const editingRequest =
    requests.find((request) => request.id === editingRequestId) ?? null;
  const filteredRequests = useMemo(
    () =>
      activeFilterId === "all"
        ? requests
        : requests.filter((request) => request.id === activeFilterId),
    [activeFilterId, requests],
  );
  const resultsAreSettled =
    filteredRequests.length > 0 &&
    filteredRequests.every((request) => {
      const status = resultStatuses[request.id];
      return Boolean(status && !status.isLoading);
    });
  const hasVisibleResults = filteredRequests.some(
    (request) => (resultStatuses[request.id]?.visibleCount ?? 0) > 0,
  );
  const hasResultErrors = filteredRequests.some(
    (request) => resultStatuses[request.id]?.isError,
  );
  const showResultsEmpty =
    filteredRequests.length === 0 ||
    (resultsAreSettled && !hasVisibleResults && !hasResultErrors);
  const handleResultStatusChange = useCallback(
    (status: PropertyRequestResultsStatus) => {
      setResultStatuses((current) => {
        const previous = current[status.requestId];

        if (
          previous &&
          previous.isError === status.isError &&
          previous.isLoading === status.isLoading &&
          previous.visibleCount === status.visibleCount
        ) {
          return current;
        }

        return { ...current, [status.requestId]: status };
      });
    },
    [],
  );
  const receivedRequests = useMemo(
    () =>
      requests.filter(
        (request) => !dismissedReceivedRequestIds.has(String(request.id)),
      ),
    [dismissedReceivedRequestIds, requests],
  );
  const hasNewReceivedRequests = receivedRequests.some(isReceivedRequestNew);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setResultStatuses({});
  }, [filteredRequests]);

  useEffect(() => {
    if (
      activeFilterId === "all" ||
      requests.some((request) => request.id === activeFilterId)
    ) {
      return;
    }

    setFilters((current) => ({ ...current, [activeTab]: "all" }));
  }, [activeFilterId, activeTab, requests]);

  const showToast = (
    message: string,
    title = "موفق",
    variant: "error" | "success" | "info" | "warning" = "success",
  ) => {
    setToast({ message, title, variant });
  };

  const refreshRequests = () => {
    setDismissedReceivedRequestIds(new Set<string>());

    void requestsQuery.refetch().then((result) => {
      if (result.isError) {
        showToast(
          getApiErrorMessage(result.error, "بروزرسانی درخواست‌ها با خطا مواجه شد."),
          "خطا",
          "error",
        );
        return;
      }

      showToast("درخواست‌ها بروزرسانی شدند.");
    });
  };

  const changeTab = (tab: RequestManagementTab) => {
    setActiveTab(tab);
    setIsFilterSheetOpen(false);

    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    const query = params.toString();
    window.history.replaceState(
      window.history.state ?? {},
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
  };

  const openEditSheet = (request: PropertySearchRequest) => {
    setEditingRequestId(request.id);
    setEditTitle(request.title);
  };

  const closeEditSheet = () => {
    setEditingRequestId(null);
    setEditTitle("");
  };

  const confirmEdit = () => {
    const nextTitle = editTitle.trim();

    if (!editingRequest || !nextTitle) {
      showToast("عنوان درخواست را وارد کنید.", "خطا", "error");
      return;
    }

    if (renameRequestMutation.isPending) return;

    renameRequestMutation.mutate(
      { id: editingRequest.id, name: nextTitle },
      {
        onError: (error) => {
          showToast(
            getApiErrorMessage(error, "ویرایش درخواست با خطا مواجه شد."),
            "خطا",
            "error",
          );
        },
        onSuccess: () => {
          closeEditSheet();
          showToast("درخواست با موفقیت ویرایش شد.");
        },
      },
    );
  };

  const cancelRequest = (requestId: string) => {
    if (deleteRequestMutation.isPending) return;

    deleteRequestMutation.mutate(requestId, {
      onError: (error) => {
        showToast(
          getApiErrorMessage(error, "لغو درخواست با خطا مواجه شد."),
          "خطا",
          "error",
        );
      },
      onSuccess: () => {
        showToast("درخواست لغو شد.");
      },
    });
  };

  const deleteReceivedRequest = (requestId: string) => {
    if (deleteRequestMutation.isPending) return;

    setDismissedReceivedRequestIds((current) => {
      const next = new Set(current);
      next.add(requestId);
      return next;
    });

    deleteRequestMutation.mutate(requestId, {
      onError: (error) => {
        setDismissedReceivedRequestIds((current) => {
          const next = new Set(current);
          next.delete(requestId);
          return next;
        });
        showToast(
          getApiErrorMessage(error, "حذف درخواست دریافتی با خطا مواجه شد."),
          "خطا",
          "error",
        );
      },
      onSuccess: () => {
        showToast("درخواست دریافتی حذف شد.");
      },
    });
  };

  const dismissReceivedGuide = () => {
    setIsReceivedGuideVisible(false);

    try {
      window.sessionStorage.setItem(receivedRequestsGuideStorageKey, "1");
    } catch {
      // The guide can still close when browser storage is unavailable.
    }
  };

  return (
    <PageFrame
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <LinearRefresh className="h-6 w-6" />,
            id: "refresh-requests",
            label: "بروزرسانی درخواست‌ها",
            onClick: refreshRequests,
          },
        ]}
        backTo={backTo}
        className={
          variant === "account"
            ? "border-b border-[#e8e8e8] bg-[#f0f0f0]"
            : "bg-[#f0f0f0]"
        }
        contentClassName="px-2"
        heightClassName={variant === "account" ? "h-14" : "h-12"}
        centerSlot={
          <Typography
            as="h1"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 truncate text-right text-[#1a1a1a]"
          >
            درخواست‌ها
          </Typography>
        }
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
        <div className={variant === "account" ? "bg-[#f0f0f0]" : "bg-white"}>
          <RequestTabs
            activeTab={activeTab}
            hasReceivedIndicator={hasNewReceivedRequests}
            onChange={changeTab}
            tabs={tabs}
            variant={variant}
          />

          {activeTab === "results" && requests.length > 0 ? (
            <section className="border-t border-[#f0f0f0] px-4 pb-3 pt-3">
              <RequestFilterButton
                label={activeFilterLabel}
                onClick={() => setIsFilterSheetOpen(true)}
              />
            </section>
          ) : null}
        </div>

        {activeTab === "requests" ? (
          requestLoadState ? (
            <EmptyRequestState
              description={requestLoadState.description}
              title={requestLoadState.title}
              variant={variant}
            />
          ) : (
            <div
              className={
                requests.length > 0
                  ? "space-y-2 bg-[#f5f5f5]"
                  : "bg-white"
              }
            >
              {requests.map((request) => (
                <CriteriaRequestCard
                  key={request.id}
                  onCancel={() => cancelRequest(request.id)}
                  onEdit={() => openEditSheet(request)}
                  request={request}
                />
              ))}
              {requests.length === 0 ? (
                <EmptyRequestState
                  description="پس از ثبت درخواست، اینجا نمایش داده می‌شود."
                  title="هنوز درخواستی ثبت نشده است"
                  variant={variant}
                />
              ) : null}
            </div>
          )
        ) : activeTab === "results" ? (
          requestLoadState ? (
            <EmptyRequestState
              description={requestLoadState.description}
              title={requestLoadState.title}
              variant={variant}
            />
          ) : (
            <div
              className={
                showResultsEmpty
                  ? "bg-white"
                  : "space-y-2 bg-[#f5f5f5]"
              }
            >
              {filteredRequests.map((request) => (
                <PropertyRequestResults
                  bare
                  className="bg-white pb-5"
                  compact
                  hideWhenEmpty
                  key={request.id}
                  maxResults={4}
                  onStatusChange={handleResultStatusChange}
                  request={request}
                  showDismissAction
                  showHeading={false}
                />
              ))}
              {showResultsEmpty ? (
                activeFilterId !== "all" ? (
                  <SearchEmptyState />
                ) : (
                  <EmptyRequestState
                    description="پس از ثبت درخواست، نتیجه بررسی‌ها و پاسخ‌های مرتبط از اینجا نمایش داده می‌شود."
                    title="هنوز نتیجه‌ای ثبت نشده است"
                    variant={variant}
                  />
                )
              ) : null}
            </div>
          )
        ) : (
          <div className="bg-[#f0f0f0]">
            {isReceivedGuideVisible ? (
              <ReceivedRequestsGuide onClose={dismissReceivedGuide} />
            ) : null}

            {requestsQuery.isLoading ? (
              <ReceivedRequestsSkeleton />
            ) : requestsQuery.isError ? (
              <EmptyRequestState
                description={
                  requestLoadState?.description ??
                  "دریافت درخواست‌های دریافتی با خطا مواجه شد."
                }
                title={requestLoadState?.title ?? "دریافت درخواست‌ها ناموفق بود"}
                variant={variant}
              />
            ) : receivedRequests.length > 0 ? (
              <div aria-label="درخواست‌های دریافتی">
                {receivedRequests.map((request) => (
                  <ReceivedRequestCard
                    isNew={isReceivedRequestNew(request)}
                    key={`received-${request.id}`}
                    onDelete={() => deleteReceivedRequest(request.id)}
                    request={request}
                  />
                ))}
              </div>
            ) : (
              <EmptyRequestState
                description="درخواست‌های ملکی کاربران که برای آژانس شما ارسال شده‌اند، اینجا نمایش داده می‌شوند."
                title="هنوز درخواست دریافتی وجود ندارد"
                variant={variant}
              />
            )}
          </div>
        )}
      </main>

      <RequestEditBottomSheet
        isOpen={Boolean(editingRequest)}
        onClose={closeEditSheet}
        onConfirm={confirmEdit}
        onValueChange={setEditTitle}
        value={editTitle}
      />

      <RequestFilterBottomSheet
        activeFilterId={activeFilterId}
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        onSelect={(filterId) => {
          setFilters((current) => ({ ...current, [activeTab]: filterId }));
          setIsFilterSheetOpen(false);
        }}
        options={requestFilterOptions}
      />

    </PageFrame>
  );
}

function RequestTabs({
  activeTab,
  hasReceivedIndicator,
  onChange,
  tabs,
  variant,
}: {
  activeTab: RequestManagementTab;
  hasReceivedIndicator: boolean;
  onChange: (tab: RequestManagementTab) => void;
  tabs: RequestTabItem[];
  variant: "account" | "default";
}) {
  return (
    <section className={variant === "account" ? "px-4 py-2" : "bg-[#f5f5f5] px-4 py-4"}>
      <div
        className={`grid overflow-hidden border border-[#808080] bg-white [direction:ltr] ${
          variant === "account"
            ? "h-10 rounded-xl"
            : "h-10 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
        }`}
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;

          return (
            <Button unstyled
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex min-w-0 items-center justify-center border-[#d9d9d9] px-2 leading-5 transition focus-visible:z-10 focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] ${
                variant === "account"
                  ? "text-sm font-medium"
                  : "text-base font-semibold"
              } ${
                index === 0 ? "" : "border-l"
              } ${
                isActive
                  ? variant === "account"
                    ? "bg-[#dce6f7] text-[#002099]"
                    : "bg-[#dce6f7] text-[#002099]"
                  : "bg-white text-[#4d4d4d] active:bg-[#f7f7f7]"
              }`}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              <Typography as="span" variant="body" size="medium" weight="regular" className="inline-flex min-w-0 items-center justify-center gap-1 [direction:ltr]">
                {tab.id === "received" && hasReceivedIndicator ? (
                  <Typography as="span" variant="body" size="medium" weight="regular"
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ef3326]"
                  />
                ) : null}
                <Typography as="span" variant="label" size="large" weight="medium" className="[direction:rtl]">{tab.label}</Typography>
              </Typography>
            </Button>
          );
        })}
      </div>
    </section>
  );
}

function RequestFilterButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button unstyled
      className="flex h-[34px] w-full items-center justify-between rounded-[10px] border border-[#cccccc] bg-white px-3 text-right text-xs font-normal leading-5 text-[#1a1a1a] transition focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f8f8f8] [direction:ltr]"
      onClick={onClick}
      type="button"
    >
      <LinearArrowDown1 className="h-4 w-4 shrink-0 text-[#a6a6a6]" />
      <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1 truncate pr-3 text-right [direction:rtl]">
        {label}
      </Typography>
    </Button>
  );
}

function RequestEditBottomSheet({
  isOpen,
  onClose,
  onConfirm,
  onValueChange,
  value,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onValueChange: (value: string) => void;
  value: string;
}) {
  return (
    <BottomSheet
      ariaLabel="ویرایش درخواست"
      contentClassName="px-4 pb-4"
      heightClassName="h-auto pb-[max(0.25rem,env(safe-area-inset-bottom,0px))]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-4"
      showHandle={false}
      showHeader={false}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm();
        }}
      >
        <input
          aria-label="نام درخواست"
          autoFocus
          className="h-14 w-full rounded-xl border-2 border-[#0048c4] bg-white px-3 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none transition placeholder:text-[#a6a6a6] focus:ring-3 focus:ring-[#0048c424]"
          onChange={(event) => onValueChange(event.target.value)}
          placeholder="نام درخواست"
          type="text"
          value={value}
        />

        <div className="grid grid-cols-2 gap-4">
          <Button unstyled
            className="h-10 rounded-xl border border-[#0048c4] bg-white text-sm font-semibold leading-5 text-[#0048c4] transition focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f5f5f5]"
            onClick={onClose}
            type="button"
          >
            انصراف
          </Button>
          <Button unstyled
            className="h-10 rounded-xl bg-[#0048c4] text-sm font-semibold leading-5 text-white transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#003ca3]"
            type="submit"
          >
            تایید
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
}

function RequestFilterBottomSheet({
  activeFilterId,
  isOpen,
  onClose,
  onSelect,
  options,
}: {
  activeFilterId: RequestFilterId;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (filterId: RequestFilterId) => void;
  options: RequestFilterOption[];
}) {
  return (
    <BottomSheet
      ariaLabel="انتخاب درخواست"
      contentClassName="px-4 pt-4"
      heightClassName="h-auto max-h-[80dvh] pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      showHeaderDivider={false}
      title="انتخاب درخواست"
      titleAlign="center"
    >
      <div
        aria-label="انتخاب درخواست"
        className="max-h-[60dvh] space-y-1 overflow-y-auto"
        role="radiogroup"
      >
        {options.map((option) => {
          const isSelected = activeFilterId === option.id;

          return (
            <Button unstyled
              aria-checked={isSelected}
              className="flex h-12 w-full items-center justify-between rounded-[10px] px-1 text-sm font-normal leading-5 text-[#1a1a1a] transition focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f5f5f5] [direction:ltr]"
              key={option.id}
              onClick={() => onSelect(option.id)}
              role="radio"
              type="button"
            >
              <RadioIndicator checked={isSelected} />
              <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1 truncate text-right [direction:rtl]">
                {option.label}
              </Typography>
            </Button>
          );
        })}
      </div>
    </BottomSheet>
  );
}

function CriteriaRequestCard({
  onCancel,
  onEdit,
  request,
}: {
  onCancel: () => void;
  onEdit: () => void;
  request: PropertySearchRequest;
}) {
  const { hiddenCount, visibleDetails } = getCollapsedPropertyRequestDetails(
    request,
    6,
  );

  return (
    <article className="min-h-[148px] overflow-hidden bg-white p-4 text-right">
      <div className="flex min-h-7 items-center justify-between gap-3 [direction:ltr]">
        <Button unstyled
          className="inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-lg px-0.5 font-medium leading-4 text-[#c11004] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#c1100440] active:bg-[#fff0f0]"
          onClick={onCancel}
          type="button"
        >
          <Typography as="span" variant="label" size="medium" weight="medium">لغو</Typography>
          <LinearCancel className="h-5 w-5 text-[#4d4d4d]" />
        </Button>

        <Button unstyled
          aria-label={`ویرایش ${request.title}`}
          className="flex min-w-0 flex-1 items-center justify-end gap-1.5 rounded-lg text-right focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#0048c440] [direction:ltr]"
          onClick={onEdit}
          type="button"
        >
          <LinearEdit2 className="h-4 w-4 text-[#4d4d4d]" />
          <Typography as="span" variant="title" size="medium" weight="semibold" className="text-right text-[#1a1a1a] [direction:rtl]">
            {request.title}
          </Typography>
        </Button>
      </div>

      {visibleDetails.length ? (
        <div className="mt-3 flex flex-wrap justify-start gap-2 [direction:rtl]">
          {visibleDetails.map((detail) => (
            <Typography as="span" variant="label" size="medium" weight="semibold"
              className="inline-flex max-w-full items-center rounded-lg border border-[#CCCCCC] bg-white text-sm font-semibold leading-4 text-[#4D4D4D]"
              title={detail}
              key={detail}
            >
              <Typography as="span" variant="label" size="medium" weight="semibold" className="py-1.5 px-2">{detail}</Typography>
            </Typography>
          ))}
          {hiddenCount > 0 ? (
            <Typography as="span" variant="label" size="small" weight="medium" className="inline-flex h-[25px] items-center rounded-[7px] border border-[#d4d4d4] bg-[#f7f7f7] px-2 text-[11px] font-medium leading-4 text-[#4d4d4d]">
              و {toPersianDigits(hiddenCount)} مورد بیشتر
            </Typography>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function ReceivedRequestsGuide({ onClose }: { onClose: () => void }) {
  return (
    <section className="border-b-8 border-[#f0f0f0] bg-white px-4 py-4">
      <div className="rounded-2xl bg-[#eaf1ff] px-4 pb-4 pt-5 text-[#0054c8]">
        <div className="flex items-center justify-between [direction:ltr]">
          <Button unstyled
            aria-label="بستن راهنما"
            className="grid h-8 w-8 place-items-center rounded-full text-[#4d4d4d] transition focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-white/60"
            onClick={onClose}
            type="button"
          >
            <LinearCancel className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 text-[#0054c8] [direction:rtl]">
            <LinearInfoCircle className="h-6 w-6 shrink-0" />
            <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6">راهنما</Typography>
          </div>
        </div>

        <Typography as="p" variant="body" size="large" weight="regular" className="m-0 mt-3 text-right text-[15px] font-normal leading-7 [direction:rtl]">
          در این بخش، درخواست‌های ملکی کاربران نمایش داده می‌شود. شما می‌توانید
          براساس نیازهای اعلام‌شده، ملک مناسب را پیدا کرده و فایل مرتبط را برای
          مشتری منتشر کنید. این بخش به شما کمک می‌کند سریع‌تر و دقیق‌تر نیاز
          مشتری را برطرف کنید.
        </Typography>
      </div>
    </section>
  );
}

function ReceivedRequestCard({
  isNew,
  onDelete,
  request,
}: {
  isNew: boolean;
  onDelete: () => void;
  request: PropertySearchRequest;
}) {
  const { hiddenCount, visibleDetails } = getReceivedRequestDetails(request, 6);
  const requestDate = formatReceivedRequestDate(request);

  return (
    <article className="relative border-b-8 border-[#f0f0f0] bg-white px-4 pb-6 pt-7 text-right">
      {isNew ? (
        <Typography as="span" variant="label" size="small" weight="medium" className="absolute left-4 top-2 inline-flex h-6 items-center rounded-full bg-[#ef3326] px-2.5 text-xs font-medium leading-6 text-white">
          جدید
        </Typography>
      ) : null}

      <div className="flex items-start justify-between gap-4 [direction:ltr]">
        <Button unstyled
          aria-label={`حذف ${request.title}`}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[#4d4d4d] transition focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f5f5f5]"
          onClick={onDelete}
          type="button"
        >
          <LinearDelete className="h-6 w-6" />
        </Button>

        <div className="min-w-0 flex-1 [direction:rtl]">
          <div className="flex min-h-10 flex-wrap items-center gap-2">
            <LinearCity className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
            <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 min-w-0 text-[17px] font-bold leading-7 text-[#1a1a1a]">
              {request.title}
            </Typography>
            {requestDate ? (
              <time
                className="inline-flex h-8 shrink-0 items-center rounded-[10px] bg-[#f5f5f5] px-3 text-xs font-normal leading-5 text-[#1a1a1a]"
                dateTime={request.createdAt}
              >
                {requestDate}
              </time>
            ) : null}
          </div>

          {visibleDetails.length ? (
            <div className="mt-3 flex flex-wrap justify-start gap-2 [direction:rtl]">
              {visibleDetails.map((detail) => (
                <Typography as="span" variant="label" size="medium" weight="semibold"
                  className="inline-flex max-w-full items-center rounded-[9px] border border-[#cccccc] bg-white px-2.5 py-1.5 text-sm font-semibold leading-5 text-[#4d4d4d]"
                  key={detail}
                  title={detail}
                >
                  {detail}
                </Typography>
              ))}
              {hiddenCount > 0 ? (
                <Typography as="span" variant="label" size="small" weight="medium" className="inline-flex items-center rounded-[9px] border border-[#cccccc] bg-[#f7f7f7] px-2.5 py-1.5 text-xs font-medium leading-5 text-[#4d4d4d]">
                  و {toPersianDigits(hiddenCount)} مورد بیشتر
                </Typography>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ReceivedRequestsSkeleton() {
  return (
    <div aria-label="در حال بارگذاری درخواست‌های دریافتی" aria-live="polite">
      {Array.from({ length: 3 }, (_, index) => (
        <article
          className="border-b-8 border-[#f0f0f0] bg-white px-4 pb-6 pt-7"
          key={index}
        >
          <div className="flex items-start justify-between gap-4 [direction:ltr]">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-[#eeeeee]" />
            <div className="min-w-0 flex-1 [direction:rtl]">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 shrink-0 animate-pulse rounded bg-[#eeeeee]" />
                <div className="h-6 w-36 animate-pulse rounded bg-[#eeeeee]" />
                <div className="h-8 w-16 animate-pulse rounded-[10px] bg-[#f1f1f1]" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="h-8 w-24 animate-pulse rounded-[9px] bg-[#eeeeee]" />
                <div className="h-8 w-32 animate-pulse rounded-[9px] bg-[#eeeeee]" />
                <div className="h-8 w-28 animate-pulse rounded-[9px] bg-[#eeeeee]" />
                <div className="h-8 w-40 animate-pulse rounded-[9px] bg-[#eeeeee]" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function EmptyRequestState({
  description,
  title,
  variant,
}: {
  description: string;
  title: string;
  variant: "account" | "default";
}) {
  const isAccount = variant === "account";

  return (
    <section
      className={`mx-auto flex w-full flex-col items-center justify-center bg-white text-center ${
        isAccount
          ? "min-h-[calc(100dvh-112px)] px-5 pb-10"
          : "min-h-[calc(100dvh-183px)] px-8 pb-16"
      }`}
    >
      <img
        src="/vectors/NoRequest.svg"
        className="h-16.5 w-16.5"
        alt=""
        aria-hidden="true"
      />
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold mt-4 text-[#1a1a1a]">
        {title}
      </Typography>
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 max-w-[320px] text-sm font-normal text-[#4d4d4d]">
        {description}
      </Typography>
    </section>
  );
}
