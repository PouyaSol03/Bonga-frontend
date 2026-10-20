import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { getApiErrorMessage } from "../../../shared/api/api";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import {
  useAdvertisementCheckoutQuery,
  useMyAdvertisementDetailQuery,
  useSubmitAdvertisementCheckoutMutation,
} from "../../advertisements/api/advertisement.hooks";
import { storePaymentReturnTarget } from "../../../shared/utils/payment-return";
import { useToast } from "../../../shared/hooks/useToast";
import type {
  AdvertisementCheckout,
  AdvertisementCheckoutItem,
  AdvertisementCheckoutPaymentMethod,
  AdvertisementCheckoutPaymentMethodCode,
} from "../../advertisements/api/advertisement.service";
import { ApiPaymentCheckoutView, type PaymentMethod } from "./IndependentConsultantAdPaymentPage";
import {
  validateDiscountCode,
  type ValidateDiscountCodeResult,
} from "../../crm/api/crm-discount.service";
import {
  AdTariffOptionsList,
  createAdTariffOptions,
  getTariffTotal,
  type AdTariffOptionId,
} from "./AdTariffOptionsView";
import { adManagementPaths, getAdManagementRouteState, getAdStatePath } from "./adManagementData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

export function AdIncreaseVisitsPage() {
  const navigate = useNavigate();
  const routeState = getAdManagementRouteState();
  const adId =
    readAdIdFromPath() ??
    readQueryAdId() ??
    readEntityId(routeState.ad) ??
    readEntityId(routeState.card);
  const backTo =
    routeState.paymentHistoryReturnTo ?? (adId ? getAdStatePath(adId) : adManagementPaths.root);
  const adQuery = useMyAdvertisementDetailQuery(adId ?? null);
  const checkoutQuery = useAdvertisementCheckoutQuery(adId ?? null);
  const checkoutMutation = useSubmitAdvertisementCheckoutMutation();
  const [step, setStep] = useState<"options" | "checkout">("options");
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [selectedTariffs, setSelectedTariffs] = useState<AdTariffOptionId[]>([]);
  const [discountInput, setDiscountInput] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<ValidateDiscountCodeResult | null>(null);
  const { showToast } = useToast();
  const showError = (message: string) => showToast(message, "خطا", "error");
  const checkout = checkoutQuery.data;
  const products = useMemo(() => resolveUpgradeProducts(checkout), [checkout]);
  const tariffOptions = useMemo(
    () =>
      createAdTariffOptions({ price: 0 }).flatMap((option) => {
        const product = resolveProductForOption(option.id, products);
        const checkoutItem = product
          ? products.find((item) => item.product === product)
          : undefined;
        if (!checkoutItem) return [];

        return [
          {
            ...option,
            description: getUpgradeDescription(option.id, checkoutItem, option.description),
            price: checkoutItem.price ?? 0,
          },
        ];
      }),
    [products],
  );
  const selectedProducts = useMemo(
    () =>
      Array.from(
        new Set(
          selectedTariffs
            .map((id) => resolveProductForOption(id, products))
            .filter((product): product is string => product !== undefined),
        ),
      ),
    [products, selectedTariffs],
  );
  const payableAmount = useMemo(() => {
    const amount = selectedProducts.reduce(
      (total, product) => total + (products.find((item) => item.product === product)?.price ?? 0),
      0,
    );
    return amount || getCheckoutAmount(checkout) || getTariffTotal(tariffOptions, selectedTariffs);
  }, [checkout, products, selectedProducts, selectedTariffs, tariffOptions]);
  const finalPayable = useMemo(() => {
    if (!appliedDiscount) return payableAmount;
    if (typeof appliedDiscount.final_price === "number") {
      return Math.max(appliedDiscount.final_price, 0);
    }
    const percent = Number(appliedDiscount.discount_percent ?? 0);
    if (percent > 0) {
      return Math.max(Math.round(payableAmount * (1 - percent / 100)), 0);
    }
    return payableAmount;
  }, [appliedDiscount, payableAmount]);
  const ad = adQuery.data ?? routeState.ad ?? routeState.card;
  const completeState = useMemo(
    () => ({
      ad,
      card: routeState.card ?? ad,
      showPaymentSuccess: true,
      returnTo: routeState.returnTo,
      tab: routeState.tab ?? "status",
    }),
    [ad, routeState.card, routeState.returnTo, routeState.tab],
  );
  const walletMethod = checkout ? findMethod(checkout, "wallet") : undefined;
  const gatewayMethod = checkout ? findMethod(checkout, "gateway") : undefined;

  const is100Percent = Boolean(
    appliedDiscount?.is_free ||
    appliedDiscount?.disable_gateway ||
    (appliedDiscount && finalPayable === 0),
  );
  const effectiveMethod =
    (gatewayMethod?.available === false && walletMethod?.available !== false) ||
    (is100Percent && method === "online")
      ? "wallet"
      : method;

  async function handleApplyDiscount() {
    const code = discountInput.trim();
    if (!code) return;
    setDiscountLoading(true);
    setDiscountError(null);
    try {
      const result = await validateDiscountCode({
        code,
        price: payableAmount,
        service: "advertise",
      });
      setAppliedDiscount(result);
      if (result.disable_gateway || result.is_free || result.final_price === 0) {
        setMethod("wallet");
      }
    } catch (err: unknown) {
      const msg = getApiErrorMessage(
        err,
        err instanceof Error && err.message ? err.message : "کد تخفیف نامعتبر است",
      );
      setDiscountError(msg);
      setAppliedDiscount(null);
    } finally {
      setDiscountLoading(false);
    }
  }

  function handleRemoveDiscount() {
    setAppliedDiscount(null);
    setDiscountInput("");
    setDiscountError(null);
  }

  function toggleTariff(id: AdTariffOptionId) {
    setSelectedTariffs((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);

      if (id === "refreshSpecial") {
        return [...current.filter((item) => item !== "refresh" && item !== "special"), id];
      }

      if (id === "refresh" || id === "special") {
        return [...current.filter((item) => item !== "refreshSpecial"), id];
      }

      return [...current, id];
    });
  }

  function submit(paymentMethod: AdvertisementCheckoutPaymentMethodCode) {
    if (!adId || selectedProducts.length === 0 || checkoutMutation.isPending) return;
    checkoutMutation.mutate(
      {
        advertiseId: adId,
        discount_code: appliedDiscount?.code,
        items: selectedProducts,
        paymentMethod,
      },
      {
        onError: (error: unknown) =>
          showError(getApiErrorMessage(error, "پرداخت و افزایش بازدید با خطا مواجه شد.")),
        onSuccess: ({ paymentUrl }) => {
          if (paymentMethod === "gateway") {
            if (!paymentUrl) {
              showError("آدرس درگاه پرداخت از سرور دریافت نشد.");
              return;
            }
            storePaymentReturnTarget({ label: "بازگشت به وضعیت آگهی", path: backTo });
            window.location.assign(paymentUrl);
            return;
          }
          navigate(backTo, { replace: true, state: completeState });
        },
      },
    );
  }

  if (checkoutQuery.isLoading || !adId) {
    return (
      <StatusPage
        backTo={backTo}
        message={adId ? "در حال دریافت هزینه و روش‌های پرداخت..." : "شناسه آگهی یافت نشد."}
      />
    );
  }
  if (checkoutQuery.isError || !checkout) {
    return (
      <StatusPage
        backTo={backTo}
        message={getApiErrorMessage(checkoutQuery.error, "دریافت اطلاعات پرداخت با خطا مواجه شد.")}
        onRetry={() => void checkoutQuery.refetch()}
      />
    );
  }
  if (products.length === 0) {
    return (
      <StatusPage
        backTo={backTo}
        message="تعرفه افزایش بازدید از سرور دریافت نشد."
        onRetry={() => void checkoutQuery.refetch()}
      />
    );
  }
  if (step === "checkout") {
    return (
      <ApiPaymentCheckoutView
        appliedDiscount={appliedDiscount}
        discountError={discountError}
        discountInput={discountInput}
        discountLoading={discountLoading}
        gatewayMethod={gatewayMethod}
        method={effectiveMethod}
        onApplyDiscount={handleApplyDiscount}
        onBack={() => setStep("options")}
        onDiscountInputChange={(val) => {
          setDiscountInput(val);
          if (discountError) setDiscountError(null);
        }}
        onMethodChange={setMethod}
        onRemoveDiscount={handleRemoveDiscount}
        onSubmit={() => submit(effectiveMethod === "wallet" ? "wallet" : "gateway")}
        payableAmount={finalPayable}
        pending={checkoutMutation.isPending}
        submitLabelPrefix="پرداخت و افزایش بازدید"
        totalPrice={payableAmount}
        walletMethod={walletMethod}
      ></ApiPaymentCheckoutView>
    );
  }

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo={backTo} className="bg-surface-container" title="افزایش بازدید" />
      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-[76px]">
        <AdTariffOptionsList
          onToggle={toggleTariff}
          options={tariffOptions}
          selectedIds={selectedTariffs}
        />
      </main>
      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-3 pb-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Button
          unstyled
          className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium disabled:opacity-60"
          disabled={selectedProducts.length === 0}
          onClick={() => setStep("checkout")}
          type="button"
        >
          تکمیل خرید
        </Button>
      </footer>
    </PageFrame>
  );
}

