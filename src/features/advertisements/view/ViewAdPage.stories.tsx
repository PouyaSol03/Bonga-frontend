import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { ViewAdContent } from "./ViewAdPage";
import {
  buildGalleryMediaItems,
  buildPropertyDetailSections,
  DetailInfoSectionBlock,
  getMapPosition,
  hasTour3d,
  mapAdToDetails,
  readVideoUrl,
} from "./viewAdDetails";
import { HotelRoomsListView } from "./pages/ViewAdHotelRoomsPage";
import type { AdvertisementItem } from "../api/advertisement.service";
import mockApartmentSale from "./mock-ads/sale-apartment.json";
import mockVillaSale from "./mock-ads/sale-villa-house.json";
import mockLandSale from "./mock-ads/sale-land.json";
import mockOfficeSale from "./mock-ads/sale-office.json";
import mockCommercialSale from "./mock-ads/sale-commercial.json";
import mockWarehouseSale from "./mock-ads/sale-warehouse.json";
import mockApartmentRent from "./mock-ads/rent-apartment.json";
import mockVillaRent from "./mock-ads/rent-villa-house.json";
import mockCommercialRent from "./mock-ads/rent-commercial.json";
import mockOfficeRent from "./mock-ads/rent-office.json";
import mockDailyApartment from "./mock-ads/daily-apartment-suite.json";
import mockDailyGardenVilla from "./mock-ads/daily-garden-villa.json";
import mockDailyHotel from "./mock-ads/daily-hotel.json";
import mockPartnership from "./mock-ads/partnership.json";
import mockPresaleSpecial from "./mock-ads/presale-special.json";

const mockAdsByFormCode: Record<string, AdvertisementItem> = {
  "sale-apartment": mockApartmentSale as unknown as AdvertisementItem,
  "sale-villa-house": mockVillaSale as unknown as AdvertisementItem,
  "sale-land": mockLandSale as unknown as AdvertisementItem,
  "sale-office": mockOfficeSale as unknown as AdvertisementItem,
  "sale-commercial": mockCommercialSale as unknown as AdvertisementItem,
  "sale-warehouse": mockWarehouseSale as unknown as AdvertisementItem,
  "rent-apartment": mockApartmentRent as unknown as AdvertisementItem,
  "rent-villa-house": mockVillaRent as unknown as AdvertisementItem,
  "rent-commercial": mockCommercialRent as unknown as AdvertisementItem,
  "rent-office": mockOfficeRent as unknown as AdvertisementItem,
  "daily-apartment-suite": mockDailyApartment as unknown as AdvertisementItem,
  "daily-garden-villa": mockDailyGardenVilla as unknown as AdvertisementItem,
  "daily-hotel": mockDailyHotel as unknown as AdvertisementItem,
  partnership: mockPartnership as unknown as AdvertisementItem,
  "presale-special": mockPresaleSpecial as unknown as AdvertisementItem,
};

