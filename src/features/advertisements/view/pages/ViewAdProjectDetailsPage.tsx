import { useState } from "react";
import { getApiErrorMessage } from "../../../../shared/api/api";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { TopBar } from "../../../../shared/components/TopBar";
import {
  useAgencyAdvertisementPreviewQuery,
  useAdvertisementDetailQuery,
  useAdvertisementPreviewQuery,
} from "../../api/advertisement.hooks";
import {
  goBackFromAd,
  goBackToAd,
  mapAdToDetails,
  parseViewAdIdFromPath,
} from "../viewAdDetails";
import { toPersianDigits } from "../viewAdComponents";
import type { ViewAdProjectDetailVariant } from "../viewAdTypes";
import { LoadingState, NotFoundState, ViewAdErrorState } from "../ViewAdRouteStates";
import { shouldUseAgencyAllocationPreview } from "../viewAdPreviewContext";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearCoinBag from "../../../../shared/icons/LinearCoinBag";
import LinearCalendarDay from "../../../../shared/icons/LinearCalendarDay";
import LinearBuilding2 from "../../../../shared/icons/LinearBuilding2";
import LinearAgreement from "../../../../shared/icons/LinearAgreement";
import LinearFloor from "../../../../shared/icons/LinearFloor";
import LinearBed from "../../../../shared/icons/LinearBed";
import LinearConstruction from "../../../../shared/icons/LinearConstruction";
import LinearBuilding3 from "../../../../shared/icons/LinearBuilding3";

function toText(val: unknown, fallback = ""): string {
  if (val === undefined || val === null) return fallback;
  const s = String(val).trim();
  return s || fallback;
}

