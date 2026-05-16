import { useMemo, useState } from "react";
import { PageFrame } from "../../app/PageFrame";
import {
  searchFilterChips,
  searchMapCenter,
  searchMapListings,
  searchMapTileConfig,
  type SearchMapListing,
} from "./searchMapData";
import { SearchMapFloatingActions } from "./components/SearchMapFloatingActions";
import { SearchMapHeader } from "./components/SearchMapHeader";
import { SearchMapView } from "./components/SearchMapView";
import { BottomNavigation } from "../../components/BottomNavigation";
import { SearchMapListingSlider } from "./components/SearchMapListingSlider";

export function SearchMapPage() {
  const [selectedListingId, setSelectedListingId] = useState<number | null>(
    searchMapListings[0]?.id ?? null,
  );
  const [isListPreviewOpen, setIsListPreviewOpen] = useState(false);

  const selectedListing = useMemo<SearchMapListing | null>(() => {
    return (
      searchMapListings.find((listing) => listing.id === selectedListingId) ??
      null
    );
  }, [selectedListingId]);

  const handleSelectListing = (listing: SearchMapListing) => {
    setSelectedListingId(listing.id);
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a]"
      variant="flush"
    >
      <SearchMapView
        center={searchMapCenter}
        listings={searchMapListings}
        selectedListingId={selectedListingId}
        tileConfig={searchMapTileConfig}
        onSelectListing={handleSelectListing}
      />

      <SearchMapHeader
        queryLabel="فروش آپارتمان"
        savedCount={2}
        chips={searchFilterChips}
      />

      <SearchMapFloatingActions
        isHidden={isListPreviewOpen}
        onLocateClick={() => {
          // Later: get client location.
        }}
        onHandClick={() => {
          // Later: draw/select area on map.
        }}
        onListClick={() => {
          setIsListPreviewOpen(true);
        }}
      />

      <SearchMapListingSlider
        isOpen={isListPreviewOpen}
        listings={searchMapListings}
        selectedListingId={selectedListingId}
        onSelectListing={handleSelectListing}
      />
      <BottomNavigation activeKey="search" />
    </PageFrame>
  );
}
