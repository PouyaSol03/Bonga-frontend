import { useState } from "react";
import { PageFrame } from "../../app/PageFrame";
import {
  searchFilterChips,
  searchMapCenter,
  searchMapDotMarkers,
  searchMapListings,
  searchMapTileConfig,
  type SearchMapListing,
} from "./searchMapData";
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
          listings={searchMapListings}
          onMapClick={() => setMode("map")}
        />
      ) : (
        <SearchMapView
          center={searchMapCenter}
          dotMarkers={searchMapDotMarkers}
          listings={searchMapListings}
          selectedListingId={selectedListingId}
          tileConfig={searchMapTileConfig}
          onSelectListing={handleSelectListing}
        />
      )}

      <SearchMapHeader
        savedCount={2}
        chips={searchFilterChips}
      />

      <SearchMapFloatingActions
        isHidden={mode !== "map"}
        onLocateClick={() => {
          // Later: get client location.
        }}
        onHandClick={() => {
          // Later: draw/select area on map.
        }}
        onListClick={() => {
          setSelectedListingId((currentId) => currentId ?? searchMapListings[0]?.id ?? null);
          setMode("preview");
        }}
      />

      <SearchMapListingSlider
        isOpen={isListPreviewOpen}
        listings={searchMapListings}
        selectedListingId={selectedListingId}
        onSelectListing={(listing) => {
          setSelectedListingId(listing.id);
          setMode("preview");
        }}
      />
      <BottomNavigation activeKey="search" />
    </PageFrame>
  );
}
