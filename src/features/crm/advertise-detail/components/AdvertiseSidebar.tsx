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
import { getFormName, readText } from "../helpers";
import type { ResolvedCrmAgency } from "../useCrmAdvertiseDetail";

export function AdvertiseSidebar({
  address,
  advertise,
  agency,
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
  agency?: ResolvedCrmAgency | null;
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
  const ownerExactAddress = readText(advertise, [
    "owner_address",
    "owner_exact_address",
    "owner_contact_address",
  ]);

  return (
    <aside className="sticky top-0 space-y-4">
      {/* Agency Section */}
      {agency ? (
        <DetailSection
          icon={<LinearApartment className="h-5 w-5" />}
          title="آژانس املاک ثبت‌کننده"
        >
          <div className="rounded-xl border border-[#0048c4]/20 bg-[#eef4ff]/50 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0048c4] text-white shadow-sm">
                <LinearApartment className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <strong className="block truncate text-base font-bold text-[#1a1a1a]">
                    {agency.name}
                  </strong>
                </div>
                {agency.id ? (
                  <span className="mt-0.5 block font-mono text-xs text-[#808080]">
                    شناسه آژانس: #{agency.id}
                  </span>
                ) : (
                  <span className="mt-0.5 inline-block rounded-full bg-[#0048c4]/10 px-2 py-0.5 text-[11px] font-medium text-[#0048c4]">
                    ثبت‌شده توسط آژانس
                  </span>
                )}
              </div>
            </div>

            {agency.managerName ? (
              <div className="mt-3.5 flex items-center justify-between border-t border-[#0048c4]/10 pt-2.5 text-xs">
                <span className="text-[#808080]">مدیر / مسئول:</span>
                <strong className="font-semibold text-[#1a1a1a]">{agency.managerName}</strong>
              </div>
            ) : null}

            {agency.phone ? (
              <div className="mt-2 flex items-center justify-between border-t border-[#0048c4]/10 pt-2.5 text-xs">
                <span className="text-[#808080]">تلفن تماس:</span>
                <a
                  href={`tel:${agency.phone}`}
                  className="font-mono font-semibold text-[#0048c4] hover:underline"
                  dir="ltr"
                >
                  {agency.phone}
                </a>
              </div>
            ) : null}

            {agency.address ? (
              <div className="mt-2 border-t border-[#0048c4]/10 pt-2.5 text-xs">
                <span className="mb-0.5 block text-[#808080]">آدرس آژانس:</span>
                <span className="leading-5 text-[#333333]">{agency.address}</span>
              </div>
            ) : null}
          </div>
        </DetailSection>
      ) : (
        <DetailSection
          icon={<LinearUserAccount className="h-5 w-5" />}
          title="نوع ثبت آگهی"
        >
          <div className="flex items-center gap-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef2f7] text-[#666666]">
              <LinearUserAccount className="h-5 w-5" />
            </div>
            <div>
              <strong className="block text-sm font-bold text-[#1a1a1a]">
                ثبت شخصی (کاربر عادی)
              </strong>
              <span className="text-xs text-[#808080]">
                این آگهی به صورت مستقیم توسط کاربر ثبت شده است.
              </span>
            </div>
          </div>
        </DetailSection>
      )}

      {/* Main Specs Section */}
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

      {/* Owner / Client Info */}
      <DetailSection icon={<LinearOwner className="h-5 w-5" />} title="اطلاعات مالک / مخاطب">
        <InformationRow
          icon={<LinearUserAccount className="h-5 w-5" />}
          label="نام مالک"
          value={ownerName}
        />
        <InformationRow
          icon={<LinearCall className="h-5 w-5" />}
          label="شماره تماس"
          value={ownerPhone}
        />
        {ownerExactAddress ? (
          <InformationRow
            icon={<LinearMapsLocation className="h-5 w-5" />}
            label="آدرس دقیق ملک"
            value={ownerExactAddress}
          />
        ) : null}
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

      {/* Map Location */}
      <DetailSection icon={<LinearGps className="h-5 w-5" />} title="موقعیت جغرافیایی">
        <InformationRow
          icon={<LinearMapsLocation className="h-5 w-5" />}
          label="آدرس آگهی"
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

      {/* System IDs */}
      <div className="rounded-xl border border-[#f0f0f0] bg-white p-5 text-sm text-[#666666] shadow-sm">
        <div className="flex items-center gap-2 text-[#0048c4]">
          <LinearApartment className="h-5 w-5" />
          <strong className="text-sm font-bold">شناسه سیستمی آگهی</strong>
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
