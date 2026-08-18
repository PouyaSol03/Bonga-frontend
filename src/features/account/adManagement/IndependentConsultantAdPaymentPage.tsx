import { useEffect, useMemo, useState, type ReactNode } from "react";

import { getApiErrorCode, getApiErrorMessage } from "../../../shared/api/api";
import {
  getActiveAuthRole,
  getStoredAuthSession,
} from "../../../shared/auth/auth-storage";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { ChoiceIndicator } from "../../../shared/ui/Choice";
import { storePaymentReturnTarget } from "../../../shared/utils/payment-return";
import { useChargeWalletMutation } from "../api/account.hooks";
import {
  useAdvertisementCheckoutQuery,
  useAgencyAdvertisementCheckoutQuery,
  useSubmitAdvertisementCheckoutMutation,
  useSubmitAgencyAdvertisementCheckoutMutation,
} from "../../advertisements/api/advertisement.hooks";
import type {
  AdvertisementCheckout,
  AdvertisementCheckoutItem,
  AdvertisementCheckoutPaymentMethod,
  AdvertisementCheckoutPaymentMethodCode,
  AgencyAdvertisementCheckoutPaymentMethodCode,
  SubmitAdvertisementCheckoutResult,
} from "../../advertisements/api/advertisement.service";
import { PaymentOptionIcon } from "./AdManagementIcons";
import { formatTariffToman } from "./AdTariffOptionsView";
import LinearAdd from "../../../shared/icons/LinearAdd";
import LinearChartUp from "../../../shared/icons/LinearChartUp";
import LinearInfoCircle from "../../../shared/icons/LinearInfoCircle";
import LinearTooman from "../../../shared/icons/LinearTooman";
import {
  clearAgencyAllocationCheckout,
  clearNewAdCheckout,
  getAdManagementRouteState,
  getAdStatePath,
  hasAgencyAllocationCheckoutMarker,
  hasNewAdCheckoutMarker,
} from "./adManagementData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { REAL_ESTATE_MANAGER } from "../../../shared/constants/roles.constants";

export type PaymentMethod = "online" | "wallet";
type PaymentStep = "options" | "checkout";
type AgencyPaymentMethod =
  | "ad_credit"
  | "by_consultant"
  | "free_quota"
  | "gateway"
  | "package_credit"
  | "wallet";

const checkoutItems = ["advertise_publish"];
const unavailableAfterPublishWarning = "این قابلیت پس از انتشار آگهی فعال می‌شود.";
const consultantUpgradeDisabledWarning =
  "امکانات ارتقای آگهی هنگام «ارسال به مشاور» قابل انتخاب نیست.";

const disabledUpgradeOptions = [
  {
    description: "آگهی شما به مدت ۳ روز، هر ۶ ساعت در اولویت نمایش قرار می‌گیرد.",
    id: "refresh",
    title: "بروزرسانی",
  },
  {
    description:
      "آگهی شما به مدت ۳ روز با برچسب ویژه برای جلب توجه بیشتر و دیده شدن بهتر نمایش داده می‌شود.",
    id: "special",
    title: "ویژه",
  },
  {
    description: "آگهی شما پیش از انقضا، برای یک ماه دیگر تمدید می‌شود.",
    id: "renew",
    title: "تمدید",
  },
  {
    description: "آگهی بروزرسانی و ویژه به صورت همزمان فعال می‌شود.",
    id: "refresh-special",
    title: "بروزرسانی و ویژه",
  },
] as const;

type UpgradeOptionId = (typeof disabledUpgradeOptions)[number]["id"];

function resolveUpgradeCheckoutItem(
  optionId: UpgradeOptionId,
  items: AdvertisementCheckoutItem[],
) {
  const keywords: Record<UpgradeOptionId, string[]> = {
    refresh: ["refresh", "update", "بروزر"],
    special: ["special", "featured", "vip", "ویژه"],
    renew: ["renew", "تمدید"],
    "refresh-special": ["refresh-special", "refresh_special", "combined"],
  };

  return items.find((item) =>
    keywords[optionId].some((keyword) =>
      item.product.toLowerCase().includes(keyword.toLowerCase()),
    ),
  );
}

function getUpgradeCheckoutItems(checkout: AdvertisementCheckout | undefined) {
  return (checkout?.items ?? []).filter(
    (item) =>
      item.product !== "advertise_publish" &&
      !/publish|ثبت|انتشار/i.test(item.product),
  );
}

function navigateTo(path: string, state?: unknown, replace = false) {
  if (replace) {
    window.history.replaceState(state ?? {}, "", path);
  } else {
    window.history.pushState(state ?? {}, "", path);
  }

  window.dispatchEvent(new PopStateEvent("popstate"));
}

function formatShortPayment(value: number) {
  if (value % 1000 === 0) {
    return `${new Intl.NumberFormat("fa-IR").format(value / 1000)} هزار تومان`;
  }

  return `${formatTariffToman(value)} تومان`;
}

function toSafeNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));

    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

