import { useCallback, useEffect, useMemo, useState } from "react";

import { PageFrame } from "../../app/PageFrame";
import LinearArrowDown1 from "../../components/(icons)/LinearArrowDown1";
import LinearDelete from "../../components/(icons)/LinearDelete";
import LinearEdit2 from "../../components/(icons)/LinearEdit2";
import LinearRefresh from "../../components/(icons)/LinearRefresh";
import LinearRequest from "../../components/(icons)/LinearRequest";
import { AdCard, type AdCardData } from "../../components/AdCard";
import { BottomSheet } from "../../components/BottomSheet";
import { EmptyState } from "../../components/EmptyState";
import { RadioIndicator } from "../../components/RadioIndicator";
import { Snackbar, type SnackbarVariant } from "../../components/Snackbar";
import { TopBar } from "../../components/TopBar";
import {
  getCollapsedPropertyRequestDetails,
  loadPropertyRequests,
  removePropertyRequest,
  subscribePropertyRequests,
  toPersianDigits,
  updatePropertyRequestTitle,
  type PropertySearchRequest,
} from "../../services/property-request.service";
import {
  PropertyRequestResults,
  type PropertyRequestResultsStatus,
} from "./PropertyRequestResults";
import { RequestResultImageMeta } from "./RequestResultImageMeta";
import LinearCancel from "../../components/(icons)/LinearCancel";

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
  variant: SnackbarVariant;
};

