import { PageFrame } from "../app/PageFrame";
import { getLatestMashhadAdById } from "./home/homeData";
import {
  BottomBackAction,
  PropertyInfoList,
  ViewAdTopBar,
} from "./viewAd/viewAdComponents";
import { parseAdIdFromPath, viewAdDemo } from "./viewAd/viewAdData";

function NotFoundState() {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar
        actionIcons={[]}
        backTo="/home"
        title="اطلاعات ملک"
      />
      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-6 text-right">
        <h1 className="m-0 text-base font-semibold leading-6">آگهی پیدا نشد</h1>
        <p className="mt-3 text-sm leading-6 text-[#4d4d4d]">
          اطلاعات این آگهی در حال حاضر موجود نیست یا لینک آن نادرست است.
        </p>
      </main>
      <BottomBackAction to="/home" />
    </PageFrame>
  );
}

export function PropertyInfoPage() {
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
        onAction={() => {
          window.history.pushState({}, "", `/ads/${adId}`);
          window.dispatchEvent(new PopStateEvent("popstate"));
        }}
        title="اطلاعات ملک"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <PropertyInfoList rows={viewAdDemo.propertyInfoRows} />
      </main>

      <BottomBackAction to={`/ads/${adId}`} />
    </PageFrame>
  );
}
