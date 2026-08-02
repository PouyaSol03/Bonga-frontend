import { PageFrame } from "../../../app/PageFrame";
import { TransientNotice } from "../../../components/TransientNotice";
import { TopBar } from "../../../components/TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import { useTransientNotice } from "../../../hooks/useTransientNotice";
import { usePackagesQuery } from "../../../hooks/package.hooks";
import type { PackageItem } from "../../../services/package.service";

import { Typography } from "../../../components/ui/Typography";
import { Button } from "../../../components/ui/Button";

type CreditView = "packages" | "panel" | "panel-bonus";
type CreditPlan = {
  benefits?: string[];
  currentPrice: string;
  discountPercent: number;
  giftBenefits?: string[];
  id: string;
  name: string;
  originalPrice: string;
  selected?: boolean;
};

function formatCreditNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function getCreditBenefits(plan: PackageItem, withCreditLabel = false) {
  return [
    { label: "آگهی", value: plan.ad_credit },
    { label: "ویژه", value: plan.special_credit },
    { label: "بروزرسانی", value: plan.renew_credit },
  ]
    .filter((item) => item.value > 0)
    .map((item) =>
      `${formatCreditNumber(item.value)} ${withCreditLabel ? "اعتبار " : ""}${item.label}`,
    );
}

function mapPackageToCreditPlan(
  plan: PackageItem,
  index: number,
  view: CreditView,
): CreditPlan {
  const isBundle = view === "packages";
  const showGiftBenefits = view === "panel-bonus";

  return {
    benefits: isBundle ? getCreditBenefits(plan, true) : undefined,
    currentPrice: formatCreditNumber(plan.final_price),
    discountPercent: plan.discount_percent,
    giftBenefits: showGiftBenefits ? getCreditBenefits(plan) : undefined,
    id: plan.id,
    name: plan.title,
    originalPrice: formatCreditNumber(plan.real_price),
    selected: index === 0,
  };
}


export function IndependentConsultantCreditPage({ view }: { view: CreditView }) {
  const { message, showNotice } = useTransientNotice();
  const packagesQuery = usePackagesQuery();
  const isPackages = view === "packages";
  const hasGiftBenefits = view === "panel-bonus";
  const plans = (packagesQuery.data ?? [])
    .filter((plan) =>
      isPackages ? plan.kind === "credit_bundle" : plan.kind === "panel_subscription",
    )
    .map((plan, index) => mapPackageToCreditPlan(plan, index, view));

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <CreditTopBar />
      <CreditTabs activeTab={isPackages ? "packages" : "panel"} />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pb-4">
        {packagesQuery.isLoading ? (
          <CreditPlansSkeleton count={3} />
        ) : packagesQuery.isError ? (
          <CreditPlansStatus
            actionLabel="تلاش دوباره"
            message="دریافت بسته‌های اعتبار با خطا مواجه شد."
            onAction={() => void packagesQuery.refetch()}
          />
        ) : plans.length > 0 ? (
          <div className="space-y-4">
            {plans.map((plan) => (
              <CreditPlanCard
                hasGiftBenefits={hasGiftBenefits}
                isPackage={isPackages}
                key={plan.id}
                onPay={() =>
                  showNotice("خرید این بسته هنوز به سرویس پرداخت متصل نشده است.")
                }
                plan={plan}
              />
            ))}
          </div>
        ) : (
          <CreditPlansStatus message="بسته‌ای برای نمایش وجود ندارد." />
        )}
      </main>
      <TransientNotice message={message} />
    </PageFrame>
  );
}

function CreditTopBar() {
  return (
    <TopBar
      backTo="/account"
      startSlot={
        <RouteLink
          className="inline-flex h-12 items-center px-3 text-sm font-medium leading-5 text-[#0048c4] no-underline"
          to="/account/credit/history"
        >
          تاریخچه پرداخت
        </RouteLink>
      }
      title="افزایش اعتبار"
    />
  );
}

function CreditTabs({ activeTab }: { activeTab: "packages" | "panel" }) {
  return (
    <nav className="shrink-0 bg-white px-4 py-4" aria-label="نوع افزایش اعتبار">
      <div className="flex h-11 overflow-hidden rounded-xl border border-[#0048c4] [direction:ltr]">
        <RouteLink
          className={`flex flex-1 items-center justify-center text-base font-medium leading-6 no-underline [direction:rtl] ${
            activeTab === "panel" ? "bg-[#0048c41f] text-[#002099]" : "bg-white text-[#4d4d4d]"
          }`}
          to="/account/credit/panel"
        >
          اعتبار پنل
        </RouteLink>
        <RouteLink
          className={`flex flex-1 items-center justify-center border-l border-[#0048c4] text-base font-medium leading-6 no-underline [direction:rtl] ${
            activeTab === "packages" ? "bg-[#0048c41f] text-[#002099]" : "bg-white text-[#4d4d4d]"
          }`}
          to="/account/credit/packages"
        >
          بسته‌ها
        </RouteLink>
      </div>
    </nav>
  );
}

function CreditPlanCard({
  hasGiftBenefits,
  isPackage,
  plan,
  onPay,
}: {
  hasGiftBenefits: boolean;
  isPackage: boolean;
  plan: CreditPlan;
  onPay: () => void;
}) {
  return (
    <article
      className={`rounded-2xl border bg-gradient-to-b from-white to-[#edf1fa] p-4 ${
        plan.selected ? "border-[#0048c4]" : "border-[#cccccc]"
      }`}
    >
      {isPackage ? (
        <PackageCardContent plan={plan} />
      ) : hasGiftBenefits ? (
        <PanelBonusCardContent plan={plan} />
      ) : (
        <PanelCardContent plan={plan} />
      )}

      <Button unstyled
        className="mt-4 h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
        onClick={onPay}
        type="button"
      >
        پرداخت
      </Button>
    </article>
  );
}

