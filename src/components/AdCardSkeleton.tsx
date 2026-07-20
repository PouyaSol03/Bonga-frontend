type AdCardSkeletonProps = {
  className?: string;
  variant?: "standard" | "mapPreview";
};

export function AdCardSkeleton({
  className = "",
  variant = "standard",
}: AdCardSkeletonProps) {
  if (variant === "mapPreview") {
    return (
      <article
        aria-hidden="true"
        className={`h-[216px] w-[min(360px,calc(100vw-28px))] shrink-0 overflow-hidden rounded-2xl bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.10)] ${className}`}
      >
        <div className="h-[112px] w-full animate-pulse rounded-xl bg-[#f0f0f0]" />
        <div className="mt-2 h-5 w-32 animate-pulse rounded-full bg-[#f0f0f0]" />
        <div className="mt-2 flex gap-3">
          <div className="h-4 w-16 animate-pulse rounded-full bg-[#f0f0f0]" />
          <div className="h-4 w-16 animate-pulse rounded-full bg-[#f0f0f0]" />
          <div className="h-4 w-16 animate-pulse rounded-full bg-[#f0f0f0]" />
        </div>
        <div className="mt-2 h-5 w-4/5 animate-pulse rounded-full bg-[#f0f0f0]" />
      </article>
    );
  }

  return (
    <article aria-hidden="true" className={`overflow-hidden bg-white ${className}`}>
      <div className="p-4 pb-3">
        <div className="aspect-[328/219.3] w-full animate-pulse rounded-2xl bg-[#f0f0f0]" />

        <div className="mt-3 flex">
          <div className="h-6 w-44 animate-pulse rounded-full bg-[#f0f0f0]" />
        </div>

        <div className="mt-3 flex items-center justify-start gap-7">
          <div className="h-5 w-20 animate-pulse rounded-full bg-[#f0f0f0]" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-[#f0f0f0]" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-[#f0f0f0]" />
        </div>

        <div className="mt-4 h-5 w-full animate-pulse rounded-full bg-[#f0f0f0]" />

        <div className="mt-4 flex justify-start">
          <div className="h-6 w-44 animate-pulse rounded-full bg-[#f0f0f0]" />
        </div>
      </div>
    </article>
  );
}
