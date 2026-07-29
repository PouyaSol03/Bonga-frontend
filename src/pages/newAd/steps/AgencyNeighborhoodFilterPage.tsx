import type { NeighborhoodDto } from "../../../services/neighborhood.service";
import { RadioIndicator } from "../../../components/RadioIndicator";
import { SearchEmptyState } from "../../../components/SearchEmptyState";
import { Typography } from "../../../components/ui/Typography";

function BackIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 12h16m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function getChildName(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";

  const record = value as Record<string, unknown>;
  const name = record.name ?? record.title ?? record.label;
  return typeof name === "string" ? name.trim() : "";
}

function getNeighborhoodDescription(item: NeighborhoodDto) {
  const value = item.sub_neighbors;

  if (Array.isArray(value)) {
    return value.map(getChildName).filter(Boolean).join("، ");
  }

  if (typeof value === "string") {
    return value
      .split(/[،,|]/)
      .map((part) => part.trim())
      .filter(Boolean)
      .join("، ");
  }

  return "";
}

function getNeighborhoodId(item: NeighborhoodDto) {
  return String(item.id ?? item._id ?? "");
}

export function AgencyNeighborhoodFilterPage({
  citySelected,
  isError,
  isLoading,
  items,
  onBack,
  onConfirm,
  onRetry,
  onSearchChange,
  onSelect,
  search,
  selectedId,
}: {
  citySelected: boolean;
  isError: boolean;
  isLoading: boolean;
  items: NeighborhoodDto[];
  onBack: () => void;
  onConfirm: () => void;
  onRetry: () => void;
  onSearchChange: (value: string) => void;
  onSelect: (item: NeighborhoodDto) => void;
  search: string;
  selectedId: string;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white text-[#1a1a1a]" dir="rtl">
      <header className="flex h-[88px] shrink-0 items-center gap-3 bg-[#f0f0f0] px-4">
        <button
          aria-label="بازگشت"
          className="grid h-11 w-9 shrink-0 place-items-center text-[#4d4d4d] active:bg-[#1a1a1a0a]"
          onClick={onBack}
          type="button"
        >
          <BackIcon />
        </button>

        <label className="flex h-12 min-w-0 flex-1 items-center rounded-xl border border-[#808080] bg-white px-4 focus-within:border-[#0048c4] focus-within:outline-3 focus-within:outline-offset-[-3px] focus-within:outline-[#0048c426]">
          <input
            autoFocus
            className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-base leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="جستجو محله"
            type="search"
            value={search}
          />
        </label>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-24 [-webkit-overflow-scrolling:touch]">
        {!citySelected ? (
          <div className="flex min-h-[320px] items-center justify-center px-8 text-center text-sm leading-7 text-[#808080]">
            ابتدا شهر خود را از صفحه خانه انتخاب کنید.
          </div>
        ) : isLoading ? (
          <div className="px-4 py-3">
            {Array.from({ length: 7 }, (_, index) => (
              <div className="flex min-h-[92px] animate-pulse items-center justify-between gap-5 border-b border-[#f0f0f0] py-4" key={index}>
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="mr-auto h-5 w-28 rounded bg-[#f0f0f0]" />
                  <div className="mr-auto h-4 w-4/5 rounded bg-[#f4f4f4]" />
                </div>
                <div className="h-5 w-5 rounded-full bg-[#eeeeee]" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-8 text-center text-sm leading-7 text-[#a43232]">
            دریافت محله‌ها با خطا مواجه شد.
            <button className="mt-3 font-semibold text-[#0048c4]" onClick={onRetry} type="button">
              تلاش دوباره
            </button>
          </div>
        ) : items.length === 0 ? (
          <SearchEmptyState />
        ) : (
          <div className="px-4">
            {items.map((item) => {
              const id = getNeighborhoodId(item);
              const description = getNeighborhoodDescription(item);
              const checked = id === selectedId;

              return (
                <button
                  className="flex min-h-[104px] w-full items-center justify-between gap-5 border-b border-[#f0f0f0] py-4 text-right active:bg-[#fafafa]"
                  key={id}
                  onClick={() => onSelect(item)}
                  type="button"
                >
                  <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1">
                    <strong className="block text-base font-semibold leading-7 text-[#1a1a1a]">{item.name}</strong>
                    {description ? (
                      <Typography as="span" variant="body" size="medium" weight="regular" className="mt-1 block line-clamp-2 text-sm font-normal leading-6 text-[#a6a6a6]">
                        {description}
                      </Typography>
                    ) : null}
                  </Typography>
                  <RadioIndicator checked={checked} />
                </button>
              );
            })}
          </div>
        )}
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-20 flex h-[76px] items-center border-t border-[#eeeeee] bg-white px-4">
        <button
          className="h-12 w-full rounded-xl bg-[#0048c4] text-base font-semibold text-white active:bg-[#003fae] disabled:bg-[#e3e3e3] disabled:text-[#b3b3b3]"
          disabled={!selectedId}
          onClick={onConfirm}
          type="button"
        >
          تایید
        </button>
      </footer>
    </div>
  );
}
