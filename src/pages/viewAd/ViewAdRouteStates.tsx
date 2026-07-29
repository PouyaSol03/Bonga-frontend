import { PageFrame } from "../../app/PageFrame";
import { getRequestErrorState, NotFoundErrorState } from "../../components/ErrorState";
import { ViewAdTopBar } from "./viewAdComponents";
import { Typography } from "../../components/ui/Typography";

export function NotFoundState() {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar actionIcons={[]} backTo="/home" />
      <main className="min-h-0 flex-1 overflow-y-auto bg-white">
        <NotFoundErrorState />
      </main>
    </PageFrame>
  );
}

export function LoadingState() {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar actionIcons={[]} backTo="/home" />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <ViewAdPageSkeleton />
      </main>
    </PageFrame>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`rounded-lg bg-[#e8e8e8] ${className}`} />;
}

function ViewAdPageSkeleton() {
  return (
    <>
      <section className="bg-white px-4 pb-4 pt-4">
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
      <section className="border-t-8 border-[#f0f0f0] bg-white px-4 py-4">
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
    <section className="border-t-8 border-[#f0f0f0] bg-white px-4 py-4">
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
  const ErrorState = getRequestErrorState(error);
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-white">
      <div className="h-full min-h-0 bg-white">
        <ErrorState className="h-full" onRetry={onRetry ?? reloadPage} />
        <Typography as="p" variant="body" size="medium" weight="regular" className="sr-only">{message}</Typography>
      </div>
    </div>
  );
}

