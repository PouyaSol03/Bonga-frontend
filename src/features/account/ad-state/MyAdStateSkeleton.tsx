import { TopBar } from "../../../shared/components/TopBar";
import { PageFrame } from "../../../shared/layout/PageFrame";
import "../../advertisements/components/AdCard.css";

export function MyAdStateSkeleton({
  backState,
  backTo,
  onBack,
}: {
  backState?: Record<string, unknown>;
  backTo: string;
  onBack?: () => void;
}) {
  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={backState}
        backTo={backTo}
        className="[&_a]:text-on-surface"
        onBack={onBack}
        title="مدیریت آگهی"
      />

      <main className="bg-surface-container flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <section
          className="bg-surface-container-lowest shrink-0 space-y-3 px-4 pt-4 pb-4"
          aria-label="در حال بارگذاری وضعیت آگهی"
        >
          <div className="animate-skeleton h-8 w-24 rounded-lg" />
          <div className="flex gap-3 [direction:rtl]">
            <div className="animate-skeleton h-[90px] w-[120px] shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2.5">
              <div className="animate-skeleton h-5 w-3/4 rounded-md" />
              <div className="animate-skeleton h-4 w-1/2 rounded-md" />
              <div className="animate-skeleton h-4 w-2/3 rounded-md" />
            </div>
          </div>
          <div className="border-outline-var flex justify-between border-t pt-2">
            <div className="animate-skeleton h-4 w-28 rounded-md" />
            <div className="animate-skeleton h-4 w-20 rounded-md" />
          </div>
        </section>

        <div className="bg-surface-container h-2 shrink-0" aria-hidden="true" />

        <section
          className="bg-surface-container-lowest min-h-[300px] flex-1 space-y-6 p-4"
          aria-label="در حال بارگذاری عملیات آگهی"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="animate-skeleton h-5 w-5 rounded-md" />
                <div className="animate-skeleton h-4 w-28 rounded-md" />
              </div>
              <div className="animate-skeleton h-4 w-4 rounded-md" />
            </div>
          ))}
        </section>
      </main>
    </PageFrame>
  );
}
