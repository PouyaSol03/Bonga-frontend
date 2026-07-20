type AdCardSkeletonProps = {
  className?: string;
};

export function AdCardSkeleton({ className = "" }: AdCardSkeletonProps) {
  return (
    <article className={`overflow-hidden bg-white ${className}`}>
      <div className="p-4 pb-3">
        <div className="h-full w-full rounded-2xl bg-[#f0f0f0]" />

        <div className="mt-3 flex">
          <div className="h-6 w-44 rounded-full bg-[#f0f0f0]" />
        </div>

        <div className="mt-3 flex items-center justify-start gap-7">
          <div className="h-5 w-20 rounded-full bg-[#f0f0f0]" />
          <div className="h-5 w-20 rounded-full bg-[#f0f0f0]" />
          <div className="h-5 w-20 rounded-full bg-[#f0f0f0]" />
        </div>

        <div className="mt-4 h-5 w-full rounded-full bg-[#f0f0f0]" />

        <div className="mt-4 flex justify-start">
          <div className="h-6 w-44 rounded-full bg-[#f0f0f0]" />
        </div>
      </div>
    </article>
  );
}
