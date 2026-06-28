import { PageFrame } from "../../app/PageFrame";
import { TopBar } from "../../components/TopBar";
import type { AdCardData } from "../../components/AdCard";
import { RouteLink } from "../../routes/RouteLink";
import { latestMashhadAds } from "../home/homeData";
import { getMyAdStatusInfo, type MyAdStatusKey } from "./myAdsStatus";

type MyAdRouteState = {
  ad?: Record<string, unknown>;
  card?: AdCardData;
  status?: MyAdStatusKey | string;
};

type StateActionKey = "delete" | "edit" | "history" | "preview" | "stats" | "upgrade";

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
  const statusQuery = new URLSearchParams(window.location.search).get("status") ?? undefined;
  const statusInfo = getMyAdStatusInfo(
    statusQuery ?? routeState.status ?? routeState.ad ?? routeState.card?.status,
    fallbackIndex,
    { useDemoFallback: true },
  );
  const card = routeState.card ?? fallbackCard;
  const sourceAd = routeState.ad;
  const actions = getStateActions(statusInfo.key, adId);

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/my-ads"
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
            <NeedsEditNotice ad={sourceAd} card={card} />
          ) : null}
        </section>

        <div className="h-2 shrink-0 bg-[#f0f0f0]" aria-hidden="true" />

        <section className="min-h-[300px] flex-1 bg-white" aria-label="عملیات آگهی">
          {actions.map((action, index) => (
            <div key={action.label}>
              <StateAdAction action={action} ad={sourceAd} card={card} />
              {index < actions.length - 1 ? <ActionDivider /> : null}
            </div>
          ))}
        </section>
      </main>
    </PageFrame>
  );
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
}: {
  ad?: Record<string, unknown>;
  card: AdCardData;
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
        state={{ ad, card }}
        to="/new-ad/details"
      >
        ویرایش آگهی
        <StateIcon className="h-5 w-5" icon="edit" />
      </RouteLink>
    </div>
  );
}

function getStateActions(status: MyAdStatusKey, adId: string): StateAction[] {
  const preview: StateAction = { icon: "preview", label: "پیش‌نمایش", to: `/ads/${adId}` };
  const edit: StateAction = { icon: "edit", label: "ویرایش", to: "/new-ad/details" };
  const remove: StateAction = { icon: "delete", label: "حذف" };
  const upgrade: StateAction = { icon: "upgrade", label: "افزایش بازدید", to: "/account/wallet" };
  const stats: StateAction = { icon: "stats", label: "آمار بازدید" };
  const history: StateAction = { icon: "history", label: "تاریخچه پرداخت", to: "/account/wallet/history" };

  if (status === "published") return [preview, edit, remove, upgrade, stats, history];
  if (status === "pending") return [preview, edit, remove, history];

  return [preview, history];
}

function StateAdAction({
  action,
  ad,
  card,
}: {
  action: StateAction;
  ad?: Record<string, unknown>;
  card: AdCardData;
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
        state={{ ad, card }}
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
      <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
        <rect height="13" rx="1.5" width="17" x="3.5" y="4" />
        <path d="m8 11 2 2 5-5M12 17v3M8.5 20h7" />
      </svg>
    );
  }

  if (icon === "edit") {
    return (
      <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
        <path d="M4.5 19.5h4l10-10a2.1 2.1 0 0 0-4-4l-10 10v4ZM13.5 6.5l4 4M19 15v5H4" />
      </svg>
    );
  }

  if (icon === "delete") {
    return (
      <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
        <path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 10v7M14 10v7" />
      </svg>
    );
  }

  if (icon === "upgrade") {
    return (
      <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="m5 16 6-6 4 4 5-7M15 7h5v5" />
      </svg>
    );
  }

  if (icon === "stats") {
    return (
      <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
        <rect height="17" rx="2" width="16" x="4" y="3" />
        <path d="M8 16v-4M12 16V8M16 16v-6M7 18h10" />
      </svg>
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
