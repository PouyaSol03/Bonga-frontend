export type AdCardSkeletonProps = {
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
        className={`w-full overflow-hidden rounded-none bg-surface-container-lowest p-4 [direction:rtl] ${className}`}
      >
        {/* Header: Thumbnail + Content */}
        <div className="flex items-center gap-3 [direction:rtl]">
          <div className="h-20 w-[120px] shrink-0 rounded-[8px] animate-skeleton" />
          <div className="flex h-20 flex-1 min-w-0 flex-col justify-between py-0.5">
            <div className="h-7 w-20 rounded-[8px] animate-skeleton" />
            <div className="h-4 w-3/4 rounded animate-skeleton" />
            <div className="h-3 w-1/2 rounded animate-skeleton" />
          </div>
        </div>

        {/* Metrics Row: 4 columns */}
        <div className="grid grid-cols-4 pt-6 pb-5 px-1 [direction:rtl]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="flex flex-col items-center justify-center gap-1.5" key={i}>
              <div className="h-6 w-6 rounded-full animate-skeleton" />
              <div className="h-4 w-8 rounded animate-skeleton" />
              <div className="h-3 w-10 rounded animate-skeleton" />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-outline-variant" />

        {/* Actions Row */}
        <div className="flex items-center justify-between pt-4 [direction:rtl]">
          <div className="h-10 w-[136px] rounded-[10px] animate-skeleton" />
          <div className="flex items-center gap-6 [direction:ltr]">
            <div className="h-10 w-10 rounded-full animate-skeleton" />
            <div className="h-10 w-10 rounded-full animate-skeleton" />
            <div className="h-10 w-10 rounded-full animate-skeleton" />
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
        <div className="relative aspect-[328/219.3] w-full overflow-hidden rounded-[16px] animate-skeleton" />
        <div className="flex flex-col gap-2 px-1">
          <div className="h-5 w-3/4 rounded-lg animate-skeleton" />
          <div className="h-4 w-1/2 rounded-md animate-skeleton" />
        </div>
      </article>
    );
  }

  if (variant === "mapPreview") {
    return (
      <article
        aria-hidden="true"
        className={`h-[216px] w-[min(360px,calc(100vw-28px))] shrink-0 overflow-hidden rounded-2xl bg-surface-container-lowest p-3 shadow-[0_4px_16px_rgba(0,0,0,0.10)] ${className}`}
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
        className={`w-full overflow-hidden rounded-none bg-surface-container-lowest [direction:rtl] ${className}`}
      >
        {/* Top allocation countdown badge */}
        <div className="mx-4 mt-4 h-9 rounded-xl animate-skeleton" />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-3 [direction:rtl]">
            <div className="h-20 w-[120px] shrink-0 rounded-[8px] animate-skeleton" />
            <div className="flex h-20 flex-1 min-w-0 flex-col justify-between py-0.5">
              <div className="h-7 w-20 rounded-[8px] animate-skeleton" />
              <div className="h-4 w-3/4 rounded animate-skeleton" />
              <div className="h-3 w-1/2 rounded animate-skeleton" />
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 pt-6 pb-5 px-1 [direction:rtl]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="flex flex-col items-center justify-center gap-1.5" key={i}>
                <div className="h-6 w-6 rounded-full animate-skeleton" />
                <div className="h-4 w-8 rounded animate-skeleton" />
                <div className="h-3 w-10 rounded animate-skeleton" />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-[1px] w-full bg-outline-variant" />

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 [direction:rtl]">
            <div className="h-10 w-[136px] rounded-[10px] animate-skeleton" />
            <div className="flex items-center gap-6 [direction:ltr]">
              <div className="h-10 w-10 rounded-full animate-skeleton" />
              <div className="h-10 w-10 rounded-full animate-skeleton" />
              <div className="h-10 w-10 rounded-full animate-skeleton" />
            </div>
          </div>
        </div>

        {/* Bottom Review & Allocation Button */}
        <div className="px-4 pb-4 pt-1">
          <div className="h-11 w-full rounded-lg animate-skeleton" />
        </div>
      </article>
    );
  }

  return (
    <article aria-hidden="true" className={`relative flex flex-col bg-surface-container-lowest px-4 py-4 text-right [direction:rtl] ${className}`}>
      {showDeleteButton ? (
        <div className="absolute left-6 top-6 z-10 h-10 w-10 rounded-xl bg-surface-container-lowest/90 shadow-[0_2px_8px_rgba(26,26,26,0.12)] p-2">
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

      <div className="mt-3 flex items-center justify-between border-t border-outline-var pt-2.5">
        <div className="h-3.5 w-28 rounded-md animate-skeleton" />
        <div className="h-3.5 w-20 rounded-md animate-skeleton" />
      </div>
    </article>
  );
}
