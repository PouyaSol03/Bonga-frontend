import { useMemo, useState } from "react";

import { PageFrame } from "../../shared/layout/PageFrame";
import { getRequestErrorState } from "../../shared/components/ErrorState";
import { TransientNotice } from "../../shared/components/TransientNotice";
import { getApiErrorMessage } from "../../shared/api/api";
import { storePaymentReturnTarget } from "../../shared/utils/payment-return";
import { TopBar } from "../../shared/components/TopBar";
import PricingCard from "./components/addWallet/PricingCard";
import { usePackagePaymentMutation, usePackagesQuery } from "../packages/api/package.hooks";
import { RouteLink } from "../../shared/navigation/RouteLink";
import { pushRoute } from "../../shared/navigation/navigation";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import LinearTooman from "../../shared/icons/LinearTooman";
import type { PackageItem } from "../packages/api/package.service";

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
          className="h-[238px] rounded-xl border border-outline-var bg-surface-container-lowest p-5"
          key={index}
        >
          <div className="mb-8 h-6 w-28 rounded-md bg-surface-container-high" />
          <div className="mb-4 h-4 w-20 rounded-md bg-surface-container-high" />
          <div className="mb-10 h-8 w-36 rounded-md bg-surface-container-high" />
          <div className="mt-auto h-11 w-full rounded-lg bg-surface-container-high" />
        </div>
      ))}
    </div>
  );
}

