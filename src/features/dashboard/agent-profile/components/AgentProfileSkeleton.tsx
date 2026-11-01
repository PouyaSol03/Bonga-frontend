export function AgentProfileSkeleton({ desktop = false }: { desktop?: boolean }) {
  if (desktop) {
    return (
      <div
        className="animate-pulse space-y-8 [direction:rtl]"
        aria-label="در حال بارگذاری مشخصات مشاور"
      >
        <div className="bg-surface-container-high h-6 w-32 rounded" />
        <div className="mt-7 flex flex-wrap items-end gap-8">
          <div className="bg-surface-container-high h-28 w-28 shrink-0 rounded-full" />
          <div className="max-w-[520px] min-w-[280px] flex-1 space-y-2">
            <div className="bg-surface-container-high h-4 w-20 rounded" />
            <div className="bg-surface-container-high h-12 w-full rounded-xl" />
          </div>
        </div>
        <div className="bg-outline-var h-px" />
        <div className="space-y-4">
          <div className="bg-surface-container-high h-5 w-28 rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-high h-12 w-full rounded-xl" />
            <div className="bg-surface-container-high h-12 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-surface-container-high h-5 w-32 rounded" />
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-container-high h-12 w-full rounded-xl" />
            <div className="bg-surface-container-high h-12 w-full rounded-xl" />
            <div className="bg-surface-container-high h-12 w-full rounded-xl" />
          </div>
        </div>
        <div className="bg-surface-container-high h-14 w-36 rounded-xl" />
      </div>
    );
  }

  return (
    <div
      className="min-h-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto pb-24 [direction:rtl]"
      aria-label="در حال بارگذاری مشخصات مشاور"
    >
      <section className="bg-surface-container-lowest p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="animate-skeleton bg-surface-container-high h-24 w-24 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="animate-skeleton bg-surface-container-high h-4 w-3/4 rounded" />
            <div className="animate-skeleton bg-surface-container-high h-3 w-1/2 rounded" />
          </div>
        </div>
        <div className="mt-4">
          <div className="animate-skeleton bg-surface-container-high h-14 w-full rounded-xl" />
        </div>
      </section>

      <section className="bg-surface-container-lowest space-y-3 p-4">
        <div className="animate-skeleton bg-surface-container-high h-5 w-24 rounded" />
        <div className="animate-skeleton bg-surface-container-high h-14 w-full rounded-xl" />
        <div className="animate-skeleton bg-surface-container-high h-14 w-full rounded-xl" />
      </section>

      <section className="bg-surface-container-lowest space-y-3 p-4">
        <div className="animate-skeleton bg-surface-container-high h-5 w-32 rounded" />
        <div className="animate-skeleton bg-surface-container-high h-14 w-full rounded-xl" />
        <div className="animate-skeleton bg-surface-container-high h-14 w-full rounded-xl" />
        <div className="animate-skeleton bg-surface-container-high h-14 w-full rounded-xl" />
      </section>

      <section className="bg-surface-container-lowest space-y-3 p-4">
        <div className="animate-skeleton bg-surface-container-high h-5 w-28 rounded" />
        <div className="animate-skeleton bg-surface-container-high h-14 w-full rounded-xl" />
      </section>
    </div>
  );
}
