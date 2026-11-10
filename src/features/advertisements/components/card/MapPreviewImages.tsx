import LinearImage from "../../../../shared/icons/LinearImage";

export function MapPreviewImages({ images, title }: { images: string[]; title: string }) {
  const visibleImages = images.length > 0 ? images : [null];

  return (
    <div className="flex h-[92px] w-full gap-3 overflow-hidden rounded-xl" dir="rtl">
      {visibleImages.map((src, index) => (
        <div
          key={src ? `${src}-${index}` : `no-image-${index}`}
          className="bg-primary-container relative h-[92px] w-[140px] shrink-0 overflow-hidden rounded-xl"
        >
          <div className="text-outline absolute inset-0 grid place-items-center" aria-hidden="true">
            <LinearImage className="h-8 w-8" />
          </div>
          {src ? (
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src={src}
              alt={index === 0 ? title : ""}
              draggable={false}
              loading={index === 0 ? "eager" : "lazy"}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
