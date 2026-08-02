import { useEffect, useMemo, useState, type ReactNode } from "react";

import "../../../shared/components/AdCard.css";

import { PageFrame } from "../../../app/layout/PageFrame";
import LinearEdit2 from "../../../shared/icons/LinearEdit2";
import LinearPreview from "../../../shared/icons/LinearPreview";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { TopBar } from "../../../shared/components/TopBar";
import { useAgencyConsultantsQuery } from "../../../core/hooks/agency.hooks";
import { RouteLink } from "../../../app/router/RouteLink";
import { ChevronLeftIcon } from "./AdManagementIcons";
import { AnimatePresence, motion } from "motion/react";
import {
  adManagementPaths,
  getAdEditPath,
  getAdManagementRouteState,
  getAdPaymentPath,
  getAdPreviewPath,
  getSelectedConsultantAd,
  type ConsultantAd,
} from "./adManagementData";
import LinearBuilding2 from "../../../shared/icons/LinearBuilding2";
import LinearUserSolid from "../../../shared/icons/LinearUserSolid";
import LinearCancel from "../../../shared/icons/LinearCancel";
import LinearSearch from "../../../shared/icons/LinearSearch";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

type PublisherType = "agency" | "consultant";

type SelectableConsultant = {
  avatarSrc?: string;
  id: string;
  name: string;
};

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
  const routeState = getAdManagementRouteState();
  const assignment = routeState.assignment;
  const ad = getSelectedConsultantAd();
  const [publisher, setPublisher] = useState<PublisherType>(
    routeState.publisherType ?? assignment?.targetType ?? "agency",
  );
  const [assignedConsultant, setAssignedConsultant] = useState<SelectableConsultant | null>(null);
  const [isConsultantPickerOpen, setIsConsultantPickerOpen] = useState(false);
  const consultantsQuery = useAgencyConsultantsQuery({
    enabled: isConsultantPickerOpen || publisher === "consultant",
    page: 1,
    perPage: 100,
  });
  const selectableConsultants = useMemo(
    () =>
      (consultantsQuery.data?.data ?? []).map((consultant) => ({
        avatarSrc: consultant.avatar,
        id: String(consultant.userId),
        name: consultant.name || `مشاور شماره ${consultant.userId}`,
      })),
    [consultantsQuery.data],
  );
  const initialConsultantId = String(
    routeState.consultantId ?? assignment?.consultantId ?? "",
  );
  const canContinue = publisher === "agency" || Boolean(assignedConsultant);

  useEffect(() => {
    if (assignedConsultant || !initialConsultantId) return;

    const currentConsultant = selectableConsultants.find(
      (consultant) => consultant.id === initialConsultantId,
    );

    if (currentConsultant) {
      setAssignedConsultant(currentConsultant);
      setPublisher("consultant");
    }
  }, [assignedConsultant, initialConsultantId, selectableConsultants]);

  function handleContinue() {
    if (!canContinue) return;

    window.history.pushState(
      {
        ad,
        assignment,
        assignmentId: assignment?.id,
        consultantId: publisher === "consultant" ? assignedConsultant?.id : undefined,
        publisherType: publisher,
        tab: "status",
      },
      "",
      getAdPaymentPath(ad.id),
    );
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
            <Typography as="span" variant="label" size="medium" weight="medium" className="inline-flex h-9 items-center rounded-lg bg-[#fff3e8] px-3 text-sm font-medium leading-5 text-[#ff6d00]">
              در انتظار پرداخت
            </Typography>
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
              assignment,
              assignmentId: assignment?.id,
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
          <Typography as="h2" variant="headline" size="large" className="m-0 mb-4 text-right font-medium leading-5 text-[#1a1a1a]">
            منتشرکننده آگهی <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#ee3623] text-sm">*</Typography>
          </Typography>

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
          consultants={selectableConsultants}
          isError={consultantsQuery.isError}
          isLoading={consultantsQuery.isLoading}
          onClose={() => setIsConsultantPickerOpen(false)}
          onConfirm={(consultant) => {
            setAssignedConsultant(consultant);
            setPublisher("consultant");
            setIsConsultantPickerOpen(false);
          }}
          onRetry={() => void consultantsQuery.refetch()}
          selectedConsultant={assignedConsultant}
        />
      ) : null}

      <footer className="shrink-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Button unstyled
          className={`inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium leading-5 transition-colors ${canContinue ? "bg-[#0048c4] text-white active:bg-[#003aa0]" : "bg-[#e5e5e5] text-[#b8b8b8]"
            }`}
          disabled={!canContinue}
          onClick={handleContinue}
          type="button"
        >
          ادامه و پرداخت
        </Button>
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
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-xs font-normal leading-4 text-[#4d4d4d]">
          فروش مسکونی / فروش آپارتمان
        </Typography>
        <Typography as="h2" variant="title" size="small" weight="semibold" className="m-0 mt-1 truncate text-sm font-semibold leading-5 text-[#1a1a1a]">
          {ad.title}
        </Typography>
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
      <Typography as="span" variant="label" size="large" weight="medium" className="inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
        <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#4d4d4d]">{icon}</Typography>
        {label}
      </Typography>
    </RouteLink>
  );
}

