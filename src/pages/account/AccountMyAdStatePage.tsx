import { useState } from "react";

import { getActiveAuthRole, getStoredAuthSession } from "../../auth/auth-storage";
import { useAdvertisementPreviewQuery } from "../../hooks/advertisement.hooks";
import { mapAdvertisementToAdCard } from "../../services/advertisement.service";
import { REAL_ESTATE_MANAGER, USER } from "../../constants/roles.constants";
import { PageFrame } from "../../app/PageFrame";
import { TopBar } from "../../components/TopBar";
import { RadioIndicator } from "../../components/RadioIndicator";
import type { AdCardData } from "../../components/AdCard";
import { RouteLink } from "../../routes/RouteLink";
import { latestMashhadAds } from "../home/homeData";
import {
  adManagementPaths,
  adManagementPublisherOptions,
  getAdCloseResultPath,
  getAdEditPath,
  getAdIncreaseVisitsPath,
  getAdPaymentHistoryPath,
  getAdPreviewPath,
  getAdVisitStatisticsPath,
} from "./adManagement/adManagementData";
import { getMyAdStatusInfo, type MyAdStatusKey } from "./myAdsStatus";
import LinearFlag from "../../components/(icons)/LinearFlag";
import LinearChartUp from "../../components/(icons)/LinearChartUp";
import LinearDelete from "../../components/(icons)/LinearDelete";
import LinearEdit2 from "../../components/(icons)/LinearEdit2";
import LinearPreview from "../../components/(icons)/LinearPreview";
import LinearAnalytics from "../../components/(icons)/LinearAnalytics";

type MyAdRouteState = {
  ad?: Record<string, unknown>;
  card?: AdCardData;
  status?: MyAdStatusKey | string;
  tab?: string;
  editReturnTo?: string;
  isEditMode?: boolean;
  returnTo?: string;
};

type StateActionKey = "delete" | "edit" | "history" | "preview" | "result" | "stats" | "upgrade";

type StateAction = {
  icon: StateActionKey;
  label: string;
  to?: string;
};

const fallbackCard = latestMashhadAds[0];

export function AccountMyAdStatePage() {
  const routeState = readRouteState();
  const adId = readAdIdFromPath() ?? String(routeState.card?.id ?? fallbackCard.id);
  const fallbackIndex = Math.max(Number(adId.replace(/\D/g, "")) - 1, 0) || 0;
  const detailQuery = useAdvertisementPreviewQuery(adId);
  const statusQuery = new URLSearchParams(window.location.search).get("status") ?? undefined;
  const sourceAd = detailQuery.data ?? routeState.ad;
  const card = detailQuery.data
    ? mapAdvertisementToAdCard(detailQuery.data, fallbackIndex)
    : routeState.card ?? fallbackCard;
  const statusInfo = getMyAdStatusInfo(
    detailQuery.data ?? statusQuery ?? routeState.status ?? routeState.ad ?? routeState.card?.status,
    fallbackIndex,
    { useDemoFallback: !detailQuery.data },
  );
  const cameFromAdManagement = Boolean(routeState.tab || routeState.returnTo);
  const backTo = getStateAdBackPath(routeState);
  const backState = cameFromAdManagement ? { tab: routeState.tab } : undefined;
  const activeRole = getActiveAuthRole(getStoredAuthSession());

  if (activeRole === REAL_ESTATE_MANAGER) {
    return (
      <RealEstateManagerAdStatePage
        ad={sourceAd}
        adId={adId}
        backState={backState}
        backTo={backTo}
        card={card}
      />
    );
  }

  const actions = getStateActions(statusInfo.key, adId);

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={backState}
        backTo={backTo}
        className="[&_a]:text-[#1a1a1a]"
        title="مدیریت آگهی"
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <section className="shrink-0 bg-white px-4 pb-4 pt-4" aria-label={card.title}>
          <div className="flex justify-start">
            <span className={`inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium leading-5 ${statusInfo.badgeClassName}`}>
              {statusInfo.label}
            </span>
          </div>

          <StateAdSummary ad={sourceAd} card={card} />

          {statusInfo.key === "published" ? <PublishedMeta /> : null}
          {statusInfo.key === "pending" ? <PendingReviewNotice /> : null}
          {statusInfo.key === "needs_edit" ? (
            <NeedsEditNotice ad={sourceAd} card={card} returnTo={backTo} />
          ) : null}
        </section>

        <div className="h-2 shrink-0 bg-[#f0f0f0]" aria-hidden="true" />

        <section className="min-h-[300px] flex-1 bg-white" aria-label="عملیات آگهی">
          {actions.map((action, index) => (
            <div key={action.label}>
              <StateAdAction
                action={action}
                ad={sourceAd}
                card={card}
                deleteCompleteTo={backTo}
                returnTo={backTo}
              />
              {index < actions.length - 1 ? <ActionDivider /> : null}
            </div>
          ))}
        </section>
      </main>
    </PageFrame>
  );
}

