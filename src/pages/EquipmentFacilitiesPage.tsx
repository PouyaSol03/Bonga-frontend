import { PageFrame } from "../app/PageFrame";
import { getLatestMashhadAdById } from "./home/homeData";
import {
  BottomBackAction,
  EquipmentSections,
  ViewAdTopBar,
} from "./viewAd/viewAdComponents";
import { parseAdIdFromPath } from "./viewAd/viewAdData";
import type { EquipmentSection } from "./viewAd/viewAdTypes";

const equipmentFacilitiesSections: EquipmentSection[] = [
  {
    icon: "building",
    title: "امکانات",
    items: [
      { icon: "elevator", label: "", value: "آسانسور" },
      { icon: "parking", label: "", value: "پارکینگ" },
      { icon: "terrace", label: "", value: "تراس" },
      { icon: "yard", label: "", value: "حیاط" },
      { icon: "warehouse", label: "", value: "انباری" },
      { icon: "cooler", label: "", value: "کولر گازی" },
    ],
  },
  {
    icon: "building",
    title: "سرمایش و گرمایش",
    items: [
      { icon: "cooler", label: "", value: "کولر گازی" },
      { icon: "waterCooler", label: "", value: "کولر گازی" },
      { icon: "waterHeater", label: "", value: "پکیج" },
      { icon: "radiator", label: "", value: "شوفاژ" },
      { icon: "underfloorHeating", label: "", value: "گرمایش از کف" },
      { icon: "cooler", label: "", value: "شوفاژ" },
    ],
  },
];

function NotFoundState() {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar
        actionIcons={["share", "bookmark", "attachment"]}
        backTo="/home"
        title="تجهیزات و امکانات"
      />
      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-6 text-right">
        <h1 className="m-0 text-base font-semibold leading-6">
          آگهی پیدا نشد
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#4d4d4d]">
          تجهیزات و امکانات این آگهی در حال حاضر موجود نیست یا لینک آن نادرست
          است.
        </p>
      </main>
      <BottomBackAction to="/home" />
    </PageFrame>
  );
}

export function EquipmentFacilitiesPage() {
  const adId = parseAdIdFromPath(window.location.pathname);
  const ad = adId != null ? getLatestMashhadAdById(adId) : undefined;

  if (!ad || adId == null) {
    return <NotFoundState />;
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar
        actionIcons={["share", "bookmark", "attachment"]}
        backTo={`/ads/${adId}`}
        title="تجهیزات و امکانات"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <EquipmentSections sections={equipmentFacilitiesSections} />
      </main>

      <BottomBackAction to={`/ads/${adId}`} />
    </PageFrame>
  );
}
