import { Typography } from "../../../../shared/ui/Typography";
import { toFaNumber } from "../paymentPlanHelpers";

export function PricingCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="border-outline-var bg-surface-container-lowest h-[238px] rounded-xl border p-5"
          key={index}
        >
          <div className="bg-surface-container-high mb-8 h-6 w-28 rounded-md" />
          <div className="bg-surface-container-high mb-4 h-4 w-20 rounded-md" />
          <div className="bg-surface-container-high mb-10 h-8 w-36 rounded-md" />
          <div className="bg-surface-container-high mt-auto h-11 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function EmptyPackagesState({ className = "" }: { className?: string }) {
  return (
    <div
      className={`border-outline-var bg-surface-container-low text-on-surface-var mx-auto w-full rounded-xl border border-dashed px-4 py-10 text-center text-sm font-medium ${className}`}
    >
      بسته‌ای برای نمایش وجود ندارد.
    </div>
  );
}

export function MobileDiscountBadge({ discount }: { discount: number }) {
  if (!discount) return null;

  return (
    <Typography
      as="p"
      variant="body"
      size="medium"
      weight="medium"
      className="bg-error/8 text-error rounded-full px-3 py-1"
    >
      {toFaNumber(discount)}٪ تخفیف
    </Typography>
  );
}

export function MobileCheckSealIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 1.4 12.4 3l2.9-.1.8 2.8 2 2-1.3 2.6.4 2.9-2.8 1-1.8 2.2-2.6-1.2-2.6 1.2-1.8-2.2-2.8-1 .4-2.9-1.3-2.6 2-2 .8-2.8 2.9.1L10 1.4Z" />
      <path
        d="m6.2 10 2.4 2.3 5.1-5.2"
        fill="none"
        stroke="var(--surface-container-lowest)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function MobileGiftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 20 20"
    >
      <path d="M3 8h14v3H3V8ZM4.5 11h11v6h-11v-6ZM10 8v9" />
      <path d="M10 8H7.2a2.1 2.1 0 1 1 0-4.2C9.1 3.8 10 8 10 8Zm0 0h2.8a2.1 2.1 0 1 0 0-4.2C10.9 3.8 10 8 10 8Z" />
    </svg>
  );
}
