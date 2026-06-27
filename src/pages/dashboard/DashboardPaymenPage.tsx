import { getRequestErrorState } from "../../components/ErrorState";
import PricingCard from "../../components/dashboard/addWallet/PricingCard";
import { usePackagesQuery } from "../../hooks/package.hooks";
import type { PackageItem } from "../../services/package.service";

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

function EmptyPackagesState() {
  return (
    <div className="rounded-xl border border-dashed border-[#D9DDE7] bg-[#F8FAFF] px-4 py-10 text-center text-sm font-medium text-[#666666]">
      بسته‌ای برای نمایش وجود ندارد.
    </div>
  );
}

export default function DashboardPaymentPage() {
  const { data: packages = [], error, isError, isLoading, refetch } = usePackagesQuery();
  const panelCreditPlans = packages
    .filter((plan) => plan.kind === "panel_subscription")
    .map(mapPanelPlan);
  const packagePlans = packages
    .filter((plan) => plan.kind === "credit_bundle")
    .map(mapBundlePlan);
  const ErrorState = getRequestErrorState(error);

  return (
    <div dir="rtl" className="rounded-xl bg-white p-6">
      <div className="mb-6 flex items-center justify-between border-b border-dashed border-[#D9DDE7] pb-5">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#DBE6FF]">
            <img className="h-5 w-5" src="/icons/walletPlus.svg" alt="" />
          </span>

          <h1 className="text-[22px] font-medium text-[#1F2937]">
            افزایش اعتبار
          </h1>
        </div>

        <button
          type="button"
          className="rounded-lg border border-[#0048C4] px-3 py-2 text-xs font-medium text-[#0048C4]"
        >
          تاریخچه پرداخت
        </button>
      </div>

      {isError ? (
        <ErrorState className="min-h-[420px]" onRetry={() => void refetch()} />
      ) : null}

      {!isError ? (
        <>
          <section>
            <h2 className="mb-4 text-[22px] font-medium text-[#1F2937]">
              اعتبار پنل
            </h2>

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
                  />
                ))}
              </div>
            ) : null}

            {!isLoading && panelCreditPlans.length === 0 ? (
              <EmptyPackagesState />
            ) : null}
          </section>

          <section className="mt-10">
            <h2 className="mb-4 text-right text-base font-semibold text-[#1F2937]">
              بسته‌ها
            </h2>

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