function resolveUpgradeProducts(checkout?: AdvertisementCheckout): AdvertisementCheckoutItem[] {
  const items = checkout?.items ?? [];
  const upgradeItems = items.filter((item) => !/publish|ثبت|انتشار/i.test(item.product));
  return upgradeItems;
}

const upgradeProductByTariff: Record<AdTariffOptionId, string> = {
  refresh: "advertise_update",
  special: "advertise_special",
  renew: "advertise_extend",
  refreshSpecial: "advertise_update_special",
};

function resolveProductForOption(id: AdTariffOptionId, products: AdvertisementCheckoutItem[]) {
  const product = upgradeProductByTariff[id];
  return products.some((item) => item.product === product) ? product : undefined;
}

function getUpgradeDescription(
  id: AdTariffOptionId,
  item: AdvertisementCheckoutItem | undefined,
  fallback: string,
) {
  if (item?.description?.trim()) return item.description.trim();

  const days = Number(item?.duration_days ?? 0);
  const months = Number(item?.duration_months ?? 0);
  if (id === "refresh" && days > 0) {
    return `آگهی شما به مدت ${new Intl.NumberFormat("fa-IR").format(days)} روز در اولویت نمایش قرار می‌گیرد.`;
  }
  if (id === "special" && days > 0) {
    return `آگهی شما به مدت ${new Intl.NumberFormat("fa-IR").format(days)} روز با برچسب ویژه نمایش داده می‌شود.`;
  }
  if (id === "renew" && months > 0) {
    return `آگهی شما برای ${new Intl.NumberFormat("fa-IR").format(months)} ماه دیگر تمدید می‌شود.`;
  }
  if (id === "refreshSpecial" && days > 0) {
    return `بروزرسانی و ویژه به مدت ${new Intl.NumberFormat("fa-IR").format(days)} روز همزمان فعال می‌شوند.`;
  }

  return fallback;
}

