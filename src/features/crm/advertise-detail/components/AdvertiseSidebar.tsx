import LinearApartment from "../../../../shared/icons/LinearApartment";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import LinearCall from "../../../../shared/icons/LinearCall";
import LinearCategory from "../../../../shared/icons/LinearCategory";
import LinearDocument from "../../../../shared/icons/LinearDocument";
import LinearGps from "../../../../shared/icons/LinearGps";
import LinearHome2 from "../../../../shared/icons/LinearHome2";
import LinearHouseDimensions from "../../../../shared/icons/LinearHouseDimensions";
import LinearInformation from "../../../../shared/icons/LinearInformation";
import LinearLocation from "../../../../shared/icons/LinearLocation";
import LinearMapsLocation from "../../../../shared/icons/LinearMapsLocation";
import LinearMoney from "../../../../shared/icons/LinearMoney";
import LinearOwner from "../../../../shared/icons/LinearOwner";
import LinearUserAccount from "../../../../shared/icons/LinearUserAccount";
import { Typography } from "../../../../shared/ui/Typography";
import { AdLocationMap } from "../../../advertisements/components/AdLocationMap";
import { getCrmRecordId, type CrmRecord } from "../../api/crm.service";
import { DetailSection, InformationRow } from "./DetailPrimitives";
import { formatArea } from "../formatters";
import { getFormName } from "../helpers";

export function AdvertiseSidebar({
  address,
  advertise,
  area,
  categoryName,
  cityName,
  createdAt,
  formCode,
  hasMapPosition,
  latitude,
  longitude,
  neighborhoodName,
  ownerName,
  ownerPhone,
  pricePresentation,
  trackCode,
}: {
  address: string;
  advertise: CrmRecord;
  area: unknown;
  categoryName: string;
  cityName: string;
  createdAt: string;
  formCode: string;
  hasMapPosition: boolean;
  latitude: number | null;
  longitude: number | null;
  neighborhoodName: string;
  ownerName: string;
  ownerPhone: string;
  pricePresentation: {
    primaryLabel: string;
    primaryValue: string;
  };
  trackCode: string;
}) {
  return (
    <aside className="sticky top-0 space-y-4">
      <DetailSection icon={<LinearInformation className="h-5 w-5" />} title="اطلاعات اصلی">
        <InformationRow
          icon={<LinearHome2 className="h-5 w-5" />}
          label="دسته‌بندی"
          value={categoryName}
        />
        <InformationRow
          icon={<LinearCategory className="h-5 w-5" />}
          label="فرم آگهی"
          value={getFormName(formCode)}
        />
        <InformationRow
          icon={<LinearMapsLocation className="h-5 w-5" />}
          label="محله"
          value={neighborhoodName}
        />
        <InformationRow
          icon={<LinearLocation className="h-5 w-5" />}
          label="شهر"
          value={cityName}
        />
        <InformationRow
          icon={<LinearMoney className="h-5 w-5" />}
          label={pricePresentation.primaryLabel}
          value={pricePresentation.primaryValue}
        />
        <InformationRow
          icon={<LinearHouseDimensions className="h-5 w-5" />}
          label="متراژ"
          value={formatArea(area)}
        />
      </DetailSection>

      <DetailSection icon={<LinearOwner className="h-5 w-5" />} title="اطلاعات آگهی‌دهنده">
        <InformationRow
          icon={<LinearUserAccount className="h-5 w-5" />}
          label="نام"
          value={ownerName}
        />
        <InformationRow
          icon={<LinearCall className="h-5 w-5" />}
          label="شماره تماس"
          value={ownerPhone}
        />
        <InformationRow
          icon={<LinearDocument className="h-5 w-5" />}
          label="کد پیگیری"
          value={trackCode}
        />
        <InformationRow
          icon={<LinearCalendar className="h-5 w-5" />}
          label="زمان ثبت"
          value={createdAt}
        />
      </DetailSection>

      <DetailSection icon={<LinearGps className="h-5 w-5" />} title="موقعیت جغرافیایی">
        <InformationRow
          icon={<LinearMapsLocation className="h-5 w-5" />}
          label="آدرس دقیق"
          value={address}
        />
        {hasMapPosition && latitude !== null && longitude !== null ? (
          <AdLocationMap
            className="mt-4"
            latitude={latitude}
            longitude={longitude}
            title="موقعیت آگهی در مدیریت"
          />
        ) : (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="m-0 mt-4 rounded-xl bg-[#f7f7f7] p-4 text-center text-sm text-[#808080]"
          >
            موقعیت این آگهی روی نقشه ثبت نشده است.
          </Typography>
        )}
      </DetailSection>

      <div className="rounded-xl bg-white p-5 text-sm text-[#666666]">
        <div className="flex items-center gap-2 text-[#0048c4]">
          <LinearApartment className="h-5 w-5" />
          <strong className="text-sm">شناسه آگهی</strong>
        </div>
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="mt-2 block font-mono text-sm break-all text-[#333333]"
          dir="ltr"
        >
          {getCrmRecordId(advertise)}
        </Typography>
      </div>
    </aside>
  );
}
