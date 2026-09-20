import { useState } from "react";
import { getApiErrorMessage } from "../../../../shared/api/api";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import {
  useAgencyAdvertisementPreviewQuery,
  useAdvertisementDetailQuery,
  useAdvertisementPreviewQuery,
} from "../../api/advertisement.hooks";
import {
  DetailSection,
  PropertyGrid,
  ViewAdTopBar,
} from "../viewAdComponents";
import {
  goBackFromAd,
  mapAdToDetails,
  parseViewAdIdFromPath,
} from "../viewAdDetails";
import type { DetailItem, ViewAdProjectDetailVariant } from "../viewAdTypes";
import { LoadingState, NotFoundState, ViewAdErrorState } from "../ViewAdRouteStates";
import { shouldUseAgencyAllocationPreview } from "../viewAdPreviewContext";
import { Typography } from "../../../../shared/ui/Typography";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearCoinBag from "../../../../shared/icons/LinearCoinBag";
import LinearCalendarDay from "../../../../shared/icons/LinearCalendarDay";
import { Button } from "../../../../shared/ui/Button";

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

  const [expandedVariantId, setExpandedVariantId] = useState<string | null>(null);

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

  const resolvedAd = ad;
  if (!resolvedAd) return <NotFoundState />;

  const details = mapAdToDetails(resolvedAd);
  const projectVariants: ViewAdProjectDetailVariant[] = details.projectDetails && details.projectDetails.length > 0
    ? details.projectDetails
    : [
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

  const activeId = expandedVariantId ?? projectVariants[0]?.id ?? "";

  const mainOverviewItems: DetailItem[] = [
    { icon: "construction", label: "نوع پروژه", value: "مسکونی" },
    { icon: "agreement", label: "سند", value: "ملکی" },
    { icon: "floor", label: "تعداد کل طبقات", value: "۱۴" },
    { icon: "bed", label: "تعداد کل واحد ها", value: "۲۵۶" },
  ];

  return (
    <PageFrame
      className="flex min-h-0 flex-col bg-surface-container text-on-surface [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar
        actionIcons={[]}
        backTo="/home"
        onBack={() => goBackFromAd("/home")}
        title="اطلاعات پروژه"
      />

      <main className="min-h-0 flex-1 overflow-y-auto bg-surface-container pb-6">
        {/* Section 1: مشخصات اصلی */}
        <DetailSection icon="apartment" title="اطلاعات پروژه">
          <PropertyGrid items={mainOverviewItems} />
        </DetailSection>

        {/* Section 2: شرایط فروش (Matching media_1789887753314.png) */}
        <DetailSection icon="tooman" title="شرایط فروش">
          <div className="mt-2">
            <div className="h-px w-full bg-outline-var mb-5" />
            <div className="grid grid-cols-2 gap-6 [direction:rtl]">
              {/* Right Col: پیش پرداخت */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center gap-1.5 [direction:rtl]">
                  <Typography
                    as="span"
                    variant="label"
                    size="large"
                    weight="semibold"
                    className="text-on-surface text-base font-semibold"
                  >
                    ۵۰٪
                  </Typography>
                  <LinearCoinBag className="h-5 w-5 text-on-surface-var shrink-0" />
                </div>
                <Typography
                  as="span"
                  variant="label"
                  size="small"
                  weight="medium"
                  className="mt-1 text-on-surface-var text-xs font-medium"
                >
                  پیشپرداخت
                </Typography>
              </div>

              {/* Left Col: تعداد اقساط */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center gap-1.5 [direction:rtl]">
                  <Typography
                    as="span"
                    variant="label"
                    size="large"
                    weight="semibold"
                    className="text-on-surface text-base font-semibold"
                  >
                    ۱۲ ماه
                  </Typography>
                  <LinearCalendarDay className="h-5 w-5 text-on-surface-var shrink-0" />
                </div>
                <Typography
                  as="span"
                  variant="label"
                  size="small"
                  weight="medium"
                  className="mt-1 text-on-surface-var text-xs font-medium"
                >
                  تعداد اقساط
                </Typography>
              </div>
            </div>
          </div>
        </DetailSection>

        {/* Section 3: جزئیات پروژه Accordion (Matching media_1789888135103.png and media_1789888190452.png) */}
        <section className="border-t-8 border-surface-container bg-surface-container-lowest px-4 py-4">
          <div className="space-y-3">
            {projectVariants.map((variant) => {
              const isExpanded = variant.id === activeId;
              const roomsText = variant.roomLabel || "";
              const posText = variant.positions.join("، ");
              const summaryLine = `${variant.meterageTitle} | ${roomsText}${posText ? ` | ${posText}` : ""} ...`;

              if (!isExpanded) {
                return (
                  <Button
                    unstyled
                    key={variant.id}
                    className="flex w-full items-center justify-between py-3.5 px-3 text-right transition active:bg-surface-container-low [direction:rtl]"
                    onClick={() => setExpandedVariantId(variant.id)}
                    type="button"
                  >
                    <Typography
                      as="span"
                      variant="title"
                      size="small"
                      weight="medium"
                      className="text-on-surface text-sm font-medium"
                    >
                      {summaryLine}
                    </Typography>
                    <LinearArrowLeft1 className="h-4 w-4 text-on-surface-var shrink-0" />
                  </Button>
                );
              }

              return (
                <div
                  key={variant.id}
                  className="rounded-2xl border border-outline-var bg-surface-container-lowest p-4 [direction:rtl]"
                >
                  <Button
                    unstyled
                    className="flex w-full items-center justify-between mb-4 text-right [direction:rtl]"
                    onClick={() => setExpandedVariantId(null)}
                    type="button"
                  >
                    <Typography
                      as="h3"
                      variant="title"
                      size="medium"
                      weight="semibold"
                      className="text-on-surface text-base font-semibold"
                    >
                      {variant.meterageTitle}
                    </Typography>
                    <LinearArrowDown1 className="h-4 w-4 text-on-surface-var shrink-0" />
                  </Button>

                  {variant.floors.length > 0 ? (
                    <div className="flex items-start gap-3 [direction:rtl]">
                      <Typography
                        as="span"
                        variant="label"
                        size="medium"
                        weight="medium"
                        className="text-on-surface-var shrink-0 text-sm font-medium pt-1"
                      >
                        موجود در طبقات:
                      </Typography>
                      <div className="flex flex-wrap items-center gap-2">
                        {variant.floors.map((floor, i) => (
                          <span
                            key={`${floor}-${i}`}
                            className="inline-flex h-8 min-w-8 items-center justify-center rounded-[8px] bg-surface-container-high px-2.5 text-sm font-medium text-on-surface"
                          >
                            {floor}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {variant.floors.length > 0 && (variant.roomLabel || variant.positions.length > 0) ? (
                    <div className="my-3.5 border-b border-dashed border-outline-var" />
                  ) : null}

                  {variant.roomLabel ? (
                    <div className="flex items-center gap-3 [direction:rtl]">
                      <Typography
                        as="span"
                        variant="label"
                        size="medium"
                        weight="medium"
                        className="text-on-surface-var shrink-0 text-sm font-medium"
                      >
                        تنوع اتاق:
                      </Typography>
                      <span className="inline-flex h-8 items-center justify-center rounded-[8px] bg-surface-container-high px-3 text-sm font-medium text-on-surface">
                        {variant.roomLabel}
                      </span>
                    </div>
                  ) : null}

                  {variant.roomLabel && variant.positions.length > 0 ? (
                    <div className="my-3.5 border-b border-dashed border-outline-var" />
                  ) : null}

                  {variant.positions.length > 0 ? (
                    <div className="flex items-center gap-3 [direction:rtl]">
                      <Typography
                        as="span"
                        variant="label"
                        size="medium"
                        weight="medium"
                        className="text-on-surface-var shrink-0 text-sm font-medium"
                      >
                        تنوع موقعیت:
                      </Typography>
                      <div className="flex flex-wrap items-center gap-2">
                        {variant.positions.map((pos, i) => (
                          <span
                            key={`${pos}-${i}`}
                            className="inline-flex h-8 items-center justify-center rounded-[8px] bg-surface-container-high px-3 text-sm font-medium text-on-surface"
                          >
                            {pos}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