function readCheckoutAdvertiseId() {
  const match = window.location.pathname.match(
    /^\/(?:account\/)?ad-management\/payment\/([^/]+)\/?$/,
  );

  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function getCheckoutItem(checkout: AdvertisementCheckout, product: string) {
  return checkout.items.find((item) => item.product === product);
}

function getCheckoutMethod(checkout: AdvertisementCheckout, method: string) {
  return checkout.payment_methods.find((item) => item.method === method);
}

function getFreeQuotaRemaining(
  checkout: AdvertisementCheckout,
  publishItem: AdvertisementCheckoutItem | undefined,
) {
  const freeQuotaMethod = getCheckoutMethod(checkout, "free_quota");

  return Math.max(
    toSafeNumber(freeQuotaMethod?.remaining),
    toSafeNumber(publishItem?.free_quota?.remaining),
    0,
  );
}

export function IndependentConsultantAdPaymentPage() {
  const advertiseId = readCheckoutAdvertiseId();

  if (advertiseId) {
    return <AdvertisementCheckoutFlow advertiseId={advertiseId} />;
  }

  return (
    <CheckoutStatusPage
      backTo="/account/my-ads"
      message="شناسه آگهی برای دریافت تعرفه از سرور موجود نیست."
      title="هزینه ثبت آگهی"
    />
  );
}

function AdvertisementCheckoutFlow({ advertiseId }: { advertiseId: string }) {
  const routeState = getAdManagementRouteState();
  const activeRole = getActiveAuthRole(getStoredAuthSession());
  const isAgencyAllocationCheckout =
    routeState.paymentFlow === "agency-allocation" ||
    hasAgencyAllocationCheckoutMarker(advertiseId);
  const isNewAdCheckout =
    routeState.paymentFlow === "new-ad" || hasNewAdCheckoutMarker(advertiseId);
  const usesAgencyCheckoutOptions =
    isAgencyAllocationCheckout ||
    routeState.publisherType === "agency" ||
    (activeRole === REAL_ESTATE_MANAGER && routeState.publisherType !== "consultant");
  const combineCheckoutSteps = !isNewAdCheckout && activeRole === REAL_ESTATE_MANAGER;
  const personalCheckoutQuery = useAdvertisementCheckoutQuery(
    advertiseId,
    !isAgencyAllocationCheckout,
  );
  const agencyCheckoutQuery = useAgencyAdvertisementCheckoutQuery(
    advertiseId,
    isAgencyAllocationCheckout,
  );
  const personalCheckoutMutation = useSubmitAdvertisementCheckoutMutation();
  const agencyCheckoutMutation = useSubmitAgencyAdvertisementCheckoutMutation();
  const checkoutQuery = isAgencyAllocationCheckout
    ? agencyCheckoutQuery
    : personalCheckoutQuery;
  const checkoutPending = isAgencyAllocationCheckout
    ? agencyCheckoutMutation.isPending
    : personalCheckoutMutation.isPending;
  const [step, setStep] = useState<PaymentStep>(routeState.paymentStep ?? "options");
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [agencyMethod, setAgencyMethod] = useState<AgencyPaymentMethod>("free_quota");
  const [, setErrorMessage] = useState("");
  const stateAdPath = getAdStatePath(advertiseId);
  const publishState = useMemo(
    () => ({
      ad: routeState.ad,
      assignment: routeState.assignment,
      assignmentId: routeState.assignmentId,
      card: routeState.card ?? routeState.ad,
      consultantId: routeState.consultantId,
      publisherType: routeState.publisherType,
      returnTo: "/account/my-ads",
      showPaymentSuccess: true,
      status: "published",
      tab: "status" as const,
    }),
    [
      routeState.ad,
      routeState.assignment,
      routeState.assignmentId,
      routeState.card,
      routeState.consultantId,
      routeState.publisherType,
    ],
  );

  const checkout = checkoutQuery.data;
  const upgradeItems = getUpgradeCheckoutItems(checkout);
  const publishItem = checkout ? getCheckoutItem(checkout, "advertise_publish") : undefined;
  const freeQuotaRemaining = checkout
    ? getFreeQuotaRemaining(checkout, publishItem)
    : 0;
  const freeQuotaMethod = checkout
    ? getCheckoutMethod(checkout, "free_quota")
    : undefined;
  const hasFreeQuota = Boolean(
    freeQuotaRemaining > 0 &&
    freeQuotaMethod?.available !== false &&
    publishItem?.free_quota?.available !== false,
  );
  const walletMethod = checkout ? getCheckoutMethod(checkout, "wallet") : undefined;
  const gatewayMethod = checkout ? getCheckoutMethod(checkout, "gateway") : undefined;
  const byConsultantMethod = checkout
    ? getCheckoutMethod(checkout, "by_consultant") ?? getCheckoutMethod(checkout, "consultant")
    : undefined;
  const showByConsultant = Boolean(
    combineCheckoutSteps &&
    isAgencyAllocationCheckout &&
    routeState.publisherType === "consultant" &&
    routeState.consultantId,
  );
  const packageCreditMethod = checkout
    ? getCheckoutMethod(
      checkout,
      isAgencyAllocationCheckout ? "ad_credit" : "package_credit",
    )
    : undefined;
  const publishPrice = toSafeNumber(
    publishItem?.price,
    toSafeNumber(checkout?.summary.total_price, toSafeNumber(gatewayMethod?.required)),
  );
  const payableAmount = toSafeNumber(
    checkout?.summary.payable_amount,
    toSafeNumber(gatewayMethod?.required, publishPrice),
  );
  const totalPrice = toSafeNumber(checkout?.summary.total_price, publishPrice);
  const creditCost = Math.max(
    toSafeNumber(publishItem?.credit_cost, toSafeNumber(checkout?.summary.credit_cost)),
    0,
  );
  const packageCreditRemaining = Math.max(
    toSafeNumber(packageCreditMethod?.remaining, toSafeNumber(packageCreditMethod?.balance)),
    0,
  );
  const packageCreditRequired = Math.max(
    toSafeNumber(packageCreditMethod?.required, creditCost),
    creditCost,
  );
  const packageCreditShortage = Math.max(
    toSafeNumber(
      packageCreditMethod?.shortage,
      packageCreditRequired - packageCreditRemaining,
    ),
    0,
  );
  const packageCreditAvailable = Boolean(
    packageCreditMethod &&
    packageCreditMethod.available !== false &&
    packageCreditShortage <= 0,
  );
  const agencyCreditCost = packageCreditMethod ? packageCreditRequired : creditCost;
  const agencyCreditMethod: AgencyPaymentMethod | null = isAgencyAllocationCheckout
    ? "ad_credit"
    : packageCreditAvailable
      ? "package_credit"
      : hasFreeQuota
        ? "free_quota"
        : packageCreditMethod
          ? "package_credit"
          : null;
  const agencyCreditAvailable =
    agencyCreditMethod === "free_quota" ? hasFreeQuota : packageCreditAvailable;
  const agencyCreditRemaining =
    agencyCreditMethod === "free_quota" ? freeQuotaRemaining : packageCreditRemaining;
  const agencyCreditShortage =
    agencyCreditMethod === "free_quota" ? 0 : packageCreditShortage;

  useEffect(() => {
    if (getApiErrorCode(checkoutQuery.error) !== "AD_WAITING_FOR_AGENCY") return;

    navigateTo(stateAdPath, {
      returnTo: "/account/my-ads",
      status: "wait_for_agency",
      tab: "status",
    }, true);
  }, [checkoutQuery.error, stateAdPath]);

  useEffect(() => {
    if (!checkout) return;

    const gatewayAvailable = gatewayMethod?.available !== false;
    const walletBalance = toSafeNumber(walletMethod?.balance);
    const walletRequired = toSafeNumber(walletMethod?.required, payableAmount);
    const walletShortage = Math.max(
      toSafeNumber(walletMethod?.shortage, walletRequired - walletBalance),
      0,
    );
    const walletAvailable = Boolean(
      walletMethod && walletMethod.available !== false && walletShortage <= 0,
    );
    const walletSelectable = Boolean(
      walletMethod && (walletMethod.available !== false || walletShortage > 0),
    );
    const creditSelectable = Boolean(
      agencyCreditMethod && (agencyCreditAvailable || agencyCreditShortage > 0),
    );

    if (usesAgencyCheckoutOptions) {
      const byConsultantAvailable =
        showByConsultant && byConsultantMethod?.available !== false;
      const currentMethodSelectable =
        ((agencyMethod === "free_quota" ||
          agencyMethod === "package_credit" ||
          agencyMethod === "ad_credit") &&
          agencyMethod === agencyCreditMethod &&
          creditSelectable) ||
        (agencyMethod === "by_consultant" && byConsultantAvailable) ||
        (agencyMethod === "wallet" && walletSelectable) ||
        (agencyMethod === "gateway" && gatewayAvailable && Boolean(gatewayMethod));

      // Keep a user-selected insufficient-balance method selected. The radio remains
      // interactive and the submit button is what becomes disabled.
      if (currentMethodSelectable) return;

      if (byConsultantAvailable) {
        setAgencyMethod("by_consultant");
      } else if (agencyCreditMethod && agencyCreditAvailable) {
        setAgencyMethod(agencyCreditMethod);
      } else if (walletAvailable) {
        setAgencyMethod("wallet");
      } else if (gatewayAvailable && gatewayMethod) {
        setAgencyMethod("gateway");
      } else if (creditSelectable && agencyCreditMethod) {
        setAgencyMethod(agencyCreditMethod);
      } else if (walletSelectable) {
        setAgencyMethod("wallet");
      }

      return;
    }

    if (!gatewayAvailable && walletAvailable) {
      setMethod("wallet");
    }
  }, [
    agencyMethod,
    agencyCreditAvailable,
    agencyCreditMethod,
    agencyCreditShortage,
    byConsultantMethod,
    checkout,
    gatewayMethod,
    hasFreeQuota,
    payableAmount,
    showByConsultant,
    usesAgencyCheckoutOptions,
    walletMethod,
  ]);

  function finishCheckout(
    paymentMethod:
      | AdvertisementCheckoutPaymentMethodCode
      | AgencyAdvertisementCheckoutPaymentMethodCode,
    extraItems: string[] = [],
  ) {
    if (checkoutPending) return;

    setErrorMessage("");
    const mutationOptions = {
      onError: (error: unknown) => {
        if (getApiErrorCode(error) === "AD_WAITING_FOR_AGENCY") {
          navigateTo(stateAdPath, {
            returnTo: "/account/my-ads",
            status: "wait_for_agency",
            tab: "status",
          }, true);
          return;
        }

        setErrorMessage(
          getApiErrorMessage(error, "پرداخت و انتشار آگهی با خطا مواجه شد."),
        );
      },
      onSuccess: ({ paymentUrl }: SubmitAdvertisementCheckoutResult) => {
        if (isAgencyAllocationCheckout) {
          clearAgencyAllocationCheckout(advertiseId);
        }
        if (isNewAdCheckout) {
          clearNewAdCheckout(advertiseId);
        }

        if (paymentMethod === "gateway") {
          if (!paymentUrl) {
            setErrorMessage("آدرس درگاه پرداخت از سرور دریافت نشد.");
            return;
          }

          storePaymentReturnTarget({
            label: "بازگشت به وضعیت آگهی",
            path: stateAdPath,
          });
          window.location.assign(paymentUrl);
          return;
        }

        navigateTo(stateAdPath, publishState, true);
      },
    };

    if (isAgencyAllocationCheckout) {
      agencyCheckoutMutation.mutate(
        {
          advertiseId,
          items: Array.from(new Set([...checkoutItems, ...extraItems])),
          paymentMethod: paymentMethod as AgencyAdvertisementCheckoutPaymentMethodCode,
        },
        mutationOptions,
      );
      return;
    }

    personalCheckoutMutation.mutate(
      {
        advertiseId,
        items: checkoutItems,
        paymentMethod: paymentMethod as AdvertisementCheckoutPaymentMethodCode,
      },
      mutationOptions,
    );
  }

  function handleCompleteOptions() {
    if (hasFreeQuota) {
      finishCheckout("free_quota");
      return;
    }

    setStep("checkout");
  }

  const checkoutBackTo = isAgencyAllocationCheckout
    ? `/account/ad-management/allocation-review/${encodeURIComponent(advertiseId)}`
    : "/new-ad";

  if (checkoutQuery.isLoading) {
    return (
      <CheckoutStatusPage
        backTo={checkoutBackTo}
        isLoading
        message="در حال دریافت هزینه و روش‌های پرداخت آگهی..."
        title="هزینه ثبت آگهی"
      />
    );
  }

  if (checkoutQuery.isError || !checkout) {
    return (
      <CheckoutStatusPage
        backTo={checkoutBackTo}
        message={getApiErrorMessage(
          checkoutQuery.error,
          "دریافت اطلاعات پرداخت آگهی با خطا مواجه شد.",
        )}
        onRetry={() => void checkoutQuery.refetch()}
        title="هزینه ثبت آگهی"
      />
    );
  }

  if (combineCheckoutSteps) {
    return (
      <AgencyCombinedCheckoutView
        byConsultantMethod={byConsultantMethod}
        creditCost={agencyCreditCost}
        creditAvailable={agencyCreditAvailable}
        creditMethod={agencyCreditMethod}
        creditRemaining={agencyCreditRemaining}
        creditShortage={agencyCreditShortage}
        gatewayMethod={gatewayMethod}
        method={agencyMethod}
        onMethodChange={setAgencyMethod}
        onSubmit={(extraItems) => finishCheckout(agencyMethod, extraItems)}
        payableAmount={payableAmount}
        pending={checkoutPending}
        price={publishPrice}
        showByConsultant={showByConsultant}
        title={isAgencyAllocationCheckout ? "تخصیص و انتشار" : "پرداخت"}
        upgradeItems={upgradeItems}
        walletMethod={walletMethod}
      >
      </AgencyCombinedCheckoutView>
    );
  }

  if (step === "checkout") {
    if (usesAgencyCheckoutOptions) {
      return (
        <AgencyCombinedCheckoutView
          byConsultantMethod={byConsultantMethod}
          creditCost={agencyCreditCost}
          creditAvailable={agencyCreditAvailable}
          creditMethod={agencyCreditMethod}
          creditRemaining={agencyCreditRemaining}
          creditShortage={agencyCreditShortage}
          gatewayMethod={gatewayMethod}
          method={agencyMethod}
          onBack={() => setStep("options")}
          onMethodChange={setAgencyMethod}
          onSubmit={(extraItems) => finishCheckout(agencyMethod, extraItems)}
          payableAmount={payableAmount}
          pending={checkoutPending}
          price={publishPrice}
          showByConsultant={showByConsultant}
          showPurchaseDetails={false}
          title="پرداخت"
          upgradeItems={upgradeItems}
          walletMethod={walletMethod}
        >
        </AgencyCombinedCheckoutView>
      );
    }

    return (
      <ApiPaymentCheckoutView
        gatewayMethod={gatewayMethod}
        method={method}
        onBack={() => setStep("options")}
        onMethodChange={setMethod}
        onSubmit={() => finishCheckout(method === "wallet" ? "wallet" : "gateway")}
        payableAmount={payableAmount}
        pending={checkoutPending}
        totalPrice={totalPrice}
        walletMethod={walletMethod}
      >
      </ApiPaymentCheckoutView>
    );
  }

  return (
    <CheckoutTariffView
      freeQuotaRemaining={freeQuotaRemaining}
      hasFreeQuota={hasFreeQuota}
      onComplete={handleCompleteOptions}
      pending={checkoutPending}
      price={publishPrice}
    >
    </CheckoutTariffView>
  );
}

function AgencyCombinedCheckoutView({
  byConsultantMethod,
  children,
  creditCost,
  creditAvailable,
  creditMethod,
  creditRemaining,
  creditShortage,
  gatewayMethod,
  method,
  onBack,
  onMethodChange,
  onSubmit,
  payableAmount,
  pending,
  price,
  showByConsultant = false,
  showPurchaseDetails = true,
  title = "پرداخت",
  upgradeItems = [],
  walletMethod,
}: {
  byConsultantMethod?: AdvertisementCheckoutPaymentMethod;
  children?: ReactNode;
  creditCost: number;
  creditAvailable: boolean;
  creditMethod: AgencyPaymentMethod | null;
  creditRemaining: number;
  creditShortage: number;
  gatewayMethod?: AdvertisementCheckoutPaymentMethod;
  method: AgencyPaymentMethod;
  onBack?: () => void;
  onMethodChange: (method: AgencyPaymentMethod) => void;
  onSubmit: (extraItems?: string[]) => void;
  payableAmount: number;
  pending: boolean;
  price: number;
  showByConsultant?: boolean;
  showPurchaseDetails?: boolean;
  title?: string;
  upgradeItems?: AdvertisementCheckoutItem[];
  walletMethod?: AdvertisementCheckoutPaymentMethod;
}) {
  const walletBalance = toSafeNumber(walletMethod?.balance);
  const walletRequired = toSafeNumber(walletMethod?.required, payableAmount);
  const walletDeficit = Math.max(
    toSafeNumber(walletMethod?.shortage, walletRequired - walletBalance),
    0,
  );
  const walletAvailable = Boolean(walletMethod && walletMethod.available !== false);
  const walletSelectable = Boolean(
    walletMethod && (walletMethod.available !== false || walletDeficit > 0),
  );
  const creditSelectable = Boolean(
    creditMethod && (creditAvailable || creditShortage > 0),
  );
  const gatewayAvailable = gatewayMethod?.available !== false && Boolean(gatewayMethod);
  const byConsultantAvailable = showByConsultant && byConsultantMethod?.available !== false;
  const [selectedUpgradeProducts, setSelectedUpgradeProducts] = useState<string[]>([]);
  const upgradeSelectionEnabled = method !== "by_consultant";
  const selectedMethodAvailable =
    method === "free_quota" || method === "package_credit" || method === "ad_credit"
      ? Boolean(creditMethod && method === creditMethod && creditAvailable)
      : method === "by_consultant"
        ? byConsultantAvailable
        : method === "wallet"
          ? walletAvailable && walletDeficit <= 0
          : gatewayAvailable;

  useEffect(() => {
    if (upgradeSelectionEnabled) return;
    setSelectedUpgradeProducts([]);
  }, [upgradeSelectionEnabled]);

  function toggleUpgrade(product: string) {
    if (!upgradeSelectionEnabled) return;
    setSelectedUpgradeProducts((current) =>
      current.includes(product)
        ? current.filter((item) => item !== product)
        : [...current, product],
    );
  }

  const publishCostLabel =
    creditCost > 0
      ? `${new Intl.NumberFormat("fa-IR").format(creditCost)} اعتبار`
      : creditAvailable
        ? "رایگان"
        : `${formatTariffToman(price)} تومان`;
  const submitLabel =
    method === "by_consultant"
      ? "ارسال به مشاور"
      : method === "free_quota" || method === "package_credit" || method === "ad_credit"
        ? creditCost > 0
          ? `انتشار آگهی - ${new Intl.NumberFormat("fa-IR").format(creditCost)} اعتبار`
          : "انتشار آگهی"
        : `پرداخت و انتشار - ${formatShortPayment(payableAmount)}`;

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        className="bg-[#f0f0f0] [&_button]:text-[#1a1a1a]"
        onBack={onBack ?? (() => window.history.back())}
        title={title}
      />

      {children}

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-[76px]">
        {showPurchaseDetails ? (
          <>
            <section className="bg-white px-4 pb-4 pt-5" aria-label="هزینه ثبت آگهی">
              <div className="flex items-start justify-between gap-5 [direction:ltr]">
                <Typography as="span" variant="label" size="medium" weight="medium" className="shrink-0 pt-1 text-sm font-medium leading-5 text-[#1a1a1a] [direction:rtl]">
                  {publishCostLabel}
                </Typography>

                <Typography as="span" variant="label" size="large" weight="semibold" className="flex min-w-0 flex-1 items-center justify-start gap-2 text-right text-base font-semibold leading-6 [direction:rtl]">
                  <ChoiceIndicator checked className="h-5 w-5 rounded-[4px]" disabled />
                  هزینه ثبت آگهی
                </Typography>
              </div>

              <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-4 text-right text-sm font-normal leading-6 text-[#666666]">
                برای ثبت آگهی، باید هزینه انتشار را پرداخت کنید.
              </Typography>
            </section>

            <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />
          </>
        ) : null}

        <section className="bg-white px-4 pb-4 pt-6" aria-label="روش پرداخت">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 mb-4 text-right text-base font-semibold leading-6">
            روش پرداخت
          </Typography>

          {showByConsultant ? (
            <>
              <PaymentMethodOption
                active={method === "by_consultant"}
                disabled={!byConsultantAvailable}
                icon="consultant"
                label="ارسال به مشاور"
                onClick={() => onMethodChange("by_consultant")}
                subLabel={
                  byConsultantAvailable
                    ? "ارسال آگهی برای انتشار توسط مشاور"
                    : "این روش در دسترس نیست"
                }
              />
              <div className="my-2 border-t border-[#f0f0f0]" />
            </>
          ) : null}

          {creditMethod ? (
            <>
              <PaymentMethodOption
                active={method === creditMethod}
                disabled={!creditSelectable}
                icon="credit"
                label="اعتبار آگهی"
                onClick={() => onMethodChange(creditMethod)}
                subLabel={`مانده: ${new Intl.NumberFormat("fa-IR").format(creditRemaining)} اعتبار`}
                subLabelClassName={creditShortage > 0 || !creditAvailable ? "text-[#c11004]" : "text-[#11a366]"}
              />

              {creditShortage > 0 ? (
                <ApiCreditDeficitBox deficit={creditShortage} />
              ) : null}

              <div className="my-2 border-t border-[#f0f0f0]" />
            </>
          ) : null}

          <PaymentMethodOption
            active={method === "wallet"}
            disabled={!walletSelectable}
            icon="wallet"
            label="کیف پول"
            onClick={() => onMethodChange("wallet")}
            subLabel={
              walletMethod
                ? `مانده: ${formatTariffToman(walletBalance)} تومان`
                : "این روش پرداخت در دسترس نیست"
            }
            subLabelClassName={
              !walletMethod || walletDeficit > 0 ? "text-[#c11004]" : "text-[#11a366]"
            }
          />

          {walletMethod && walletDeficit > 0 ? (
            <ApiWalletDeficitBox deficit={walletDeficit} />
          ) : null}

          <div className="mt-2 border-t border-[#f0f0f0] pt-2">
            <PaymentMethodOption
              active={method === "gateway"}
              disabled={!gatewayAvailable}
              icon="online"
              label="پرداخت آنلاین"
              onClick={() => onMethodChange("gateway")}
              subLabel={gatewayAvailable ? "بانک ملت" : "درگاه پرداخت در دسترس نیست"}
            />
          </div>
        </section>

        {showPurchaseDetails ? (
          <>
            <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />
            <DisabledUpgradeOptionsSection
              disabledWarning={consultantUpgradeDisabledWarning}
              enabled={upgradeSelectionEnabled}
              onToggle={toggleUpgrade}
              selectedProducts={selectedUpgradeProducts}
              upgradeItems={upgradeItems}
            />
          </>
        ) : null}
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-3 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Button unstyled
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white shadow-[0_4px_10px_rgba(0,72,196,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedMethodAvailable || pending}
          onClick={() =>
            onSubmit(upgradeSelectionEnabled ? selectedUpgradeProducts : [])
          }
          type="button"
        >
          {pending ? "در حال پردازش پرداخت..." : submitLabel}
        </Button>
      </footer>
    </PageFrame>
  );
}

function CheckoutTariffView({
  children,
  freeQuotaRemaining,
  hasFreeQuota,
  onComplete,
  pending,
  price,
}: {
  children?: ReactNode;
  freeQuotaRemaining: number;
  hasFreeQuota: boolean;
  onComplete: () => void;
  pending: boolean;
  price: number;
}) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/new-ad"
        className="bg-[#f0f0f0]"
        title="هزینه ثبت آگهی"
      />

      {children}

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-[76px]">
        <section className="px-4 pb-4 pt-5" aria-label="هزینه ثبت آگهی">
          <div className="flex items-start justify-between gap-5 [direction:ltr]">
            <Typography as="span" variant="label" size="medium" weight="medium" className="shrink-0 pt-1 text-sm font-medium leading-5 text-[#1a1a1a] [direction:rtl]">
              {hasFreeQuota ? "رایگان" : (
                <Typography as="span" variant="body" size="medium" weight="regular" className="inline-flex items-center gap-1">
                  {formatTariffToman(price)}
                  <LinearTooman className="h-5 w-5" />
                </Typography>
              )}
            </Typography>

            <Typography as="span" variant="label" size="large" weight="semibold" className="flex min-w-0 flex-1 items-center justify-start gap-2 text-right text-base font-semibold leading-6 [direction:rtl]">
              <ChoiceIndicator checked className="h-5 w-5 rounded-[4px]" disabled />
              هزینه ثبت آگهی
            </Typography>
          </div>

          {hasFreeQuota ? (
            <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-4 flex min-h-9 items-center gap-2 rounded-lg bg-[#edf3ff] px-3 py-2 text-right text-xs font-medium leading-5 text-[#0048c4]">
              <LinearInfoCircle className="h-5 w-5 shrink-0" />
              <Typography as="span" variant="body" size="medium" weight="regular">
                {new Intl.NumberFormat("fa-IR").format(freeQuotaRemaining)} تعرفه رایگان باقی مانده است
              </Typography>
            </Typography>
          ) : null}
        </section>

        <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />

        <DisabledUpgradeOptionsSection />
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-3 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Button unstyled
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white shadow-[0_4px_10px_rgba(0,72,196,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          onClick={onComplete}
          type="button"
        >
          {pending ? "در حال انتشار آگهی..." : "تکمیل خرید"}
        </Button>
      </footer>
    </PageFrame>
  );
}

function DisabledUpgradeOptionsSection({
  disabledWarning = unavailableAfterPublishWarning,
  enabled = false,
  onToggle,
  selectedProducts = [],
  upgradeItems = [],
}: {
  disabledWarning?: string;
  enabled?: boolean;
  onToggle?: (product: string) => void;
  selectedProducts?: string[];
  upgradeItems?: AdvertisementCheckoutItem[];
}) {
  return (
    <section className="bg-white" aria-label="امکانات ارتقای آگهی">
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 flex items-center gap-2 px-4 pb-2 pt-5 text-right text-base font-semibold leading-6">
        <LinearChartUp className="h-5 w-5" />
        امکانات ارتقای آگهی
      </Typography>

      <div className="divide-y divide-[#e6e6e6] px-4">
        {disabledUpgradeOptions.map((option) => {
          const checkoutItem = resolveUpgradeCheckoutItem(option.id, upgradeItems);
          const optionEnabled = Boolean(enabled && checkoutItem);
          const checked = Boolean(
            checkoutItem && selectedProducts.includes(checkoutItem.product),
          );
          const unavailableWarning = enabled
            ? "این قابلیت در حال حاضر در دسترس نیست."
            : disabledWarning;

          return (
            <Button unstyled
              aria-disabled={!optionEnabled}
              aria-pressed={checked}
              className={`block w-full border-0 bg-white py-4 text-inherit ${optionEnabled ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              key={option.id}
              onClick={() => {
                if (optionEnabled && checkoutItem && onToggle) {
                  onToggle(checkoutItem.product);
                }
              }}
              type="button"
            >
              <div className="flex items-start justify-between gap-5 [direction:ltr]">
                <Typography as="span" variant="label" size="medium" weight="semibold" className={`flex shrink-0 items-center gap-1 pt-1 text-sm font-semibold leading-5 [direction:rtl] ${optionEnabled ? "text-[#1a1a1a]" : "text-[#c2c2c2]"
                  }`}>
                  {checkoutItem?.price !== undefined && optionEnabled ? (
                    <>
                      {formatTariffToman(toSafeNumber(checkoutItem.price))}
                      <LinearTooman className="h-5 w-5" />
                    </>
                  ) : (
                    "—"
                  )}
                </Typography>

                <div className="min-w-0 flex-1 text-right [direction:rtl]">
                  <div className={`flex items-center justify-start gap-2 text-base font-medium leading-6 ${optionEnabled ? "text-[#1a1a1a]" : "text-[#808080]"
                    }`}>
                    <ChoiceIndicator
                      checked={checked}
                      className="h-5 w-5 rounded-[4px]"
                      disabled={!optionEnabled}
                    />
                    {option.title}
                  </div>
                  <Typography as="p" variant="body" size="medium" weight="regular" className={`m-0 mt-4 text-sm font-normal leading-6 ${optionEnabled ? "text-[#4d4d4d]" : "text-[#808080]"
                    }`}>
                    {option.description}
                  </Typography>
                </div>
              </div>

              {!optionEnabled ? (
                <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-3 flex min-h-9 items-center gap-2 rounded-lg bg-[#fff8e8] px-3 py-2 text-right text-xs font-medium leading-5 text-[#ff6d00]">
                  <LinearInfoCircle className="h-5 w-5 shrink-0" />
                  <Typography as="span" variant="body" size="medium" weight="regular">
                    {unavailableWarning}
                  </Typography>
                </Typography>
              ) : null}
            </Button>
          );
        })}
      </div>
    </section>
  );
}

export function ApiPaymentCheckoutView({
  children,
  gatewayMethod,
  method,
  onBack,
  onMethodChange,
  onSubmit,
  payableAmount,
  pending,
  totalPrice,
  walletMethod,
  submitLabelPrefix = "پرداخت و انتشار",
}: {
  children?: ReactNode;
  gatewayMethod?: AdvertisementCheckoutPaymentMethod;
  method: PaymentMethod;
  onBack: () => void;
  onMethodChange: (method: PaymentMethod) => void;
  onSubmit: () => void;
  payableAmount: number;
  pending: boolean;
  totalPrice: number;
  walletMethod?: AdvertisementCheckoutPaymentMethod;
  submitLabelPrefix?: string;
}) {
  const walletBalance = toSafeNumber(walletMethod?.balance);
  const walletRequired = toSafeNumber(walletMethod?.required, payableAmount);
  const walletDeficit = Math.max(
    toSafeNumber(walletMethod?.shortage, walletRequired - walletBalance),
    0,
  );
  // A wallet with insufficient credit is still a valid payment choice: keep it
  // selectable so the shortage and the wallet-charge action are visible.
  const walletAvailable = Boolean(walletMethod && walletMethod.available !== false);
  const gatewayAvailable = gatewayMethod?.available !== false && Boolean(gatewayMethod);
  const selectedMethodAvailable =
    method === "wallet"
      ? walletAvailable && walletDeficit <= 0
      : gatewayAvailable;
  const discount = Math.max(totalPrice - payableAmount, 0);

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar className="[&_button]:text-[#1a1a1a]" onBack={onBack} title="پرداخت" />

      {children}

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-[76px]">
        <section className="bg-white px-4 pb-2 pt-6" aria-label="روش پرداخت">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 mb-4 text-right text-base font-semibold leading-6">روش پرداخت</Typography>
          <PaymentMethodOption
            active={method === "wallet"}
            disabled={!walletAvailable}
            icon="wallet"
            label="کیف پول"
            onClick={() => onMethodChange("wallet")}
            subLabel={
              walletAvailable
                ? `مانده: ${formatTariffToman(walletBalance)} تومان`
                : "این روش پرداخت در دسترس نیست"
            }
            subLabelClassName={
              !walletAvailable || walletDeficit > 0 ? "text-[#e11900]" : "text-[#11a366]"
            }
          />

          {method === "wallet" && walletDeficit > 0 ? (
            <ApiWalletDeficitBox deficit={walletDeficit} />
          ) : null}

          <div className="border-t border-[#e6e6e6]">
            <PaymentMethodOption
              active={method === "online"}
              disabled={!gatewayAvailable}
              icon="online"
              label="پرداخت آنلاین"
              onClick={() => onMethodChange("online")}
              subLabel={gatewayAvailable ? "بانک ملت" : "درگاه پرداخت در دسترس نیست"}
            />
          </div>
        </section>

        <section className="mt-2 bg-white px-4 py-4" aria-label="کد تخفیف">
          <div className="flex items-center gap-2 [direction:ltr]">
            <Button unstyled
              className="h-12 shrink-0 rounded-xl bg-[#e5e5e5] px-4 text-sm font-medium leading-5 text-[#a6a6a6]"
              disabled
              type="button"
            >
              اعمال
            </Button>
            <label className="min-w-0 flex-1">
              <Typography as="span" variant="body" size="medium" weight="regular" className="sr-only">کد تخفیف</Typography>
              <input
                className="h-12 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4]"
                placeholder="کد تخفیف را وارد کنید"
                type="text"
              />
            </label>
          </div>
        </section>

        <section className="mt-2 bg-white px-4 pb-6 pt-5" aria-label="خلاصه پرداخت">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 mb-4 text-right text-base font-semibold leading-6">خلاصه پرداخت</Typography>
          <SummaryRow label="قیمت" value={formatTariffToman(totalPrice)} />
          <SummaryRow label="تخفیف" value={formatTariffToman(discount)} />
          <div className="my-4 border-t border-dashed border-[#cccccc]" aria-hidden="true" />
          <SummaryRow
            iconClassName="h-7 w-7"
            label="جمع پرداختی"
            labelClassName="text-right text-base font-semibold text-[#4d4d4d]"
            value={formatTariffToman(payableAmount)}
            valueClassName="text-base font-semibold text-[#0048c4]"
          />
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-3 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Button unstyled
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white shadow-[0_4px_10px_rgba(0,72,196,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedMethodAvailable || pending}
          onClick={onSubmit}
          type="button"
        >
          {pending
            ? "در حال پردازش پرداخت..."
            : `${submitLabelPrefix} - ${formatShortPayment(payableAmount)}`}
        </Button>
      </footer>
    </PageFrame>
  );
}

function CheckoutStatusPage({
  backTo,
  isLoading = false,
  message,
  onRetry,
  title,
}: {
  backTo: string;
  isLoading?: boolean;
  message: string;
  onRetry?: () => void;
  title: string;
}) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo={backTo} title={title} />
      <main className="mx-auto flex min-h-0 w-full flex-1 flex-col items-center justify-center px-6 text-center">
        <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm font-medium leading-6 text-[#4d4d4d]">{message}</Typography>
        {onRetry ? (
          <Button unstyled
            className="mt-4 h-10 rounded-lg bg-[#0048c4] px-5 text-sm font-medium text-white"
            onClick={onRetry}
            type="button"
          >
            تلاش دوباره
          </Button>
        ) : isLoading ? (
          <Typography as="span" variant="body" size="medium" weight="regular" className="mt-4 h-8 w-8 animate-spin rounded-full border-2 border-[#d9e5fb] border-t-[#0048c4]" />
        ) : null}
      </main>
    </PageFrame>
  );
}

function ApiCreditDeficitBox({ deficit }: { deficit: number }) {
  function openCreditPackages() {
    navigateTo("/account/dashboard/payments", {
      initialPaymentTab: "packages",
      returnTo: window.location.pathname,
    });
  }

  return (
    <div className="flex h-[60px] items-center justify-between rounded-lg border border-[rgba(255,141,0,0.16)] bg-[rgba(255,141,0,0.08)] px-4 [direction:ltr]">
      <Button unstyled
        className="flex shrink-0 items-center justify-center gap-1 rounded-lg bg-[#11a366] px-4 py-1.5 text-xs font-semibold leading-5 text-white"
        onClick={openCreditPackages}
        type="button"

      >
        <Typography variant="label" size="small" weight="medium">
          افزایش اعتبار
        </Typography>
        <LinearAdd className="h-4 w-4" />
      </Button>

      <Typography as="span" variant="body" size="medium" weight="regular" className="text-right text-[#1a1a1a] [direction:rtl]">
        کسری:{" "}
        <Typography as="span" variant="body" size="medium">
          {new Intl.NumberFormat("fa-IR").format(deficit)} اعتبار
        </Typography>
      </Typography>
    </div>
  );
}

function ApiWalletDeficitBox({ deficit }: { deficit: number }) {
  const chargeWalletMutation = useChargeWalletMutation();
  const [, setErrorMessage] = useState("");

  function chargeWallet() {
    if (chargeWalletMutation.isPending || deficit <= 0) return;

    setErrorMessage("");
    chargeWalletMutation.mutate(
      { price: Math.ceil(deficit) },
      {
        onError: (error: unknown) => {
          setErrorMessage(getApiErrorMessage(error, "شارژ کیف پول با خطا مواجه شد."));
        },
        onSuccess: ({ paymentUrl }) => {
          storePaymentReturnTarget({
            label: "بازگشت به پرداخت آگهی",
            path: window.location.pathname,
          });
          window.location.assign(paymentUrl);
        },
      },
    );
  }

  return (
    <div>
      <div className="flex h-[60px] items-center justify-between rounded-lg border border-[rgba(255,141,0,0.16)] bg-[rgba(255,141,0,0.08)] px-4 [direction:ltr]">
        <Button unstyled
          className="flex shrink-0 items-center justify-center gap-1 rounded-lg bg-[#11a366] px-4 py-1.5 text-xs font-semibold leading-5 text-white disabled:opacity-60"
          disabled={chargeWalletMutation.isPending}
          onClick={chargeWallet}
          type="button"
        >
          <Typography variant="label" size="small" weight="medium">
            {chargeWalletMutation.isPending ? "در حال اتصال..." : "افزایش موجودی"}
          </Typography>
          <LinearAdd className="h-4 w-4" />
        </Button>

        <Typography as="span" variant="label" size="medium" weight="medium" className="text-right text-sm font-medium leading-5 text-[#1a1a1a] [direction:rtl]">
          کسری: {formatTariffToman(deficit)} تومان
        </Typography>
      </div>
    </div>
  );
}

function PaymentMethodOption({
  active,
  disabled = false,
  icon,
  label,
  onClick,
  subLabel,
  subLabelClassName = "text-[rgba(26,26,26,0.4)]",
}: {
  active: boolean;
  disabled?: boolean;
  icon: "consultant" | "credit" | "online" | "wallet";
  label: string;
  onClick: () => void;
  subLabel: string;
  subLabelClassName?: string;
}) {
  return (
    <Button unstyled
      aria-pressed={active}
      className={`flex h-[72px] w-full items-center justify-between border-0 bg-white px-4 text-inherit [direction:ltr] ${disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <ChoiceIndicator
        checked={active}
        className={`ml-1 ${!active && !disabled ? "!border-[rgba(77,77,77,0.3)]" : ""}`}
        disabled={disabled}
        type="radio"
      />
      <Typography as="span" variant="body" size="medium" weight="regular" className="inline-flex items-center gap-2 text-right [direction:rtl]">
        <PaymentOptionIcon className="h-6 w-6 shrink-0 text-[#4d4d4d]" icon={icon} />
        <Typography as="span" variant="body" size="medium" weight="regular" className="block">
          <strong className="block text-base font-normal leading-6 text-[#1a1a1a]">
            {label}
          </strong>
          <Typography as="span" variant="body" size="medium" weight="regular" className={`block text-sm font-normal leading-5 ${subLabelClassName}`}>
            {subLabel}
          </Typography>
        </Typography>
      </Typography>
    </Button>
  );
}

function SummaryRow({
  iconClassName = "mr-0.5 h-5 w-5 text-[#4d4d4d]",
  label,
  labelClassName = "text-right font-medium text-[#4d4d4d]",
  value,
  valueClassName = "font-medium text-[#1a1a1a]",
}: {
  iconClassName?: string;
  label: string;
  labelClassName?: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-4 text-sm leading-5 [direction:ltr]">
      <Typography as="span" variant="body" size="medium" weight="regular" className={`flex items-center text-left [direction:rtl] ${valueClassName}`}>
        {value}
        <LinearTooman className={iconClassName} />
      </Typography>
      <Typography as="span" variant="body" size="medium" weight="regular" className={`[direction:rtl] ${labelClassName}`}>{label}</Typography>
    </div>
  );
}
