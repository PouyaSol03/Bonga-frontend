export function SummaryCardsSkeleton() {
  return (
    <div className="animate-pulse space-y-4 [direction:rtl]">
      <div className="bg-surface-container-lowest flex h-20 items-center justify-between rounded-2xl px-4 [direction:ltr]">
        <div className="bg-surface-container-high h-12 w-28 rounded" />
        <div className="bg-surface-container-high h-12 w-12 rounded-full" />
      </div>
      <div className="bg-surface-container-lowest flex h-20 items-center justify-between rounded-2xl px-4 [direction:ltr]">
        <div className="bg-surface-container-high h-7 w-12 rounded" />
        <div className="flex items-center gap-2 [direction:rtl]">
          <div className="bg-surface-container-high h-10 w-10 rounded-2xl" />
          <div className="bg-surface-container-high h-5 w-20 rounded" />
        </div>
      </div>
      <div className="bg-surface-container-lowest flex h-20 items-center justify-between rounded-2xl px-4 [direction:ltr]">
        <div className="bg-surface-container-high h-7 w-12 rounded" />
        <div className="flex items-center gap-2 [direction:rtl]">
          <div className="bg-surface-container-high h-10 w-10 rounded-2xl" />
          <div className="bg-surface-container-high h-5 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}