function RejectAction() {
  return (
    <Button unstyled
      className="flex h-[52px] w-full items-center justify-between border-0 bg-white p-0 text-[#1a1a1a] [direction:ltr] active:bg-[#1a1a1a0a]"
      type="button"
    >
      <ChevronLeftIcon className="h-5 w-5 text-[#4d4d4d]" />
      <Typography as="span" variant="label" size="large" weight="medium" className="inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
        <LinearCancel className="h-6 w-6 text-[#4d4d4d]" />
        رد ثبت آگهی
      </Typography>
    </Button>
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
    <motion.div
      layout
      animate={{
        scale: selected ? 1.01 : 1,
      }}
      whileTap={{ scale: 0.985 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      className={`w-full rounded-xl border p-4 text-right ${selected ? "border-[#0048c4]" : "border-[#cccccc]"
        }`}
    >
      <Button unstyled
        aria-checked={selected}
        className="flex min-h-[48px] w-full justify-between gap-3 border-0 bg-transparent text-right [direction:ltr]"
        onClick={onSelect}
        role="radio"
        type="button"
      >
        <RadioIndicator className="m-3" checked={selected} />
        <Typography as="span" variant="body" size="medium" weight="regular" className="flex min-w-0 flex-1 items-start gap-2 text-right [direction:rtl]">
          <PublisherIcon className="h-6 w-6 shrink-0 text-[#4d4d4d]" icon={option.icon} />
          <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1">
            <Typography as="p" variant="body" size="medium" weight="regular" className="block text-normal text-[#1a1a1a]">
              {option.label}
            </Typography>
            <Typography as="span" variant="body" size="medium" weight="regular" className="block text-sm font-normal text-[#a6a6a6]">
              {option.description}
            </Typography>
          </Typography>
        </Typography>
      </Button>

      <AnimatePresence initial={false}>
        {selected && isConsultant ? (
          <motion.div
            key="consultant-options"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 22 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="overflow-hidden rounded-lg border border-[#0048c4] bg-white"
          >
              {assignedConsultant ? (
                <div className="mb-2 flex items-center justify-center gap-2 px-1 py-1 text-right [direction:rtl]">
                  <ConsultantAvatar consultant={assignedConsultant} className="h-10 w-10" />
                  <Typography as="span" variant="label" size="medium" weight="medium" className="min-w-0 flex-1 truncate text-sm font-medium leading-5 text-[#1a1a1a]">
                    {assignedConsultant.name}
                  </Typography>
                </div>
              ) : null}
            <div className="py-4">
              <Button unstyled
                className="inline-flex items-center justify-center w-full gap-1 rounded-lg bg-white text-sm font-medium leading-5 text-[#0048c4]"
                onClick={onAssignConsultant}
                type="button"
              >
                {assignedConsultant ? "تغییر مشاور" : "تعیین مشاور"}
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        ) : null
        }
      </AnimatePresence >
    </motion.div >
  );
}

function ConsultantPickerPage({
  consultants,
  isError,
  isLoading,
  onClose,
  onConfirm,
  onRetry,
  selectedConsultant,
}: {
  consultants: SelectableConsultant[];
  isError: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (consultant: SelectableConsultant) => void;
  onRetry: () => void;
  selectedConsultant: SelectableConsultant | null;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [draftConsultantId, setDraftConsultantId] = useState<string | null>(
    selectedConsultant?.id ?? null,
  );
  const normalizedSearch = searchValue.trim();
  const visibleConsultants = normalizedSearch
    ? consultants.filter((consultant) => consultant.name.includes(normalizedSearch))
    : consultants;
  const draftConsultant =
    consultants.find((consultant) => consultant.id === draftConsultantId) ?? null;

  useEffect(() => {
    if (draftConsultantId || consultants.length === 0) return;
    setDraftConsultantId(consultants[0].id);
  }, [consultants, draftConsultantId]);

  return (
    <section
      aria-label="انتخاب مشاور"
      aria-modal="true"
      className="fixed inset-y-0 left-1/2 z-[1200] flex w-full max-w-[500px] -translate-x-1/2 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      role="dialog"
    >
      <TopBar
        placement="inline"
        centerClassName="px-0"
        className="bg-[#f0f0f0]"
        onBack={onClose}
        reserveStartSpace
        title="انتخاب مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pb-24 pt-3">
        <label className="flex items-center gap-2 rounded-xl border border-[#808080] bg-white p-3 focus-within:border-[#0048c4] ">
          <input
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-xs font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080]"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="جستجوی مشاور"
            type="search"
            value={searchValue}
          />
          <LinearSearch className="h-6 w-6 text-[#4D4D4D]"/>
        </label>

        <div className="mt-6 grid gap-1">
          {isLoading ? (
            <Typography as="p" variant="body" size="medium" weight="regular" className="py-10 text-center text-sm text-[#808080]">در حال دریافت مشاوران...</Typography>
          ) : isError ? (
            <div className="py-8 text-center text-sm leading-6 text-[#808080]">
              دریافت فهرست مشاوران با خطا مواجه شد.
              <Button unstyled
                className="mt-3 block w-full font-semibold text-[#0048c4]"
                onClick={onRetry}
                type="button"
              >
                تلاش دوباره
              </Button>
            </div>
          ) : visibleConsultants.length === 0 ? (
            <SearchEmptyState />
          ) : (
            visibleConsultants.map((consultant) => {
              const selected = draftConsultantId === consultant.id;

              return (
                <Button unstyled
                  aria-checked={selected}
                  className="flex w-full items-center justify-between gap-3 rounded-lg bg-white px-6 text-right [direction:ltr] active:bg-[#f7f7f7]"
                  key={consultant.id}
                  onClick={() => setDraftConsultantId(consultant.id)}
                  role="radio"
                  type="button"
                >
                  <RadioIndicator checked={selected} />
                  <Typography as="span" variant="body" size="medium" weight="regular" className="flex flex-1 items-center gap-3 [direction:rtl]">
                    <ConsultantAvatar consultant={consultant} className="h-14 w-14" />
                    <Typography as="span" variant="body" size="medium" weight="regular" className="leading-5 text-[#1a1a1a]">
                      {consultant.name}
                    </Typography>
                  </Typography>
                </Button>
              );
            })
          )}
        </div>
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Button unstyled
          className={`inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium leading-5 ${draftConsultant ? "bg-[#0048c4] text-white" : "bg-[#e5e5e5] text-[#b8b8b8]"
            }`}
          disabled={!draftConsultant}
          onClick={() => {
            if (draftConsultant) onConfirm(draftConsultant);
          }}
          type="button"
        >
          انتخاب
        </Button>
      </footer>
    </section>
  );
}

function ConsultantAvatar({
  className,
  consultant,
}: {
  className: string;
  consultant: SelectableConsultant;
}) {
  if (consultant.avatarSrc) {
    return (
      <img
        alt=""
        className={`${className} shrink-0 rounded-full object-cover`}
        draggable={false}
        src={consultant.avatarSrc}
      />
    );
  }

  return (
    <Typography as="span" variant="label" size="small" weight="semibold"
      aria-hidden="true"
      className={`${className} grid shrink-0 place-items-center rounded-full bg-[#edf3ff] text-xs font-semibold text-[#0048c4]`}
    >
      {consultant.name.trim().charAt(0) || "م"}
    </Typography>
  );
}

function PublisherIcon({ className, icon }: { className?: string; icon: "agency" | "consultant" }) {
  if (icon === "agency") return <LinearBuilding2 className={className} />;

  return <LinearUserSolid className={className} />;
}
