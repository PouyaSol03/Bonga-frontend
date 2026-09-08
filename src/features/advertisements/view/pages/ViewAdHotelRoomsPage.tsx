import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getApiErrorMessage } from "../../../../shared/api/api";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { TopBar } from "../../../../shared/components/TopBar";
import { Typography } from "../../../../shared/ui/Typography";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearUserSolid from "../../../../shared/icons/LinearUserSolid";
import LinearUserAdd from "../../../../shared/icons/LinearUserAdd";
import LinearMeal from "../../../../shared/icons/LinearMeal";
import LinearTooman from "../../../../shared/icons/LinearTooman";
import {
  useAgencyAdvertisementPreviewQuery,
  useAdvertisementDetailQuery,
  useAdvertisementPreviewQuery,
} from "../../api/advertisement.hooks";
import {
  goBackToAd,
  mapAdToDetails,
  parseViewAdIdFromPath,
} from "../viewAdDetails";
import { LoadingState, NotFoundState, ViewAdErrorState } from "../ViewAdRouteStates";
import { shouldUseAgencyAllocationPreview } from "../viewAdPreviewContext";

export function ViewAdHotelRoomsPage() {
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

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (adId == null) return <NotFoundState />;

  if (isLoading) return <LoadingState />;

  if (isError) {
    return (
      <ViewAdErrorState
        error={error}
        message={getApiErrorMessage(error, "دریافت اطلاعات هتل با خطا مواجه شد.")}
        onRetry={() => void refetch()}
      />
    );
  }

  const resolvedAd = ad;
  if (!resolvedAd) return <NotFoundState />;

  const details = mapAdToDetails(resolvedAd);
  const rooms = details.dailyHotelRooms ?? [];

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#F0F0F0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar onBack={() => goBackToAd(adId)} title="اطلاعات هتل" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#F0F0F0] divide-y-8 divide-[#F0F0F0]">
        {rooms.length > 0 ? (
          rooms.map((room, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div key={room.id || idx} className="bg-white">
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="flex w-full items-center justify-between px-4 py-4 text-right transition-colors"
                >
                  <Typography
                    as="span"
                    variant="label"
                    size="large"
                    weight="semibold"
                    className="text-[#1A1A1A]"
                  >
                    {room.label}
                  </Typography>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="inline-flex items-center justify-center shrink-0"
                  >
                    <LinearArrowDown1 className="h-5 w-5 text-[#4D4D4D] shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="mb-4 h-px w-full bg-[#E5E5E5]" />

                    {/* Metadata items */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <LinearUserSolid className="h-5 w-5 text-[#4D4D4D] shrink-0" />
                        <Typography
                          as="span"
                          variant="label"
                          size="medium"
                          weight="medium"
                          className="text-[#808080]"
                        >
                          ظرفیت:
                        </Typography>
                        <Typography
                          as="span"
                          variant="label"
                          size="medium"
                          weight="semibold"
                          className="text-[#1A1A1A]"
                        >
                          {room.guestCount} نفر
                        </Typography>
                      </div>

                      <div className="flex items-center gap-2">
                        <LinearUserAdd className="h-5 w-5 text-[#4D4D4D] shrink-0" />
                        <Typography
                          as="span"
                          variant="label"
                          size="medium"
                          weight="medium"
                          className="text-[#808080]"
                        >
                          ظرفیت اضافه:
                        </Typography>
                        <Typography
                          as="span"
                          variant="label"
                          size="medium"
                          weight="semibold"
                          className="text-[#1A1A1A]"
                        >
                          {room.extraGuestCount}
                        </Typography>
                      </div>

                      <div className="flex items-center gap-2">
                        <LinearMeal className="h-5 w-5 text-[#4D4D4D] shrink-0" />
                        <Typography
                          as="span"
                          variant="label"
                          size="medium"
                          weight="medium"
                          className="text-[#808080]"
                        >
                          وعده غذایی:
                        </Typography>
                        <Typography
                          as="span"
                          variant="label"
                          size="medium"
                          weight="semibold"
                          className="text-[#1A1A1A]"
                        >
                          {room.mealPlan}
                        </Typography>
                      </div>
                    </div>

                    <div className="my-3 border-b border-dashed border-[#E5E5E5]" />

                    {/* Price items */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Typography
                          as="span"
                          variant="label"
                          size="medium"
                          weight="medium"
                          className="text-[#808080]"
                        >
                          روزهای عادی:
                        </Typography>
                        <div className="flex items-center gap-1">
                          <Typography
                            as="span"
                            variant="label"
                            size="large"
                            weight="semibold"
                            className="text-[#1A1A1A]"
                          >
                            {room.normalPrice}
                          </Typography>
                          <LinearTooman className="h-4 w-4 text-[#1A1A1A] shrink-0" />
                        </div>
                      </div>

                      <div className="border-b border-dashed border-[#E5E5E5]" />

                      <div className="flex items-center justify-between">
                        <Typography
                          as="span"
                          variant="label"
                          size="medium"
                          weight="medium"
                          className="text-[#808080]"
                        >
                          آخر هفته:
                        </Typography>
                        <div className="flex items-center gap-1">
                          <Typography
                            as="span"
                            variant="label"
                            size="large"
                            weight="semibold"
                            className="text-[#1A1A1A]"
                          >
                            {room.weekendPrice}
                          </Typography>
                          <LinearTooman className="h-4 w-4 text-[#1A1A1A] shrink-0" />
                        </div>
                      </div>

                      <div className="border-b border-dashed border-[#E5E5E5]" />

                      <div className="flex items-center justify-between">
                        <Typography
                          as="span"
                          variant="label"
                          size="medium"
                          weight="medium"
                          className="text-[#808080]"
                        >
                          روزهای خاص:
                        </Typography>
                        <div className="flex items-center gap-1">
                          <Typography
                            as="span"
                            variant="label"
                            size="large"
                            weight="semibold"
                            className="text-[#1A1A1A]"
                          >
                            {room.specialPrice}
                          </Typography>
                          <LinearTooman className="h-4 w-4 text-[#1A1A1A] shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })
        ) : (
          <div className="mx-auto w-full bg-white px-4 py-10 text-center text-sm font-medium leading-5 text-[#808080]">
            اطلاعاتی برای نمایش وجود ندارد.
          </div>
        )}
      </main>
    </PageFrame>
  );
}
