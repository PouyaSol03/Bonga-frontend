import { AdCardSkeleton } from "../../../advertisements/components/AdCardSkeleton";

export function AccountSkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-skeleton rounded-lg ${className}`} />;
}

export function ProfileFieldSkeleton() {
  return (
    <div className="relative">
      <AccountSkeletonBlock className="h-14 w-full rounded-xl" />
    </div>
  );
}

export function AccountProfileSkeleton() {
  return (
    <div aria-label="در حال دریافت مشخصات" className="bg-surface-container-lowest pb-24">
      <section className="flex flex-col items-center px-4 pt-4">
        <AccountSkeletonBlock className="h-[100px] w-[100px] rounded-full" />
        <AccountSkeletonBlock className="mt-3 h-4 w-28" />
      </section>

      <section className="mt-6 space-y-6 px-4">
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
      </section>

      <div className="bg-surface-container mt-4 h-4" />

      <section className="space-y-6 px-4 pt-4">
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
      </section>

      <div className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <AccountSkeletonBlock className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function AccountAdCardsSkeleton({
  count = 3,
  showDeleteButton = false,
}: {
  count?: number;
  showDeleteButton?: boolean;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <AdCardSkeleton key={index} showDeleteButton={showDeleteButton} />
      ))}
    </>
  );
}

export function WalletPageSkeleton() {
  return (
    <section className="space-y-5 px-3 pt-4 text-right" aria-label="در حال بارگذاری کیف پول">
      {/* Credit Card */}
      <div className="border-primary/8 bg-primary-container flex items-center justify-between rounded-xl border p-4 [direction:rtl]">
        <div className="space-y-2">
          <AccountSkeletonBlock className="h-4 w-28" />
          <AccountSkeletonBlock className="h-7 w-36" />
        </div>
        <AccountSkeletonBlock className="h-14 w-14 rounded-full" />
      </div>

      <div className="border-outline-var -mx-3 border-t" />

      {/* Increase credit header */}
      <div className="flex items-center gap-2">
        <AccountSkeletonBlock className="h-5 w-5 rounded-full" />
        <AccountSkeletonBlock className="h-5 w-24" />
      </div>

      {/* Input box */}
      <AccountSkeletonBlock className="h-14 w-full rounded-xl" />

      {/* Suggested amounts header */}
      <AccountSkeletonBlock className="h-4 w-28" />

      {/* 6 buttons grid */}
      <div className="grid grid-cols-3 gap-3 [direction:rtl]">
        {Array.from({ length: 6 }).map((_, index) => (
          <AccountSkeletonBlock key={index} className="h-10 w-full rounded-lg" />
        ))}
      </div>

      {/* History button */}
      <AccountSkeletonBlock className="mt-8 h-14 w-full rounded-xl" />
    </section>
  );
}

export function PaymentHistorySkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2" aria-label="در حال دریافت تاریخچه پرداخت">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="border-outline-var bg-surface-container-lowest flex flex-col gap-y-3 border-b p-4 text-right"
        >
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-between gap-4 py-1.5">
              <AccountSkeletonBlock className="h-4 w-20" />
              <AccountSkeletonBlock className="h-4 w-28" />
            </div>
          ))}
        </article>
      ))}
    </div>
  );
}

export function AccountNotesSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <article
          className="border-outline-var bg-surface-container-lowest h-[137px] border-b px-4 py-4"
          key={index}
        >
          <div className="flex h-10 items-center justify-end gap-3">
            <AccountSkeletonBlock className="h-5 w-5 shrink-0" />
            <AccountSkeletonBlock className="h-5 w-36" />
          </div>
          <div className="mt-4 flex h-10 items-center gap-3 [direction:rtl]">
            <AccountSkeletonBlock className="h-10 w-[60px] shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <AccountSkeletonBlock className="ml-auto h-3 w-3/4" />
              <AccountSkeletonBlock className="ml-auto h-3 w-1/2" />
            </div>
          </div>
        </article>
      ))}
    </>
  );
}
