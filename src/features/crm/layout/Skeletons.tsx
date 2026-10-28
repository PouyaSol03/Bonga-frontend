import { Typography } from "../../../shared/ui/Typography";

export function ListSkeleton({ count }: { count: number }) {
  return (
    <div className="divide-y divide-[#edf0f5]">
      {Array.from({ length: count }).map((_, index) => (
        <div className="flex items-center justify-between gap-4 py-4" key={index}>
          <div className="flex-1 space-y-2">
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="block h-4 w-2/5 animate-pulse rounded-full bg-[#edf0f4]"
            />
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="block h-3 w-1/4 animate-pulse rounded-full bg-[#f1f3f6]"
            />
          </div>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="block h-7 w-20 animate-pulse rounded-full bg-[#edf0f4]"
          />
        </div>
      ))}
    </div>
  );
}

export function FormCardSkeleton() {
  return (
    <div className="h-[320px] animate-pulse rounded-xl border border-[#f0f0f0] bg-white p-4">
      <div className="h-5 w-2/5 rounded-full bg-[#edf0f4]" />
      <div className="mt-3 h-3 w-1/4 rounded-full bg-[#f1f3f6]" />
      <div className="mt-7 space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="h-10 rounded-xl bg-[#f1f3f6]" key={index} />
        ))}
      </div>
    </div>
  );
}
