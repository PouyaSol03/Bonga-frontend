import { useMemo, useState } from "react";
import { PageFrame } from "../../app/PageFrame";
import {
  searchFilterChips,
  searchMapCenter,
  searchMapDotMarkers,
  searchMapListings,
  searchMapTileConfig,
  type SearchMapListing,
} from "./searchMapData";
import type { SearchFilterChip } from "./searchMapData";
import { DemoNotice } from "../../components/DemoNotice";
import { useDemoNotice } from "../../hooks/useDemoNotice";
import { SearchMapFloatingActions } from "./components/SearchMapFloatingActions";
import { SearchMapHeader } from "./components/SearchMapHeader";
import { SearchMapView } from "./components/SearchMapView";
import { BottomNavigation } from "../../components/BottomNavigation";
import { SearchMapListingSlider } from "./components/SearchMapListingSlider";
import { SearchMapListView } from "./components/SearchMapListView";

type SearchMapMode = "map" | "preview" | "list";

export function SearchMapPage() {
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [mode, setMode] = useState<SearchMapMode>("map");
  const [chips, setChips] = useState(searchFilterChips);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [isLocated, setIsLocated] = useState(false);
  const { message, showNotice } = useDemoNotice();

  const visibleListings = useMemo(() => {
    const activeIds = new Set(
      chips.filter((chip) => chip.isActive).map((chip) => chip.id),
    );

    return searchMapListings.filter((listing) => {
      if (activeIds.has("neighborhood") && listing.locationLabel !== "الهیه") {
        return false;
      }
      if (activeIds.has("area") && !listing.area.includes("۱۱۰")) {
        return false;
      }
      if (activeIds.has("price") && listing.id > 3) {
        return false;
      }
      return true;
    });
  }, [chips]);

  const visibleListingIds = new Set(visibleListings.map((listing) => listing.id));
  const visibleDotMarkers = searchMapDotMarkers.filter((marker) =>
    visibleListingIds.has(marker.listingId),
  );

  const toggleChip = (chip: SearchFilterChip) => {
    if (chip.id === "filters") {
      window.history.pushState({}, "", "/search/filter");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    setChips((current) =>
      current.map((item) =>
        item.id === chip.id ? { ...item, isActive: !item.isActive } : item,
      ),
    );
  };

  const handleSelectListing = (listing: SearchMapListing) => {
    setSelectedListingId(listing.id);
    setMode("preview");
  };

  const isListPreviewOpen = mode === "preview";
  const isFullListOpen = mode === "list";

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a]"
      variant="flush"
    >
      {isFullListOpen ? (
        <SearchMapListView
          listings={visibleListings}
          onMapClick={() => setMode("map")}
        />
      ) : (
        <SearchMapView
          center={searchMapCenter}
          dotMarkers={visibleDotMarkers}
          listings={visibleListings}
          selectedListingId={selectedListingId}
          tileConfig={searchMapTileConfig}
          onSelectListing={handleSelectListing}
        />
      )}

      <SearchMapHeader
        savedCount={2}
        chips={chips}
        onChipClick={toggleChip}
        onSearchClick={() => setMode("list")}
      />

      <SearchMapFloatingActions
        isDrawing={isDrawMode}
        isHidden={mode !== "map"}
        isLocated={isLocated}
        onLocateClick={() => {
          setIsLocated(true);
          showNotice("موقعیت نمایشی شما روی نقشه مشخص شد");
        }}
        onHandClick={() => {
          setIsDrawMode((current) => !current);
          showNotice(isDrawMode ? "انتخاب محدوده پایان یافت" : "محدوده موردنظر را روی نقشه مشخص کنید");
        }}
        onListClick={() => {
          setSelectedListingId((currentId) => currentId ?? visibleListings[0]?.id ?? null);
          setMode("preview");
        }}
      />

      <SearchMapListingSlider
        isOpen={isListPreviewOpen}
        listings={visibleListings}
        selectedListingId={selectedListingId}
        onSelectListing={(listing) => {
          setSelectedListingId(listing.id);
          setMode("preview");
        }}
      />
      <BottomNavigation activeKey="search" />
      <DemoNotice message={message} />
    </PageFrame>
  );
}
