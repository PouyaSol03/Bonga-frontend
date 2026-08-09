import { useMemo, useState } from "react";

import { PageFrame } from "../../app/layout/PageFrame";
import { getRequestErrorState } from "../../shared/components/ErrorState";
import { TransientNotice } from "../../shared/components/TransientNotice";
import { getApiErrorMessage } from "../../core/api/api";
import { storePaymentReturnTarget } from "../../shared/utils/payment-return";
import { TopBar } from "../../shared/components/TopBar";
import PricingCard from "./components/addWallet/PricingCard";
import { REAL_ESTATE_MANAGER } from "../../shared/constants/roles.constants";
import { getActiveAuthRole, getStoredAuthSession } from "../../core/auth/auth-storage";
import { useAgencyPackagePaymentMutation, usePackagesQuery } from "../../core/hooks/package.hooks";
import { useTransientNotice } from "../../core/hooks/useTransientNotice";
import { RouteLink } from "../../app/router/RouteLink";
import type { PackageItem } from "../../core/services/package.service";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import LinearTooman from "../../shared/icons/LinearTooman";

type PricingCardPlan = {
  discount: number;
  id: string;
  items?: {
    label: string;
    value: number;
  }[];
  price: number;
  priceAfterDiscount: number;
  title: string;
};

type MobilePaymentTab = "packages" | "panel";

type MobileCreditPlan = {
  benefits?: string[];
  currentPrice: number | string;
  discount: number;
  giftBenefits?: string[];
  id: string;
  originalPrice: number | string;
  selected?: boolean;
  title: string;
};

function getCreditItems(plan: PackageItem) {
  return [
    { label: "آگهی", value: plan.ad_credit },
    { label: "ویژه", value: plan.special_credit },
    { label: "بروزرسانی", value: plan.renew_credit },
  ].filter((item) => item.value > 0);
}

function mapPanelPlan(plan: PackageItem): PricingCardPlan {
  return {
    discount: plan.discount_percent,
    id: plan.id,
    price: plan.real_price,
    priceAfterDiscount: plan.final_price,
    title: plan.title,
  };
}

function mapBundlePlan(plan: PackageItem): PricingCardPlan {
  return {
    discount: plan.discount_percent,
    id: plan.id,
    items: getCreditItems(plan),
    price: plan.real_price,
    priceAfterDiscount: plan.final_price,
    title: plan.title,
  };
}

function useIsMobileDashboardPayment() {
  return true;
}

function PricingCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="h-[238px] rounded-xl border border-[#D9DDE7] bg-white p-5"
          key={index}
        >
          <div className="mb-8 h-6 w-28 rounded-md bg-[#E8E8E8]" />
          <div className="mb-4 h-4 w-20 rounded-md bg-[#E8E8E8]" />
          <div className="mb-10 h-8 w-36 rounded-md bg-[#E8E8E8]" />
          <div className="mt-auto h-11 w-full rounded-lg bg-[#E8E8E8]" />
        </div>
      ))}
    </div>
  );
}

