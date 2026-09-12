import { getNeighborhoodDescription, type NeighborhoodDto } from "../../../locations/api/neighborhood.service";
import { RadioIndicator } from "../../../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";

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
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-surface-container-lowest text-on-surface" dir="rtl">
      <header className="flex h-[88px] shrink-0 items-center gap-3 bg-surface-container px-4">
        <Button unstyled
          aria-label="بازگشت"
          className="grid h-11 w-9 shrink-0 place-items-center text-on-surface-var active:bg-surface-container-high"
          onClick={onBack}
          type="button"
        >
          <BackIcon />
        </Button>

        <label className="flex h-12 min-w-0 flex-1 items-center rounded-xl border border-outline bg-surface-container-lowest px-4 focus-within:border-primary focus-within:outline-3 focus-within:outline-offset-[-3px] focus-within:outline-primary/20">
          <input
            autoFocus
            className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-base leading-6 text-on-surface outline-none placeholder:text-outline"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="جستجو محله"
            type="search"
            value={search}
          />
        </label>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-24 [-webkit-overflow-scrolling:touch]">
        {!citySelected ? (
          <div className="mx-auto flex min-h-[320px] w-full items-center justify-center px-8 text-center text-sm leading-7 text-outline">
            ابتدا شهر خود را از صفحه خانه انتخاب کنید.
          </div>
        ) : isLoading ? (
          <div className="px-4 py-3">
            {Array.from({ length: 7 }, (_, index) => (
              <div className="flex min-h-[92px] animate-pulse items-center justify-between gap-5 border-b border-outline-var py-4" key={index}>
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="mr-auto h-5 w-28 rounded bg-surface-container" />
                  <div className="mr-auto h-4 w-4/5 rounded bg-surface-container" />
                </div>
                <div className="h-5 w-5 rounded-full bg-surface-container-high" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="mx-auto flex min-h-[320px] w-full flex-col items-center justify-center px-8 text-center text-sm leading-7 text-error">
            دریافت محله‌ها با خطا مواجه شد.
            <Button unstyled className="mt-3 font-semibold text-primary" onClick={onRetry} type="button">
              تلاش دوباره
            </Button>
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
                <Button unstyled
                  className="flex min-h-[104px] w-full items-center justify-between gap-5 border-b border-outline-var py-4 text-right active:bg-surface-container"
                  key={id}
                  onClick={() => onSelect(item)}
                  type="button"
                >
                  <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1">
                    <strong className="block text-base font-semibold leading-7 text-on-surface">{item.name}</strong>
                    {description ? (
                      <Typography as="span" variant="body" size="medium" weight="regular" className="mt-1 block line-clamp-2 text-sm font-normal leading-6 text-outline">
                        {description}
                      </Typography>
                    ) : null}
                  </Typography>
                  <RadioIndicator checked={checked} />
                </Button>
              );
            })}
          </div>
        )}
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-20 flex h-[76px] items-center border-t border-outline-var bg-surface-container-lowest px-4">
        <Button unstyled
          className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-on-primary active:opacity-90 disabled:bg-surface-container-high disabled:text-outline"
          disabled={!selectedId}
          onClick={onConfirm}
          type="button"
        >
          تایید
        </Button>
      </footer>
    </div>
  );
}
