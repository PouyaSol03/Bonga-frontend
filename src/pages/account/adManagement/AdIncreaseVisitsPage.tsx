import { useMemo, useState } from "react";

import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { useAdvertisementDetailQuery } from "../../../hooks/advertisement.hooks";
import {
  AdTariffOptionsList,
  createAdTariffOptions,
  getTariffTotal,
  type AdTariffOptionId,
} from "./AdTariffOptionsView";
import { PaymentCheckoutView, type PaymentMethod } from "./IndependentConsultantAdPaymentPage";
import {
  adManagementPaths,
  getAdManagementRouteState,
  getAdStatePath,
  getSelectedConsultantAd,
} from "./adManagementData";

const upgradePrice = 40_000;

export function AdIncreaseVisitsPage() {
  const routeState = getAdManagementRouteState();
  const adId = readAdIdFromPath() ?? readQueryAdId() ?? readEntityId(routeState.ad) ?? readEntityId(routeState.card);
  const backTo = routeState.paymentHistoryReturnTo ?? (adId ? getAdStatePath(adId) : adManagementPaths.root);
  const query = useAdvertisementDetailQuery(adId ?? null);
  const fetchedAd = query.data;
  const card = routeState.card ?? getSelectedConsultantAd(adId);
  const ad = fetchedAd ?? routeState.ad ?? card;
  const [step, setStep] = useState<"options" | "checkout">("options");
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [selectedTariffs, setSelectedTariffs] = useState<AdTariffOptionId[]>(["special"]);
  const tariffOptions = useMemo(
    () => createAdTariffOptions({ price: upgradePrice }),
    [],
  );
  const payableAmount = getTariffTotal(tariffOptions, selectedTariffs);
  const completeState = useMemo(
    () => ({
      ad,
      card,
      showPaymentSuccess: true,
      returnTo: routeState.returnTo,
      tab: routeState.tab ?? "status",
    }),
    [ad, card, routeState.returnTo, routeState.tab],
  );

  function toggleTariff(optionId: AdTariffOptionId) {
    setSelectedTariffs((selected) =>
      selected.includes(optionId)
        ? selected.filter((item) => item !== optionId)
        : [...selected, optionId],
    );
  }

  if (step === "checkout") {
    return (
      <PaymentCheckoutView
        completeLabelPrefix="پرداخت و افزایش بازدید"
        completeState={completeState}
        completeTo={backTo}
        method={method}
        onBack={() => setStep("options")}
        onMethodChange={setMethod}
        publishState={completeState}
        total={payableAmount}
      />
    );
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ ad, card, returnTo: routeState.returnTo, tab: routeState.tab ?? "status" }}
        backTo={backTo}
        className="bg-[#f0f0f0] [&_a]:text-[#1a1a1a]"
        title="افزایش بازدید"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-[76px]">
        {query.isLoading ? <LoadingNotice /> : null}
        {query.isError ? <ErrorNotice onRetry={() => void query.refetch()} /> : null}
        <AdTariffOptionsList
          onToggle={toggleTariff}
          options={tariffOptions}
          selectedIds={selectedTariffs}
        />
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-3 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <button
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white shadow-[0_4px_10px_rgba(0,72,196,0.22)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          onClick={() => setStep("checkout")}
          type="button"
        >
          تکمیل خرید
        </button>
      </footer>
    </PageFrame>
  );
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

  const record = entity as Record<string, unknown>;
  const id = record.id ?? record._id ?? record.advertise_id ?? record.advertiseId;

  if (typeof id === "string" && id.trim()) return id;
  if (typeof id === "number") return String(id);

  return undefined;
}

function LoadingNotice() {
  return (
    <div className="px-4 py-3 text-center text-xs font-medium leading-5 text-[#808080]">
      در حال دریافت اطلاعات آگهی...
    </div>
  );
}

function ErrorNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-4 my-3 rounded-lg bg-[#fff5db] px-3 py-2 text-center text-xs font-medium leading-5 text-[#ff6d00]">
      <p className="m-0">دریافت اطلاعات آگهی با خطا مواجه شد.</p>
      <button className="mt-1 border-0 text-xs font-semibold text-[#0048c4]" onClick={onRetry} type="button">
        تلاش دوباره
      </button>
    </div>
  );
}
