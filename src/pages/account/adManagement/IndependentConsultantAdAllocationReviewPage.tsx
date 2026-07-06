import { useState, type ReactNode } from "react";

import { PageFrame } from "../../../app/PageFrame";
import LinearBuilding3 from "../../../components/(icons)/LinearBuilding3";
import LinearCancelSmall from "../../../components/(icons)/LinearCancelSmall";
import LinearEdit2 from "../../../components/(icons)/LinearEdit2";
import LinearPreview from "../../../components/(icons)/LinearPreview";
import LinearUserAccount from "../../../components/(icons)/LinearUserAccount";
import { RadioIndicator } from "../../../components/RadioIndicator";
import { TopBar } from "../../../components/TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import { ChevronLeftIcon } from "./AdManagementIcons";
import {
  adManagementPaths,
  adManagementPublisherOptions,
  getAdEditPath,
  getAdPreviewPath,
  getSelectedConsultantAd,
  type ConsultantAd,
} from "./adManagementData";

type PublisherType = "agency" | "consultant";

type SelectableConsultant = {
  avatarSrc: string;
  id: string;
  name: string;
};

const selectableConsultants: SelectableConsultant[] = adManagementPublisherOptions
  .filter((publisher) => publisher.id !== "jalilian-real-estate")
  .map((publisher) => ({
    avatarSrc: publisher.image,
    id: publisher.id,
    name: publisher.name,
  }));

const defaultSelectedConsultant = selectableConsultants[1] ?? selectableConsultants[0] ?? null;

const publisherOptions: {
  description: string;
  icon: "agency" | "consultant";
  label: string;
  value: PublisherType;
}[] = [
  {
    description: "انتشار و مدیریت آگهی توسط حساب آژانس انجام می‌شود.",
    icon: "agency",
    label: "آژانس",
    value: "agency",
  },
  {
    description: "انتشار و مدیریت آگهی توسط یکی از مشاوران انجام می‌شود.",
    icon: "consultant",
    label: "مشاور",
    value: "consultant",
  },
];

export function IndependentConsultantAdAllocationReviewPage() {
  const ad = getSelectedConsultantAd();
  const [publisher, setPublisher] = useState<PublisherType>("agency");
  const [assignedConsultant, setAssignedConsultant] = useState<SelectableConsultant | null>(null);
  const [isConsultantPickerOpen, setIsConsultantPickerOpen] = useState(false);
  const canContinue = publisher === "agency" || Boolean(assignedConsultant);

  function handleContinue() {
    if (!canContinue) return;

    window.history.pushState({ ad, tab: "status" }, "", adManagementPaths.payment);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ tab: "status" }}
        backTo={adManagementPaths.root}
        className="bg-[#f0f0f0]"
        title="تخصیص و انتشار"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-4">
        <section className="px-4 pb-4 pt-4" aria-label="خلاصه آگهی">
          <div className="flex justify-start">
            <span className="inline-flex h-9 items-center rounded-lg bg-[#fff3e8] px-3 text-sm font-medium leading-5 text-[#ff6d00]">
              در انتظار پرداخت
            </span>
          </div>

          <CompactAdSummary ad={ad} />
        </section>

        <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />

        <section className="px-4" aria-label="عملیات آگهی">
          <ReviewAction
            icon={<LinearPreview className="h-6 w-6" />}
            label="پیش نمایش"
            to={getAdPreviewPath(ad.id)}
          />
          <ActionDivider />
          <ReviewAction
            icon={<LinearEdit2 className="h-6 w-6" />}
            label="ویرایش"
            state={{
              ad,
              card: ad,
              editReturnTo: getAllocationReviewPathForCurrentAd(ad.id),
              isEditMode: true,
              tab: "status",
            }}
            to={getAdEditPath(ad.id)}
          />
          <ActionDivider />
          <RejectAction />
        </section>

        <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />

        <section className="px-4 pb-6 pt-5" aria-label="منتشرکننده آگهی">
          <h2 className="m-0 mb-4 text-right text-sm font-medium leading-5 text-[#1a1a1a]">
            منتشرکننده آگهی <span className="text-[#ee3623]">*</span>
          </h2>

          <div className="space-y-3" role="radiogroup" aria-label="انتخاب منتشرکننده آگهی">
            {publisherOptions.map((option) => (
              <PublisherOptionCard
                assignedConsultant={assignedConsultant}
                key={option.value}
                onAssignConsultant={() => setIsConsultantPickerOpen(true)}
                onSelect={() => {
                  setPublisher(option.value);
                  if (option.value === "agency") setAssignedConsultant(null);
                }}
                option={option}
                selected={publisher === option.value}
              />
            ))}
          </div>
        </section>
      </main>

      {isConsultantPickerOpen ? (
        <ConsultantPickerPage
          onClose={() => setIsConsultantPickerOpen(false)}
          onConfirm={(consultant) => {
            setAssignedConsultant(consultant);
            setPublisher("consultant");
            setIsConsultantPickerOpen(false);
          }}
          selectedConsultant={assignedConsultant ?? defaultSelectedConsultant}
        />
      ) : null}

      <footer className="shrink-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <button
          className={`inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium leading-5 transition-colors ${
            canContinue ? "bg-[#0048c4] text-white active:bg-[#003aa0]" : "bg-[#e5e5e5] text-[#b8b8b8]"
          }`}
          disabled={!canContinue}
          onClick={handleContinue}
          type="button"
        >
          ادامه و پرداخت
        </button>
      </footer>
    </PageFrame>
  );
}

