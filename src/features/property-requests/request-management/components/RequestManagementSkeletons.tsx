import { Typography } from "../../../../shared/ui/Typography";

export function CriteriaRequestsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="bg-surface-container space-y-2" aria-label="در حال دریافت درخواست‌ها">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="bg-surface-container-lowest min-h-[148px] overflow-hidden p-4 text-right"
        >
          <div className="flex min-h-7 items-center justify-between gap-3 [direction:ltr]">
            <div className="animate-skeleton h-6 w-12 rounded-lg" />
            <div className="flex items-center gap-2">
              <div className="animate-skeleton h-5 w-32 rounded-md" />
              <div className="animate-skeleton h-5 w-5 rounded-md" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 [direction:rtl]">
            <div className="animate-skeleton h-8 w-20 rounded-[10px]" />
            <div className="animate-skeleton h-8 w-28 rounded-[10px]" />
            <div className="animate-skeleton h-8 w-24 rounded-[10px]" />
            <div className="animate-skeleton h-8 w-32 rounded-[10px]" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function ReceivedRequestsSkeleton() {
  return (
    <div aria-label="در حال بارگذاری درخواست‌های دریافتی" aria-live="polite">
      {Array.from({ length: 3 }, (_, index) => (
        <article
          className="border-surface-container bg-surface-container-lowest border-b-8 px-4 pt-7 pb-6"
          key={index}
        >
          <div className="flex items-start justify-between gap-4 [direction:ltr]">
            <div className="animate-skeleton h-10 w-10 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 [direction:rtl]">
              <div className="flex items-center gap-2">
                <div className="animate-skeleton h-6 w-6 shrink-0 rounded" />
                <div className="animate-skeleton h-6 w-36 rounded" />
                <div className="animate-skeleton h-8 w-16 rounded-[10px]" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="animate-skeleton h-8 w-24 rounded-[9px]" />
                <div className="animate-skeleton h-8 w-32 rounded-[9px]" />
                <div className="animate-skeleton h-8 w-28 rounded-[9px]" />
                <div className="animate-skeleton h-8 w-40 rounded-[9px]" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function EmptyRequestState({
  description,
  title,
  variant,
}: {
  description: string;
  title: string;
  variant: "account" | "default";
}) {
  const isAccount = variant === "account";

  return (
    <section
      className={`bg-surface-container-lowest mx-auto flex w-full flex-col items-center justify-center text-center ${
        isAccount
          ? "min-h-[calc(100dvh-112px)] px-5 pb-10"
          : "min-h-[calc(100dvh-183px)] px-8 pb-16"
      }`}
    >
      <img src="/vectors/NoRequest.svg" className="h-16.5 w-16.5" alt="" aria-hidden="true" />
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0 mt-4 text-base font-semibold"
      >
        {title}
      </Typography>
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 max-w-[320px] text-sm font-normal"
      >
        {description}
      </Typography>
    </section>
  );
}