const baseRequestAds: AdCardData[] = [
  {
    id: 1,
    agency: "ناصر اشرفی",
    area: "۱۱۰ متر",
    badges: [],
    imageClassName: "",
    imageCount: "۸",
    imageUrl: "/images/request-result-living-room.png",
    priceLabelPrimary: "",
    priceLabelSecondary: "",
    pricePrimary: "۳/۸۵۰ میلیارد",
    priceSecondary: "",
    rooms: "۲ اتاق",
    status: "",
    timeAndLocation: "۱ ساعت پیش در الهیه",
    title: "آپارتمان ۱۱۰ متری شمال تک واحدی سنددار رحیمی",
    year: "۱۴۰۰",
  },
  {
    id: 2,
    agency: "آژانس املاک اشرفی",
    area: "۱۷۰ متر",
    badges: [],
    imageClassName: "",
    imageCount: "۶",
    imageUrl: "/images/request-result-kitchen.png",
    priceLabelPrimary: "اجاره:",
    priceLabelSecondary: "رهن:",
    pricePrimary: "۱/۱ میلیارد",
    priceSecondary: "۷/۵ میلیون",
    rooms: "۳ اتاق",
    status: "",
    timeAndLocation: "۱ روز پیش در الهیه",
    title: "اجاره آپارتمان ابتدای هاشمیه طبقه اول ۱۷۰ متری",
    year: "۱۳۹۰",
  },
];

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
  const [requests, setRequests] = useState<PropertySearchRequest[]>(
    loadPropertyRequests,
  );
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [toast, setToast] = useState<RequestToast | null>(null);
  const [dismissedReceivedAdIds, setDismissedReceivedAdIds] = useState<Set<string>>(
    () => new Set(),
  );
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
  const filteredReceivedAds = useMemo(() => {
    const selectedAds =
      activeFilterId === "all"
        ? baseRequestAds
        : [
            baseRequestAds[
              Math.max(
                requests.findIndex((request) => request.id === activeFilterId),
                0,
              ) % baseRequestAds.length
            ],
          ];

    return selectedAds.filter((ad) => !dismissedReceivedAdIds.has(String(ad.id)));
  }, [activeFilterId, dismissedReceivedAdIds, requests]);
  const showCurrentEmptyState =
    activeTab === "requests"
      ? requests.length === 0
      : activeTab === "results"
        ? showResultsEmpty
        : filteredReceivedAds.length === 0;

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(
    () => subscribePropertyRequests(() => setRequests(loadPropertyRequests())),
    [],
  );

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
    variant: SnackbarVariant = "success",
  ) => {
    setToast({ message, title, variant });
  };

  const refreshRequests = () => {
    setRequests(loadPropertyRequests());
    setDismissedReceivedAdIds(new Set<string>());
    showToast("درخواست‌ها بروزرسانی شدند.");
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

    updatePropertyRequestTitle(editingRequest.id, nextTitle);
    setRequests((items) =>
      items.map((item) =>
        item.id === editingRequest.id ? { ...item, title: nextTitle } : item,
      ),
    );
    closeEditSheet();
    showToast("درخواست با موفقیت ویرایش شد.");
  };

  const cancelRequest = (requestId: string) => {
    removePropertyRequest(requestId);
    setRequests((items) => items.filter((item) => item.id !== requestId));
    showToast("درخواست لغو شد.");
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
            : "border-b border-[#eeeeee] bg-[#f5f5f5]"
        }
        contentClassName="px-2"
        title="درخواست‌ها"
        titleClassName="text-base font-bold leading-6"
      />

      <main
        className={`flex min-h-0 flex-1 flex-col overflow-x-hidden ${
          showCurrentEmptyState
            ? "overflow-hidden"
            : "overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
        } ${variant === "account" ? "bg-[#f0f0f0]" : "bg-[#f5f5f5]"}`}
      >
        <div className={`shrink-0 ${variant === "account" ? "bg-[#f0f0f0]" : "bg-white"}`}>
          <RequestTabs
            activeTab={activeTab}
            onChange={changeTab}
            tabs={tabs}
            variant={variant}
          />

          {activeTab !== "requests" && requests.length > 0 ? (
            <section className="border-t border-[#f0f0f0] px-4 pb-3 pt-3">
              <RequestFilterButton
                label={activeFilterLabel}
                onClick={() => setIsFilterSheetOpen(true)}
              />
            </section>
          ) : null}
        </div>

        {activeTab === "requests" ? (
          <div
            className={
              requests.length > 0
                ? "space-y-2 bg-[#f5f5f5] pt-2"
                : "min-h-0 flex-1 bg-white"
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
              />
            ) : null}
          </div>
        ) : activeTab === "results" ? (
          <div
            className={
              showResultsEmpty
                ? "min-h-0 flex-1 bg-white"
                : "space-y-2 bg-[#f5f5f5] pt-2"
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
              <EmptyRequestState
                description="پس از ثبت درخواست، نتیجه بررسی‌ها و پاسخ‌های مرتبط از اینجا نمایش داده می‌شود."
                title="هنوز نتیجه‌ای ثبت نشده است"
              />
            ) : null}
          </div>
        ) : (
          <div
            className={
              filteredReceivedAds.length > 0
                ? "space-y-2 bg-[#f5f5f5] pt-2"
                : "min-h-0 flex-1 bg-white"
            }
          >
            {filteredReceivedAds.map((ad) => (
              <RequestResultCard
                ad={ad}
                key={`received-${ad.id}`}
                onDismiss={() =>
                  setDismissedReceivedAdIds((current) => {
                    const next = new Set(current);
                    next.add(String(ad.id));
                    return next;
                  })
                }
              />
            ))}
            {filteredReceivedAds.length === 0 ? (
              <EmptyRequestState
                description="آگهی‌های مرتبط با درخواست‌های شما از اینجا نمایش داده می‌شوند."
                title="هنوز آگهی دریافتی وجود ندارد"
              />
            ) : null}
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

      {toast ? (
        <Snackbar
          className="top-[72px]"
          message={toast.message}
          onDismiss={() => setToast(null)}
          title={toast.title}
          variant={toast.variant}
        />
      ) : null}
    </PageFrame>
  );
}

