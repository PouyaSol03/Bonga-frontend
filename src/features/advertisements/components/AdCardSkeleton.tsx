type AdCardSkeletonProps = {
  className?: string;
  showDeleteButton?: boolean;
  variant?: "standard" | "mapPreview" | "assigned" | "dashboard" | "management";
};

export function AdCardSkeleton({
  className = "",
  showDeleteButton = false,
  variant = "standard",
}: AdCardSkeletonProps) {
  if (variant === "management") {
    return (
      <article
        aria-hidden="true"
        className={`bg-surface-container-lowest w-full overflow-hidden rounded-none p-4 [direction:rtl] ${className}`}
      >
        {/* Header: Thumbnail + Content */}
        <div className="flex items-center gap-3 [direction:rtl]">
          <div className="animate-skeleton h-20 w-[120px] shrink-0 rounded-[8px]" />
          <div className="flex h-20 min-w-0 flex-1 flex-col justify-between py-0.5">
            <div className="animate-skeleton h-7 w-20 rounded-[8px]" />
            <div className="animate-skeleton h-4 w-3/4 rounded" />
            <div className="animate-skeleton h-3 w-1/2 rounded" />
          </div>
        </div>

        {/* Metrics Row: 4 columns */}
        <div className="grid grid-cols-4 px-1 pt-6 pb-5 [direction:rtl]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="flex flex-col items-center justify-center gap-1.5" key={i}>
              <div className="animate-skeleton h-6 w-6 rounded-full" />
              <div className="animate-skeleton h-4 w-8 rounded" />
              <div className="animate-skeleton h-3 w-10 rounded" />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="bg-outline-variant h-[1px] w-full" />

        {/* Actions Row */}
        <div className="flex items-center justify-between pt-4 [direction:rtl]">
          <div className="animate-skeleton h-10 w-[136px] rounded-[10px]" />
          <div className="flex items-center gap-6 [direction:ltr]">
            <div className="animate-skeleton h-10 w-10 rounded-full" />
            <div className="animate-skeleton h-10 w-10 rounded-full" />
            <div className="animate-skeleton h-10 w-10 rounded-full" />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "dashboard") {
    return (
      <article
        aria-hidden="true"
        className={`flex w-full min-w-0 flex-col gap-4 text-right ${className}`}
      >
        <div className="animate-skeleton relative aspect-[328/219.3] w-full overflow-hidden rounded-[16px]" />
        <div className="flex flex-col gap-2 px-1">
          <div className="animate-skeleton h-5 w-3/4 rounded-lg" />
          <div className="animate-skeleton h-4 w-1/2 rounded-md" />
        </div>
      </article>
    );
  }

  if (variant === "mapPreview") {
    return (
      <article
        aria-hidden="true"
        className={`bg-surface-container-lowest h-[216px] w-[min(360px,calc(100vw-28px))] shrink-0 overflow-hidden rounded-2xl p-3 shadow-[0_4px_16px_rgba(0,0,0,0.10)] ${className}`}
      >
        <div className="animate-skeleton h-[112px] w-full rounded-xl" />
        <div className="animate-skeleton mt-2 h-5 w-32 rounded-full" />
        <div className="mt-2 flex gap-3">
          <div className="animate-skeleton h-4 w-16 rounded-full" />
          <div className="animate-skeleton h-4 w-16 rounded-full" />
          <div className="animate-skeleton h-4 w-16 rounded-full" />
        </div>
        <div className="animate-skeleton mt-2 h-5 w-4/5 rounded-full" />
      </article>
    );
  }

  if (variant === "assigned") {
    return (
      <article
        aria-hidden="true"
        className={`bg-surface-container-lowest w-full overflow-hidden rounded-none p-4 [direction:rtl] ${className}`}
      >
        {/* Top allocation countdown badge */}
        <div className="animate-skeleton h-9 w-full rounded-xl" />

        {/* Hero image with meta overlay */}
        <div className="animate-skeleton mt-4 aspect-[328/219.3] w-full rounded-2xl" />

        {/* Pricing */}
        <div className="animate-skeleton mt-3 h-6 w-36 rounded-lg" />

        {/* Specs row */}
        <div className="mt-3 flex items-center gap-6">
          <div className="animate-skeleton h-5 w-16 rounded" />
          <div className="animate-skeleton h-5 w-16 rounded" />
          <div className="animate-skeleton h-5 w-16 rounded" />
        </div>

        {/* Title */}
        <div className="animate-skeleton mt-3 h-6 w-4/5 rounded" />

        {/* Time and location */}
        <div className="animate-skeleton mt-2 h-4 w-1/3 rounded" />

        {/* Bottom Review & Allocation Button */}
        <div className="mt-4 pt-1">
          <div className="animate-skeleton h-11 w-full rounded-lg" />
        </div>
      </article>
    );
  }

  return (
    <article
      aria-hidden="true"
      className={`bg-surface-container-lowest relative flex flex-col px-4 py-4 text-right [direction:rtl] ${className}`}
    >
      {showDeleteButton ? (
        <div className="bg-surface-container-lowest/90 absolute top-6 left-6 z-10 h-10 w-10 rounded-xl p-2 shadow-[0_2px_8px_rgba(26,26,26,0.12)]">
          <div className="animate-skeleton h-full w-full rounded-lg" />
        </div>
      ) : null}

      <div className="animate-skeleton aspect-[328/219.3] w-full rounded-2xl" />

      <div className="mt-3 flex justify-start">
        <div className="animate-skeleton h-5 w-3/4 rounded-lg" />
      </div>

      <div className="mt-3 flex items-center justify-start gap-6">
        <div className="animate-skeleton h-4 w-16 rounded-md" />
        <div className="animate-skeleton h-4 w-16 rounded-md" />
        <div className="animate-skeleton h-4 w-16 rounded-md" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="animate-skeleton h-5 w-36 rounded-md" />
        <div className="animate-skeleton h-4 w-20 rounded-md" />
      </div>

      <div className="border-outline-var mt-3 flex items-center justify-between border-t pt-2.5">
        <div className="animate-skeleton h-3.5 w-28 rounded-md" />
        <div className="animate-skeleton h-3.5 w-20 rounded-md" />
      </div>
    </article>
  );
}