function EmptyPackagesState({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto w-full rounded-xl border border-dashed border-outline-var bg-surface-container-low px-4 py-10 text-center text-sm font-medium text-on-surface-var ${className}`}>
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
    <nav className="shrink-0 bg-surface-container-lowest px-4 py-4" aria-label="نوع افزایش اعتبار">
      <div className="flex h-11 overflow-hidden rounded-xl border border-primary [direction:ltr]">
        <Button unstyled
          className={`flex flex-1 items-center justify-center text-base font-medium leading-6 [direction:rtl] ${
            activeTab === "panel" ? "bg-primary-container text-primary" : "bg-surface-container-lowest text-on-surface-var"
          }`}
          onClick={() => onChange("panel")}
          type="button"
        >
          اعتبار پنل
        </Button>
        <Button unstyled
          className={`flex flex-1 items-center justify-center border-l border-primary text-base font-medium leading-6 [direction:rtl] ${
            activeTab === "packages" ? "bg-primary-container text-primary" : "bg-surface-container-lowest text-on-surface-var"
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
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-primary [direction:rtl]">
          {plan.title}
        </Typography>
      </div>
      <div className="mt-8 flex items-end gap-x-6">
        <div className="text-right">
          <Typography as="p" variant="body" size="large" weight="medium" className="m-0 text-base font-semibold leading-6 text-outline line-through">
            {toFaNumber(plan.originalPrice)}
          </Typography>
          <div className="mt-0.5 flex items-center justify-end gap-1 [direction:rtl]">
            <strong className="text-[22px] font-semibold leading-7 text-on-surface">
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
      <path d="m6.2 10 2.4 2.3 5.1-5.2" fill="none" stroke="var(--surface-container-lowest)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
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
      <div className="my-4 h-px border-t border-dashed border-outline-var" />
      <ul className="space-y-4">
        {(plan.benefits ?? []).map((benefit) => (
          <li className="flex h-6 items-center gap-2 text-base font-medium leading-6" key={benefit}>
            <MobileCheckSealIcon className="h-5 w-5 shrink-0 text-tertiary" />
            <Typography as="span" variant="body" size="medium" weight="regular">{benefit}</Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileGiftBenefits({ benefits }: { benefits: string[] }) {
  return (
    <div className="h-16 rounded-lg border border-tertiary bg-tertiary-container/20 px-4 py-2 text-tertiary">
      <div className="flex h-5 items-center justify-end gap-1 text-sm font-medium leading-5 text-tertiary">
        <MobileGiftIcon className="h-5 w-5" />
        <Typography as="span" variant="body" size="medium" weight="regular">بسته هدیه</Typography>
      </div>
      <div className="mt-2 flex h-5 items-center justify-between text-sm font-medium leading-5">
        {benefits.map((benefit, index) => (
          <Typography as="span" variant="body" size="medium" weight="regular"
            className={index < benefits.length - 1 ? "border-l border-tertiary/20 pl-4" : ""}
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
      className={`rounded-2xl border bg-gradient-to-b from-surface-container-lowest to-surface-container-low p-4 ${
        plan.selected ? "border-primary" : "border-outline-var"
      }`}
    >
      {isPackage ? (
        <MobilePackageContent plan={plan} />
      ) : (
        <MobilePanelContent plan={plan} showGift={showGift} />
      )}

      <Button
        className="mt-8 bg-primary text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
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
          className={`${showGift ? "h-[284px]" : "h-[204px]"} animate-pulse rounded-2xl border border-outline-var bg-surface-container-low p-4`}
          key={index}
        >
          <div className="mr-auto h-5 w-16 rounded bg-surface-container-high" />
          <div className="mt-7 mr-auto h-6 w-28 rounded bg-surface-container-high" />
          <div className="mt-9 h-10 rounded-lg bg-surface-container-high" />
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
  const returnTo =
    window.history.state?.returnTo ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("bonga:paymentReturnTo")
      : null) ||
    undefined;
  const initialPaymentTab =
    window.history.state?.initialPaymentTab === "packages" ? "packages" : "panel";
  const [activeTab, setActiveTab] = useState<MobilePaymentTab>(initialPaymentTab);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const packagePaymentMutation = usePackagePaymentMutation();
  const showGift = activeTab === "panel";
  const shownPlans = useMemo(() => {
    if (activeTab === "panel") {
      return packages
        .filter((plan) => plan.kind === "panel_subscription")
        .map((plan, index) => mapMobilePanelPlan(plan, index, true));
    }

    return packages
      .filter((plan) => plan.kind === "credit_bundle")
      .map((plan, index) => mapMobilePackagePlan(plan, index));
  }, [activeTab, packages]);

  const ErrorState = getRequestErrorState(error);

  function showNotice(text: string) {
    setMessage(null);
    window.setTimeout(() => setMessage(text), 10);
  }

  function handlePay(packageId: string) {
    if (packagePaymentMutation.isPending) return;

    setSelectedPackageId(packageId);
    packagePaymentMutation.mutate(
      { packageId, paymentType: 0 },
      {
        onError: (requestError) => {
          showNotice(getApiErrorMessage(requestError, "اتصال به درگاه پرداخت با خطا مواجه شد."));
        },
        onSuccess: ({ paymentUrl }) => {
          if (!paymentUrl) {
            showNotice("آدرس درگاه پرداخت از سرور دریافت نشد.");
            return;
          }

          storePaymentReturnTarget({
            kind: "package",
            label: "بازگشت به افزایش اعتبار",
            path: returnTo || "/account/dashboard/payments",
          });
          window.location.assign(paymentUrl);
        },
      },
    );
  }

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={returnTo ?? "/account/dashboard"}
        onBack={() => {
          if (returnTo) {
            try {
              sessionStorage.removeItem("bonga:paymentReturnTo");
            } catch {
              // ignore
            }
            pushRoute(returnTo);
          } else if (window.history.length > 1) {
            window.history.back();
          } else {
            pushRoute("/account/dashboard");
          }
        }}
        startSlot={
          <RouteLink
            className="inline-flex h-12 items-center px-3 text-sm font-medium leading-5 text-primary no-underline"
            to="/account/credit/history"
          >
            تاریخچه پرداخت
          </RouteLink>
        }
        title="افزایش اعتبار"
      />
      <MobileCreditTabs activeTab={activeTab} onChange={setActiveTab} />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container-lowest px-4 pb-4">
        {isError ? <ErrorState className="min-h-[420px]" onRetry={() => void refetch()} /> : null}

        {!isError && isLoading ? <MobilePlansSkeleton showGift={showGift} /> : null}

        {!isError && !isLoading && shownPlans.length > 0 ? (
          <div className="space-y-4">
            {shownPlans.map((plan) => (
              <MobilePlanCard
                isPackage={activeTab === "packages"}
                key={plan.id}
                onPay={() => handlePay(plan.id)}
                paymentPending={packagePaymentMutation.isPending && selectedPackageId === plan.id}
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
  const packagePaymentMutation = usePackagePaymentMutation();
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
    packagePaymentMutation.mutate(
      { packageId, paymentType: 0 },
      {
        onError: (requestError) => {
          setPaymentError(
            getApiErrorMessage(
              requestError,
              "اتصال به درگاه پرداخت با خطا مواجه شد.",
            ),
          );
        },
        onSuccess: ({ paymentUrl }) => {
          if (!paymentUrl) {
            setPaymentError("آدرس درگاه پرداخت از سرور دریافت نشد.");
            return;
          }

          storePaymentReturnTarget({
            kind: "package",
            label: "بازگشت به افزایش اعتبار",
            path: "/account/dashboard/payments",
          });
          window.location.assign(paymentUrl);
        },
      },
    );
  }

  return (
    <div dir="rtl" className="rounded-xl bg-surface-container-lowest p-6">
      {paymentError ? <TransientNotice message={paymentError} /> : null}

      <div className="mb-6 flex items-center justify-between border-b border-dashed border-outline-var pb-5">
        <div className="flex items-center gap-2">
          <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-9 w-9 place-items-center rounded-full bg-primary-container">
            <img className="h-5 w-5" src="/icons/walletPlus.svg" alt="" />
          </Typography>

          <Typography as="h1" variant="display" size="large" className="text-[22px] font-medium text-on-surface">
            افزایش اعتبار
          </Typography>
        </div>

        <RouteLink
          className="rounded-lg border border-primary px-3 py-2 text-xs font-medium text-primary no-underline"
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
            <Typography as="h2" variant="title" size="large" weight="medium" className="mb-4 text-[22px] font-medium text-on-surface">
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
            <Typography as="h2" variant="title" size="medium" weight="semibold" className="mb-4 text-right text-base font-semibold text-on-surface">
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
