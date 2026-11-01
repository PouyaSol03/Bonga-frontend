import { useEffect, useMemo, useState } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import type { LatLngTuple } from "leaflet";
import { CircleMarker, MapContainer, Polygon, TileLayer, useMapEvents } from "react-leaflet";
import { searchMapTileConfig } from "../../search/searchMapData";
import { polygonStringToPoints, pointsToPolygonString } from "./mapFormatters";
import { CRM_BLUE, miniGhostButtonClassName } from "./constants";

export function NeighborhoodPolygonEditor({
  lat,
  lng,
  onChange,
  value,
}: {
  lat: number;
  lng: number;
  onChange: (value: { lat: number; lng: number; polygon: string }) => void;
  value: string;
}) {
  const initialPoints = useMemo(() => polygonStringToPoints(value), [value]);
  const [points, setPoints] = useState<LatLngTuple[]>(initialPoints);

  useEffect(() => {
    setPoints(initialPoints);
  }, [initialPoints]);

  const updatePoints = (nextPoints: LatLngTuple[]) => {
    setPoints(nextPoints);

    const coordinateTotals = nextPoints.reduce(
      (sum, point) => [sum[0] + point[0], sum[1] + point[1]] as LatLngTuple,
      [0, 0] as LatLngTuple,
    );
    const center: LatLngTuple = nextPoints.length
      ? [coordinateTotals[0] / nextPoints.length, coordinateTotals[1] / nextPoints.length]
      : [lat, lng];

    onChange({
      lat: Number(center[0].toFixed(7)),
      lng: Number(center[1].toFixed(7)),
      polygon: pointsToPolygonString(nextPoints),
    });
  };

  const center: LatLngTuple = points[0] ?? [lat, lng];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dce3ef] bg-[#f8faff]">
      <div className="flex items-center justify-between gap-3 border-b border-[#dce3ef] px-4 py-3">
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 text-sm leading-5 text-[#4d4d4d]"
        >
          برای ساخت محدوده، روی نقشه کلیک کنید. با حداقل سه نقطه یک چندضلعی ساخته می‌شود.
        </Typography>
        <div className="flex shrink-0 gap-2">
          <Button
            unstyled
            className={miniGhostButtonClassName}
            disabled={!points.length}
            onClick={() => updatePoints(points.slice(0, -1))}
            type="button"
          >
            حذف آخرین نقطه
          </Button>
          <Button
            unstyled
            className={miniGhostButtonClassName}
            disabled={!points.length}
            onClick={() => updatePoints([])}
            type="button"
          >
            پاک کردن
          </Button>
        </div>
      </div>
      <div className="h-[320px] w-full overflow-hidden">
        <MapContainer center={center} className="h-full w-full" scrollWheelZoom zoom={13}>
          <TileLayer
            attribution={searchMapTileConfig.attribution}
            className={searchMapTileConfig.className}
            maxZoom={searchMapTileConfig.maxZoom}
            tms={searchMapTileConfig.isTms}
            url={searchMapTileConfig.urlTemplate}
          />
          <PolygonClickCollector onAdd={(point) => updatePoints([...points, point])} />
          {points.length >= 3 ? (
            <Polygon
              pathOptions={{ color: CRM_BLUE, fillOpacity: 0.18, weight: 2 }}
              positions={points}
            />
          ) : null}
          {points.map((point, index) => (
            <CircleMarker
              center={point}
              key={`${point[0]}-${point[1]}-${index}`}
              pathOptions={{ color: CRM_BLUE, fillColor: "white", fillOpacity: 1, weight: 2 }}
              radius={5}
            />
          ))}
        </MapContainer>
      </div>
      <textarea
        className="block min-h-20 w-full resize-y border-0 border-t border-[#dce3ef] bg-white p-3 font-mono text-sm leading-5 text-[#596477] outline-none"
        dir="ltr"
        readOnly
        value={pointsToPolygonString(points)}
      />
    </div>
  );
}

export function PolygonClickCollector({ onAdd }: { onAdd: (point: LatLngTuple) => void }) {
  useMapEvents({
    click(event) {
      onAdd([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
}
