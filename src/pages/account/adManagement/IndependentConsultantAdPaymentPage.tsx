import { useEffect, useMemo, useState, type ReactNode } from "react";

import { getApiErrorMessage } from "../../../api/api";
import { PageFrame } from "../../../app/PageFrame";
import { Snackbar } from "../../../components/Snackbar";
import { TopBar } from "../../../components/TopBar";
import { ChoiceIndicator } from "../../../components/ui/Choice";
import { storePaymentReturnTarget } from "../../../utils/payment-return";
import { useChargeWalletMutation } from "../../../hooks/account.hooks";
import {
  useAdvertisementCheckoutQuery,
  useSubmitAdvertisementCheckoutMutation,
} from "../../../hooks/advertisement.hooks";
import type {
  AdvertisementCheckout,
  AdvertisementCheckoutItem,
  AdvertisementCheckoutPaymentMethod,
  AdvertisementCheckoutPaymentMethodCode,
  SubmitAdvertisementCheckoutResult,
} from "../../../services/advertisement.service";
import { PaymentOptionIcon } from "./AdManagementIcons";
import {
  AdCardTomanIcon,
  formatTariffToman,
} from "./AdTariffOptionsView";
import {
  getAdManagementRouteState,
  getAdStatePath,
} from "./adManagementData";
import { Typography } from "../../../components/ui/Typography";
import { Button } from "../../../components/ui/Button";

export type PaymentMethod = "online" | "wallet";
type PaymentStep = "options" | "checkout";