type ManagerPublisher = {
  id: string;
  image: string;
  name: string;
  type: "agency" | "consultant";
};

const managerPublisherOptions: ManagerPublisher[] = adManagementPublisherOptions.map((publisher, index) => ({
  id: publisher.id,
  image: publisher.image,
  name: publisher.name,
  type: index === 0 ? "agency" : "consultant",
}));

function RealEstateManagerAdStatePage({
  ad,
  adId,
  backState,
  backTo,
  card,
}: {
  ad?: Record<string, unknown>;
  adId: string;
  backState?: unknown;
  backTo: string;
  card: AdCardData;
}) {
  const [publisher, setPublisher] = useState<ManagerPublisher>(managerPublisherOptions[0]);
  const [isPublisherPickerOpen, setIsPublisherPickerOpen] = useState(false);

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={backState}
        backTo={backTo}
        className="[&_a]:text-[#1a1a1a]"
        title="تخصیص و انتشار"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-4">
        <section className="bg-white px-4 pb-4 pt-4" aria-label={card.title}>
          <div className="flex justify-start">
            <span className="inline-flex h-9 items-center rounded-lg bg-[#11a36614] px-3 text-sm font-medium leading-5 text-[#11a366]">
              منتشر شده
            </span>
          </div>

          <ManagerAdSummary ad={ad} card={card} />

          <div className="mt-4 text-sm font-medium leading-5">
            <MetaRow label="انتشار" value="۳ روز پیش" />
            <div className="border-t border-dashed border-[#cccccc]" aria-hidden="true" />
            <MetaRow label="انقضا" value="۱۲بهمن (۱۲روز دیگر)" />
          </div>
        </section>

        <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />

        <section className="bg-white px-4 pb-4 pt-4" aria-label="مسئول انتشار آگهی">
          <h2 className="m-0 text-right font-medium text-[#1a1a1a]">مسئول انتشار آگهی</h2>
          <div className="mt-3">
            <div className="flex items-center bg-[#fafafa] rounded-xl p-3 justify-end gap-3 [direction:rtl]">
              <img
                alt=""
                className={`h-12 w-12 shrink-0  object-cover rounded-full`}
                draggable={false}
                src={publisher.image}
              />
              <div className="flex-1 flex flex-col justify-center text-right">
                <p className="m-0 font-medium text-[#4D4D4D]">{publisher.name}</p>
                <p className="m-0 text-xs leading-4 text-[#808080]">
                  {publisher.type === "agency" ? "آژانس" : "مشاور"}
                </p>
              </div>
            </div>

            <button
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1 rounded-lg border border-[#0048c4] bg-white text-sm font-medium text-[#0048c4] active:bg-[#e6efff]"
              onClick={() => setIsPublisherPickerOpen(true)}
              type="button"
            >
              تغییر مشاور
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          </div>
        </section>

        <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />

        <section className="min-h-[244px] bg-white" aria-label="عملیات آگهی">
          <StateAdAction action={{ icon: "preview", label: "پیش‌نمایش", to: getAdPreviewPath(adId) }} ad={ad} card={card} deleteCompleteTo={backTo} returnTo={backTo} />
          <ActionDivider />
          <StateAdAction action={{ icon: "edit", label: "ویرایش", to: getAdEditPath(adId) }} ad={ad} card={card} deleteCompleteTo={backTo} returnTo={backTo} />
          <ActionDivider />
          <StateAdAction action={{ icon: "result", label: "ثبت نتیجه آگهی", to: getAdCloseResultPath(adId) }} ad={ad} card={card} deleteCompleteTo={backTo} returnTo={backTo} />
          <ActionDivider />
          <StateAdAction action={{ icon: "stats", label: "آمار", to: getAdVisitStatisticsPath(adId) }} ad={ad} card={card} deleteCompleteTo={backTo} returnTo={backTo} />
          <ActionDivider />
          <StateAdAction action={{ icon: "history", label: "تاریخچه پرداخت", to: getAdPaymentHistoryPath(adId) }} ad={ad} card={card} deleteCompleteTo={backTo} returnTo={backTo} />
        </section>
      </main>

      {isPublisherPickerOpen ? (
        <ManagerPublisherPickerPage
          onClose={() => setIsPublisherPickerOpen(false)}
          onConfirm={(nextPublisher) => {
            setPublisher(nextPublisher);
            setIsPublisherPickerOpen(false);
          }}
          selectedPublisher={publisher}
        />
      ) : null}
    </PageFrame>
  );
}

