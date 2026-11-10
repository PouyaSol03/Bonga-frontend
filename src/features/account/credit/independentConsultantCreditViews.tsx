import { useState } from "react";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { Link, useNavigate } from "react-router";
import { useToast } from "../../../shared/hooks/useToast";
import { usePackagePaymentMutation, usePackagesQuery } from "../../packages/api/package.hooks";
import { useWalletQuery } from "../api/account.hooks";
import type { PackageItem, PackagePaymentType } from "../../packages/api/package.service";

import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { PackagePaymentPage } from "../../packages/components/PackagePaymentPage";
import { getApiErrorMessage } from "../../../shared/api/api";
import { storePaymentReturnTarget } from "../../../shared/utils/payment-return";

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
    .map(
      (item) =>
        `${formatCreditNumber(item.value)} ${withCreditLabel ? "اعتبار " : ""}${item.label}`,
    );
}

function mapPackageToCreditPlan(plan: PackageItem, index: number, view: CreditView): CreditPlan {
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
  const { showToast } = useToast();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const packagesQuery = usePackagesQuery();
  const walletQuery = useWalletQuery();
  const packagePaymentMutation = usePackagePaymentMutation();
  const isPackages = view === "packages";
  const hasGiftBenefits = view === "panel-bonus";
  const sourcePackages = packagesQuery.data ?? [];
  const plans = sourcePackages
    .filter((plan) =>
      isPackages ? plan.kind === "credit_bundle" : plan.kind === "panel_subscription",
    )
    .map((plan, index) => mapPackageToCreditPlan(plan, index, view));
  const selectedPackage = selectedPackageId
    ? (sourcePackages.find((item) => item.id === selectedPackageId) ?? null)
    : null;

  function submitPackagePayment(paymentType: PackagePaymentType, discountCode?: string) {
    if (!selectedPackage || packagePaymentMutation.isPending) return;

    packagePaymentMutation.mutate(
      { discountCode, packageId: selectedPackage.id, paymentType },
      {
        onError: (error) => {
          showToast(
            getApiErrorMessage(
              error,
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
            const returnPath = isPackages ? "/account/credit/packages" : "/account/credit/panel";
            storePaymentReturnTarget({
              kind: "package",
              label: "بازگشت به افزایش اعتبار",
              path: returnPath,
            });
            window.location.assign(paymentUrl);
            return;
          }

          setSelectedPackageId(null);
          showToast("بسته با موفقیت خریداری و فعال شد.");
        },
      },
    );
  }

  if (selectedPackage) {
    return (
      <PackagePaymentPage
        isPending={packagePaymentMutation.isPending}
        onBack={() => {
          if (!packagePaymentMutation.isPending) setSelectedPackageId(null);
        }}
        onSubmit={submitPackagePayment}
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
      <CreditTopBar />
      <CreditTabs activeTab={isPackages ? "packages" : "panel"} />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-4">
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
                onPay={() => {
                  if (!packagePaymentMutation.isPending) setSelectedPackageId(plan.id);
                }}
                plan={plan}
              />
            ))}
          </div>
        ) : (
          <CreditPlansStatus message="بسته‌ای برای نمایش وجود ندارد." />
        )}
      </main>
    </PageFrame>
  );
}

