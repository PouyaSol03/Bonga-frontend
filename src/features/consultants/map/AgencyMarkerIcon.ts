import { DivIcon } from "leaflet";

export function createAgencyMarkerIcon(isSelected: boolean): DivIcon {
  const markerColor = isSelected ? "var(--tertiary)" : "var(--primary)";
  const markerWidth = isSelected ? 31 : 18;
  const markerHeight = isSelected ? 40 : 24;

  return new DivIcon({
    className: "agency-directory-map-marker-wrapper",
    html: `
      <svg aria-hidden="true" width="${markerWidth}" height="${markerHeight}" viewBox="0 0 31 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15.5" cy="40.5" rx="6" ry="1.5" fill="var(--on-surface)" fill-opacity="0.12"/>
        <path d="M20.738 30.061C26.721 27.916 31 22.199 31 15.484C31 6.932 24.06 0 15.5 0S0 6.932 0 15.484c0 6.715 4.279 12.431 10.261 14.577 2.136.868 3.947 2.591 3.947 4.778v3.87a1.292 1.292 0 0 0 2.584 0v-3.87c0-2.187 1.811-3.91 3.946-4.778Z" fill="${markerColor}"/>
        <circle cx="15.5" cy="15" r="6" fill="var(--surface-container-lowest)"/>
      </svg>
    `,
    iconAnchor: [markerWidth / 2, markerHeight],
    iconSize: [markerWidth, markerHeight],
  });
}
