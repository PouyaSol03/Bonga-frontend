export function DashboardSkeleton() {
  return (
    <div aria-hidden="true" className="bg-surface-container min-h-full pb-6 [direction:rtl]">
      <main className="mx-auto flex flex-col gap-3.5 px-4 pt-3">
        {/* 1. Tasks Card Skeleton */}
        <div className="bg-surface-container-lowest h-[235px] w-full rounded-[16px] p-4 shadow-sm">
          <div className="animate-skeleton h-6 w-48 rounded-md" />
          <div className="mt-6 flex flex-col gap-4">
            <div className="animate-skeleton h-8 w-full rounded-md" />
            <div className="animate-skeleton h-8 w-full rounded-md" />
            <div className="animate-skeleton h-8 w-full rounded-md" />
            <div className="animate-skeleton h-8 w-full rounded-md" />
          </div>
        </div>

        {/* 2. Quick Access Row Skeleton */}
        <div className="grid grid-cols-4 gap-2.5">
          <div className="bg-surface-container-lowest animate-skeleton h-[74px] rounded-[16px] p-2" />
          <div className="bg-surface-container-lowest animate-skeleton h-[74px] rounded-[16px] p-2" />
          <div className="bg-surface-container-lowest animate-skeleton h-[74px] rounded-[16px] p-2" />
          <div className="bg-surface-container-lowest animate-skeleton h-[74px] rounded-[16px] p-2" />
        </div>

        {/* 3. Badge Banner Skeleton */}
        <div className="bg-surface-container-lowest flex h-[64px] w-full items-center gap-3 rounded-[16px] p-3 shadow-sm">
          <div className="animate-skeleton h-10 w-10 shrink-0 rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="animate-skeleton h-3.5 w-24 rounded-md" />
            <div className="animate-skeleton h-4 w-36 rounded-md" />
          </div>
        </div>

        {/* 4. Credits Card Skeleton */}
        <div className="bg-surface-container-lowest flex h-[204px] w-full flex-col justify-between rounded-[16px] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="animate-skeleton h-5 w-28 rounded-md" />
            <div className="animate-skeleton h-8 w-24 rounded-lg" />
          </div>
          <div className="grid grid-cols-4 gap-2 pt-2">
            <div className="animate-skeleton h-24 rounded-xl" />
            <div className="animate-skeleton h-24 rounded-xl" />
            <div className="animate-skeleton h-24 rounded-xl" />
            <div className="animate-skeleton h-24 rounded-xl" />
          </div>
        </div>

        {/* 5. Urgent Actions Skeleton */}
        <div className="bg-surface-container-lowest flex h-[140px] w-full flex-col justify-between rounded-[16px] p-4 shadow-sm">
          <div className="animate-skeleton h-5 w-28 rounded-md" />
          <div className="animate-skeleton h-16 w-full rounded-xl" />
        </div>

        {/* 6. Reports Teaser Skeleton */}
        <div className="bg-surface-container-lowest flex h-[150px] w-full flex-col justify-between rounded-[16px] p-4 shadow-sm">
          <div className="flex flex-col gap-1.5">
            <div className="animate-skeleton h-5 w-36 rounded-md" />
            <div className="animate-skeleton h-3.5 w-52 rounded-md" />
          </div>
          <div className="animate-skeleton h-16 w-full rounded-xl" />
        </div>

        {/* 7. Recent Ads Skeleton */}
        <div className="bg-surface-container-lowest flex h-[360px] w-full flex-col gap-3 rounded-[16px] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="animate-skeleton h-5 w-24 rounded-md" />
            <div className="animate-skeleton h-4 w-16 rounded-md" />
          </div>
          <div className="animate-skeleton h-48 w-full rounded-xl" />
          <div className="animate-skeleton h-5 w-3/4 rounded-md" />
          <div className="animate-skeleton h-4 w-1/2 rounded-md" />
        </div>
      </main>
    </div>
  );
}