function EmptyPackagesState({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto w-full rounded-xl border border-dashed border-[#D9DDE7] bg-[#F8FAFF] px-4 py-10 text-center text-sm font-medium text-[#666666] ${className}`}>
      بسته‌ای برای نمایش وجود ندارد.
    </div>
  );
}

function toFaNumber(value: number | string) {
  if (typeof value === "number") {
    return value.toLocaleString("fa-IR");
  }

  return String(value);
}

function getGiftBenefits(plan: PackageItem) {
  const benefits = getCreditItems(plan).map((item) => `${item.value.toLocaleString("fa-IR")} ${item.label}`);

  return benefits;
}

function mapMobilePanelPlan(plan: PackageItem, index: number, hasManagerGift: boolean): MobileCreditPlan {
  const giftBenefits = hasManagerGift ? getGiftBenefits(plan) : [];

  return {
    currentPrice: plan.final_price,
    discount: plan.discount_percent,
    giftBenefits,
    id: plan.id,
    originalPrice: plan.real_price,
    selected: index === 0,
    title: plan.title,
  };
}

function mapMobilePackagePlan(plan: PackageItem, index: number): MobileCreditPlan {
  return {
    benefits: getCreditItems(plan).map((item) => `${item.value.toLocaleString("fa-IR")} اعتبار ${item.label}`),
    currentPrice: plan.final_price,
    discount: plan.discount_percent,
    id: plan.id,
    originalPrice: plan.real_price,
    selected: index === 0,
    title: plan.title,
  };
}

function MobileCreditTabs({ activeTab, onChange }: { activeTab: MobilePaymentTab; onChange: (tab: MobilePaymentTab) => void }) {
  return (
    <nav className="shrink-0 bg-white px-4 py-4" aria-label="نوع افزایش اعتبار">
      <div className="flex h-11 overflow-hidden rounded-xl border border-[#0048c4] [direction:ltr]">
        <Button unstyled
          className={`flex flex-1 items-center justify-center text-base font-medium leading-6 [direction:rtl] ${
            activeTab === "panel" ? "bg-[#0048c41f] text-[#002099]" : "bg-white text-[#4d4d4d]"
          }`}
          onClick={() => onChange("panel")}
          type="button"
        >
          اعتبار پنل
        </Button>
        <Button unstyled
          className={`flex flex-1 items-center justify-center border-l border-[#0048c4] text-base font-medium leading-6 [direction:rtl] ${
            activeTab === "packages" ? "bg-[#0048c41f] text-[#002099]" : "bg-white text-[#4d4d4d]"
          }`}
          onClick={() => onChange("packages")}
          type="button"
        >
          بسته‌ها
        </Button>
      </div>
    </nav>
  );
}

function MobileDiscountBadge({ discount }: { discount: number }) {
  if (!discount) return null;

  return (
    <Typography as="p" variant="body" size="medium" weight="medium" className="rounded-full bg-error/8 px-3 py-1 text-error">
      {toFaNumber(discount)}٪ تخفیف
    </Typography>
  );
}

function MobilePrice({ plan }: { plan: MobileCreditPlan }) {
  return (
    <>
      <div className="flex h-6 items-center">
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-[#0048c4] [direction:rtl]">
          {plan.title}
        </Typography>
      </div>
      <div className="mt-8 flex items-end gap-x-6">
        <div className="text-right">
          <Typography as="p" variant="body" size="large" weight="medium" className="m-0 text-base font-semibold leading-6 text-[#a6a6a6] line-through">
            {toFaNumber(plan.originalPrice)}
          </Typography>
          <div className="mt-0.5 flex items-center justify-end gap-1 [direction:rtl]">
            <strong className="text-[22px] font-semibold leading-7 text-[#1a1a1a]">
              {toFaNumber(plan.currentPrice)}
            </strong>
            <LinearTooman className="h-6 w-6 text-on-surface-var"/>
          </div>
        </div>
        <MobileDiscountBadge discount={plan.discount} />
      </div>
    </>
  );
}

function MobileCheckSealIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 1.4 12.4 3l2.9-.1.8 2.8 2 2-1.3 2.6.4 2.9-2.8 1-1.8 2.2-2.6-1.2-2.6 1.2-1.8-2.2-2.8-1 .4-2.9-1.3-2.6 2-2 .8-2.8 2.9.1L10 1.4Z" />
      <path d="m6.2 10 2.4 2.3 5.1-5.2" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

function MobileGiftIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 20 20">
      <path d="M3 8h14v3H3V8ZM4.5 11h11v6h-11v-6ZM10 8v9" />
      <path d="M10 8H7.2a2.1 2.1 0 1 1 0-4.2C9.1 3.8 10 8 10 8Zm0 0h2.8a2.1 2.1 0 1 0 0-4.2C10.9 3.8 10 8 10 8Z" />
    </svg>
  );
}