function SingleAdViewer({ initialAd }: { initialAd: AdvertisementItem }) {
  const [rawJson, setRawJson] = useState(() => JSON.stringify(initialAd, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"both" | "card" | "more">("both");

  const parsedAd: AdvertisementItem = useMemo(() => {
    try {
      const parsed = JSON.parse(rawJson);
      setParseError(null);
      return parsed;
    } catch (err: any) {
      setParseError(err.message || "خطا در ساختار JSON");
      return initialAd;
    }
  }, [rawJson, initialAd]);

  const details = useMemo(() => mapAdToDetails(parsedAd), [parsedAd]);
  const mediaItems = useMemo(() => buildGalleryMediaItems(parsedAd), [parsedAd]);
  const mapPosition = useMemo(() => getMapPosition(parsedAd), [parsedAd]);
  const tourUrl = useMemo(() => parsedAd.virtual_tour_link ?? null, [parsedAd]);
  const tourActive = useMemo(() => hasTour3d(parsedAd), [parsedAd]);
  const propertySections = useMemo(() => buildPropertyDetailSections(parsedAd), [parsedAd]);

  return (
    <div className="w-full min-h-screen bg-surface-container-low flex flex-col items-center py-6 px-4">
      {/* ردیف کنترل: سوئیچ تب‌ها + انتخاب فرم‌کد + ادیتور JSON */}
      <div className="w-full max-w-[1100px] mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-on-surface">
            فرم: <code className="bg-surface-container px-2 py-0.5 rounded text-primary">{parsedAd.form_code}</code>
          </span>
          <div className="flex items-center bg-surface-container-highest p-0.5 rounded-xl border border-outline-var/40 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("both")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${viewMode === "both" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface hover:text-primary"}`}
            >
              هر دو ستون
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${viewMode === "card" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface hover:text-primary"}`}
            >
              فقط کارت آگهی
            </button>
            <button
              type="button"
              onClick={() => setViewMode("more")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${viewMode === "more" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface hover:text-primary"}`}
            >
              فقط اطلاعات بیشتر
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditorOpen((prev) => !prev)}
          className="px-3 py-1.5 text-xs font-medium rounded-xl bg-primary text-on-primary hover:opacity-90 shadow-sm transition-all"
        >
          {isEditorOpen ? "بستن ویرایشگر JSON ▲" : "ویرایش دستی JSON ▼"}
        </button>
      </div>

      {/* ویرایشگر تاشو JSON */}
      {isEditorOpen && (
        <div className="w-full max-w-[1100px] mb-4 flex flex-col gap-2 bg-surface-container p-3 rounded-2xl border border-outline-var shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-on-surface">ویرایشگر داده خام JSON</span>
            {parseError ? (
              <span className="text-xs text-error font-medium">{parseError}</span>
            ) : (
              <span className="text-xs text-tertiary">JSON معتبر است</span>
            )}
          </div>
          <textarea
            dir="ltr"
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            rows={14}
            className="w-full font-mono text-[11px] leading-relaxed p-2.5 bg-surface text-on-surface rounded-xl border border-outline-var focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
          />
          <div className="flex justify-between items-center pt-1">
            <button
              type="button"
              onClick={() => setRawJson(JSON.stringify(initialAd, null, 2))}
              className="px-2.5 py-1 text-xs rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
            >
              بازنشانی به پیش‌فرض
            </button>
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="px-2.5 py-1 text-xs rounded-lg bg-surface-container-highest text-on-surface"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {/* محتوا بر اساس مود انتخابی کاربر */}
      <div className={`w-full max-w-[1100px] flex ${viewMode === "both" ? "flex-col lg:flex-row-reverse items-start justify-center" : "justify-center"} gap-6`}>
        {/* ستون اطلاعات بیشتر */}
        {(viewMode === "both" || viewMode === "more") && (
          <div className={`w-full ${viewMode === "both" ? "lg:w-[500px]" : "max-w-[500px]"} border border-outline-var/40 rounded-3xl overflow-hidden shadow-md bg-surface p-4 flex flex-col gap-4 shrink-0`}>
            <div className="border-b border-outline-var/30 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface m-0">اطلاعات بیشتر ملک</h3>
              <span className="text-xs text-outline font-medium">مشخصات تکمیلی</span>
            </div>

            <div className="flex flex-col gap-4">
              {parsedAd.form_code === "daily-hotel" && details.dailyHotelRooms && details.dailyHotelRooms.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-outline px-1">واحدهای اقامتی هتل (آکاردئون)</span>
                  <HotelRoomsListView rooms={details.dailyHotelRooms} />
                </div>
              )}

              {propertySections.length > 0 ? (
                propertySections.map((section, index) => (
                  <DetailInfoSectionBlock
                    key={section.title}
                    section={section}
                    separated={index > 0}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-xs text-outline">
                  اطلاعات تکمیلی برای این فرم‌کد تعریف نشده یا وجود ندارد.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ستون کارت اصلی آگهی */}
        {(viewMode === "both" || viewMode === "card") && (
          <div className="w-full max-w-[500px] border border-outline-var/40 rounded-3xl overflow-hidden shadow-md bg-surface shrink-0">
            <ViewAdContent
              adId={String(parsedAd.id ?? "demo")}
              ad={parsedAd}
              details={details}
              hasTour3d={tourActive}
              hideRestrictedActions={false}
              isPreview={false}
              mediaItems={mediaItems}
              mapPosition={mapPosition}
              onOpenAlbum={() => {}}
              onRowAction={(label) => alert(`کلیک شد: ${label}`)}
              tour3dUrl={tourUrl}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const meta: Meta<typeof SingleAdViewer> = {
  title: "Features/Advertisements/SingleAdPage",
  component: SingleAdViewer,
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "responsive",
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SingleAdViewer>;

export const SaleApartment: Story = {
  name: "فروش آپارتمان (sale-apartment)",
  args: { initialAd: {
    "id": 1001,
    "track_code": "100101",
    "title": "آپارتمان ۱۴۰ متری نوساز سه خوابه سجاد",
    "description": "واحد جنوبی بسیار خوش نقشه با نورگیر عالی، دسترسی فوق‌العاده به مراکز خرید و خیابان اصلی. متریال برند با نمای مدرن.",
    "form_code": "sale-apartment",
    "price": 8500000000,
    "price_label": "قیمت کل",
    "published_time_ago": "لحظاتی پیش",
    "published_date": "1403/07/20",
    "is_special": true,
    "is_bookmarked": false,
    "is_mine": false,

    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80"
    ],

    "video": null,
    "virtual_tour_link": null,

    "location": {
      "lat": 36.3155,
      "lng": 59.5492,

      "city": {
        "id": 1,
        "name": "مشهد"
      },

      "district": {
        "id": 2,
        "name": "منطقه ۱"
      },

      "neighborhood": {
        "id": 10,
        "name": "سجاد"
      },

      "sub_neighborhood": null,
      "address": "خیابان بهار"
    },

    "contacts": {
      "phone": "09120000000",
      "agency_phone": "05137600000",
      "chat_enabled": true
    },

    "social": {
      "instagram": "bonga_agency",
      "telegram": "bonga_support",
      "whatsapp": "989120000000"
    },

    "property_info": {
      "area": 140,
      "rooms": "۳",
      "floor": "۳",
      "age": "نوساز",
      "unit_type": "جنوبی",
      "unit_position": "جلو",
      "total_floors": 6,
      "units_per_floor": 2,
      "document_type": "تک برگ",
      "occupancy_status": "تخلیه"
    },

    "finishing": {
      "kitchen_type": "جزیره",
      "floor_material": "سرامیک",
      "cabinet_material": "های‌گلاس",
      "facade_material": "سنگ"
    },

    "financial": {
      "loan": {
        "amount": 800000000,
        "installment": 15000000
      },

      "exchange": {
        "items": ["خودرو", "آپارتمان کوچک‌تر"],
        "description": "معاوضه با خودروی خارجی یا واحد زیر ۱۰۰ متر"
      }
    },

    "counts": {
      "elevator": 1,
      "parking": 2,
      "warehouse": 1,
      "terrace": 1
    },

    "heating_cooling": ["کولر آبی", "کولر گازی", "پکیج", "شوفاژ"],

    "facilities": [
      "آسانسور",
      "پارکینگ",
      "انباری",
      "تراس",
      "درب ضد سرقت",
      "آیفون تصویری",
      "کمد دیواری",
      "سرویس فرنگی",
      "گاز رومیزی"
    ]
  } },
};

export const RentApartment: Story = {
  name: "رهن و اجاره آپارتمان (rent-apartment)",
  args: { initialAd: mockAdsByFormCode["rent-apartment"] },
};

export const SaleVillaHouse: Story = {
  name: "فروش خانه ویلایی (sale-villa-house)",
  args: { initialAd: mockAdsByFormCode["sale-villa-house"] },
};

export const SaleLand: Story = {
  name: "فروش زمین و کلنگی (sale-land)",
  args: { initialAd: mockAdsByFormCode["sale-land"] },
};

export const SaleOffice: Story = {
  name: "فروش دفتر کار و اداری (sale-office)",
  args: { initialAd: mockAdsByFormCode["sale-office"] },
};

export const SaleCommercial: Story = {
  name: "فروش تجاری و مغازه (sale-commercial)",
  args: { initialAd: mockAdsByFormCode["sale-commercial"] },
};

export const SaleWarehouse: Story = {
  name: "فروش انبار و سوله (sale-warehouse)",
  args: { initialAd: mockAdsByFormCode["sale-warehouse"] },
};

export const RentVillaHouse: Story = {
  name: "اجاره خانه ویلایی (rent-villa-house)",
  args: { initialAd: mockAdsByFormCode["rent-villa-house"] },
};

export const RentCommercial: Story = {
  name: "اجاره تجاری (rent-commercial)",
  args: { initialAd: mockAdsByFormCode["rent-commercial"] },
};

export const RentOffice: Story = {
  name: "اجاره اداری (rent-office)",
  args: { initialAd: mockAdsByFormCode["rent-office"] },
};

export const DailyApartmentSuite: Story = {
  name: "اجاره روزانه سوئیت (daily-apartment-suite)",
  args: { initialAd: mockAdsByFormCode["daily-apartment-suite"] },
};

export const DailyGardenVilla: Story = {
  name: "اجاره روزانه ویلا باغ (daily-garden-villa)",
  args: { initialAd: mockAdsByFormCode["daily-garden-villa"] },
};

export const DailyHotel: Story = {
  name: "اقامت روزانه هتل (daily-hotel)",
  args: { initialAd: mockAdsByFormCode["daily-hotel"] },
};

export const Partnership: Story = {
  name: "مشارکت در ساخت (partnership)",
  args: { initialAd: mockAdsByFormCode["partnership"] },
};

export const PresaleSpecial: Story = {
  name: "پیش‌فروش ویژه (presale-special)",
  args: { initialAd: mockAdsByFormCode["presale-special"] },
};