function RequestTabs({
  activeTab,
  onChange,
  tabs,
  variant,
}: {
  activeTab: RequestManagementTab;
  onChange: (tab: RequestManagementTab) => void;
  tabs: RequestTabItem[];
  variant: "account" | "default";
}) {
  return (
    <section className={variant === "account" ? "px-4 py-2" : "px-4 pb-3 pt-2.5"}>
      <div
        className={`grid overflow-hidden border border-[#808080] bg-white [direction:ltr] ${
          variant === "account" ? "h-10 rounded-xl" : "h-[35px] rounded-[11px]"
        }`}
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex min-w-0 items-center justify-center border-[#d9d9d9] px-2 font-medium leading-5 transition focus-visible:z-10 focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] ${
                variant === "account" ? "text-sm" : "text-[13px]"
              } ${
                index === 0 ? "" : "border-l"
              } ${
                isActive
                  ? variant === "account"
                    ? "bg-[#dce6f7] text-[#002099]"
                    : "bg-[#eaf0ff] text-[#002099]"
                  : "bg-white text-[#4d4d4d] active:bg-[#f7f7f7]"
              }`}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              <span className="truncate">{tab.label}</span>
            </button>
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
    <button
      className="flex h-[34px] w-full items-center justify-between rounded-[10px] border border-[#cccccc] bg-white px-3 text-right text-xs font-normal leading-5 text-[#1a1a1a] transition focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f8f8f8] [direction:ltr]"
      onClick={onClick}
      type="button"
    >
      <LinearArrowDown1 className="h-4 w-4 shrink-0 text-[#a6a6a6]" />
      <span className="min-w-0 flex-1 truncate pr-3 text-right [direction:rtl]">
        {label}
      </span>
    </button>
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
          <button
            className="h-10 rounded-xl border border-[#0048c4] bg-white text-sm font-semibold leading-5 text-[#0048c4] transition focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f5f5f5]"
            onClick={onClose}
            type="button"
          >
            انصراف
          </button>
          <button
            className="h-10 rounded-xl bg-[#0048c4] text-sm font-semibold leading-5 text-white transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#003ca3]"
            type="submit"
          >
            تایید
          </button>
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
            <button
              aria-checked={isSelected}
              className="flex h-12 w-full items-center justify-between rounded-[10px] px-1 text-sm font-normal leading-5 text-[#1a1a1a] transition focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f5f5f5] [direction:ltr]"
              key={option.id}
              onClick={() => onSelect(option.id)}
              role="radio"
              type="button"
            >
              <RadioIndicator checked={isSelected} />
              <span className="min-w-0 flex-1 truncate text-right [direction:rtl]">
                {option.label}
              </span>
            </button>
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
        <button
          className="inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-lg px-0.5 font-medium leading-4 text-[#c11004] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#c1100440] active:bg-[#fff0f0]"
          onClick={onCancel}
          type="button"
        >
          <span className="text-sm font-medium">لغو</span>
          <LinearCancel className="h-4 w-4 text-[#4d4d4d]" />
        </button>

        <button
          aria-label={`ویرایش ${request.title}`}
          className="flex min-w-0 flex-1 items-center justify-end gap-1.5 rounded-lg text-right focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#0048c440] [direction:ltr]"
          onClick={onEdit}
          type="button"
        >
          <LinearEdit2 className="h-4 w-4 shrink-0 text-[#4d4d4d]" />
          <span className="min-w-0 truncate text-right font-semibold leading-5 text-[#1a1a1a] [direction:rtl]">
            {request.title}
          </span>
        </button>
      </div>

      {visibleDetails.length ? (
        <div className="mt-3 flex flex-wrap justify-start gap-2 [direction:rtl]">
          {visibleDetails.map((detail) => (
            <span
              className="inline-flex max-w-full items-center rounded-lg border border-[#CCCCCC] bg-white text-sm font-semibold leading-4 text-[#4D4D4D]"
              title={detail}
              key={detail}
            >
              <span className="max-w-full py-1.5 px-2">{detail}</span>
            </span>
          ))}
          {hiddenCount > 0 ? (
            <span className="inline-flex h-[25px] items-center rounded-[7px] border border-[#d4d4d4] bg-[#f7f7f7] px-2 text-[11px] font-medium leading-4 text-[#4d4d4d]">
              و {toPersianDigits(hiddenCount)} مورد بیشتر
            </span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function RequestResultCard({
  ad,
  onDismiss,
}: {
  ad: AdCardData;
  onDismiss: () => void;
}) {
  return (
    <AdCard
      ad={ad}
      imageAction={
        <button
          aria-label="حذف از لیست"
          className="absolute left-2 top-2 z-3 grid h-9 w-9 place-items-center rounded-[10px] bg-white text-[#4d4d4d] shadow-[0_2px_8px_rgba(0,0,0,0.12)] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f5f5f5]"
          onClick={onDismiss}
          type="button"
        >
          <LinearDelete className="h-5 w-5" />
        </button>
      }
      imageMeta={<RequestResultImageMeta imageCount={ad.imageCount} />}
      showAgency={false}
      showBadges={false}
      to={`/ads/${ad.id}`}
      variant="requestResult"
    />
  );
}

function EmptyRequestState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <EmptyState
      description={description}
      iconSrc="/vectors/NoResult.svg"
      title={title}
    />
  );
}
