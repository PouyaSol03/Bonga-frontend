import { useEffect, useMemo, useState } from "react";

import { PageFrame } from "../../shared/layout/PageFrame";
import { getRequestErrorState } from "../../shared/components/ErrorState";
import { useToast } from "../../shared/hooks/useToast";
import { getApiErrorMessage } from "../../shared/api/api";
import { storePaymentReturnTarget } from "../../shared/utils/payment-return";
import { TopBar } from "../../shared/components/TopBar";
import PricingCard from "./components/addWallet/PricingCard";
import { usePackagePaymentMutation, usePackagesQuery } from "../packages/api/package.hooks";
import { PackagePaymentPage } from "../packages/components/PackagePaymentPage";
import { useWalletQuery } from "../account/api/account.hooks";
import type { PackagePaymentType, PackageItem } from "../packages/api/package.service";
import { Link, useNavigate } from "react-router";
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
          className="border-outline-var bg-surface-container-lowest h-[238px] rounded-xl border p-5"
          key={index}
        >
          <div className="bg-surface-container-high mb-8 h-6 w-28 rounded-md" />
          <div className="bg-surface-container-high mb-4 h-4 w-20 rounded-md" />
          <div className="bg-surface-container-high mb-10 h-8 w-36 rounded-md" />
          <div className="bg-surface-container-high mt-auto h-11 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function EmptyPackagesState({ className = "" }: { className?: string }) {
  return (
    <div
      className={`border-outline-var bg-surface-container-low text-on-surface-var mx-auto w-full rounded-xl border border-dashed px-4 py-10 text-center text-sm font-medium ${className}`}
    >
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
  const benefits = getCreditItems(plan).map(
    (item) => `${item.value.toLocaleString("fa-IR")} ${item.label}`,
  );

  return benefits;
}

function mapMobilePanelPlan(
  plan: PackageItem,
  index: number,
  hasManagerGift: boolean,
): MobileCreditPlan {
  const giftBenefits = hasManagerGift ? getGiftBenefits(plan) : [];

  return {
    currentPrice: plan.final_price,
    discount: plan.discount_percent,
    giftBenefits,
    id: String(plan.id),
    originalPrice: plan.real_price,
    selected: index === 0,
    title: plan.title,
  };
}

function mapMobilePackagePlan(plan: PackageItem, index: number): MobileCreditPlan {
  return {
    benefits: getCreditItems(plan).map(
      (item) => `${item.value.toLocaleString("fa-IR")} اعتبار ${item.label}`,
    ),
    currentPrice: plan.final_price,
    discount: plan.discount_percent,
    id: String(plan.id),
    originalPrice: plan.real_price,
    selected: index === 0,
    title: plan.title,
  };
}