function MobilePackageContent({ plan }: { plan: MobileCreditPlan }) {
  return (
    <div className="">
      <div className="">
        <MobilePrice plan={plan} />
      </div>
      <div className="my-4 h-px border-t border-dashed border-[#cccccc]" />
      <ul className="space-y-4">
        {(plan.benefits ?? []).map((benefit) => (
          <li className="flex h-6 items-center gap-2 text-base font-medium leading-6" key={benefit}>
            <MobileCheckSealIcon className="h-5 w-5 shrink-0 text-[#11a366]" />
            <Typography as="span" variant="body" size="medium" weight="regular">{benefit}</Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileGiftBenefits({ benefits }: { benefits: string[] }) {
  return (
    <div className="h-16 rounded-lg border border-[#11a366] bg-[#11a36614] px-4 py-2 text-[#006038]">
      <div className="flex h-5 items-center justify-end gap-1 text-sm font-medium leading-5 text-[#11a366]">
        <MobileGiftIcon className="h-5 w-5" />
        <Typography as="span" variant="body" size="medium" weight="regular">بسته هدیه</Typography>
      </div>
      <div className="mt-2 flex h-5 items-center justify-between text-sm font-medium leading-5">
        {benefits.map((benefit, index) => (
          <Typography as="span" variant="body" size="medium" weight="regular"
            className={index < benefits.length - 1 ? "border-l border-[#00603829] pl-4" : ""}
            key={benefit}
          >
            {benefit}
          </Typography>
        ))}
      </div>
    </div>
  );
}

function MobilePanelContent({ plan, showGift }: { plan: MobileCreditPlan; showGift: boolean }) {
  const hasGiftBenefits = showGift && Boolean(plan.giftBenefits?.length);

  return (
    <div>
      <div className="">
        <MobilePrice plan={plan} />
      </div>
      {hasGiftBenefits ? <MobileGiftBenefits benefits={plan.giftBenefits ?? []} /> : null}
    </div>
  );
}

function MobilePlanCard({
  isPackage,
  onPay,
  paymentPending,
  plan,
  showGift,
}: {
  isPackage: boolean;
  onPay: () => void;
  paymentPending: boolean;
  plan: MobileCreditPlan;
  showGift: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border bg-gradient-to-b from-white to-[#edf1fa] p-4 ${
        plan.selected ? "border-[#0048c4]" : "border-[#cccccc]"
      }`}
    >
      {isPackage ? (
        <MobilePackageContent plan={plan} />
      ) : (
        <MobilePanelContent plan={plan} showGift={showGift} />
      )}

      <Button
        className="mt-8 bg-[#0048c4] text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={paymentPending}
        onClick={onPay}
        size="x-medium"
        radius="medium"
        fullWidth
        type="button"
      >
        پرداخت
      </Button>
    </article>
  );
}

function MobilePlansSkeleton({ showGift = false }: { showGift?: boolean }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className={`${showGift ? "h-[284px]" : "h-[204px]"} animate-pulse rounded-2xl border border-[#cccccc] bg-[#f7f9fe] p-4`}
          key={index}
        >
          <div className="mr-auto h-5 w-16 rounded bg-[#e6eaf3]" />
          <div className="mt-7 mr-auto h-6 w-28 rounded bg-[#e6eaf3]" />
          <div className="mt-9 h-10 rounded-lg bg-[#e6eaf3]" />
        </div>
      ))}
    </div>
  );
}

function DashboardPaymentMobilePage({
  error,
  isError,
  isLoading,
  packages,
  refetch,
}: {
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  packages: PackageItem[];
  refetch: () => void;
}) {
  const initialPaymentTab =
    window.history.state?.initialPaymentTab === "packages" ? "packages" : "panel";
  const [activeTab, setActiveTab] = useState<MobilePaymentTab>(initialPaymentTab);
  const [payingPackageId, setPayingPackageId] = useState<string | null>(null);
  const { message, showNotice } = useTransientNotice();
  const packagePaymentMutation = useAgencyPackagePaymentMutation();
  const activeRole = getActiveAuthRole(getStoredAuthSession());
  const isManager = activeRole === REAL_ESTATE_MANAGER;
  const panelPlans = useMemo(
    () => packages
      .filter((plan) => plan.kind === "panel_subscription")
      .map((plan, index) => mapMobilePanelPlan(plan, index, isManager)),
    [isManager, packages],
  );
  const packagePlans = useMemo(
    () => packages
      .filter((plan) => plan.kind === "credit_bundle")
      .map(mapMobilePackagePlan),
    [packages],
  );
  const ErrorState = getRequestErrorState(error);
  const shownPlans = activeTab === "packages" ? packagePlans : panelPlans;
  const showGift = activeTab === "panel" && isManager;

  function handlePay(packageId: string) {
    if (packagePaymentMutation.isPending) return;

    setPayingPackageId(packageId);
    packagePaymentMutation.mutate(packageId, {
      onError: (paymentError) => {
        setPayingPackageId(null);
        showNotice(
          getApiErrorMessage(
            paymentError,
            "اتصال به درگاه پرداخت با خطا مواجه شد.",
          ),
        );
      },
      onSuccess: ({ paymentUrl }) => {
        storePaymentReturnTarget({
          label: "بازگشت به افزایش اعتبار",
          path: "/account/dashboard/payments",
        });
        window.location.assign(paymentUrl);
      },
    });
  }

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/dashboard"
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
      <MobileCreditTabs activeTab={activeTab} onChange={setActiveTab} />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pb-4">
        {isError ? <ErrorState className="min-h-[420px]" onRetry={() => void refetch()} /> : null}

        {!isError && isLoading ? <MobilePlansSkeleton showGift={showGift} /> : null}

        {!isError && !isLoading && shownPlans.length > 0 ? (
          <div className="space-y-4">
            {shownPlans.map((plan) => (
              <MobilePlanCard
                isPackage={activeTab === "packages"}
                key={plan.id}
                onPay={() => handlePay(plan.id)}
                paymentPending={packagePaymentMutation.isPending && payingPackageId === plan.id}
                plan={plan}
                showGift={showGift}
              />
            ))}
          </div>
        ) : null}

        {!isError && !isLoading && shownPlans.length === 0 ? (
          <EmptyPackagesState className="mt-2" />
        ) : null}
      </main>
      <TransientNotice message={message} />
    </PageFrame>
  );
}

function DashboardPaymentDesktopPage({
  error,
  isError,
  isLoading,
  packages,
  refetch,
}: {
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  packages: PackageItem[];
  refetch: () => void;
}) {
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const packagePaymentMutation = useAgencyPackagePaymentMutation();
  const panelCreditPlans = packages
    .filter((plan) => plan.kind === "panel_subscription")
    .map(mapPanelPlan);
  const packagePlans = packages
    .filter((plan) => plan.kind === "credit_bundle")
    .map(mapBundlePlan);
  const ErrorState = getRequestErrorState(error);

  function handlePay(packageId: string) {
    if (packagePaymentMutation.isPending) return;

    setPaymentError(null);
    packagePaymentMutation.mutate(packageId, {
      onError: (requestError) => {
        setPaymentError(
          getApiErrorMessage(
            requestError,
            "اتصال به درگاه پرداخت با خطا مواجه شد.",
          ),
        );
      },
      onSuccess: ({ paymentUrl }) => {
        storePaymentReturnTarget({
          label: "بازگشت به افزایش اعتبار",
          path: "/account/dashboard/payments",
        });
        window.location.assign(paymentUrl);
      },
    });
  }

  return (
    <div dir="rtl" className="rounded-xl bg-white p-6">
      {paymentError ? <TransientNotice message={paymentError} /> : null}

      <div className="mb-6 flex items-center justify-between border-b border-dashed border-[#D9DDE7] pb-5">
        <div className="flex items-center gap-2">
          <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-9 w-9 place-items-center rounded-full bg-[#DBE6FF]">
            <img className="h-5 w-5" src="/icons/walletPlus.svg" alt="" />
          </Typography>

          <Typography as="h1" variant="display" size="large" className="text-[22px] font-medium text-[#1F2937]">
            افزایش اعتبار
          </Typography>
        </div>

        <RouteLink
          className="rounded-lg border border-[#0048C4] px-3 py-2 text-xs font-medium text-[#0048C4] no-underline"
          to="/account/credit/history"
        >
          تاریخچه پرداخت
        </RouteLink>
      </div>

      {isError ? (
        <ErrorState className="min-h-[420px]" onRetry={() => void refetch()} />
      ) : null}

      {!isError ? (
        <>
          <section>
            <Typography as="h2" variant="title" size="large" weight="medium" className="mb-4 text-[22px] font-medium text-[#1F2937]">
              اعتبار پنل
            </Typography>

            {isLoading ? <PricingCardsSkeleton /> : null}

            {!isLoading && panelCreditPlans.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {panelCreditPlans.map((plan) => (
                  <PricingCard
                    key={plan.id}
                    title={plan.title}
                    price={plan.price}
                    discount={plan.discount}
                    priceAfterDiscount={plan.priceAfterDiscount}
                    onPay={() => handlePay(plan.id)}
                  />
                ))}
              </div>
            ) : null}

            {!isLoading && panelCreditPlans.length === 0 ? (
              <EmptyPackagesState />
            ) : null}
          </section>

          <section className="mt-10">
            <Typography as="h2" variant="title" size="medium" weight="semibold" className="mb-4 text-right text-base font-semibold text-[#1F2937]">
              بسته‌ها
            </Typography>

            {isLoading ? <PricingCardsSkeleton count={2} /> : null}

            {!isLoading && packagePlans.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {packagePlans.map((plan) => (
                  <PricingCard
                    key={plan.id}
                    title={plan.title}
                    price={plan.price}
                    discount={plan.discount}
                    priceAfterDiscount={plan.priceAfterDiscount}
                    items={plan.items}
                    onPay={() => handlePay(plan.id)}
                  />
                ))}
              </div>
            ) : null}

            {!isLoading && packagePlans.length === 0 ? <EmptyPackagesState /> : null}
          </section>
        </>
      ) : null}
    </div>
  );
}

export default function DashboardPaymentPage() {
  const { data: packages = [], error, isError, isLoading, refetch } = usePackagesQuery();
  const isMobile = useIsMobileDashboardPayment();
  const sharedProps = { error, isError, isLoading, packages, refetch };

  if (isMobile) {
    return <DashboardPaymentMobilePage {...sharedProps} />;
  }

  return <DashboardPaymentDesktopPage {...sharedProps} />;
}
