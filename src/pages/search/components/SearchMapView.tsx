import { MapContainer, TileLayer } from "react-leaflet";
import { SearchMapMarker } from "./SearchMapMarker";
import type { SearchMapCenter, SearchMapListing, SearchMapTileConfig } from "../searchMapData";

type SearchMapViewProps = {
  center: SearchMapCenter;
  listings: SearchMapListing[];
  selectedListingId: number | null;
  tileConfig: SearchMapTileConfig;
  onSelectListing: (listing: SearchMapListing) => void;
};

export function SearchMapView({
  center,
  listings,
  selectedListingId,
  tileConfig,
  onSelectListing,
}: SearchMapViewProps) {
  return (
    <MapContainer
      className="h-full w-full bg-[#f5f5f5]"
      center={[center.latitude, center.longitude]}
      zoom={center.zoom}
      minZoom={tileConfig.minZoom}
      maxZoom={tileConfig.maxZoom}
      zoomControl={false}
      attributionControl={false}
      preferCanvas
    >
      <TileLayer
        url={tileConfig.urlTemplate}
        attribution={tileConfig.attribution}
        tms={tileConfig.isTms}
      />

      {listings.map((listing) => (
        <SearchMapMarker
          key={listing.id}
          listing={listing}
          isSelected={listing.id === selectedListingId}
          onSelect={onSelectListing}
        />
      ))}
    </MapContainer>
  );
}
