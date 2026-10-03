export function DashboardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-h-full bg-surface-container pb-6 [direction:rtl]"
    >
      <main className="mx-auto flex flex-col gap-3.5 px-4 pt-3">
        {/* 1. Tasks Card Skeleton */}
        <div className="h-[235px] w-full rounded-[16px] bg-surface-container-lowest p-4 shadow-sm">
          <div className="h-6 w-48 rounded-md animate-skeleton" />
          <div className="mt-6 flex flex-col gap-4">
            <div className="h-8 w-full rounded-md animate-skeleton" />
            <div className="h-8 w-full rounded-md animate-skeleton" />
            <div className="h-8 w-full rounded-md animate-skeleton" />
            <div className="h-8 w-full rounded-md animate-skeleton" />
          </div>
        </div>

        {/* 2. Quick Access Row Skeleton */}
        <div className="grid grid-cols-4 gap-2.5">
          <div className="h-[74px] rounded-[16px] bg-surface-container-lowest p-2 animate-skeleton" />
          <div className="h-[74px] rounded-[16px] bg-surface-container-lowest p-2 animate-skeleton" />
          <div className="h-[74px] rounded-[16px] bg-surface-container-lowest p-2 animate-skeleton" />
          <div className="h-[74px] rounded-[16px] bg-surface-container-lowest p-2 animate-skeleton" />
        </div>

        {/* 3. Badge Banner Skeleton */}
        <div className="h-[64px] w-full rounded-[16px] bg-surface-container-lowest p-3 flex items-center gap-3 shadow-sm">
          <div className="h-10 w-10 shrink-0 rounded-xl animate-skeleton" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-3.5 w-24 rounded-md animate-skeleton" />
            <div className="h-4 w-36 rounded-md animate-skeleton" />
          </div>
        </div>

        {/* 4. Credits Card Skeleton */}
        <div className="h-[204px] w-full rounded-[16px] bg-surface-container-lowest p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="h-5 w-28 rounded-md animate-skeleton" />
            <div className="h-8 w-24 rounded-lg animate-skeleton" />
          </div>
          <div className="grid grid-cols-4 gap-2 pt-2">
            <div className="h-24 rounded-xl animate-skeleton" />
            <div className="h-24 rounded-xl animate-skeleton" />
            <div className="h-24 rounded-xl animate-skeleton" />
            <div className="h-24 rounded-xl animate-skeleton" />
          </div>
        </div>

        {/* 5. Urgent Actions Skeleton */}
        <div className="h-[140px] w-full rounded-[16px] bg-surface-container-lowest p-4 shadow-sm flex flex-col justify-between">
          <div className="h-5 w-28 rounded-md animate-skeleton" />
          <div className="h-16 w-full rounded-xl animate-skeleton" />
        </div>

        {/* 6. Reports Teaser Skeleton */}
        <div className="h-[150px] w-full rounded-[16px] bg-surface-container-lowest p-4 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="h-5 w-36 rounded-md animate-skeleton" />
            <div className="h-3.5 w-52 rounded-md animate-skeleton" />
          </div>
          <div className="h-16 w-full rounded-xl animate-skeleton" />
        </div>

        {/* 7. Recent Ads Skeleton */}
        <div className="h-[360px] w-full rounded-[16px] bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="h-5 w-24 rounded-md animate-skeleton" />
            <div className="h-4 w-16 rounded-md animate-skeleton" />
          </div>
          <div className="h-48 w-full rounded-xl animate-skeleton" />
          <div className="h-5 w-3/4 rounded-md animate-skeleton" />
          <div className="h-4 w-1/2 rounded-md animate-skeleton" />
        </div>
      </main>
    </div>
  );
}
