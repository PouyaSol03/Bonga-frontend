import { DetailSection, MoreLink } from ".././viewAdComponents";
import type { ViewAdDailyHotelRoom } from ".././viewAdTypes";
import { getCurrentViewAdBasePath } from ".././viewAdDetails";
import { Typography } from "../../../../shared/ui/Typography";
import LinearBed from "../../../../shared/icons/LinearBed";
import LinearUserSolid from "../../../../shared/icons/LinearUserSolid";
import LinearUserAdd from "../../../../shared/icons/LinearUserAdd";
import LinearMeal from "../../../../shared/icons/LinearMeal";
import LinearTooman from "../../../../shared/icons/LinearTooman";

export function HotelDailyRoomsSection({ rooms, adId }: { rooms: ViewAdDailyHotelRoom[]; adId: string }) {
  if (!rooms || rooms.length === 0) return null;

  const previewRoom = rooms[0];

  return (
    <DetailSection icon="apartment" title="اطلاعات اتاق‌ها">
      <div className="mt-4">
        
        <div className="grid grid-cols-2 gap-x-4 [direction:rtl]">
          
          <div className="flex items-center gap-2">
            <LinearBed className="text-on-surface-var h-6 w-6 shrink-0" />
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface"
            >
              {previewRoom.label}
            </Typography>
          </div>

          
          <div className="flex items-center gap-2">
            <LinearUserSolid className="text-on-surface-var h-6 w-6 shrink-0" />
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface"
            >
              {previewRoom.guestCount} نفر
            </Typography>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-4 [direction:rtl]">
          
          <div className="flex items-center gap-2">
            <LinearUserAdd className="text-on-surface-var h-6 w-6 shrink-0" />
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface"
            >
              {previewRoom.extraGuestCount}
            </Typography>
          </div>

          
          <div className="flex items-center gap-2">
            <LinearMeal className="text-on-surface-var h-6 w-6 shrink-0" />
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface"
            >
              {previewRoom.mealPlan}
            </Typography>
          </div>
        </div>

        
        <div className="bg-outline-var my-4 h-px w-full" />

        
        <div className="space-y-3">
          
          <div className="grid grid-cols-2 items-center gap-x-4 [direction:rtl]">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-outline"
            >
              روزهای عادی:
            </Typography>
            <div className="flex items-center gap-1">
              <Typography
                as="span"
                variant="label"
                size="large"
                weight="semibold"
                className="text-on-surface"
              >
                {previewRoom.normalPrice}
              </Typography>
              <LinearTooman className="text-on-surface-var h-5 w-5 shrink-0" />
            </div>
          </div>

          <div className="border-outline-var border-b border-dashed" />

          
          <div className="grid grid-cols-2 items-center gap-x-4 [direction:rtl]">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-outline"
            >
              آخر هفته:
            </Typography>
            <div className="flex items-center gap-1">
              <Typography
                as="span"
                variant="label"
                size="large"
                weight="semibold"
                className="text-on-surface"
              >
                {previewRoom.weekendPrice}
              </Typography>
              <LinearTooman className="text-on-surface-var h-5 w-5 shrink-0" />
            </div>
          </div>

          <div className="border-outline-var border-b border-dashed" />

          
          <div className="grid grid-cols-2 items-center gap-x-4 [direction:rtl]">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-outline"
            >
              روزهای خاص:
            </Typography>
            <div className="flex items-center gap-1">
              <Typography
                as="span"
                variant="label"
                size="large"
                weight="semibold"
                className="text-on-surface"
              >
                {previewRoom.specialPrice}
              </Typography>
              <LinearTooman className="text-on-surface-var h-5 w-5 shrink-0" />
            </div>
          </div>
        </div>

        
        <MoreLink to={`${getCurrentViewAdBasePath(adId)}/hotel-rooms`}>
          اطلاعات سایر اتاق‌ها
        </MoreLink>
      </div>
    </DetailSection>
  );
}