function getCheckoutAmount(checkout?: AdvertisementCheckout) {
  const value = checkout?.summary.payable_amount ?? checkout?.summary.total_price;
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function findMethod(
  checkout: AdvertisementCheckout,
  method: string,
): AdvertisementCheckoutPaymentMethod | undefined {
  return checkout.payment_methods.find((item) => item.method === method);
}

function readAdIdFromPath() {
  const match = window.location.pathname.match(/^\/account\/my-ads\/([^/]+)\/increase-visits\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function readQueryAdId() {
  return new URLSearchParams(window.location.search).get("adId") ?? undefined;
}

function readEntityId(entity: unknown) {
  if (!entity || typeof entity !== "object") return undefined;
  const value =
    (entity as Record<string, unknown>).id ??
    (entity as Record<string, unknown>)._id ??
    (entity as Record<string, unknown>).advertise_id;
  return typeof value === "string" && value.trim()
    ? value
    : typeof value === "number"
      ? String(value)
      : undefined;
}

function StatusPage({
  backTo,
  message,
  onRetry,
}: {
  backTo: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo={backTo} title="افزایش بازدید" />
      <main className="mx-auto flex min-h-0 w-full flex-1 flex-col items-center justify-center px-6 text-center">
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="medium"
          className="text-on-surface-var m-0 text-sm leading-6 font-medium"
        >
          {message}
        </Typography>
        {onRetry ? (
          <Button
            unstyled
            className="bg-primary text-on-primary mt-4 h-10 rounded-lg px-5 text-sm font-medium"
            onClick={onRetry}
            type="button"
          >
            تلاش دوباره
          </Button>
        ) : (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="border-primary-container border-t-primary mt-4 h-8 w-8 animate-spin rounded-full border-2"
          />
        )}
      </main>
    </PageFrame>
  );
}
