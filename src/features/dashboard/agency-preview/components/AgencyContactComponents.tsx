import "leaflet/dist/leaflet.css";
import { DivIcon } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { Typography } from "../../../../shared/ui/Typography";
import { toPersianDigits } from "../profileHelpers";

export function ContactPhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M6.6 4.8 9 4.2l2.1 4.8-1.5 1.1a11.2 11.2 0 0 0 4.3 4.3L15 12.9l4.8 2.1-.6 2.4c-.3 1.2-1.4 2-2.6 1.8C10.2 18.2 5.8 13.8 4.8 7.4 4.6 6.2 5.4 5.1 6.6 4.8Z" />
    </svg>
  );
}

export function ContactMessageIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M5 18.5V20l3.1-1.6A8 8 0 1 0 4 11.5c0 2.6 1.2 4.9 3.1 6.4" />
      <path d="M8.5 12h7" />
    </svg>
  );
}

interface ContactRowProps {
  href: string;
  icon?: "message" | "phone";
  label: string;
  value: string;
}

export function ContactRow({
  href,
  icon = "phone",
  label,
  value,
}: ContactRowProps) {
  return (
    <a
      className="border-outline-var text-on-surface flex h-14 items-center justify-between gap-3 border-b no-underline [direction:ltr]"
      href={href}
    >
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className="text-on-surface text-left text-base leading-6 font-medium"
      >
        {toPersianDigits(value)}
      </Typography>
      <span className="inline-flex min-w-0 items-center gap-2 [direction:rtl]">
        {icon === "message" ? (
          <ContactMessageIcon className="text-on-surface-var h-6 w-6 shrink-0" />
        ) : (
          <ContactPhoneIcon className="text-on-surface-var h-6 w-6 shrink-0" />
        )}
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="text-outline text-right text-sm leading-5 font-normal"
        >
          {label}
        </Typography>
      </span>
    </a>
  );
}

export function createAgencyContactMapMarkerIcon() {
  return new DivIcon({
    className: "agency-contact-map-marker-wrapper",
    html: `
      <svg aria-hidden="true" width="31" height="42" viewBox="0 0 31 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15.5" cy="40.5" rx="6" ry="1.5" fill="var(--on-surface)" fill-opacity="0.12"/>
        <path d="M20.738 30.061C26.721 27.916 31 22.199 31 15.484C31 6.932 24.06 0 15.5 0S0 6.932 0 15.484c0 6.715 4.279 12.431 10.261 14.577 2.136.868 3.947 2.591 3.947 4.778v3.87a1.292 1.292 0 0 0 2.584 0v-3.87c0-2.187 1.811-3.91 3.946-4.778Z" fill="var(--tertiary)"/>
        <circle cx="15.5" cy="15" r="6" fill="var(--surface-container-lowest)"/>
      </svg>
    `,
    iconAnchor: [15.5, 42],
    iconSize: [31, 42],
  });
}

export function AgencyMiniMap({ lat, lng }: { lat: number; lng: number }) {
  return (
    <MapContainer
      attributionControl={false}
      center={[lat, lng]}
      className="h-[196px] w-full"
      dragging={false}
      doubleClickZoom={false}
      keyboard={false}
      scrollWheelZoom={false}
      touchZoom={false}
      zoom={16}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker icon={createAgencyContactMapMarkerIcon()} interactive={false} position={[lat, lng]} />
    </MapContainer>
  );
}