function getAllocationReviewPathForCurrentAd(adId: ConsultantAd["id"] | string) {
  return `${adManagementPaths.allocationReview}/${encodeURIComponent(String(adId))}`;
}

function CompactAdSummary({ ad }: { ad: ConsultantAd }) {
  return (
    <section
      aria-label={ad.title}
      className="mt-4 flex h-[68px] items-center justify-between gap-2 rounded-2xl border border-[#e5e5e5] bg-[#fafafa] px-3 py-2 shadow-[0_2px_8px_rgba(26,26,26,0.04)] [direction:ltr]"
    >
      <div className="min-w-0 flex-1 text-right [direction:rtl]">
        <p className="m-0 text-xs font-normal leading-4 text-[#4d4d4d]">
          فروش مسکونی / فروش آپارتمان
        </p>
        <h2 className="m-0 mt-1 truncate text-sm font-semibold leading-5 text-[#1a1a1a]">
          {ad.title}
        </h2>
      </div>
      <div
        aria-hidden="true"
        className={`ad-card__image ${ad.imageClassName} h-[52px] w-[78px] shrink-0 rounded-lg bg-cover bg-center`}
        style={ad.imageUrl ? { backgroundImage: `url(${ad.imageUrl})` } : undefined}
      />
    </section>
  );
}

function ActionDivider() {
  return <div className="h-px bg-[#cccccc]" aria-hidden="true" />;
}

function ReviewAction({
  icon,
  label,
  state,
  to,
}: {
  icon: ReactNode;
  label: string;
  state?: unknown;
  to: string;
}) {
  return (
    <RouteLink
      className="flex h-[52px] w-full items-center justify-between text-[#1a1a1a] no-underline [direction:ltr] active:bg-[#1a1a1a0a]"
      state={state}
      to={to}
    >
      <ChevronLeftIcon className="h-5 w-5 text-[#4d4d4d]" />
      <span className="inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
        <span className="text-[#4d4d4d]">{icon}</span>
        {label}
      </span>
    </RouteLink>
  );
}

function RejectAction() {
  return (
    <button
      className="flex h-[52px] w-full items-center justify-between border-0 bg-white p-0 text-[#1a1a1a] [direction:ltr] active:bg-[#1a1a1a0a]"
      type="button"
    >
      <ChevronLeftIcon className="h-5 w-5 text-[#4d4d4d]" />
      <span className="inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
        <LinearCancelSmall className="h-6 w-6 text-[#4d4d4d]" />
        رد ثبت آگهی
      </span>
    </button>
  );
}