const checkoutItems = ["advertise_publish"];
const unavailableAfterPublishWarning = "این قابلیت پس از انتشار آگهی فعال می‌شود.";

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
  const checkoutQuery = useAdvertisementCheckoutQuery(advertiseId);
  const checkoutMutation = useSubmitAdvertisementCheckoutMutation();
  const [step, setStep] = useState<PaymentStep>(routeState.paymentStep ?? "options");
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [errorMessage, setErrorMessage] = useState("");
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
  const publishPrice = toSafeNumber(
    publishItem?.price,
    toSafeNumber(checkout?.summary.total_price, toSafeNumber(gatewayMethod?.required)),
  );
  const payableAmount = toSafeNumber(
    checkout?.summary.payable_amount,
    toSafeNumber(gatewayMethod?.required, publishPrice),
  );
  const totalPrice = toSafeNumber(checkout?.summary.total_price, publishPrice);

  useEffect(() => {
    if (!checkout) return;

    const gatewayAvailable = gatewayMethod?.available !== false;
    const walletAvailable = walletMethod?.available !== false;

    if (!gatewayAvailable && walletAvailable) {
      setMethod("wallet");
    }
  }, [checkout, gatewayMethod?.available, walletMethod?.available]);

  function finishCheckout(paymentMethod: AdvertisementCheckoutPaymentMethodCode) {
    if (checkoutMutation.isPending) return;

    setErrorMessage("");
    checkoutMutation.mutate(
      {
        advertiseId,
        items: checkoutItems,
        paymentMethod,
      },
      {
        onError: (error: unknown) => {
          setErrorMessage(
            getApiErrorMessage(error, "پرداخت و انتشار آگهی با خطا مواجه شد."),
          );
        },
        onSuccess: ({ paymentUrl }: SubmitAdvertisementCheckoutResult) => {
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
      },
    );
  }

  function handleCompleteOptions() {
    if (hasFreeQuota) {
      finishCheckout("free_quota");
      return;
    }

    setStep("checkout");
  }

  if (checkoutQuery.isLoading) {
    return (
      <CheckoutStatusPage
        backTo="/new-ad"
        isLoading
        message="در حال دریافت هزینه و روش‌های پرداخت آگهی..."
        title="هزینه ثبت آگهی"
      />
    );
  }

  if (checkoutQuery.isError || !checkout) {
    return (
      <CheckoutStatusPage
        backTo="/new-ad"
        message={getApiErrorMessage(
          checkoutQuery.error,
          "دریافت اطلاعات پرداخت آگهی با خطا مواجه شد.",
        )}
        onRetry={() => void checkoutQuery.refetch()}
        title="هزینه ثبت آگهی"
      />
    );
  }

  if (step === "checkout") {
    return (
      <ApiPaymentCheckoutView
        gatewayMethod={gatewayMethod}
        method={method}
        onBack={() => setStep("options")}
        onMethodChange={setMethod}
        onSubmit={() => finishCheckout(method === "wallet" ? "wallet" : "gateway")}
        payableAmount={payableAmount}
        pending={checkoutMutation.isPending}
        totalPrice={totalPrice}
        walletMethod={walletMethod}
      >
        {errorMessage ? (
          <Snackbar
            message={errorMessage}
            onDismiss={() => setErrorMessage("")}
            title="خطا در پرداخت"
          />
        ) : null}
      </ApiPaymentCheckoutView>
    );
  }

  return (
    <CheckoutTariffView
      freeQuotaRemaining={freeQuotaRemaining}
      hasFreeQuota={hasFreeQuota}
      onComplete={handleCompleteOptions}
      pending={checkoutMutation.isPending}
      price={publishPrice}
    >
      {errorMessage ? (
        <Snackbar
          message={errorMessage}
          onDismiss={() => setErrorMessage("")}
          title="خطا در انتشار آگهی"
        />
      ) : null}
    </CheckoutTariffView>
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
                  <AdCardTomanIcon className="h-5 w-5" />
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
              <CircleInfoIcon className="h-5 w-5 shrink-0" />
              <Typography as="span" variant="body" size="medium" weight="regular">
                {new Intl.NumberFormat("fa-IR").format(freeQuotaRemaining)} تعرفه رایگان باقی مانده است
              </Typography>
            </Typography>
          ) : null}
        </section>

        <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />

        <section aria-label="امکانات ارتقای آگهی">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 flex items-center gap-2 px-4 pb-2 pt-5 text-right text-base font-semibold leading-6">
            <UpgradeIcon className="h-5 w-5" />
            امکانات ارتقای آگهی
          </Typography>

          <div className="divide-y divide-[#e6e6e6] px-4">
            {disabledUpgradeOptions.map((option) => (
              <div className="py-4" key={option.id}>
                <div className="flex items-start justify-between gap-5 [direction:ltr]">
                  <Typography as="span" variant="label" size="medium" weight="semibold" className="flex shrink-0 items-center gap-1 pt-1 text-sm font-semibold leading-5 text-[#c2c2c2] [direction:rtl]">
                    —
                  </Typography>

                  <div className="min-w-0 flex-1 text-right [direction:rtl]">
                    <div className="flex items-center justify-start gap-2 text-base font-medium leading-6 text-[#808080]">
                      <ChoiceIndicator checked={false} className="h-5 w-5 rounded-[4px]" disabled />
                      {option.title}
                    </div>
                    <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-4 text-sm font-normal leading-6 text-[#808080]">
                      {option.description}
                    </Typography>
                  </div>
                </div>

                <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-3 flex min-h-9 items-center gap-2 rounded-lg bg-[#fff8e8] px-3 py-2 text-right text-xs font-medium leading-5 text-[#ff6d00]">
                  <CircleInfoIcon className="h-5 w-5 shrink-0" />
                  <Typography as="span" variant="body" size="medium" weight="regular">{unavailableAfterPublishWarning}</Typography>
                </Typography>
              </div>
            ))}
          </div>
        </section>
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
  const walletAvailable = Boolean(walletMethod);
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
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
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

function ApiWalletDeficitBox({ deficit }: { deficit: number }) {
  const chargeWalletMutation = useChargeWalletMutation();
  const [errorMessage, setErrorMessage] = useState("");

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
      <div className="flex items-center justify-between rounded-lg border border-[#ffd7ad] bg-[#fff7ed] px-3 py-3 [direction:ltr]">
        <Button unstyled
          className="flex shrink-0 items-center justify-center gap-1 rounded-lg bg-[#11a366] px-4 py-1.5 text-xs font-semibold leading-5 text-white disabled:opacity-60"
          disabled={chargeWalletMutation.isPending}
          onClick={chargeWallet}
          type="button"
        >
          {chargeWalletMutation.isPending ? "در حال اتصال..." : "افزایش موجودی"}
          <Typography as="span" variant="body" size="large" weight="regular" className="flex text-base leading-none">+</Typography>
        </Button>

        <Typography as="span" variant="label" size="medium" weight="medium" className="text-right text-sm font-medium leading-5 text-[#1a1a1a] [direction:rtl]">
          کسری: {formatTariffToman(deficit)} تومان
        </Typography>
      </div>
      {errorMessage ? (
        <Snackbar
          className="relative inset-x-auto bottom-auto mt-2"
          message={errorMessage}
          onDismiss={() => setErrorMessage("")}
          title="خطا در شارژ کیف پول"
          variant="error"
        />
      ) : null}
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
  subLabelClassName = "text-[#a6a6a6]",
}: {
  active: boolean;
  disabled?: boolean;
  icon: "online" | "wallet";
  label: string;
  onClick: () => void;
  subLabel: string;
  subLabelClassName?: string;
}) {
  return (
    <Button unstyled
      aria-pressed={active}
      className={`flex h-[72px] w-full items-center justify-between border-0 bg-white px-0 text-inherit [direction:ltr] ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <ChoiceIndicator checked={active} className="h-5 w-5" disabled={disabled} type="radio" />
      <Typography as="span" variant="body" size="medium" weight="regular" className="inline-flex items-center gap-3 text-right [direction:rtl]">
        <PaymentOptionIcon className="h-7 w-7 shrink-0" icon={icon} />
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
        <AdCardTomanIcon className={iconClassName} />
      </Typography>
      <Typography as="span" variant="body" size="medium" weight="regular" className={`[direction:rtl] ${labelClassName}`}>{label}</Typography>
    </div>
  );
}

function CircleInfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9.25v4.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      <circle cx="10" cy="6.5" fill="currentColor" r="1" />
    </svg>
  );
}

function UpgradeIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path
        d="M4.5 14.5 9 10l2.75 2.75L16 8.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M12.5 8.5H16v3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}
