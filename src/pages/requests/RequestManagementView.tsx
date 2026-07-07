import { useMemo, useState, type ReactNode } from "react";

import { PageFrame } from "../../app/PageFrame";
import Linear3d from "../../components/(icons)/Linear3d";
import LinearArrowDown1 from "../../components/(icons)/LinearArrowDown1";
import LinearDelete from "../../components/(icons)/LinearDelete";
import LinearImage from "../../components/(icons)/LinearImage";
import LinearRefresh from "../../components/(icons)/LinearRefresh";
import LinearVideo from "../../components/(icons)/LinearVideo";
import { BottomSheet } from "../../components/BottomSheet";
import { RadioIndicator } from "../../components/RadioIndicator";
import { TopBar } from "../../components/TopBar";
import { AdCard, type AdCardData } from "../../components/AdCard";

type RequestManagementTab = "received" | "requests" | "results";
type RequestFilterId = "all" | "apartment-naser" | "request-1" | "request-2" | "request-3" | "request-4";

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

type CriteriaRequest = {
  id: number;
  title: string;
  details: string[];
};

const requestFilterOptions: RequestFilterOption[] = [
  { id: "all", label: "همه" },
  { id: "apartment-naser", label: "فروش آپارتمان ناصر" },
  { id: "request-1", label: "درخواست ۱" },
  { id: "request-2", label: "درخواست ۲" },
  { id: "request-3", label: "درخواست ۳" },
  { id: "request-4", label: "درخواست ۴" },
];

const defaultFilters: Record<RequestManagementTab, RequestFilterId> = {
  received: "apartment-naser",
  requests: "all",
  results: "all",
};

const criteriaRequests: CriteriaRequest[] = [
  {
    id: 1,
    title: "فروش آپارتمان",
    details: ["قیمت ۳ میلیارد تومان", "محله صیاد شیرازی", "سال ساخت نوساز", "متراژ از ۱۰۰متر تا ۲۰۰ متر", "دو خوابه"],
  },
  {
    id: 2,
    title: "اجاره آپارتمان",
    details: ["رهن کامل", "محله الهیه", "متراژ از ۸۰متر تا ۱۴۰ متر", "۲ اتاق", "آسانسور"],
  },
  {
    id: 3,
    title: "خرید خانه ویلایی",
    details: ["تا ۸ میلیارد تومان", "محله هاشمیه", "حداقل ۲۵۰ متر", "۳ اتاق", "حیاط‌دار"],
  },
  {
    id: 4,
    title: "فروش زمین",
    details: ["بالای ۳۰۰ متر", "سنددار", "دسترسی اصلی", "کاربری مسکونی", "قابل معاوضه"],
  },
];

