import { useEffect, useMemo, useState } from "react";

import { getApiErrorMessage } from "../../../shared/api/api";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import {
  useAdvertisementCheckoutQuery,
  useMyAdvertisementDetailQuery,
  useSubmitAdvertisementCheckoutMutation,
} from "../../advertisements/api/advertisement.hooks";
import { storePaymentReturnTarget } from "../../../shared/utils/payment-return";
import type {
  AdvertisementCheckout,
  AdvertisementCheckoutItem,
  AdvertisementCheckoutPaymentMethod,
  AdvertisementCheckoutPaymentMethodCode,
} from "../../advertisements/api/advertisement.service";
import {
  ApiPaymentCheckoutView,
  type PaymentMethod,
} from "./IndependentConsultantAdPaymentPage";
import {
  AdTariffOptionsList,
  createAdTariffOptions,
  getTariffTotal,
  type AdTariffOptionId,
} from "./AdTariffOptionsView";
import {
  adManagementPaths,
  getAdManagementRouteState,
  getAdStatePath,
} from "./adManagementData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

export function AdIncreaseVisitsPage() {
  const routeState = getAdManagementRouteState();
  const adId = readAdIdFromPath() ?? readQueryAdId() ?? readEntityId(routeState.ad) ?? readEntityId(routeState.card);
  const backTo = routeState.paymentHistoryReturnTo ?? (adId ? getAdStatePath(adId) : adManagementPaths.root);
  const adQuery = useMyAdvertisementDetailQuery(adId ?? null);
  const checkoutQuery = useAdvertisementCheckoutQuery(adId ?? null);
  const checkoutMutation = useSubmitAdvertisementCheckoutMutation();
  const [step, setStep] = useState<"options" | "checkout">("options");
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [selectedTariffs, setSelectedTariffs] = useState<AdTariffOptionId[]>(["special"]);
  const [, setErrorMessage] = useState("");
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

        return [{
          ...option,
          description: getUpgradeDescription(option.id, checkoutItem, option.description),
          price: checkoutItem.price ?? 0,
        }];
      }),
    [products],
  );
  const selectedProducts = useMemo(
    () => Array.from(new Set(selectedTariffs.map((id) => resolveProductForOption(id, products)).filter(Boolean))),
    [products, selectedTariffs],
  );
  const payableAmount = useMemo(() => {
    const amount = selectedProducts.reduce((total, product) => total + (products.find((item) => item.product === product)?.price ?? 0), 0);
    return amount || getCheckoutAmount(checkout) || getTariffTotal(tariffOptions, selectedTariffs);
  }, [checkout, products, selectedProducts, selectedTariffs, tariffOptions]);
  const ad = adQuery.data ?? routeState.ad ?? routeState.card;
  const completeState = useMemo(
    () => ({ ad, card: routeState.card ?? ad, showPaymentSuccess: true, returnTo: routeState.returnTo, tab: routeState.tab ?? "status" }),
    [ad, routeState.card, routeState.returnTo, routeState.tab],
  );
  const walletMethod = checkout ? findMethod(checkout, "wallet") : undefined;
  const gatewayMethod = checkout ? findMethod(checkout, "gateway") : undefined;

  useEffect(() => {
    if (gatewayMethod?.available === false && walletMethod?.available !== false) setMethod("wallet");
  }, [gatewayMethod?.available, walletMethod?.available]);

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
    setErrorMessage("");
    checkoutMutation.mutate(
      { advertiseId: adId, items: selectedProducts, paymentMethod },
      {
        onError: (error: unknown) => setErrorMessage(getApiErrorMessage(error, "پرداخت و افزایش بازدید با خطا مواجه شد.")),
        onSuccess: ({ paymentUrl }) => {
          if (paymentMethod === "gateway") {
            if (!paymentUrl) {
              setErrorMessage("آدرس درگاه پرداخت از سرور دریافت نشد.");
              return;
            }
            storePaymentReturnTarget({ label: "بازگشت به وضعیت آگهی", path: backTo });
            window.location.assign(paymentUrl);
            return;
          }
          navigateTo(backTo, completeState, true);
        },
      },
    );
  }

  if (checkoutQuery.isLoading || !adId) {
    return <StatusPage backTo={backTo} message={adId ? "در حال دریافت هزینه و روش‌های پرداخت..." : "شناسه آگهی یافت نشد."} />;
  }
  if (checkoutQuery.isError || !checkout) {
    return <StatusPage backTo={backTo} message={getApiErrorMessage(checkoutQuery.error, "دریافت اطلاعات پرداخت با خطا مواجه شد.")} onRetry={() => void checkoutQuery.refetch()} />;
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
        gatewayMethod={gatewayMethod}
        method={method}
        onBack={() => setStep("options")}
        onMethodChange={setMethod}
        onSubmit={() => submit(method === "wallet" ? "wallet" : "gateway")}
        payableAmount={payableAmount}
        pending={checkoutMutation.isPending}
        submitLabelPrefix="پرداخت و افزایش بازدید"
        totalPrice={payableAmount}
        walletMethod={walletMethod}
      >
      </ApiPaymentCheckoutView>
    );
  }

  return (
    <PageFrame className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]" variant="flush">
      <TopBar backTo={backTo} className="bg-[#f0f0f0]" title="افزایش بازدید" />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-[76px]">
        <AdTariffOptionsList onToggle={toggleTariff} options={tariffOptions} selectedIds={selectedTariffs} />
      </main>
      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-3 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Button unstyled className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white disabled:opacity-60" disabled={selectedProducts.length === 0} onClick={() => setStep("checkout")} type="button">
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

function findMethod(checkout: AdvertisementCheckout, method: string): AdvertisementCheckoutPaymentMethod | undefined {
  return checkout.payment_methods.find((item) => item.method === method);
}

function navigateTo(path: string, state?: unknown, replace = false) {
  window.history[replace ? "replaceState" : "pushState"](state ?? {}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function readAdIdFromPath() {
  const match = window.location.pathname.match(/^\/account\/my-ads\/([^/]+)\/increase-visits\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function readQueryAdId() { return new URLSearchParams(window.location.search).get("adId") ?? undefined; }

function readEntityId(entity: unknown) {
  if (!entity || typeof entity !== "object") return undefined;
  const value = (entity as Record<string, unknown>).id ?? (entity as Record<string, unknown>)._id ?? (entity as Record<string, unknown>).advertise_id;
  return typeof value === "string" && value.trim() ? value : typeof value === "number" ? String(value) : undefined;
}

function StatusPage({ backTo, message, onRetry }: { backTo: string; message: string; onRetry?: () => void }) {
  return (
    <PageFrame className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]" variant="flush">
      <TopBar backTo={backTo} title="افزایش بازدید" />
      <main className="mx-auto flex min-h-0 w-full flex-1 flex-col items-center justify-center px-6 text-center">
        <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm font-medium leading-6 text-[#4d4d4d]">{message}</Typography>
        {onRetry ? <Button unstyled className="mt-4 h-10 rounded-lg bg-[#0048c4] px-5 text-sm font-medium text-white" onClick={onRetry} type="button">تلاش دوباره</Button> : <Typography as="span" variant="body" size="medium" weight="regular" className="mt-4 h-8 w-8 animate-spin rounded-full border-2 border-[#d9e5fb] border-t-[#0048c4]" />}
      </main>
    </PageFrame>
  );
}