export function ViewAdProjectDetailsPage() {
  const adId = parseViewAdIdFromPath(window.location.pathname);
  const isPreview = window.location.pathname.startsWith("/preview-ad/");
  const useAgencyAllocationPreview = isPreview && shouldUseAgencyAllocationPreview();
  const detailQuery = useAdvertisementDetailQuery(isPreview ? null : adId);
  const previewQuery = useAdvertisementPreviewQuery(
    isPreview && !useAgencyAllocationPreview ? adId : null,
  );
  const agencyPreviewQuery = useAgencyAdvertisementPreviewQuery(
    useAgencyAllocationPreview ? adId : null,
  );
  const { data: ad, error, isError, isLoading, refetch } = isPreview
    ? useAgencyAllocationPreview
      ? agencyPreviewQuery
      : previewQuery
    : detailQuery;

  const resolvedAd = ad;

  const fallbackVariants: ViewAdProjectDetailVariant[] = [
    {
      id: "variant-100",
      meterageTitle: "واحدهای ۱۰۰ متری",
      floors: ["۳", "۵", "۷", "۸", "۱۵"],
      roomLabel: "۱ تا ۳ خواب",
      positions: ["شمالی", "جنوبی", "شرقی"],
    },
    {
      id: "variant-150",
      meterageTitle: "۱۵۰ متری",
      floors: ["۲", "۴", "۶", "۹"],
      roomLabel: "تا ۳ خواب",
      positions: ["جنوبی"],
    },
    {
      id: "variant-180",
      meterageTitle: "۱۸۰ متری",
      floors: ["۱", "۱۰", "۱۲"],
      roomLabel: "تا ۴ خواب",
      positions: ["جنوبی"],
    },
    {
      id: "variant-250",
      meterageTitle: "۲۵۰ متری",
      floors: ["۱۳", "۱۴"],
      roomLabel: "تا ۴ خواب",
      positions: ["شمالی"],
    },
  ];

  const details = resolvedAd ? mapAdToDetails(resolvedAd) : null;
  const projectVariants: ViewAdProjectDetailVariant[] =
    details?.projectDetails && details.projectDetails.length > 0
      ? details.projectDetails
      : fallbackVariants;

  const [expandedVariantId, setExpandedVariantId] = useState<string | null>(
    () => projectVariants[0]?.id ?? "variant-100",
  );

  if (adId == null) return <NotFoundState />;
  if (isLoading) return <LoadingState />;

  if (isError) {
    return (
      <ViewAdErrorState
        error={error}
        message={getApiErrorMessage(error, "دریافت اطلاعات پروژه با خطا مواجه شد.")}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!resolvedAd) return <NotFoundState />;

  // Dynamic feature extraction with faithful fallbacks matching the Figma frame
  const features = Array.isArray(resolvedAd.features) ? resolvedAd.features : [];
  const featureMap: Record<string, unknown> = {};
  for (const f of features) {
    if (f && typeof f === "object" && "label" in f && "value" in f) {
      featureMap[String(f.label)] = f.value;
    }
  }

  const projectType =
    toText(featureMap.project_type ?? featureMap.projectType ?? (resolvedAd as any).project_type) || "مسکونی";
  const documentType =
    toText(featureMap.document_type ?? featureMap.documentType ?? featureMap.document ?? (resolvedAd as any).document_type) || "ملکی";
  const totalFloors =
    toText(featureMap.project_total_floors ?? featureMap.projectTotalFloors ?? featureMap.total_floors ?? (resolvedAd as any).total_floors) || "۱۴";
  const totalUnits =
    toText(featureMap.project_total_units ?? featureMap.projectTotalUnits ?? featureMap.total_units ?? (resolvedAd as any).total_units) || "۲۵۶";

  const rawPrepayment =
    featureMap.sale_terms_percent ?? featureMap.sale_terms_down_payment ?? featureMap.prepayment_percent ?? (resolvedAd as any).sale_terms_percent;
  const prepaymentPercent = rawPrepayment ? `${toPersianDigits(rawPrepayment)}٪` : "۵۰٪";

  const rawInstallments =
    featureMap.sale_terms_installment_months ?? featureMap.installment_months ?? (resolvedAd as any).sale_terms_installment_months;
  const installmentMonths = rawInstallments ? `${toPersianDigits(rawInstallments)} ماه` : "۱۲ ماه";

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={adId ? `/ads/${adId}` : "/home"}
        className="bg-surface-container shrink-0"
        onBack={() => (adId ? goBackToAd(adId) : goBackFromAd("/home"))}
        title="اطلاعات پروژه"
      />

      <main className="min-h-0 flex-1 overflow-y-auto bg-surface-container pb-8">
        {/* Section 1: مشخصات اصلی */}
        <section className="bg-surface-container-lowest px-4 pt-4 pb-5">
          <Typography
            as="h2"
            variant="label"
            size="medium"
            weight="medium"
            className="text-right text-sm font-medium text-outline"
          >
            مشخصات اصلی
          </Typography>

          <div className="mt-2.5 mb-5 h-px w-full bg-outline-var/40" />

          <div className="grid grid-cols-2 gap-y-5 gap-x-4 [direction:rtl]">
            {/* Column 1 (Right): نوع پروژه */}
            <div className="flex flex-col">
              <div className="flex gap-2 [direction:rtl]">
                <LinearBuilding2 className="h-6 w-6 text-on-surface-var shrink-0" />
                <Typography
                  as="span"
                  variant="label"
                  size="large"
                  weight="semibold"
                  className="text-base font-semibold text-on-surface"
                >
                  {projectType}
                </Typography>
              </div>
              <Typography
                as="span"
                variant="label"
                size="small"
                weight="medium"
                className="mt-1 text-xs font-medium text-outline mr-8"
              >
                نوع پروژه
              </Typography>
            </div>

            {/* Column 2 (Left): سند */}
            <div className="flex flex-col">
              <div className="flex gap-2 [direction:rtl]">
                <LinearAgreement className="h-6 w-6 text-on-surface-var shrink-0" />
                <Typography
                  as="span"
                  variant="label"
                  size="large"
                  weight="semibold"
                  className="text-base font-semibold text-on-surface"
                >
                  {documentType}
                </Typography>
              </div>
              <Typography
                as="span"
                variant="label"
                size="small"
                weight="medium"
                className="mt-1 text-xs font-medium text-outline mr-8"
              >
                سند
              </Typography>
            </div>

            {/* Column 3 (Right): تعداد کل طبقات */}
            <div className="flex flex-col">
              <div className="flex gap-2 [direction:rtl]">
                <LinearFloor className="h-6 w-6 text-on-surface-var shrink-0" />
                <Typography
                  as="span"
                  variant="label"
                  size="large"
                  weight="semibold"
                  className="text-base font-semibold text-on-surface"
                >
                  {toPersianDigits(totalFloors)}
                </Typography>
              </div>
              <Typography
                as="span"
                variant="label"
                size="small"
                weight="medium"
                className="mt-1 text-xs font-medium text-outline mr-8"
              >
                تعداد کل طبقات
              </Typography>
            </div>

            {/* Column 4 (Left): تعداد کل واحدها */}
            <div className="flex flex-col">
              <div className="flex gap-2 [direction:rtl]">
                <LinearBed className="h-6 w-6 text-on-surface-var shrink-0" />
                <Typography
                  as="span"
                  variant="label"
                  size="large"
                  weight="semibold"
                  className="text-base font-semibold text-on-surface"
                >
                  {toPersianDigits(totalUnits)}
                </Typography>
              </div>
              <Typography
                as="span"
                variant="label"
                size="small"
                weight="medium"
                className="mt-1 text-xs font-medium text-outline mr-8"
              >
                تعداد کل واحدها
              </Typography>
            </div>
          </div>
        </section>

        {/* Separator between Section 1 & Section 2 */}
        <div className="h-2.5 w-full bg-surface-container" />

        {/* Section 2: شرایط فروش */}
        <section className="bg-surface-container-lowest px-4 pt-4 pb-5">
          <Typography
            as="h2"
            variant="label"
            size="medium"
            weight="medium"
            className="text-right text-sm font-medium text-outline"
          >
            شرایط فروش
          </Typography>

          <div className="mt-2.5 mb-5 h-px w-full bg-outline-var/40" />

          <div className="grid grid-cols-2 gap-y-5 gap-x-4 [direction:rtl]">
            {/* Column 1 (Right): پیش پرداخت */}
            <div className="flex flex-col">
              <div className="flex gap-2 [direction:rtl]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M11.6735 2.33789C11.9606 2.18442 12.3223 2.23286 12.5593 2.47168L14.0134 3.93945L16.2468 3.18945C16.5342 3.09278 16.8521 3.17878 17.0515 3.40723C17.2506 3.63565 17.2925 3.96181 17.1579 4.2334L15.6013 7.37305C19.1817 11.3018 20.8086 14.7232 20.7477 17.3057C20.7154 18.6722 20.207 19.8158 19.2595 20.6055C18.327 21.3824 17.0506 21.75 15.5944 21.75H8.40497C6.94874 21.75 5.67238 21.3824 4.73993 20.6055C3.79242 19.8158 3.28399 18.6722 3.25165 17.3057C3.19056 14.715 4.8278 11.2795 8.43231 7.33496L6.8952 4.2334C6.757 3.95448 6.80577 3.61901 7.01727 3.39062C7.22884 3.16224 7.55964 3.08758 7.84833 3.2041L9.66864 3.93945L11.5554 2.41601L11.6735 2.33789ZM9.62762 8.25C6.03871 12.1498 4.70321 15.251 4.75067 17.2695C4.77414 18.265 5.1298 18.9773 5.70087 19.4531C6.28743 19.9418 7.18544 20.25 8.40497 20.25H15.5944C16.8139 20.25 17.712 19.9418 18.2985 19.4531C18.8696 18.9773 19.2252 18.265 19.2487 17.2695C19.2962 15.251 17.9607 12.1498 14.3718 8.25H9.62762ZM11.2624 18.2998V18.1592C10.4062 17.9311 9.64169 17.3349 9.50165 16.417C9.43929 16.0077 9.72036 15.6251 10.1296 15.5625C10.539 15.5001 10.9216 15.7811 10.9841 16.1904C11.0105 16.3637 11.3182 16.7532 12.0251 16.7646C12.2058 16.7676 12.3981 16.742 12.5934 16.6797C12.8933 16.584 13.0144 16.3894 13.0505 16.1475C13.0951 15.8469 12.9863 15.5942 12.9284 15.5312C12.8435 15.4389 12.7815 15.4101 12.6198 15.3936C12.5134 15.3827 12.3958 15.382 12.2116 15.3789C12.0388 15.376 11.8263 15.3709 11.5895 15.3457C11.0212 15.2852 10.5318 15.0888 10.1716 14.749C9.80724 14.4053 9.62616 13.9616 9.60223 13.5137C9.55599 12.6459 10.091 11.7907 10.9333 11.3945C11.0425 11.3432 11.1528 11.3018 11.2624 11.2656V11.0996C11.2626 10.6857 11.5985 10.3498 12.0124 10.3496C12.4265 10.3496 12.7622 10.6856 12.7624 11.0996V11.2383C13.5764 11.493 14.1617 12.1731 14.3347 12.9092C14.4294 13.3124 14.1793 13.7168 13.7761 13.8115C13.3729 13.9061 12.9694 13.6551 12.8747 13.252C12.7996 12.9331 12.4683 12.6188 12.0349 12.6318C11.9056 12.6358 11.7507 12.6679 11.572 12.752C11.2361 12.9099 11.0881 13.224 11.0993 13.4336C11.1041 13.5241 11.1363 13.5962 11.2009 13.6572C11.2699 13.7223 11.4262 13.8202 11.7487 13.8545C11.9145 13.8721 12.0699 13.8761 12.237 13.8789C12.3925 13.8815 12.5876 13.8824 12.7731 13.9014C13.1955 13.9446 13.637 14.0859 14.0329 14.5166C14.4556 14.9767 14.6313 15.7127 14.5339 16.3682C14.4275 17.0825 13.9787 17.8119 13.0495 18.1084C12.9539 18.1389 12.858 18.1642 12.7624 18.1855V18.2998C12.7624 18.714 12.4266 19.0498 12.0124 19.0498C11.5983 19.0496 11.2624 18.7139 11.2624 18.2998ZM10.2682 5.38379C10.0565 5.55469 9.76863 5.59697 9.51629 5.49512L9.11395 5.33203L9.8161 6.75H14.238L15.0114 5.18652L14.0495 5.51074C13.7785 5.60183 13.4793 5.53113 13.278 5.32812L11.9704 4.00879L10.2682 5.38379Z" fill="#4D4D4D" />
                </svg>
                <Typography
                  as="span"
                  variant="label"
                  size="large"
                  weight="semibold"
                  className="text-base font-semibold text-on-surface"
                >
                  {prepaymentPercent}
                </Typography>
              </div>
              <Typography
                as="span"
                variant="label"
                size="small"
                weight="medium"
                className="mt-1 text-xs font-medium text-outline mr-8"
              >
                پیش پرداخت
              </Typography>
            </div>

            {/* Column 2 (Left): تعداد اقساط */}
            <div className="flex flex-col">
              <div className="flex gap-2 [direction:rtl]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20.25 9.59961H3.75V19.2002C3.75011 19.7442 4.22578 20.2499 4.89453 20.25H19.1055C19.7742 20.2499 20.2499 19.7442 20.25 19.2002V9.59961ZM9.25 17V12.75H9C8.58579 12.75 8.25 12.4142 8.25 12C8.25 11.5858 8.58579 11.25 9 11.25H10C10.4142 11.25 10.75 11.5858 10.75 12V17C10.75 17.4142 10.4142 17.75 10 17.75C9.58579 17.75 9.25 17.4142 9.25 17ZM14.5 11.25C14.7371 11.25 14.96 11.3625 15.1016 11.5527C15.243 11.7429 15.2869 11.9888 15.2188 12.2158L13.7188 17.2158C13.5997 17.6125 13.1809 17.8378 12.7842 17.7188C12.3875 17.5997 12.1622 17.1809 12.2812 16.7842L13.4912 12.75H12C11.5858 12.75 11.25 12.4142 11.25 12C11.25 11.5858 11.5858 11.25 12 11.25H14.5ZM16.9346 5.7002V5.09961H7.06543V5.7002C7.06532 6.11432 6.72958 6.4502 6.31543 6.4502C5.90145 6.45 5.56554 6.1142 5.56543 5.7002V5.09961H4.89453C4.2257 5.09971 3.75 5.60633 3.75 6.15039V8.09961H20.25V6.15039C20.25 5.60633 19.7743 5.09971 19.1055 5.09961H18.4346V5.7002C18.4345 6.1142 18.0986 6.45 17.6846 6.4502C17.2704 6.4502 16.9347 6.11432 16.9346 5.7002ZM21.75 19.2002C21.7499 20.6442 20.5293 21.7499 19.1055 21.75H4.89453C3.47076 21.7499 2.25011 20.6442 2.25 19.2002V6.15039C2.25 4.70635 3.47069 3.59972 4.89453 3.59961H5.56543V3C5.56543 2.58591 5.90138 2.25019 6.31543 2.25C6.72964 2.25 7.06543 2.58579 7.06543 3V3.59961H16.9346V3C16.9346 2.58579 17.2704 2.25 17.6846 2.25C18.0986 2.25019 18.4346 2.58591 18.4346 3V3.59961H19.1055C20.5294 3.59972 21.75 4.70636 21.75 6.15039V19.2002Z" fill="#4D4D4D" />
                </svg>
                <Typography
                  as="span"
                  variant="label"
                  size="large"
                  weight="semibold"
                  className="text-base font-semibold text-on-surface"
                >
                  {installmentMonths}
                </Typography>
              </div>
              <Typography
                as="span"
                variant="label"
                size="small"
                weight="medium"
                className="mt-1 text-xs font-medium text-outline mr-8"
              >
                تعداد اقساط
              </Typography>
            </div>
          </div>
        </section>

        {/* Section 3: واحدهای پروژه Accordion Cards */}
        {projectVariants.map((variant) => {
          const isExpanded = variant.id === expandedVariantId;
          const cleanTitle = variant.meterageTitle.replace(/^واحدهای\s+/, "");
          const positionsSummary =
            variant.positions.length > 0
              ? `${variant.positions.slice(0, 2).join("، ")} ...`
              : null;

          return (
            <div key={variant.id}>
              {/* Thick divider between cards */}
              <div className="h-2.5 w-full bg-surface-container" />

              {isExpanded ? (
                <section className="bg-surface-container-lowest px-4 pt-4 pb-5 [direction:rtl]">
                  {/* Expanded Header: chevron down and title start-aligned (on right) */}
                  <Button
                    unstyled
                    type="button"
                    onClick={() => setExpandedVariantId(null)}
                    className="flex w-full items-center justify-start gap-2 text-right transition active:opacity-70 [direction:rtl]"
                  >
                    <LinearArrowDown1 className="h-6 w-6 text-on-surface shrink-0" />
                    <Typography
                      as="h3"
                      variant="body"
                      size="large"
                      weight="medium"
                      className="text-on-surface"
                    >
                      {variant.meterageTitle}
                    </Typography>
                  </Button>

                  {/* Body Content */}
                  <div className="mt-5 space-y-4">
                    {/* Row 1: موجود در طبقات: */}
                    {variant.floors.length > 0 ? (
                      <div className="flex gap-3 [direction:rtl]">
                        <Typography
                          as="span"
                          variant="label"
                          size="medium"
                          weight="medium"
                          className="py-2 text-outline shrink-0"
                        >
                          موجود در طبقات:
                        </Typography>
                        <div className="flex flex-wrap items-center gap-2">
                          {variant.floors.map((floor, i) => (
                            <span
                              key={`${floor}-${i}`}
                              className="inline-flex h-9 min-w-9 items-center justify-center rounded-[8px] bg-surface-container-high px-2.5 text-sm font-medium text-on-surface"
                            >
                              {toPersianDigits(floor)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* Dotted divider */}
                    {variant.floors.length > 0 && (variant.roomLabel || variant.positions.length > 0) ? (
                      <div className="my-4 border-b border-dashed border-outline-var/50" />
                    ) : null}

                    {/* Row 2: تنوع اتاق: */}
                    {variant.roomLabel ? (
                      <div className="flex items-center gap-3 [direction:rtl]">
                        <Typography
                          as="span"
                          variant="label"
                          size="medium"
                          weight="medium"
                          className="text-sm font-medium text-outline shrink-0"
                        >
                          تنوع اتاق:
                        </Typography>
                        <span className="inline-flex h-9 items-center justify-center rounded-[8px] bg-surface-container-high px-3.5 text-sm font-medium text-on-surface">
                          {toPersianDigits(variant.roomLabel)}
                        </span>
                      </div>
                    ) : null}

                    {/* Dotted divider */}
                    {variant.roomLabel && variant.positions.length > 0 ? (
                      <div className="my-4 border-b border-dashed border-outline-var/50" />
                    ) : null}

                    {/* Row 3: تنوع موقعیت: */}
                    {variant.positions.length > 0 ? (
                      <div className="flex items-center gap-3 [direction:rtl]">
                        <Typography
                          as="span"
                          variant="label"
                          size="medium"
                          weight="medium"
                          className="text-sm font-medium text-outline shrink-0"
                        >
                          تنوع موقعیت:
                        </Typography>
                        <div className="flex flex-wrap items-center gap-2">
                          {variant.positions.map((pos, i) => (
                            <span
                              key={`${pos}-${i}`}
                              className="inline-flex h-9 items-center justify-center rounded-[8px] bg-surface-container-high px-3.5 text-sm font-medium text-on-surface"
                            >
                              {pos}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : (
                <section className="bg-surface-container-lowest px-4 py-4 [direction:rtl]">
                  {/* Collapsed Header: chevron left and details start-aligned (on right) */}
                  <Button
                    unstyled
                    type="button"
                    onClick={() => setExpandedVariantId(variant.id)}
                    className="flex w-full items-center justify-start gap-2.5 text-right transition active:opacity-70 [direction:rtl]"
                  >
                    <LinearArrowLeft1 className="h-6 w-6 text-on-surface-var shrink-0" />
                    <div className="flex items-center gap-2 text-sm font-medium text-on-surface">
                      <Typography as="span" variant="body" size="large" weight="medium">{cleanTitle}</Typography>
                      {variant.roomLabel ? (
                        <>
                          <span className="text-outline-var/60 text-xs font-normal">|</span>
                          <Typography as="span" variant="body" size="large" weight="medium">
                            {toPersianDigits(variant.roomLabel)}
                          </Typography>
                        </>
                      ) : null}
                      {positionsSummary ? (
                        <>
                          <span className="text-outline-var/60 text-xs font-normal">|</span>
                          <Typography as="span" variant="body" size="large" weight="medium">
                            {positionsSummary}
                          </Typography>
                        </>
                      ) : null}
                    </div>
                  </Button>
                </section>
              )}
            </div>
          );
        })}

        {/* Bottom divider bar */}
        <div className="h-2.5 w-full bg-surface-container" />
      </main>
    </PageFrame>
  );
}