const baseRequestAds: AdCardData[] = [
  {
    id: 1,
    agency: "",
    area: "۱۱۰ متر",
    badges: [],
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
    agency: "دفتر املاک جلیلیان",
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
  {
    id: 3,
    agency: "دفتر املاک شریعت زاده",
    area: "۸۰۰ متر",
    badges: ["بروزرسانی"],
    imageClassName: "ad-card__image--three",
    imageCount: "۵",
    priceLabelPrimary: "از:",
    priceLabelSecondary: "تا:",
    pricePrimary: "۲ میلیون",
    priceSecondary: "۴ میلیون",
    rooms: "۳ اتاق",
    status: "",
    timeAndLocation: "یک هفته پیش در شاندیز",
    title: "اجاره باغ ویلادوبلکس ۳ خواب استخردار جکوزی شاندیز",
    year: "تا ۱۰ نفر",
  },
  {
    id: 4,
    agency: "دفتر املاک شریعت زاده",
    area: "۱۱۰ متر",
    badges: ["فوری"],
    imageClassName: "ad-card__image--four",
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
];

const resultAds: AdCardData[] = baseRequestAds.map((ad, index) => ({
  ...ad,
  agency: index % 2 === 0 ? "" : ad.agency,
}));

const receivedAds: AdCardData[] = baseRequestAds.map((ad, index) => ({
  ...ad,
  agency: index % 2 === 0 ? "ناصر اشرفی" : "آژانس املاک اشرفی",
  badges: index % 2 === 0 ? ["جدید"] : ad.badges,
}));

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

function getFilterLabel(filterId: RequestFilterId) {
  return requestFilterOptions.find((option) => option.id === filterId)?.label ?? requestFilterOptions[0].label;
}

function filterIndex(filterId: RequestFilterId) {
  return requestFilterOptions.findIndex((option) => option.id === filterId);
}

function getFilteredAds(tab: RequestManagementTab, filterId: RequestFilterId) {
  const source = tab === "received" ? receivedAds : resultAds;

  if (filterId === "all") return source;
  if (filterId === "apartment-naser") return source.slice(0, 2);

  const index = Math.max(filterIndex(filterId) - 2, 0);
  return [source[index % source.length]];
}

function getFilteredCriteriaRequests(filterId: RequestFilterId, requestIds: number[]) {
  const source = criteriaRequests.filter((request) => requestIds.includes(request.id));

  if (filterId === "all") return source;
  if (filterId === "apartment-naser") return source.slice(0, 1);

  const index = Math.max(filterIndex(filterId) - 2, 0);
  const matched = source[index % source.length];

  return matched ? [matched] : [];
}

function refreshPage() {
  window.location.reload();
}

export function RequestManagementView({ backTo, showReceivedTab = false }: RequestManagementViewProps) {
  const [activeTab, setActiveTab] = useState<RequestManagementTab>(showReceivedTab ? "received" : "requests");
  const [filters, setFilters] = useState<Record<RequestManagementTab, RequestFilterId>>(defaultFilters);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [requestIds, setRequestIds] = useState([1, 2, 3, 4]);
  const tabs = useMemo(() => getTabs(showReceivedTab), [showReceivedTab]);
  const activeFilterId = filters[activeTab];
  const activeFilterLabel = getFilterLabel(activeFilterId);
  const filteredRequests = useMemo(
    () => getFilteredCriteriaRequests(activeFilterId, requestIds),
    [activeFilterId, requestIds],
  );
  const filteredAds = useMemo(
    () => getFilteredAds(activeTab, activeFilterId),
    [activeFilterId, activeTab],
  );

  return (
    <PageFrame
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <LinearRefresh className="h-6 w-6" />,
            id: "refresh-requests",
            label: "بروزرسانی درخواست‌ها",
            onClick: refreshPage,
          },
        ]}
        backTo={backTo}
        className="bg-[#f0f0f0]"
        contentClassName="px-1"
        title="درخواست‌ها"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-6">
        <RequestTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />

        <section className="px-4 pt-3">
          <RequestFilterButton label={activeFilterLabel} onClick={() => setIsFilterSheetOpen(true)} />
        </section>

        {activeTab === "requests" ? (
          <div className="space-y-2 bg-[#f0f0f0] pt-4">
            {filteredRequests.map((request) => (
              <CriteriaRequestCard
                key={request.id}
                request={request}
                onCancel={() => setRequestIds((items) => items.filter((item) => item !== request.id))}
              />
            ))}
            {filteredRequests.length === 0 ? <EmptyRequestState text="درخواستی باقی نمانده است" /> : null}
          </div>
        ) : (
          <div className="space-y-2 bg-[#f0f0f0] pt-4">
            {filteredAds.map((ad, index) => (
              <RequestResultCard ad={ad} isNew={activeTab === "received" && index === 0} key={`${activeTab}-${ad.id}-${index}`} />
            ))}
          </div>
        )}
      </main>

      <RequestFilterBottomSheet
        activeFilterId={activeFilterId}
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        onSelect={(filterId) => {
          setFilters((current) => ({ ...current, [activeTab]: filterId }));
          setIsFilterSheetOpen(false);
        }}
      />
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
    <section className="bg-[#f0f0f0] px-4 py-2">
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
                isActive ? "bg-[#0048c414] text-[#002099]" : "bg-white text-[#4d4d4d]"
              }`}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              {tab.showDot ? <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c11004]" /> : null}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function RequestFilterButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="flex h-11 w-full items-center justify-between rounded-xl border border-[#cccccc] bg-white px-3 text-right text-sm font-normal leading-5 text-[#1a1a1a] transition focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f8f8f8] [direction:ltr]"
      onClick={onClick}
      type="button"
    >
      <LinearArrowDown1 className="h-5 w-5 shrink-0 text-[#808080]" />
      <span className="min-w-0 flex-1 truncate pr-3 text-right [direction:rtl]">{label}</span>
    </button>
  );
}

function RequestFilterBottomSheet({
  activeFilterId,
  isOpen,
  onClose,
  onSelect,
}: {
  activeFilterId: RequestFilterId;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (filterId: RequestFilterId) => void;
}) {
  return (
    <BottomSheet
      ariaLabel="انتخاب درخواست"
      contentClassName="px-4 pt-4"
      heightClassName="h-auto pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      showHeaderDivider={false}
      title="انتخاب درخواست"
      titleAlign="center"
    >
      <div className="space-y-1" role="radiogroup" aria-label="انتخاب درخواست">
        {requestFilterOptions.map((option) => {
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
  request,
}: {
  onCancel: () => void;
  request: CriteriaRequest;
}) {
  return (
    <article className="bg-white px-4 py-4 text-right">
      <div className="flex items-center justify-between gap-3 [direction:ltr]">
        <button
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[10px] px-3 text-sm font-medium leading-5 text-[#c11004] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#c1100440] active:bg-[#fff0f0]"
          onClick={onCancel}
          type="button"
        >
          <LinearDelete className="h-5 w-5" />
          <span>لغو درخواست</span>
        </button>

        <h2 className="m-0 min-w-0 flex-1 truncate text-right text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
          {request.title}
        </h2>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {request.details.map((detail) => (
          <span
            className="rounded-lg bg-[#f5f5f5] px-3 py-2 text-sm font-semibold leading-5 text-[#1a1a1a]"
            key={detail}
          >
            {detail}
          </span>
        ))}
      </div>
    </article>
  );
}

function RequestResultCard({ ad, isNew = false }: { ad: AdCardData; isNew?: boolean }) {
  return (
    <AdCard
      ad={ad}
      imageAction={(
        <button
          aria-label="حذف از لیست"
          className="absolute left-2 top-2 z-3 grid h-8 w-8 place-items-center rounded-lg bg-white text-[#4d4d4d] shadow-[0_4px_14px_rgba(0,0,0,0.12)] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f5f5f5]"
          type="button"
        >
          <LinearDelete className="h-5 w-5" />
        </button>
      )}
      imageMeta={(
        <div className="absolute right-2 top-2 z-2 inline-flex h-7 items-center overflow-hidden rounded-lg bg-[#1a1a1a99] text-[#fafafa]">
          <ImageMetaIcon icon={<LinearImage className="h-4.5 w-4.5" />} />
          <ImageMetaIcon icon={<LinearVideo className="h-4.5 w-4.5" />} />
          <ImageMetaIcon icon={<Linear3d className="h-4.5 w-4.5" />} />
        </div>
      )}
      to={`/ads/${ad.id}`}
      topBadge={isNew ? (
        <span className="mb-1 inline-flex h-5 items-center rounded-md bg-[#ee3623] px-1.5 text-[10px] font-medium leading-4 text-white">
          جدید
        </span>
      ) : null}
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
