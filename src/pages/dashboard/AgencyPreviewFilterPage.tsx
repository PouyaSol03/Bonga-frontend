import { AdvertisementFilterPage } from "../search/SearchMapFilterPage";

const agencyPreviewPath = "/account/dashboard/agency/preview";

export function AgencyPreviewFilterPage() {
  return (
    <AdvertisementFilterPage
      applyBasePath={agencyPreviewPath}
      applyButtonLabel="نمایش آگهی‌ها"
      backBasePath={agencyPreviewPath}
      title="فیلتر آگهی‌ها"
    />
  );
}
