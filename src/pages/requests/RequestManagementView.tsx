import { useEffect, useMemo, useState, type ReactNode } from "react";

import { PageFrame } from "../../app/PageFrame";
import Linear3d from "../../components/(icons)/Linear3d";
import LinearArrowDown1 from "../../components/(icons)/LinearArrowDown1";
import LinearCancelSmall from "../../components/(icons)/LinearCancelSmall";
import LinearDelete from "../../components/(icons)/LinearDelete";
import LinearEdit2 from "../../components/(icons)/LinearEdit2";
import LinearImage from "../../components/(icons)/LinearImage";
import LinearRefresh from "../../components/(icons)/LinearRefresh";
import LinearVideo from "../../components/(icons)/LinearVideo";
import { AdCard, type AdCardData } from "../../components/AdCard";
import { BottomSheet } from "../../components/BottomSheet";
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
import { PropertyRequestResults } from "./PropertyRequestResults";

type RequestManagementTab = "received" | "requests" | "results";
type RequestFilterId = "all" | string;

type RequestManagementViewProps = {
  backTo: string;
  showReceivedTab?: boolean;
};

type RequestTabItem = {
  id: RequestManagementTab;
  label: string;
  showDot?: boolean;
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
    badges: ["جدید"],
    imageClassName: "ad-card__image--one",
    imageCount: "۵",
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
    badges: ["فوری", "بروزرسانی"],
    imageClassName: "ad-card__image--two",
    imageCount: "۵",
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
        { id: "results", label: "نتایج", showDot: true },
        { id: "requests", label: "درخواست‌ها" },
        { id: "received", label: "دریافت‌ها", showDot: true },
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

  return showReceivedTab ? "received" : "requests";
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
  const filteredReceivedAds = useMemo(() => {
    if (activeFilterId === "all") return baseRequestAds;

    const requestIndex = Math.max(
      requests.findIndex((request) => request.id === activeFilterId),
      0,
    );
    return [baseRequestAds[requestIndex % baseRequestAds.length]];
  }, [activeFilterId, requests]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() =>
    subscribePropertyRequests(() => setRequests(loadPropertyRequests())),
  []);

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
    showToast("درخواست‌ها بروزرسانی شدند.");
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
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-[#f5f5f5] text-[#1a1a1a] [direction:rtl]"
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
        className="bg-[#f0f0f0]"
        contentClassName="px-1"
        title="درخواست‌ها"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f5f5f5] pb-6">
        <RequestTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />

        {activeTab === "results" && requests.length > 0 && !showReceivedTab ? (
          <RequestFilterChips
            activeFilterId={activeFilterId}
            onSelect={(filterId) =>
              setFilters((current) => ({ ...current, results: filterId }))
            }
            options={requestFilterOptions}
          />
        ) : activeTab !== "requests" && requests.length > 0 ? (
          <section className="px-4 pt-3">
            <RequestFilterButton
              label={activeFilterLabel}
              onClick={() => setIsFilterSheetOpen(true)}
            />
          </section>
        ) : null}

        {activeTab === "requests" ? (
          <div className="space-y-2 bg-[#f5f5f5] pt-3">
            {requests.map((request) => (
              <CriteriaRequestCard
                key={request.id}
                onCancel={() => cancelRequest(request.id)}
                onEdit={() => openEditSheet(request)}
                request={request}
              />
            ))}
            {requests.length === 0 ? (
              <EmptyRequestState text="درخواستی ثبت نشده است" />
            ) : null}
          </div>
        ) : activeTab === "results" ? (
          <div className="space-y-2 bg-[#f5f5f5] pb-2 pt-2">
            {filteredRequests.map((request) => (
              <PropertyRequestResults
                bare
                className="bg-white px-4 py-4"
                compact
                key={request.id}
                maxResults={4}
                request={request}
                showDismissAction
                showHeading={false}
              />
            ))}
            {filteredRequests.length === 0 ? (
              <EmptyRequestState text="نتیجه ای برای این درخواست وجود ندارد" />
            ) : null}
          </div>
        ) : (
          <div className="space-y-2 bg-[#f5f5f5] pt-4">
            {filteredReceivedAds.map((ad, index) => (
              <RequestResultCard
                ad={ad}
                isNew={index === 0}
                key={`received-${ad.id}-${index}`}
              />
            ))}
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
}: {
  activeTab: RequestManagementTab;
  onChange: (tab: RequestManagementTab) => void;
  tabs: RequestTabItem[];
}) {
  return (
    <section className="bg-[#f5f5f5] px-4 py-2">
      <div
        className="grid h-10 overflow-hidden rounded-2xl border border-[#808080] bg-white [direction:ltr]"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex items-center justify-center gap-1 text-base font-medium leading-6 transition ${
                isActive
                  ? "bg-[#0048c414] text-[#002099]"
                  : "bg-white text-[#4d4d4d]"
              }`}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              {tab.showDot ? (
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[#c11004]"
                />
              ) : null}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}


function RequestFilterChips({
  activeFilterId,
  onSelect,
  options,
}: {
  activeFilterId: RequestFilterId;
  onSelect: (filterId: RequestFilterId) => void;
  options: RequestFilterOption[];
}) {
  return (
    <div
      aria-label="فیلتر نتایج درخواست‌ها"
      className="flex gap-2 overflow-x-auto bg-[#f5f5f5] px-4 py-2 [direction:rtl] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="radiogroup"
    >
      {options.map((option) => {
        const isSelected = option.id === activeFilterId;

        return (
          <button
            aria-checked={isSelected}
            className={`inline-flex h-9 shrink-0 items-center gap-1 rounded-lg border px-2.5 text-sm font-medium leading-5 transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${
              isSelected
                ? "border-[#0048c4] bg-[#0048c414] text-[#002099]"
                : "border-[#cccccc] bg-white text-[#4d4d4d]"
            }`}
            key={option.id}
            onClick={() => onSelect(option.id)}
            role="radio"
            type="button"
          >
            <span>{option.label}</span>
            {isSelected ? (
              <LinearCancelSmall className="h-4 w-4" />
            ) : null}
          </button>
        );
      })}
    </div>
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
      className="flex h-11 w-full items-center justify-between rounded-xl border border-[#cccccc] bg-white px-3 text-right text-sm font-normal leading-5 text-[#1a1a1a] transition focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f8f8f8] [direction:ltr]"
      onClick={onClick}
      type="button"
    >
      <LinearArrowDown1 className="h-5 w-5 shrink-0 text-[#808080]" />
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
    <article className="h-[216px] overflow-hidden bg-white px-4 py-4 text-right">
      <div className="flex items-center justify-between gap-3 [direction:ltr]">
        <button
          className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-[10px] px-1 text-sm font-medium leading-5 text-[#c11004] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#c1100440] active:bg-[#fff0f0]"
          onClick={onCancel}
          type="button"
        >
          <span>لغو</span>
          <LinearCancelSmall className="h-5 w-5 text-[#4d4d4d]" />
        </button>

        <button
          aria-label={`ویرایش ${request.title}`}
          className="flex min-w-0 flex-1 items-center justify-end gap-2 rounded-[10px] text-right focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#0048c440] [direction:ltr]"
          onClick={onEdit}
          type="button"
        >
          <LinearEdit2 className="h-5 w-5 shrink-0 text-[#4d4d4d]" />
          <span className="min-w-0 truncate text-right text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
            {request.title}
          </span>
        </button>
      </div>

      {visibleDetails.length ? (
        <div className="mt-4 grid grid-cols-2 gap-2 [direction:rtl]">
          {visibleDetails.map((detail) => (
            <span
              className="min-w-0 truncate whitespace-nowrap rounded-lg border border-[#cccccc] bg-white px-2.5 py-1.5 text-sm font-normal leading-5 text-[#1a1a1a]"
              title={detail}
              key={detail}
            >
              {detail}
            </span>
          ))}
          {hiddenCount > 0 ? (
            <span className="min-w-0 truncate whitespace-nowrap rounded-lg border border-[#cccccc] bg-[#f7f7f7] px-2.5 py-1.5 text-sm font-medium leading-5 text-[#4d4d4d]">
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
  isNew = false,
}: {
  ad: AdCardData;
  isNew?: boolean;
}) {
  return (
    <AdCard
      ad={ad}
      imageAction={
        <button
          aria-label="حذف از لیست"
          className="absolute left-2 top-2 z-3 grid h-8 w-8 place-items-center rounded-lg bg-white text-[#4d4d4d] shadow-[0_4px_14px_rgba(0,0,0,0.12)] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f5f5f5]"
          type="button"
        >
          <LinearDelete className="h-5 w-5" />
        </button>
      }
      imageMeta={
        <div className="absolute right-2 top-2 z-2 inline-flex h-7 items-center overflow-hidden rounded-lg bg-[#1a1a1a99] text-[#fafafa]">
          <ImageMetaIcon icon={<LinearImage className="h-4.5 w-4.5" />} />
          <ImageMetaIcon icon={<LinearVideo className="h-4.5 w-4.5" />} />
          <ImageMetaIcon icon={<Linear3d className="h-4.5 w-4.5" />} />
        </div>
      }
      to={`/ads/${ad.id}`}
      topBadge={
        isNew ? (
          <p className="absolute left-5 top-0.5 z-10 mb-1 flex items-center justify-end rounded-md text-xs font-medium leading-4 text-white">
            <span className="rounded-xl bg-[#ee3623] px-1">جدید</span>
          </p>
        ) : null
      }
      variant="requestResult"
    />
  );
}

function ImageMetaIcon({ icon }: { icon: ReactNode }) {
  return (
    <span className="grid h-7 w-7 place-items-center border-l border-white/20 last:border-l-0">
      {icon}
    </span>
  );
}

function EmptyRequestState({ text }: { text: string }) {
  return (
    <div className="px-4 py-8 text-center text-sm font-normal leading-6 text-[#808080]">
      {text}
    </div>
  );
}
