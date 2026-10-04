import { TopBar } from "../../../../../shared/components/TopBar";
import { Typography } from "../../../../../shared/ui/Typography";

function ConsultantInfoSkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-container-high ${className}`} />;
}

export function ConsultantInfoRowsSkeleton({ rows }: { rows: number }) {
  return (
    <article className="rounded-2xl bg-surface-container-lowest px-4 py-5">
      <div className="grid gap-8">
        {Array.from({ length: rows }, (_, index) => (
          <div className="flex items-center justify-between" key={index}>
            <div className="flex items-center gap-3">
              <ConsultantInfoSkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />
              <ConsultantInfoSkeletonBlock className="h-4 w-28" />
            </div>
            <ConsultantInfoSkeletonBlock className="h-5 w-10" />
          </div>
        ))}
      </div>
    </article>
  );
}

export function ConsultantInfoPageSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="در حال دریافت اطلاعات مشاور"
      className="mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-surface-container-low text-on-surface"
      dir="rtl"
      role="status"
    >
      <TopBar
        backTo="/account/dashboard/team"
        centerClassName="px-0"
        reserveStartSpace
        title="اطلاعات مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        <article className="mt-4 rounded-2xl bg-surface-container-lowest p-4">
          <div className="flex items-center gap-4">
            <ConsultantInfoSkeletonBlock className="h-16 w-16 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-3">
              <ConsultantInfoSkeletonBlock className="ml-auto h-5 w-32" />
              <ConsultantInfoSkeletonBlock className="ml-auto h-4 w-24" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <ConsultantInfoSkeletonBlock className="h-10 w-full rounded-xl" />
            <ConsultantInfoSkeletonBlock className="h-10 w-full rounded-xl" />
          </div>
        </article>

        <section className="mt-5 grid gap-4">
          <ConsultantInfoRowsSkeleton rows={2} />
          <ConsultantInfoRowsSkeleton rows={2} />
          <ConsultantInfoRowsSkeleton rows={3} />

          {Array.from({ length: 3 }, (_, index) => (
            <article className="rounded-2xl bg-surface-container-lowest p-4" key={index}>
              <div className="flex items-center justify-between">
                <ConsultantInfoSkeletonBlock className="h-5 w-40" />
                <ConsultantInfoSkeletonBlock className="h-7 w-16" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <ConsultantInfoSkeletonBlock className="h-6 w-12" />
                <ConsultantInfoSkeletonBlock className="h-4 w-36" />
              </div>
              <ConsultantInfoSkeletonBlock className="mx-auto mt-7 h-[180px] w-[180px] rounded-full" />
              <div className="mt-8 grid grid-cols-2 gap-8">
                <ConsultantInfoSkeletonBlock className="h-12 w-full" />
                <ConsultantInfoSkeletonBlock className="h-12 w-full" />
              </div>
            </article>
          ))}

          <article className="rounded-2xl bg-surface-container-lowest p-4">
            <ConsultantInfoSkeletonBlock className="ml-auto h-5 w-40" />
            <ConsultantInfoSkeletonBlock className="mt-7 h-[220px] w-full" />
          </article>
        </section>
      </main>

      <Typography as="span" variant="body" size="medium" weight="regular" className="sr-only">در حال دریافت اطلاعات مشاور...</Typography>
    </section>
  );
}
