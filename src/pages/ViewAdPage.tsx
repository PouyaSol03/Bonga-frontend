import { PageFrame } from "../app/PageFrame";
import { BottomNavigation } from "../components/BottomNavigation";
import ArrowRight from "../assets/icons/ArrowRight";
import { RouteLink } from "../routes/RouteLink";
import { getLatestMashhadAdById } from "./home/homeData";

function parseViewAdId(pathname: string): number | null {
  const match = /^\/ads\/(\d+)\/?$/.exec(pathname);
  if (!match) return null;

  const id = Number(match[1]);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function ViewAdPage() {
  const adId = parseViewAdId(window.location.pathname);
  const ad = adId != null ? getLatestMashhadAdById(adId) : undefined;
  const hasSecondaryPrice =
    ad && ad.priceLabelSecondary && ad.priceSecondary;

  if (!ad) {
    return (
      <PageFrame
        className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
        variant="flush"
      >
        <header className="shrink-0 border-b border-[#e5e5e5] bg-white">
          <div className="flex min-h-14 items-center gap-2 px-3 py-2 min-[390px]:min-h-16 min-[390px]:px-4">
            <RouteLink
              aria-label="بازگشت"
              className="grid size-9 shrink-0 place-items-center text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:size-10"
              to="/home"
            >
              <ArrowRight />
            </RouteLink>
            <h1 className="m-0 flex-1 text-right text-sm font-semibold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6">
              آگهی پیدا نشد
            </h1>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
          <p className="m-0 text-right text-sm leading-6 text-[#4d4d4d] min-[390px]:text-base min-[390px]:leading-7">
            این آگهی در حال حاضر موجود نیست یا لینک آن نادرست است.
          </p>
          <RouteLink
            className="mt-6 inline-flex rounded-xl bg-[#0048c4] px-5 py-3 text-sm font-semibold text-white no-underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:px-6 min-[390px]:text-base"
            to="/home"
          >
            بازگشت به خانه
          </RouteLink>
        </main>

        <BottomNavigation activeKey="home" />
      </PageFrame>
    );
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <header className="shrink-0 border-b border-[#e5e5e5] bg-white">
        <div className="flex min-h-14 items-center gap-2 px-3 py-2 min-[390px]:min-h-16 min-[390px]:px-4">
          <RouteLink
            aria-label="بازگشت"
            className="grid size-9 shrink-0 place-items-center text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:size-10"
            to="/home"
          >
            <ArrowRight />
          </RouteLink>
          <h1 className="m-0 line-clamp-1 min-w-0 flex-1 text-right text-sm font-semibold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6">
            {ad.title}
          </h1>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <div
          className={`ad-card__image relative min-h-[220px] w-full overflow-hidden bg-[#dbe5ff] bg-cover min-[390px]:min-h-[260px] ${ad.imageClassName}`}
        >
          <div
            className="absolute right-3 top-3 z-2 inline-flex h-7 min-w-11 items-center justify-center gap-1.5 rounded-lg bg-[#1a1a1a85] px-2 py-1 text-xs font-semibold leading-4 text-white min-[390px]:right-4 min-[390px]:top-4 min-[390px]:h-8 min-[390px]:min-w-[52px] min-[390px]:text-sm min-[390px]:leading-5"
            aria-hidden="true"
          >
            <span>{ad.statusCount}</span>
            <span className="ad-card__action-icon" />
          </div>
          {ad.agency ? (
            <div className="ad-card__agency-name absolute bottom-3 right-3 z-1 inline-flex max-w-[calc(100%-24px)] items-center gap-2 whitespace-nowrap rounded-lg bg-[#1a1a1a9e] px-2 py-1.5 text-xs font-medium leading-4 text-white min-[390px]:bottom-4 min-[390px]:right-4 min-[390px]:px-2.5 min-[390px]:py-2 min-[390px]:text-[13px] min-[390px]:leading-[18px]">
              {ad.agency}
            </div>
          ) : null}
        </div>

        <div className="bg-white px-4 pb-4 pt-4 min-[390px]:px-5 min-[390px]:pb-5 min-[390px]:pt-5">
          <div className="flex flex-wrap items-baseline justify-start gap-2 [direction:rtl]">
            <div className="ad-card__price-item inline-flex min-w-0 items-center gap-1">
              {ad.priceLabelPrimary ? (
                <span className="text-sm font-medium leading-5 text-[#808080] min-[390px]:text-base min-[390px]:leading-6">
                  {ad.priceLabelPrimary}
                </span>
              ) : null}
              <strong className="whitespace-nowrap text-base font-bold leading-6 text-[#0048c4] min-[390px]:text-lg min-[390px]:leading-7">
                {ad.pricePrimary}
              </strong>
            </div>
            {hasSecondaryPrice ? (
              <span
                className="h-6 w-px shrink-0 bg-[#cccccc]"
                aria-hidden="true"
              />
            ) : null}
            {hasSecondaryPrice ? (
              <div className="ad-card__price-item inline-flex min-w-0 items-center gap-1">
                <span className="text-sm font-medium leading-5 text-[#808080] min-[390px]:text-base min-[390px]:leading-6">
                  {ad.priceLabelSecondary}
                </span>
                <strong className="whitespace-nowrap text-base font-bold leading-6 text-[#0048c4] min-[390px]:text-lg min-[390px]:leading-7">
                  {ad.priceSecondary}
                </strong>
              </div>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-start gap-3 text-sm font-medium leading-5 text-[#1a1a1a] [direction:rtl] min-[390px]:mt-4 min-[390px]:gap-[22px] min-[390px]:text-base min-[390px]:leading-6">
            <span className="ad-card__property ad-card__property--area text-[#4d4d4d]">
              {ad.area}
            </span>
            <span className="ad-card__property ad-card__property--rooms text-[#4d4d4d]">
              {ad.rooms}
            </span>
            <span className="ad-card__property ad-card__property--year text-[#4d4d4d]">
              {ad.year}
            </span>
          </div>

          <p className="mt-4 text-right text-base font-medium leading-7 text-[#1a1a1a] min-[390px]:mt-5 min-[390px]:text-lg min-[390px]:leading-8">
            {ad.title}
          </p>

          <div className="mt-3 flex min-h-6 flex-wrap items-center justify-start gap-2 [direction:rtl] min-[390px]:mt-4">
            <div className="ad-card__badges inline-flex items-center gap-1">
              {ad.badges.map((badge) => (
                <span
                  className={`whitespace-nowrap rounded-lg border px-2 py-[3px] text-xs leading-4 min-[390px]:text-sm min-[390px]:leading-5 ${
                    badge === "فوری"
                      ? "border-[#ff6d00] text-[#ff6d00]"
                      : "border-[#11a366] text-[#11a366]"
                  }`}
                  key={badge}
                >
                  {badge}
                </span>
              ))}
            </div>
            <span className="min-w-0 text-right text-xs font-normal leading-4 text-[#808080] min-[390px]:text-sm min-[390px]:leading-5">
              {ad.timeAndLocation}
            </span>
          </div>
        </div>

        <section
          className="mt-2 border-t-8 border-[#f0f0f0] bg-white px-4 py-4 text-right min-[390px]:px-5 min-[390px]:py-5"
          aria-labelledby="view-ad-description"
        >
          <h2
            className="m-0 text-base font-bold leading-6 text-[#1a1a1a] min-[390px]:text-lg min-[390px]:leading-7"
            id="view-ad-description"
          >
            توضیحات
          </h2>
          <div className="mt-3 space-y-3 text-sm font-normal leading-6 text-[#4d4d4d] min-[390px]:mt-4 min-[390px]:space-y-4 min-[390px]:text-base min-[390px]:leading-7">
            <p className="m-0">
              واحد رو به آفتاب با نور طبیعی عالی، کف سرامیک، کابینت ممبران و
              سیستم گرمایشی و سرمایشی اسپلیت. دسترسی آسان به بلوار اصلی، مراکز
              خرید و حمل‌ونقل عمومی.
            </p>
            <p className="m-0">
              سند تک‌برگ، پارکینگ اختصاصی و انباری. مناسب سکونت خانوادگی یا
              سرمایه‌گذاری. بازدید با هماهنگی قبلی امکان‌پذیر است.
            </p>
            <p className="m-0">
              اطلاعات نمایش‌داده‌شده صرفاً جنبه معرفی دارد؛ برای قطعی شدن شرایط
              معامله با مشاور تماس بگیرید.
            </p>
          </div>
        </section>

        <section
          className="mt-2 border-t-8 border-[#f0f0f0] bg-white px-4 py-4 min-[390px]:px-5 min-[390px]:py-5"
          aria-labelledby="view-ad-features"
        >
          <h2
            className="m-0 text-right text-base font-bold leading-6 text-[#1a1a1a] min-[390px]:text-lg min-[390px]:leading-7"
            id="view-ad-features"
          >
            امکانات
          </h2>
          <ul className="m-0 mt-3 list-none space-y-2.5 p-0 text-right text-sm leading-6 text-[#4d4d4d] min-[390px]:mt-4 min-[390px]:space-y-3 min-[390px]:text-base min-[390px]:leading-7">
            <li>آسانسور</li>
            <li>بالکن</li>
            <li>انباری اختصاصی</li>
            <li>درب ضدسرقت</li>
            <li>آیفون تصویری</li>
          </ul>
        </section>
      </main>

      <div className="shrink-0 border-t border-[#e5e5e5] bg-white px-4 py-3 min-[390px]:px-5 min-[390px]:py-4">
        <div className="flex gap-3 [direction:rtl]">
          <button
            className="min-h-11 flex-1 rounded-xl border border-[#0048c4] bg-white py-2.5 text-sm font-semibold leading-5 text-[#0048c4] transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:min-h-12 min-[390px]:py-3 min-[390px]:text-base min-[390px]:leading-6"
            type="button"
          >
            پیام
          </button>
          <button
            className="min-h-11 flex-1 rounded-xl bg-[#0048c4] py-2.5 text-sm font-semibold leading-5 text-white shadow-[0_6px_18px_rgba(0,72,196,0.22)] transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:min-h-12 min-[390px]:py-3 min-[390px]:text-base min-[390px]:leading-6"
            type="button"
          >
            تماس
          </button>
        </div>
      </div>

      <BottomNavigation activeKey="home" />
    </PageFrame>
  );
}
