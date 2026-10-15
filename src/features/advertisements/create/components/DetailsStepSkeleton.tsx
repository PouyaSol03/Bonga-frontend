export function DetailsStepSkeleton({ desktop = false }: { desktop?: boolean }) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" dir="rtl">
      <main
        className={
          desktop
            ? "bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-6 py-5 [&>section]:mx-auto [&>section]:mb-5 [&>section]:max-w-[1120px]"
            : "bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-3"
        }
      >
        <section
          className={
            desktop
              ? "border-outline-var bg-surface-container-lowest rounded-xl border p-4 text-right shadow-[0_6px_20px_rgba(30,50,80,0.04)]"
              : "border-surface-container bg-surface-container-lowest border-b-[10px] p-4 text-right"
          }
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="animate-skeleton h-6 w-6 rounded-full" />
            <div className="animate-skeleton h-5 w-28 rounded-md" />
          </div>
          <div className="animate-skeleton h-12 w-full rounded-xl" />
        </section>

        <section
          className={
            desktop
              ? "border-outline-var bg-surface-container-lowest rounded-xl border p-4 text-right shadow-[0_6px_20px_rgba(30,50,80,0.04)]"
              : "border-surface-container bg-surface-container-lowest border-b-[10px] p-4 text-right"
          }
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="animate-skeleton h-6 w-6 rounded-full" />
            <div className="animate-skeleton h-5 w-32 rounded-md" />
          </div>
          <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            <div className="animate-skeleton h-12 w-full rounded-xl" />
            <div className="animate-skeleton h-12 w-full rounded-xl" />
            <div className="animate-skeleton h-12 w-full rounded-xl" />
            <div className="animate-skeleton h-12 w-full rounded-xl" />
          </div>
        </section>

        <section
          className={
            desktop
              ? "border-outline-var bg-surface-container-lowest rounded-xl border p-4 text-right shadow-[0_6px_20px_rgba(30,50,80,0.04)]"
              : "border-surface-container bg-surface-container-lowest border-b-[10px] p-4 text-right"
          }
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="animate-skeleton h-6 w-6 rounded-full" />
            <div className="animate-skeleton h-5 w-24 rounded-md" />
          </div>
          <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            <div className="animate-skeleton h-12 w-full rounded-xl" />
            <div className="animate-skeleton h-12 w-full rounded-xl" />
          </div>
        </section>

        <section
          className={
            desktop
              ? "border-outline-var bg-surface-container-lowest rounded-xl border p-4 text-right shadow-[0_6px_20px_rgba(30,50,80,0.04)]"
              : "border-surface-container bg-surface-container-lowest border-b-[10px] p-4 text-right"
          }
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="animate-skeleton h-6 w-6 rounded-full" />
            <div className="animate-skeleton h-5 w-20 rounded-md" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-skeleton h-9 w-24 rounded-full" />
            ))}
          </div>
        </section>
      </main>

      <footer
        className={
          desktop
            ? "border-outline-var bg-surface-container-lowest flex shrink-0 justify-end gap-3 border-t px-6 py-4 [direction:ltr]"
            : "bg-surface-container-lowest grid shrink-0 grid-cols-2 gap-3 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_0_rgba(26,26,26,0.08)] [direction:ltr]"
        }
      >
        <div className="animate-skeleton h-11 w-full rounded-xl" />
        <div className="animate-skeleton h-11 w-full rounded-xl" />
      </footer>
    </div>
  );
}
