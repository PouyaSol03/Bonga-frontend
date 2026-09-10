type AdCardSkeletonProps = {
  className?: string;
  showDeleteButton?: boolean;
  variant?: "standard" | "mapPreview" | "assigned";
};

export function AdCardSkeleton({
  className = "",
  showDeleteButton = false,
  variant = "standard",
}: AdCardSkeletonProps) {
  if (variant === "mapPreview") {
    return (
      <article
        aria-hidden="true"
        className={`h-[216px] w-[min(360px,calc(100vw-28px))] shrink-0 overflow-hidden rounded-2xl bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.10)] ${className}`}
      >
        <div className="h-[112px] w-full rounded-xl animate-skeleton" />
        <div className="mt-2 h-5 w-32 rounded-full animate-skeleton" />
        <div className="mt-2 flex gap-3">
          <div className="h-4 w-16 rounded-full animate-skeleton" />
          <div className="h-4 w-16 rounded-full animate-skeleton" />
          <div className="h-4 w-16 rounded-full animate-skeleton" />
        </div>
        <div className="mt-2 h-5 w-4/5 rounded-full animate-skeleton" />
      </article>
    );
  }

  if (variant === "assigned") {
    return (
      <article
        aria-hidden="true"
        className={`overflow-hidden bg-white shadow-[0_4px_16px_rgba(26,26,26,0.06)] [direction:rtl] ${className}`}
      >
        <div className="mx-4 mt-4 h-9 rounded-full animate-skeleton" />
        <div className="p-4 pb-3">
          <div className="aspect-[328/219.3] w-full rounded-2xl animate-skeleton" />
          <div className="mt-3 h-5 w-3/4 rounded-lg animate-skeleton" />
          <div className="mt-3 flex items-center justify-start gap-6">
            <div className="h-4 w-16 rounded-md animate-skeleton" />
            <div className="h-4 w-16 rounded-md animate-skeleton" />
            <div className="h-4 w-16 rounded-md animate-skeleton" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="h-5 w-32 rounded-md animate-skeleton" />
            <div className="h-4 w-20 rounded-md animate-skeleton" />
          </div>
        </div>
        <div className="px-4 pb-4 pt-1">
          <div className="h-11 w-full rounded-lg animate-skeleton" />
        </div>
      </article>
    );
  }

  return (
    <article aria-hidden="true" className={`relative flex flex-col bg-white px-4 py-4 text-right [direction:rtl] ${className}`}>
      {showDeleteButton ? (
        <div className="absolute left-6 top-6 z-10 h-10 w-10 rounded-xl bg-white/90 shadow-[0_2px_8px_rgba(26,26,26,0.12)] p-2">
          <div className="h-full w-full rounded-lg animate-skeleton" />
        </div>
      ) : null}

      <div className="aspect-[328/219.3] w-full rounded-2xl animate-skeleton" />

      <div className="mt-3 flex justify-start">
        <div className="h-5 w-3/4 rounded-lg animate-skeleton" />
      </div>

      <div className="mt-3 flex items-center justify-start gap-6">
        <div className="h-4 w-16 rounded-md animate-skeleton" />
        <div className="h-4 w-16 rounded-md animate-skeleton" />
        <div className="h-4 w-16 rounded-md animate-skeleton" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="h-5 w-36 rounded-md animate-skeleton" />
        <div className="h-4 w-20 rounded-md animate-skeleton" />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#f5f5f5] pt-2.5">
        <div className="h-3.5 w-28 rounded-md animate-skeleton" />
        <div className="h-3.5 w-20 rounded-md animate-skeleton" />
      </div>
    </article>
  );
}
