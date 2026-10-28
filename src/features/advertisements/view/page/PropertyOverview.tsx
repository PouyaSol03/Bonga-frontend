import { AccommodationRatingBanner, DetailSection, MoreLink, PropertyGrid } from ".././viewAdComponents";
import type { ViewAdDetails } from ".././viewAdTypes";
import { getCurrentViewAdBasePath, getPropertyPreviewTitle } from ".././viewAdDetails";
import { DailyRentalPriceList } from "./DailyRentalPriceList";
import { ProjectUnitDetailsSection } from "./ProjectUnitDetailsSection";
import { HotelDailyRoomsSection } from "./HotelDailyRoomsSection";

export function PropertyOverview({adId,details}:{adId:string;details:ViewAdDetails}) {
  const propertyInfoItems = details.propertyInfoPreview.filter(
    (item) => !(item.label.includes("رتبه") || item.icon === "star"),
  );
  const hasMorePropertyInfo = details.propertyInfoRows.length > propertyInfoItems.length;
return (<>
          <DetailSection icon="apartment" title={getPropertyPreviewTitle(details.formCode)}>
            {details.hotelStars ? (
              <AccommodationRatingBanner
                className="mt-6"
                count={details.hotelStars}
                label="رتبه اقامتگاه"
              />
            ) : null}
            <PropertyGrid items={propertyInfoItems} />
            {details.formCode.startsWith("daily-") && details.formCode !== "daily-hotel" ? (
              <DailyRentalPriceList details={details} />
            ) : null}
            {hasMorePropertyInfo && details.formCode !== "daily-hotel" ? (
              <MoreLink to={`${getCurrentViewAdBasePath(adId)}/property-info`}>
                اطلاعات بیشتر
              </MoreLink>
            ) : null}
          </DetailSection>

          {details.formCode === "daily-hotel" &&
          details.dailyHotelRooms &&
          details.dailyHotelRooms.length > 0 ? (
            <HotelDailyRoomsSection adId={adId} rooms={details.dailyHotelRooms} />
          ) : null}

          {details.formCode === "presale-special" &&
          details.projectDetails &&
          details.projectDetails.length > 0 ? (
            <ProjectUnitDetailsSection adId={adId} details={details.projectDetails} />
          ) : null}


</>); }