function PublisherOptionCard({
  assignedConsultant,
  onAssignConsultant,
  onSelect,
  option,
  selected,
}: {
  assignedConsultant: SelectableConsultant | null;
  onAssignConsultant: () => void;
  onSelect: () => void;
  option: (typeof publisherOptions)[number];
  selected: boolean;
}) {
  const isConsultant = option.value === "consultant";

  return (
    <div
      className={`w-full rounded-xl border bg-white px-3 py-3 text-right transition-colors ${
        selected ? "border-[#0048c4] ring-1 ring-[#0048c4]" : "border-[#cccccc]"
      }`}
    >
      <button
        aria-checked={selected}
        className="flex min-h-[48px] w-full items-center justify-between gap-3 border-0 bg-transparent p-0 text-right [direction:ltr]"
        onClick={onSelect}
        role="radio"
        type="button"
      >
        <RadioIndicator checked={selected} />
        <span className="flex min-w-0 flex-1 items-start gap-2 text-right [direction:rtl]">
          <PublisherIcon className="mt-0.5 h-6 w-6 shrink-0 text-[#4d4d4d]" icon={option.icon} />
          <span className="min-w-0 flex-1">
            <strong className="block text-base font-medium leading-6 text-[#1a1a1a]">
              {option.label}
            </strong>
            <span className="mt-1 block text-xs font-normal leading-5 text-[#a6a6a6]">
              {option.description}
            </span>
          </span>
        </span>
      </button>

      {selected && isConsultant ? (
        <div className="mt-3 rounded-lg border border-[#0048c4] bg-white p-2">
          {assignedConsultant ? (
            <div className="mb-2 flex items-center gap-2 px-1 py-1 text-right [direction:rtl]">
              <img
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                draggable={false}
                src={assignedConsultant.avatarSrc}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium leading-5 text-[#1a1a1a]">
                {assignedConsultant.name}
              </span>
            </div>
          ) : null}
          <button
            className="inline-flex h-10 w-full items-center justify-center gap-1 rounded-lg border border-[#0048c4] bg-white text-sm font-medium leading-5 text-[#0048c4]"
            onClick={onAssignConsultant}
            type="button"
          >
            {assignedConsultant ? "تغییر مشاور" : "تعیین مشاور"}
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ConsultantPickerPage({
  onClose,
  onConfirm,
  selectedConsultant,
}: {
  onClose: () => void;
  onConfirm: (consultant: SelectableConsultant) => void;
  selectedConsultant: SelectableConsultant | null;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [draftConsultantId, setDraftConsultantId] = useState<string | null>(
    selectedConsultant?.id ?? defaultSelectedConsultant?.id ?? null,
  );
  const normalizedSearch = searchValue.trim();
  const visibleConsultants = normalizedSearch
    ? selectableConsultants.filter((consultant) => consultant.name.includes(normalizedSearch))
    : selectableConsultants;
  const draftConsultant =
    visibleConsultants.find((consultant) => consultant.id === draftConsultantId) ??
    selectableConsultants.find((consultant) => consultant.id === draftConsultantId) ??
    null;

  return (
    <section
      aria-label="انتخاب مشاور"
      aria-modal="true"
      className="fixed inset-y-0 left-1/2 z-[1200] flex w-full max-w-[500px] -translate-x-1/2 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      role="dialog"
    >
      <TopBar
        centerClassName="px-0"
        className="bg-[#f0f0f0]"
        onBack={onClose}
        reserveStartSpace
        title="انتخاب مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pb-24 pt-3">
        <label className="flex h-10 items-center gap-2 rounded-lg border border-[#d9d9d9] bg-white px-3 focus-within:border-[#0048c4] focus-within:ring-2 focus-within:ring-[#0048c41a]">
          <input
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-xs font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="جستجوی مشاور"
            type="search"
            value={searchValue}
          />
          <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-[#4d4d4d]" fill="none" viewBox="0 0 24 24">
            <path d="m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
          </svg>
        </label>

        <div className="mt-5 grid gap-1">
          {visibleConsultants.map((consultant) => {
            const selected = draftConsultantId === consultant.id;

            return (
              <button
                aria-checked={selected}
                className="flex h-12 w-full items-center justify-between gap-3 rounded-lg bg-white px-1 text-right [direction:ltr] active:bg-[#f7f7f7]"
                key={consultant.id}
                onClick={() => setDraftConsultantId(consultant.id)}
                role="radio"
                type="button"
              >
                <RadioIndicator checked={selected} />
                <span className="flex min-w-0 flex-1 items-center justify-end gap-3 [direction:rtl]">
                  <span className="truncate text-xs font-medium leading-5 text-[#1a1a1a]">
                    {consultant.name}
                  </span>
                  <img
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                    draggable={false}
                    src={consultant.avatarSrc}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <button
          className={`inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium leading-5 ${
            draftConsultant ? "bg-[#0048c4] text-white" : "bg-[#e5e5e5] text-[#b8b8b8]"
          }`}
          disabled={!draftConsultant}
          onClick={() => {
            if (draftConsultant) onConfirm(draftConsultant);
          }}
          type="button"
        >
          انتخاب
        </button>
      </footer>
    </section>
  );
}

function PublisherIcon({ className, icon }: { className?: string; icon: "agency" | "consultant" }) {
  if (icon === "agency") return <LinearBuilding3 className={className} />;

  return <LinearUserAccount className={className} />;
}
