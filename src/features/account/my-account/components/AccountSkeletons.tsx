import { Divider } from "./AccountMenuRow";

export function AccountSkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`bg-surface-container-high animate-pulse rounded-lg ${className}`} />;
}

export function AccountHeaderSkeleton() {
  return (
    <section className="bg-surface-container-lowest" aria-label="در حال دریافت اطلاعات حساب">
      <div className="flex h-32 items-center gap-4 px-4 [direction:rtl]">
        <AccountSkeletonBlock className="h-[72px] w-[72px] shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-3 text-right">
          <AccountSkeletonBlock className="ml-auto h-5 w-32" />
          <AccountSkeletonBlock className="ml-auto h-4 w-24" />
        </div>
      </div>
      <Divider />
    </section>
  );
}

export function AccountMenuSkeleton({ count }: { count: number }) {
  return (
    <section className="bg-surface-container-lowest" aria-label="در حال دریافت گزینه‌های حساب">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <div className="flex h-14 items-center gap-2 px-4 [direction:ltr]">
            <AccountSkeletonBlock className="h-6 w-6 shrink-0 rounded-full" />
            <AccountSkeletonBlock className="ml-auto h-5 w-36" />
            <AccountSkeletonBlock className="h-6 w-6 shrink-0 rounded-full" />
          </div>
          {index < count - 1 ? <Divider /> : null}
        </div>
      ))}
    </section>
  );
}

export function StandardAccountSkeleton() {
  return (
    <>
      <AccountHeaderSkeleton />
      <AccountMenuSkeleton count={1} />
      <div className="bg-surface-container h-4" />
      <AccountMenuSkeleton count={6} />
      <div className="bg-surface-container h-4" />
      <AccountMenuSkeleton count={3} />
    </>
  );
}

export function BusinessAccountSkeleton() {
  return (
    <>
      <AccountHeaderSkeleton />
      <AccountMenuSkeleton count={3} />
      <div className="bg-surface-container h-4" />
      <AccountMenuSkeleton count={6} />
    </>
  );
}
