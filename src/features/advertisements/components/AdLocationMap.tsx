type AdLocationMapProps = {
  className?: string;
  latitude: number;
  longitude: number;
  title?: string;
};

export function AdLocationMap({
  className = "",
  latitude,
  longitude,
  title = "موقعیت روی نقشه",
}: AdLocationMapProps) {
  const mapSrc = `https://neshan.org/maps/iframe/places/78bff763c73354cd9b7a48dd01792bf9#c${latitude}-${longitude}-15z-0p/${latitude}/${longitude}`;

  return (
    <div
      className={`relative h-[198px] overflow-hidden rounded-2xl border border-[#ebebeb] bg-[#fafafa] ${className}`}
    >
      <iframe
        allowFullScreen
        className="pointer-events-none h-full w-full border-0"
        height="300"
        loading="lazy"
        src={mapSrc}
        tabIndex={-1}
        title={title}
        width="450"
      />
    </div>
  );
}