function ManagerAdSummary({
  ad,
  card,
}: {
  ad?: Record<string, unknown>;
  card: AdCardData;
}) {
  const subtitle = readText(ad?.category_title ?? ad?.categoryTitle ?? ad?.category_name ?? ad?.categoryName) ||
    "فروش مسکونی / فروش آپارتمان";

  return (
    <div className="mt-4 flex h-[68px] items-center rounded-2xl bg-[#fafafa] px-3 shadow-[0_2px_8px_rgba(26,26,26,0.04)] [direction:ltr]">
      <div className="min-w-0 flex-1 text-right [direction:rtl]">
        <p className="m-0 truncate text-xs font-normal leading-4 text-[#4d4d4d]">{subtitle}</p>
        <h2 className="m-0 mt-1 truncate text-sm font-medium leading-5 text-[#1a1a1a]">{card.title}</h2>
      </div>
      <div
        aria-hidden="true"
        className={`ad-card__image ${card.imageClassName} h-[52px] w-[78px] shrink-0 rounded-lg bg-cover bg-center`}
        style={card.imageUrl ? { backgroundImage: `url(${card.imageUrl})` } : undefined}
      />
    </div>
  );
}

function ManagerPublisherPickerPage({
  onClose,
  onConfirm,
  selectedPublisher,
}: {
  onClose: () => void;
  onConfirm: (publisher: ManagerPublisher) => void;
  selectedPublisher: ManagerPublisher;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [draftPublisherId, setDraftPublisherId] = useState(selectedPublisher.id);
  const normalizedSearch = searchValue.trim();
  const visiblePublishers = normalizedSearch
    ? managerPublisherOptions.filter((publisher) => publisher.name.includes(normalizedSearch))
    : managerPublisherOptions;
  const draftPublisher = managerPublisherOptions.find((publisher) => publisher.id === draftPublisherId) ?? selectedPublisher;

  return (
    <section
      aria-label="تغییر منتشرکننده"
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
        title="تغییر منتشرکننده"
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

        <div className="mt-5 grid gap-2" role="radiogroup" aria-label="انتخاب منتشرکننده">
          {visiblePublishers.map((publisher) => {
            const selected = draftPublisherId === publisher.id;

            return (
              <button
                aria-checked={selected}
                className="flex w-full py-2 px-4 items-center justify-between gap-3 rounded-lg bg-white text-right [direction:ltr] active:bg-[#f7f7f7]"
                key={publisher.id}
                onClick={() => setDraftPublisherId(publisher.id)}
                role="radio"
                type="button"
              >
                <RadioIndicator checked={selected} />
                <span className="flex min-w-0 flex-1 items-center gap-3 [direction:rtl]">
                  <img
                    alt=""
                    className={`h-14 w-14 shrink-0 object-cover ${publisher.type === "agency" ? "rounded-lg" : "rounded-full"}`}
                    draggable={false}
                    src={publisher.image}
                  />
                  <span className="text-[#1a1a1a]">{publisher.name}</span>
                </span>
              </button>
            );
          })}
        </div>
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <button
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white active:bg-[#003aa0]"
          onClick={() => onConfirm(draftPublisher)}
          type="button"
        >
          انتخاب
        </button>
      </footer>
    </section>
  );
}

function getStateAdBackPath(routeState: MyAdRouteState) {
  const activeRole = getActiveAuthRole(getStoredAuthSession());
  const returnTo = normalizeLocalPath(routeState.returnTo);

  if (returnTo) return returnTo;
  if (activeRole === USER) return "/account/my-ads";

  if (routeState.tab) return getBusinessAdManagementFallbackPath();

  if (activeRole) return getBusinessAdManagementFallbackPath();

  return "/account/my-ads";
}

function getBusinessAdManagementFallbackPath() {
  return window.matchMedia("(min-width: 501px)").matches
    ? "/account/dashboard/ads"
    : adManagementPaths.root;
}

function normalizeLocalPath(path?: string) {
  if (!path || !path.startsWith("/")) return undefined;
  if (path.startsWith("//")) return undefined;

  return path;
}

function readRouteState(): MyAdRouteState {
  const state = window.history.state;

  if (!state || typeof state !== "object") return {};

  return state as MyAdRouteState;
}

function readAdIdFromPath() {
  const match = window.location.pathname.match(/^\/account\/my-ads\/([^/]+)\/state-ad\/?$/);

  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function StateAdSummary({
  ad,
  card,
}: {
  ad?: Record<string, unknown>;
  card: AdCardData;
}) {
  const subtitle = readText(ad?.category_title ?? ad?.categoryTitle ?? ad?.category_name ?? ad?.categoryName) ||
    "فروش مسکونی / فروش آپارتمان";

  return (
    <div className="mt-4 flex h-[80px] items-center rounded-2xl border border-[#e6e6e6] bg-[#fafafa] px-3 [direction:ltr]">
      <div className="min-w-0 flex-1 text-right [direction:rtl]">
        <p className="m-0 truncate text-xs font-normal leading-5 text-[#808080]">
          {subtitle}
        </p>
        <h2 className="m-0 mt-1 truncate text-sm font-medium leading-5 text-[#1a1a1a]">
          {card.title}
        </h2>
      </div>

      <div
        aria-hidden="true"
        className={`ad-card__image ${card.imageClassName} h-[52px] w-[86px] shrink-0 rounded-lg bg-cover bg-center`}
        style={card.imageUrl ? { backgroundImage: `url(${card.imageUrl})` } : undefined}
      />
    </div>
  );
}

function PublishedMeta() {
  return (
    <div className="mt-4 text-sm font-medium leading-5">
      <MetaRow label="انتشار" value="۳ روز پیش" />
      <div className="border-t border-dashed border-[#cccccc]" aria-hidden="true" />
      <MetaRow label="انقضا" value="۱۲بهمن (۱۲روز دیگر)" />
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-12 items-center justify-between gap-4 [direction:ltr]">
      <span className="text-[#1a1a1a] [direction:rtl]">{value}</span>
      <span className="text-[#808080] [direction:rtl]">{label}</span>
    </div>
  );
}

function PendingReviewNotice() {
  return (
    <div className="mt-4 rounded-lg border border-[#ffb15d] bg-[#fff7ed] px-4 py-3 text-right">
      <p className="m-0 text-sm font-normal leading-7 text-[#1a1a1a]">
        این آگهی در صف بررسی سامانه قرار دارد.
        <br />
        پس از تایید، آگهی به صورت خودکار منتشر می‌شود.
      </p>

      <div className="mt-3 border-t border-dashed border-[#cccccc] pt-3">
        <div className="flex h-6 items-center justify-between gap-4 text-xs font-normal leading-4 [direction:ltr]">
          <span className="text-[#1a1a1a] [direction:rtl]">بین ۱ تا ۲ ساعت</span>
          <span className="inline-flex items-center gap-2 text-[#4d4d4d] [direction:rtl]">
            <ClockIcon className="h-5 w-5" />
            زمان تقریبی بررسی:
          </span>
        </div>
      </div>
    </div>
  );
}

function NeedsEditNotice({
  ad,
  card,
  returnTo,
}: {
  ad?: Record<string, unknown>;
  card: AdCardData;
  returnTo: string;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-[#ffd19c] bg-[#fff7ed] p-4 text-right">
      <p className="m-0 text-sm font-normal leading-7 text-[#1a1a1a]">
        برای انتشار مجدد آگهی، لطفا موارد زیر را اصلاح کنید.
      </p>

      <div className="mt-3 rounded-lg border border-[#ff6d00] bg-white px-3 py-3">
        <div className="flex items-center justify-start gap-2 text-[#ff6d00]">
          <AlertIcon className="h-5 w-5 shrink-0" />
          <h3 className="m-0 text-sm font-medium leading-5">دلیل توقف انتشار</h3>
        </div>

        <ul className="m-0 mt-2 list-disc space-y-2 pr-5 text-xs font-normal leading-6 text-[#1a1a1a] marker:text-[#808080]">
          <li>تصویر آگهی شامل شماره تلفن یا آدرس سایت است.</li>
          <li>این موارد مطابق قوانین انتشار مجاز نیستند.</li>
        </ul>
      </div>

      <RouteLink
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white no-underline"
        state={{
          ad,
          card,
          editReturnTo: window.location.pathname,
          isEditMode: true,
          returnTo,
        }}
        to={getAdEditPath(card.id)}
      >
        ویرایش آگهی
        <StateIcon className="h-5 w-5" icon="edit" />
      </RouteLink>
    </div>
  );
}

function getStateActions(status: MyAdStatusKey, adId: string): StateAction[] {
  const preview: StateAction = { icon: "preview", label: "پیش‌نمایش", to: getAdPreviewPath(adId) };
  const edit: StateAction = { icon: "edit", label: "ویرایش آگهی", to: getAdEditPath(adId) };
  const remove: StateAction = {
    icon: "delete",
    label: "حذف",
    to: `${adManagementPaths.delete}?adId=${encodeURIComponent(adId)}`,
  };
  const upgrade: StateAction = { icon: "upgrade", label: "افزایش بازدید", to: getAdIncreaseVisitsPath(adId) };
  const stats: StateAction = { icon: "stats", label: "آمار بازدید", to: getAdVisitStatisticsPath(adId) };
  const history: StateAction = { icon: "history", label: "تاریخچه پرداخت", to: getAdPaymentHistoryPath(adId) };

  if (status === "published") return [preview, edit, remove, upgrade, stats, history];
  if (status === "pending") return [preview, edit, remove, history];

  return [preview, history];
}

function StateAdAction({
  action,
  ad,
  card,
  deleteCompleteTo,
  returnTo,
}: {
  action: StateAction;
  ad?: Record<string, unknown>;
  card: AdCardData;
  deleteCompleteTo: string;
  returnTo: string;
}) {
  const content = (
    <>
      <ChevronLeftIcon className="h-6 w-6 text-[#4d4d4d]" />
      <span className="inline-flex items-center gap-2 text-base font-medium leading-6 text-[#1a1a1a] [direction:rtl]">
        <StateIcon className="h-6 w-6 text-[#4d4d4d]" icon={action.icon} />
        {action.label}
      </span>
    </>
  );

  if (action.to) {
    return (
      <RouteLink
        className="flex h-14 w-full items-center justify-between px-4 text-[#1a1a1a] no-underline [direction:ltr]"
        state={{
          ad: action.icon === "upgrade" && !ad ? card : ad,
          card,
          deleteCompleteTo: action.icon === "delete" ? deleteCompleteTo : undefined,
          deleteReturnTo: action.icon === "delete" ? window.location.pathname : undefined,
          editReturnTo: window.location.pathname,
          isEditMode: action.icon === "edit" ? true : undefined,
          paymentFlow: action.icon === "upgrade" ? "upgrade" : undefined,
          paymentHistoryReturnTo: action.icon === "history" ? window.location.pathname : undefined,
          visitStatisticsReturnTo: action.icon === "stats" ? window.location.pathname : undefined,
          returnTo,
        }}
        to={action.to}
      >
        {content}
      </RouteLink>
    );
  }

  return (
    <button
      className="flex h-14 w-full items-center justify-between px-4 text-[#1a1a1a] [direction:ltr]"
      type="button"
    >
      {content}
    </button>
  );
}

function ActionDivider() {
  return (
    <div className="flex h-[5px] items-center px-4" aria-hidden="true">
      <div className="h-px w-full bg-[#cccccc]" />
    </div>
  );
}

function StateIcon({ className = "", icon }: { className?: string; icon: StateActionKey }) {
  if (icon === "preview") {
    return (
      <LinearPreview className="h-6 w-6"/>
    );
  }

  if (icon === "edit") {
    return (
      <LinearEdit2 className="h-6 w-6"/>
    );
  }

  if (icon === "delete") {
    return (
      <LinearDelete className="h-6 w-6"/>
    );
  }

  if (icon === "upgrade") {
    return (
      <LinearChartUp className="h-6 w-6"/>
    );
  }

  if (icon === "result") {
    return (
      <LinearFlag className="w-6 h-6"/>
    );
  }

  if (icon === "stats") {
    return (
      <LinearAnalytics className="h-6 w-6"/>
    );
  }

  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M7 3h10v18l-5-2.5L7 21V3Z" />
      <path d="M13.8 9.2c-.4-.5-1-.7-1.8-.7-.9 0-1.6.5-1.6 1.2 0 1.8 3.5.8 3.5 2.8 0 .7-.7 1.2-1.7 1.2-.8 0-1.5-.3-2-.8M12.1 7.4v7.4" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m14 7-5 5 5 5" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function AlertIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M10.35 4.4 2.8 17.5A2 2 0 0 0 4.55 20.5h14.9a2 2 0 0 0 1.75-3L13.65 4.4a1.9 1.9 0 0 0-3.3 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function readText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return "";
}