function MobileCreditTabs({
  activeTab,
  onChange,
}: {
  activeTab: MobilePaymentTab;
  onChange: (tab: MobilePaymentTab) => void;
}) {
  return (
    <nav className="bg-surface-container-lowest shrink-0 px-4 py-4" aria-label="نوع افزایش اعتبار">
      <div className="border-primary flex h-11 overflow-hidden rounded-xl border [direction:ltr]">
        <Button
          unstyled
          className={`flex flex-1 items-center justify-center text-base leading-6 font-medium [direction:rtl] ${
            activeTab === "panel"
              ? "bg-primary-container text-primary"
              : "bg-surface-container-lowest text-on-surface-var"
          }`}
          onClick={() => onChange("panel")}
          type="button"
        >
          اعتبار پنل
        </Button>
        <Button
          unstyled
          className={`border-primary flex flex-1 items-center justify-center border-l text-base leading-6 font-medium [direction:rtl] ${
            activeTab === "packages"
              ? "bg-primary-container text-primary"
              : "bg-surface-container-lowest text-on-surface-var"
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
    <Typography
      as="p"
      variant="body"
      size="medium"
      weight="medium"
      className="bg-error/8 text-error rounded-full px-3 py-1"
    >
      {toFaNumber(discount)}٪ تخفیف
    </Typography>
  );
}

function MobilePrice({ plan }: { plan: MobileCreditPlan }) {
  return (
    <>
      <div className="flex h-6 items-center">
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-primary m-0 [direction:rtl]"
        >
          {plan.title}
        </Typography>
      </div>
      <div className="mt-8 flex items-end gap-x-6">
        <div className="text-right">
          <Typography
            as="p"
            variant="body"
            size="large"
            weight="medium"
            className="text-outline m-0 text-base leading-6 font-semibold line-through"
          >
            {toFaNumber(plan.originalPrice)}
          </Typography>
          <div className="mt-0.5 flex items-center justify-end gap-1 [direction:rtl]">
            <strong className="text-on-surface text-[22px] leading-7 font-semibold">
              {toFaNumber(plan.currentPrice)}
            </strong>
            <LinearTooman className="text-on-surface-var h-6 w-6" />
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
      <path
        d="m6.2 10 2.4 2.3 5.1-5.2"
        fill="none"
        stroke="var(--surface-container-lowest)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function MobileGiftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 20 20"
    >
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
      <div className="border-outline-var my-4 h-px border-t border-dashed" />
      <ul className="space-y-4">
        {(plan.benefits ?? []).map((benefit) => (
          <li className="flex h-6 items-center gap-2 text-base leading-6 font-medium" key={benefit}>
            <MobileCheckSealIcon className="text-tertiary h-5 w-5 shrink-0" />
            <Typography as="span" variant="body" size="medium" weight="regular">
              {benefit}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileGiftBenefits({ benefits }: { benefits: string[] }) {
  return (
    <div className="border-tertiary bg-tertiary-container/20 text-tertiary h-16 rounded-lg border px-4 py-2">
      <div className="text-tertiary flex h-5 items-center justify-end gap-1 text-sm leading-5 font-medium">
        <MobileGiftIcon className="h-5 w-5" />
        <Typography as="span" variant="body" size="medium" weight="regular">
          بسته هدیه
        </Typography>
      </div>
      <div className="mt-2 flex h-5 items-center justify-between text-sm leading-5 font-medium">
        {benefits.map((benefit, index) => (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className={index < benefits.length - 1 ? "border-tertiary/20 border-l pl-4" : ""}
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
      className={`from-surface-container-lowest to-surface-container-low rounded-2xl border bg-gradient-to-b p-4 ${
        plan.selected ? "border-primary" : "border-outline-var"
      }`}
    >
      {isPackage ? (
        <MobilePackageContent plan={plan} />
      ) : (
        <MobilePanelContent plan={plan} showGift={showGift} />
      )}

      <Button
        className="bg-primary text-on-primary mt-8 disabled:cursor-not-allowed disabled:opacity-60"
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
          className={`${showGift ? "h-[284px]" : "h-[204px]"} border-outline-var bg-surface-container-low animate-pulse rounded-2xl border p-4`}
          key={index}
        >
          <div className="bg-surface-container-high mr-auto h-5 w-16 rounded" />
          <div className="bg-surface-container-high mt-7 mr-auto h-6 w-28 rounded" />
          <div className="bg-surface-container-high mt-9 h-10 rounded-lg" />
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
  const navigate = useNavigate();
  const returnTo =
    window.history.state?.returnTo ||
    (typeof window !== "undefined" ? sessionStorage.getItem("bonga:paymentReturnTo") : null) ||
    undefined;
  const initialPaymentTab =
    window.history.state?.initialPaymentTab === "packages" ? "packages" : "panel";
  const [activeTab, setActiveTab] = useState<MobilePaymentTab>(initialPaymentTab);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const { showToast } = useToast();
  const walletQuery = useWalletQuery();
  const packagePaymentMutation = usePackagePaymentMutation();
  const showGift = activeTab === "panel";

  useEffect(() => {
    function handlePopState(e: PopStateEvent) {
      if (!e.state?.paymentPackageId) {
        setSelectedPackageId(null);
      } else {
        setSelectedPackageId(String(e.state.paymentPackageId));
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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

  const selectedPackage = selectedPackageId
    ? (packages.find((p) => String(p.id) === String(selectedPackageId)) ?? null)
    : null;

  const ErrorState = getRequestErrorState(error);

  function handlePay(packageId: string | number) {
    if (packagePaymentMutation.isPending) return;
    const strId = String(packageId);
    window.history.pushState({ ...window.history.state, paymentPackageId: strId }, "");
    setSelectedPackageId(strId);
  }

  function handlePaymentBack() {
    if (packagePaymentMutation.isPending) return;
    if (window.history.state?.paymentPackageId) {
      window.history.back();
    } else {
      setSelectedPackageId(null);
    }
  }

  function handleSubmitPayment(paymentType: PackagePaymentType, discountCode?: string) {
    if (!selectedPackage || packagePaymentMutation.isPending) return;

    packagePaymentMutation.mutate(
      { discountCode, packageId: String(selectedPackage.id), paymentType },
      {
        onError: (requestError) => {
          showToast(
            getApiErrorMessage(
              requestError,
              paymentType === 1
                ? "پرداخت بسته از کیف پول با خطا مواجه شد."
                : "اتصال به درگاه پرداخت با خطا مواجه شد.",
            ),
            "خطا",
            "error",
          );
        },
        onSuccess: ({ paymentUrl }) => {
          if (paymentUrl) {
            storePaymentReturnTarget({
              kind: "package",
              label: "بازگشت به افزایش اعتبار",
              path: returnTo || "/account/dashboard/payments",
            });
            window.location.assign(paymentUrl);
            return;
          }

          if (window.history.state?.paymentPackageId) {
            window.history.back();
          } else {
            setSelectedPackageId(null);
          }
          showToast("بسته با موفقیت خریداری و فعال شد.");
        },
      },
    );
  }

  if (selectedPackage) {
    return (
      <PackagePaymentPage
        isPending={packagePaymentMutation.isPending}
        onBack={handlePaymentBack}
        onSubmit={handleSubmitPayment}
        packageItem={selectedPackage}
        walletCredit={walletQuery.data?.credit}
        walletError={
          walletQuery.isError
            ? getApiErrorMessage(walletQuery.error, "دریافت موجودی کیف پول با خطا مواجه شد.")
            : null
        }
        walletLoading={walletQuery.isLoading}
      />
    );
  }

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface flex min-h-0 flex-col overflow-hidden [direction:rtl]"
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
            navigate(returnTo, { replace: true });
            return;
          }

          if (window.history.state?.idx > 0) {
            navigate(-1);
            return;
          }

          navigate("/account/dashboard", { replace: true });
        }}
        startSlot={
          <Link
            className="text-primary inline-flex h-12 items-center px-3 text-sm leading-5 font-medium no-underline"
            to="/account/credit/history"
          >
            تاریخچه پرداخت
          </Link>
        }
        title="افزایش اعتبار"
      />
      <MobileCreditTabs activeTab={activeTab} onChange={setActiveTab} />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-4">
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
  const { showToast } = useToast();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const walletQuery = useWalletQuery();
  const packagePaymentMutation = usePackagePaymentMutation();

  useEffect(() => {
    function handlePopState(e: PopStateEvent) {
      if (!e.state?.paymentPackageId) {
        setSelectedPackageId(null);
      } else {
        setSelectedPackageId(String(e.state.paymentPackageId));
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const panelCreditPlans = packages
    .filter((plan) => plan.kind === "panel_subscription")
    .map(mapPanelPlan);
  const packagePlans = packages.filter((plan) => plan.kind === "credit_bundle").map(mapBundlePlan);
  const selectedPackage = selectedPackageId
    ? (packages.find((p) => String(p.id) === String(selectedPackageId)) ?? null)
    : null;
  const ErrorState = getRequestErrorState(error);

  function handlePay(packageId: string | number) {
    if (packagePaymentMutation.isPending) return;
    const strId = String(packageId);
    window.history.pushState({ ...window.history.state, paymentPackageId: strId }, "");
    setSelectedPackageId(strId);
  }

  function handlePaymentBack() {
    if (packagePaymentMutation.isPending) return;
    if (window.history.state?.paymentPackageId) {
      window.history.back();
    } else {
      setSelectedPackageId(null);
    }
  }

  function handleSubmitPayment(paymentType: PackagePaymentType, discountCode?: string) {
    if (!selectedPackage || packagePaymentMutation.isPending) return;

    packagePaymentMutation.mutate(
      { discountCode, packageId: String(selectedPackage.id), paymentType },
      {
        onError: (requestError) => {
          showToast(
            getApiErrorMessage(
              requestError,
              paymentType === 1
                ? "پرداخت بسته از کیف پول با خطا مواجه شد."
                : "اتصال به درگاه پرداخت با خطا مواجه شد.",
            ),
            "خطا",
            "error",
          );
        },
        onSuccess: ({ paymentUrl }) => {
          if (paymentUrl) {
            storePaymentReturnTarget({
              kind: "package",
              label: "بازگشت به افزایش اعتبار",
              path: "/account/dashboard/payments",
            });
            window.location.assign(paymentUrl);
            return;
          }

          if (window.history.state?.paymentPackageId) {
            window.history.back();
          } else {
            setSelectedPackageId(null);
          }
        },
      },
    );
  }

  if (selectedPackage) {
    return (
      <div className="mx-auto max-w-xl p-4 md:p-6" dir="rtl">
        <PackagePaymentPage
          isPending={packagePaymentMutation.isPending}
          onBack={handlePaymentBack}
          onSubmit={handleSubmitPayment}
          packageItem={selectedPackage}
          walletCredit={walletQuery.data?.credit}
          walletError={
            walletQuery.isError
              ? getApiErrorMessage(walletQuery.error, "دریافت موجودی کیف پول با خطا مواجه شد.")
              : null
          }
          walletLoading={walletQuery.isLoading}
        />
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-surface-container-lowest rounded-xl p-6">
      <div className="border-outline-var mb-6 flex items-center justify-between border-b border-dashed pb-5">
        <div className="flex items-center gap-2">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="bg-primary-container grid h-9 w-9 place-items-center rounded-full"
          >
            <img className="h-5 w-5" src="/icons/walletPlus.svg" alt="" />
          </Typography>

          <Typography
            as="h1"
            variant="display"
            size="large"
            className="text-on-surface text-[22px] font-medium"
          >
            افزایش اعتبار
          </Typography>
        </div>

        <Link
          className="text-primary inline-flex h-12 items-center px-3 text-sm leading-5 font-medium no-underline"
          to="/account/credit/history"
        >
          تاریخچه پرداخت
        </Link>
      </div>

      {isError ? <ErrorState className="min-h-[420px]" onRetry={() => void refetch()} /> : null}

      {!isError ? (
        <>
          <section>
            <Typography
              as="h2"
              variant="title"
              size="large"
              weight="medium"
              className="text-on-surface mb-4 text-[22px] font-medium"
            >
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

            {!isLoading && panelCreditPlans.length === 0 ? <EmptyPackagesState /> : null}
          </section>

          <section className="mt-10">
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="text-on-surface mb-4 text-right text-base font-semibold"
            >
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
