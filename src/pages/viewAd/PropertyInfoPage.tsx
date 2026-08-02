import { PageFrame } from "../../app/layout/PageFrame";
import { NotFoundErrorState } from "../../shared/components/ErrorState";
import {
  BottomBackAction,
  PropertyInfoList,
  ViewAdTopBar,
} from "./viewAdComponents";
import { parseAdIdFromPath, viewAdDemo } from "./viewAdData";

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
      <main className="min-h-0 flex-1 overflow-y-auto bg-white">
        <NotFoundErrorState />
      </main>
      <BottomBackAction to="/home" />
    </PageFrame>
  );
}

export function PropertyInfoPage() {
  const adId = parseAdIdFromPath(window.location.pathname);

  if (adId == null) {
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
