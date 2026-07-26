import LinearCancel from "../../../components/(icons)/LinearCancel";
import LinearCancelSmall from "../../../components/(icons)/LinearCancelSmall";

type SearchMapResultsSummaryProps = {
  count: number;
  hasGeofence: boolean;
  isLoading: boolean;
  onRemoveGeofence: () => void;
};

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M6.75 6.75 17.25 17.25M17.25 6.75 6.75 17.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SearchMapResultsSummary({
  count,
  hasGeofence,
  isLoading,
  onRemoveGeofence,
}: SearchMapResultsSummaryProps) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[64px] z-[520] flex items-center justify-center gap-3 px-4"
      aria-live="polite"
      dir="rtl"
    >
      <p className="m-0 min-w-0 rounded-full bg-white/95 px-4 py-1 text-center text-[13px] font-semibold leading-5 text-[#4d4d4d] shadow-[0_4px_14px_rgba(26,26,26,0.13)] backdrop-blur-sm min-[400px]:px-5 min-[400px]:text-sm">
        {isLoading
          ? "در حال دریافت تعداد آگهی‌ها..."
          : `${count.toLocaleString("fa-IR")} آگهی در این محدوده`}
      </p>

      {hasGeofence ? (
        <button
          className="pointer-events-auto flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#0048c4] px-4 py-2 leading-5 text-white shadow-[0_5px_16px_rgba(0,72,196,0.24)] transition-colors hover:bg-[#003da8] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[400px]:gap-2 min-[400px]:px-5 min-[400px]:text-sm"
          type="button"
          onClick={onRemoveGeofence}
        >
          <LinearCancel className="w-4 h-4" />
          <span className="text-xs font-medium">حذف محدوده</span>
        </button>
      ) : null}
    </div>
  );
}
