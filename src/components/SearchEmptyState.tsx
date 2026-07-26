import NoSearchIcon from "../assets/icons/NoSearch.svg";

type SearchEmptyStateProps = {
  className?: string;
  compact?: boolean;
  description?: string;
  title?: string;
};

export function SearchEmptyState({
  className = "",
  compact = false,
  description = "فیلترها یا عبارت جستجو را تغییر دهید و دوباره تلاش کنید.",
  title = "هیچ نتیجه‌ای یافت نشد!",
}: SearchEmptyStateProps) {
  return (
    <div
      className={`flex ${compact ? "min-h-[240px]" : "min-h-[360px]"} w-full flex-col items-center justify-center px-6 text-center ${className}`}
    >
      <img
        alt=""
        aria-hidden="true"
        className="h-[66px] w-[66px] shrink-0 object-contain"
        draggable={false}
        src={NoSearchIcon}
      />
      <h2 className="m-0 mt-4 text-base font-semibold leading-6 text-[#1a1a1a]">
        {title}
      </h2>
      <p className="m-0 mt-2 max-w-[320px] text-sm font-normal leading-6 text-[#4d4d4d]">
        {description}
      </p>
    </div>
  );
}
