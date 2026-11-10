import { PageFrame } from "../../../shared/layout/PageFrame";
import { NotFoundErrorState, RequestErrorState } from "../../../shared/components/ErrorState";
import { ViewAdTopBar } from "./viewAdComponents";
import { Typography } from "../../../shared/ui/Typography";

export function NotFoundState({ onBack }: { onBack?: () => void } = {}) {
  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar actionIcons={[]} backTo="/home" onBack={onBack} />
      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto">
        <NotFoundErrorState />
      </main>
    </PageFrame>
  );
}

export function LoadingState({ onBack }: { onBack?: () => void } = {}) {
  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar actionIcons={[]} backTo="/home" onBack={onBack} />
      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <ViewAdPageSkeleton />
      </main>
    </PageFrame>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`bg-surface-container-high rounded-lg ${className}`} />;
}

function ViewAdPageSkeleton() {
  return (
    <>
      <section className="bg-surface-container-lowest px-4 pt-4 pb-4">
        <SkeletonBlock className="aspect-[328/219] w-full rounded-2xl" />
        <div className="mt-4 flex items-center justify-between">
          <SkeletonBlock className="h-5 w-20" />
          <SkeletonBlock className="h-5 w-28" />
        </div>
        <div className="mt-4 space-y-2">
          <SkeletonBlock className="ml-auto h-5 w-44" />
          <SkeletonBlock className="ml-auto h-6 w-64 max-w-full" />
        </div>
        <div className="mt-4 space-y-2">
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-14 w-full" />
        </div>
      </section>
      <ViewAdSectionSkeleton rows={4} />
      <ViewAdSectionSkeleton rows={6} />
      <section className="border-surface-container bg-surface-container-lowest border-t-8 px-4 py-4">
        <SkeletonBlock className="ml-auto h-5 w-24" />
        <div className="mt-6 space-y-3">
          <SkeletonBlock className="ml-auto h-4 w-full" />
          <SkeletonBlock className="ml-auto h-4 w-11/12" />
          <SkeletonBlock className="ml-auto h-4 w-9/12" />
        </div>
      </section>
    </>
  );
}

function ViewAdSectionSkeleton({ rows }: { rows: number }) {
  return (
    <section className="border-surface-container bg-surface-container-lowest border-t-8 px-4 py-4">
      <SkeletonBlock className="ml-auto h-5 w-28" />
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6">
        {Array.from({ length: rows }).map((_, index) => (
          <div className="flex items-start gap-3" key={index}>
            <SkeletonBlock className="h-6 w-6 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBlock className="h-5 w-full" />
              <SkeletonBlock className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ViewAdErrorState({
  error,
  message,
  onRetry,
}: {
  error?: unknown;
  message: string;
  onRetry?: () => void;
}) {
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="bg-surface-container-lowest fixed inset-0 z-[999]">
      <div className="bg-surface-container-lowest h-full min-h-0">
        <RequestErrorState error={error} className="h-full" onRetry={onRetry ?? reloadPage} />
        <Typography as="p" variant="body" size="medium" weight="regular" className="sr-only">
          {message}
        </Typography>
      </div>
    </div>
  );
}