function CreditTopBar() {
  const navigate = useNavigate();
  const returnTo =
    window.history.state?.returnTo ||
    (typeof window !== "undefined" ? sessionStorage.getItem("bonga:paymentReturnTo") : null) ||
    undefined;

  return (
    <TopBar
      backTo={returnTo ?? "/account/dashboard"}
      onBack={() => {
        if (returnTo) {
          try {
            sessionStorage.removeItem("bonga:paymentReturnTo");
          } catch {
            // ignore
          }
          navigate(returnTo);
        } else if (window.history.state?.idx > 0) {
          navigate(-1);
        } else {
          navigate("/account/dashboard", { replace: true });
        }
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
  );
}

function CreditTabs({ activeTab }: { activeTab: "packages" | "panel" }) {
  return (
    <nav className="bg-surface-container-lowest shrink-0 px-4 py-4" aria-label="نوع افزایش اعتبار">
      <div className="border-primary flex h-11 overflow-hidden rounded-xl border [direction:ltr]">
        <Link
          className={`flex flex-1 items-center justify-center text-base leading-6 font-medium [direction:rtl] ${
            activeTab === "panel"
              ? "bg-primary-container text-primary font-semibold"
              : "bg-surface-container-lowest text-on-surface-var"
          }`}
          to="/account/credit/panel"
        >
          اعتبار پنل
        </Link>
        <Link
          className={`border-primary flex flex-1 items-center justify-center border-l text-base leading-6 font-medium [direction:rtl] ${
            activeTab === "packages"
              ? "bg-primary-container text-primary font-semibold"
              : "bg-surface-container-lowest text-on-surface-var"
          }`}
          to="/account/credit/packages"
        >
          بسته‌ها
        </Link>
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
      className={`bg-surface-container-lowest rounded-2xl border p-4 ${
        plan.selected ? "border-primary" : "border-outline-var"
      }`}
    >
      {isPackage ? (
        <PackageCardContent plan={plan} />
      ) : hasGiftBenefits ? (
        <PanelBonusCardContent plan={plan} />
      ) : (
        <PanelCardContent plan={plan} />
      )}

      <Button
        unstyled
        className="bg-primary text-on-primary mt-4 h-10 w-full rounded-lg text-sm leading-5 font-medium"
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
      <div className="border-outline-var my-4 h-px border-t border-dashed" />
      <ul className="space-y-4">
        {(plan.benefits ?? []).map((benefit) => (
          <li className="flex h-6 items-center gap-2 text-base leading-6 font-medium" key={benefit}>
            <CheckSealIcon className="text-tertiary h-5 w-5 shrink-0" />
            <Typography as="span" variant="body" size="medium" weight="regular">
              {benefit}
            </Typography>
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
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-primary m-0 text-base leading-6 font-semibold [direction:rtl]"
        >
          {plan.name}
        </Typography>
      </div>
      <div className="mt-4 flex h-[68px] items-end justify-between">
        {plan.discountPercent > 0 ? (
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className="border-error bg-surface-container-lowest text-error mb-1 rounded-lg border px-2 py-1 text-xs leading-4 font-normal"
          >
            {formatCreditNumber(plan.discountPercent)}٪ تخفیف
          </Typography>
        ) : (
          <span />
        )}
        <div className="text-right [direction:rtl]">
          <Typography
            as="p"
            variant="body"
            size="large"
            weight="medium"
            className="text-outline m-0 text-base leading-6 font-semibold line-through"
          >
            {plan.originalPrice}
          </Typography>
          <div className="mt-0.5 flex items-center justify-end gap-1 [direction:rtl]">
            <strong className="text-on-surface text-[22px] leading-7 font-semibold">
              {plan.currentPrice}
            </strong>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-on-surface text-xs leading-4 font-medium"
            >
              تومان
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
}

function GiftBenefits({ benefits }: { benefits: string[] }) {
  return (
    <div className="border-tertiary bg-tertiary-container/30 text-tertiary h-16 rounded-lg border px-4 py-2">
      <div className="text-tertiary flex h-5 items-center justify-end gap-1 text-sm leading-5 font-medium">
        <GiftIcon className="h-5 w-5" />
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
            className={`${index < benefits.length - 1 ? "border-tertiary/20 border-l pl-4" : ""}`}
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
          className="border-outline-var bg-surface-container h-[204px] animate-pulse rounded-2xl border"
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
    <div className="border-outline-var mx-auto w-full rounded-2xl border border-dashed px-4 py-10 text-center">
      <Typography as="p" variant="body" size="medium" weight="regular" className="text-outline m-0">
        {message}
      </Typography>
      {actionLabel && onAction ? (
        <Button
          unstyled
          className="border-primary text-primary mt-4 h-10 rounded-lg border px-5 text-sm font-medium"
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
      <path
        d="m6.2 10 2.4 2.3 5.1-5.2"
        fill="none"
        stroke="currentColor"
        className="text-on-primary"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function GiftIcon({ className = "" }: { className?: string }) {
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
