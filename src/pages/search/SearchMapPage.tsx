import { useMemo, useState } from "react";
import { PageFrame } from "../../app/PageFrame";
import { BottomSheet } from "../../components/BottomSheet";
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
import { HomeSearchScreen } from "../home/components/HomeSearchScreen";
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
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isLocated, setIsLocated] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
      setIsFilterSheetOpen(true);
      return;
    }

    setChips((current) =>
      current.map((item) =>
        item.id === chip.id ? { ...item, isActive: !item.isActive } : item,
      ),
    );
  };

  const clearFilters = () => {
    setChips((current) =>
      current.map((chip) => ({
        ...chip,
        isActive: chip.id === "sale-apartment",
      })),
    );
    setIsFilterSheetOpen(false);
    showNotice("فیلترها پاک شد");
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
        onSearchClick={() => setIsSearchOpen(true)}
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
      <BottomSheet
        ariaLabel="فیلتر آگهی‌ها"
        contentClassName="mt-4 px-4"
        heightClassName="h-[360px]"
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="فیلتر"
      >
        <div className="flex flex-wrap justify-start gap-2 [direction:rtl]">
          {chips.slice(1).map((chip) => (
            <button
              aria-pressed={Boolean(chip.isActive)}
              className={`h-10 rounded-lg border px-3 text-sm font-medium ${
                chip.isActive
                  ? "border-[#0048c4] bg-[#0048c414] text-[#0048c4]"
                  : "border-[#cccccc] bg-white text-[#4d4d4d]"
              }`}
              key={chip.id}
              onClick={() => toggleChip(chip)}
              type="button"
            >
              {chip.label}
            </button>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 [direction:ltr]">
          <button
            className="h-10 rounded-lg border border-[#0048c4] text-sm font-medium text-[#0048c4]"
            onClick={clearFilters}
            type="button"
          >
            حذف فیلتر
          </button>
          <button
            className="h-10 rounded-lg bg-[#0048c4] text-sm font-medium text-white"
            onClick={() => {
              setIsFilterSheetOpen(false);
              showNotice(`${visibleListings.length} آگهی نمایش داده شد`);
            }}
            type="button"
          >
            اعمال
          </button>
        </div>
      </BottomSheet>
      <HomeSearchScreen
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={() => {
          setIsSearchOpen(false);
          setMode("list");
          showNotice("نتایج جستجو نمایش داده شد");
        }}
      />
      <DemoNotice message={message} />
    </PageFrame>
  );
}
