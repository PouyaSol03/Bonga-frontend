import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import { ConsultantAdCard } from "./ConsultantAdCard";
import { adManagementPaths, getSelectedConsultantAd } from "./adManagementData";

export function IndependentConsultantAdAllocationReviewPage() {
  const ad = getSelectedConsultantAd();

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ ad, tab: "status" }}
        backTo={adManagementPaths.root}
        className="bg-[#f0f0f0]"
        title="بررسی و تخصیص"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] px-4 py-4">
        <section className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(26,26,26,0.06)]">
          <ConsultantAdCard ad={ad} state={{ ad, tab: "status" }} />
        </section>

        <section className="mt-3 rounded-2xl bg-white px-4 py-6 text-right">
          <h2 className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">
            صفحه بررسی و تخصیص هنوز تکمیل نشده است.
          </h2>
          <p className="m-0 mt-2 text-sm font-normal leading-6 text-[#808080]">
            این مسیر برای دکمه «بررسی و تخصیص» آماده شده تا بعداً فرم یا جریان اصلی تخصیص در همین صفحه اضافه شود.
          </p>
        </section>
      </main>

      <footer className="shrink-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <RouteLink
          className="flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white no-underline"
          state={{ tab: "status" }}
          to={adManagementPaths.root}
        >
          بازگشت به تخصیصی‌ها
        </RouteLink>
      </footer>
    </PageFrame>
  );
}