function PanelCardContent({ plan }: { plan: CreditPlan }) {
  return (
    <div className="h-[124px]">
      <CreditPrice plan={plan} />
    </div>
  );
}

function PanelBonusCardContent({ plan }: { plan: CreditPlan }) {
  return (
    <div className="h-[204px]">
      <div className="h-[124px]">
        <CreditPrice plan={plan} />
      </div>
      <GiftBenefits benefits={plan.giftBenefits ?? []} />
    </div>
  );
}

function PackageCardContent({ plan }: { plan: CreditPlan }) {
  return (
    <div className="h-[261px]">
      <div className="h-[108px]">
        <CreditPrice plan={plan} />
      </div>
      <div className="my-4 h-px border-t border-dashed border-[#cccccc]" />
      <ul className="space-y-4">
        {(plan.benefits ?? []).map((benefit) => (
          <li className="flex h-6 items-center gap-2 text-base font-medium leading-6" key={benefit}>
            <CheckSealIcon className="h-5 w-5 shrink-0 text-[#11a366]" />
            <Typography as="span" variant="body" size="medium" weight="regular">{benefit}</Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CreditPrice({ plan }: { plan: CreditPlan }) {
  return (
    <>
      <div className="flex h-6 items-center justify-end">
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 text-[#0048c4] [direction:rtl]">{plan.name}</Typography>
      </div>
      <div className="mt-4 flex h-[68px] items-end justify-between [direction:ltr]">
        {plan.discountPercent > 0 ? (
          <Typography as="span" variant="body" size="small" weight="regular" className="mb-1 rounded-lg border border-[#ee3623] bg-white px-2 py-1 text-xs font-normal leading-4 text-[#ee3623]">
            {formatCreditNumber(plan.discountPercent)}٪ تخفیف
          </Typography>
        ) : (
          <span />
        )}
        <div className="text-right [direction:rtl]">
          <Typography as="p" variant="body" size="large" weight="medium" className="m-0 text-base font-semibold leading-6 text-[#a6a6a6] line-through">{plan.originalPrice}</Typography>
          <div className="mt-0.5 flex items-center justify-end gap-1 [direction:rtl]">
            <strong className="text-[22px] font-semibold leading-7 text-[#1a1a1a]">{plan.currentPrice}</strong>
            <Typography as="span" variant="label" size="small" weight="medium" className="text-xs font-medium leading-4 text-[#1a1a1a]">تومان</Typography>
          </div>
        </div>
      </div>
    </>
  );
}

function GiftBenefits({ benefits }: { benefits: string[] }) {
  return (
    <div className="h-16 rounded-lg border border-[#11a366] bg-[#11a36614] px-4 py-2 text-[#006038]">
      <div className="flex h-5 items-center justify-end gap-1 text-sm font-medium leading-5 text-[#11a366]">
        <GiftIcon className="h-5 w-5" />
        <Typography as="span" variant="body" size="medium" weight="regular">بسته هدیه</Typography>
      </div>
      <div className="mt-2 flex h-5 items-center justify-between text-sm font-medium leading-5">
        {benefits.map((benefit, index) => (
          <Typography as="span" variant="body" size="medium" weight="regular"
            className={`${index < benefits.length - 1 ? "border-l border-[#00603829] pl-4" : ""}`}
            key={benefit}
          >
            {benefit}
          </Typography>
        ))}
      </div>
    </div>
  );
}

function CreditPlansSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-4" aria-label="در حال دریافت بسته‌های اعتبار" role="status">
      {Array.from({ length: count }, (_, index) => (
        <div
          className="h-[204px] animate-pulse rounded-2xl border border-[#e0e0e0] bg-[#f7f9fe]"
          key={index}
        />
      ))}
    </div>
  );
}

function CreditPlansStatus({
  actionLabel,
  message,
  onAction,
}: {
  actionLabel?: string;
  message: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d9d9d9] px-4 py-10 text-center">
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-[#808080]">
        {message}
      </Typography>
      {actionLabel && onAction ? (
        <Button
          unstyled
          className="mt-4 h-10 rounded-lg border border-[#0048c4] px-5 text-sm font-medium text-[#0048c4]"
          onClick={onAction}
          type="button"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

function CheckSealIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 1.4 12.4 3l2.9-.1.8 2.8 2 2-1.3 2.6.4 2.9-2.8 1-1.8 2.2-2.6-1.2-2.6 1.2-1.8-2.2-2.8-1 .4-2.9-1.3-2.6 2-2 .8-2.8 2.9.1L10 1.4Z" />
      <path d="m6.2 10 2.4 2.3 5.1-5.2" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

function GiftIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 20 20">
      <path d="M3 8h14v3H3V8ZM4.5 11h11v6h-11v-6ZM10 8v9" />
      <path d="M10 8H7.2a2.1 2.1 0 1 1 0-4.2C9.1 3.8 10 8 10 8Zm0 0h2.8a2.1 2.1 0 1 0 0-4.2C10.9 3.8 10 8 10 8Z" />
    </svg>
  );
}
