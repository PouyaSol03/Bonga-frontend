import {
  getNeighborhoodDescription,
  type NeighborhoodDto,
} from "../../../locations/api/neighborhood.service";
import { RadioIndicator } from "../../../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { SearchInputBar } from "../../../../shared/ui/SearchBar";
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
    <div
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-1 flex-col overflow-hidden"
      dir="rtl"
    >
      <header className="bg-surface-container flex h-[88px] shrink-0 items-center gap-3 px-4">
        <Button
          unstyled
          aria-label="بازگشت"
          className="text-on-surface-var active:bg-surface-container-high grid h-11 w-9 shrink-0 place-items-center"
          onClick={onBack}
          type="button"
        >
          <BackIcon />
        </Button>

        <SearchInputBar
          autoFocus
          compact
          containerClassName="flex-1 border-outline"
          onClear={() => onSearchChange("")}
          onValueChange={onSearchChange}
          placeholder="جستجو محله"
          showSearchIcon={false}
          value={search}
        />
      </header>

      <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-24 [-webkit-overflow-scrolling:touch]">
        {!citySelected ? (
          <div className="text-outline mx-auto flex min-h-[320px] w-full items-center justify-center px-8 text-center text-sm leading-7">
            ابتدا شهر خود را از صفحه خانه انتخاب کنید.
          </div>
        ) : isLoading ? (
          <div className="px-4 py-3">
            {Array.from({ length: 7 }, (_, index) => (
              <div
                className="border-outline-var flex min-h-[92px] animate-pulse items-center justify-between gap-5 border-b py-4"
                key={index}
              >
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="bg-surface-container mr-auto h-5 w-28 rounded" />
                  <div className="bg-surface-container mr-auto h-4 w-4/5 rounded" />
                </div>
                <div className="bg-surface-container-high h-5 w-5 rounded-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-error mx-auto flex min-h-[320px] w-full flex-col items-center justify-center px-8 text-center text-sm leading-7">
            دریافت محله‌ها با خطا مواجه شد.
            <Button
              unstyled
              className="text-primary mt-3 font-semibold"
              onClick={onRetry}
              type="button"
            >
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
                <Button
                  unstyled
                  className="border-outline-var active:bg-surface-container flex min-h-[104px] w-full items-center justify-between gap-5 border-b py-4 text-right"
                  key={id}
                  onClick={() => onSelect(item)}
                  type="button"
                >
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="min-w-0 flex-1"
                  >
                    <strong className="text-on-surface block text-base leading-7 font-semibold">
                      {item.name}
                    </strong>
                    {description ? (
                      <Typography
                        as="span"
                        variant="body"
                        size="medium"
                        weight="regular"
                        className="text-outline mt-1 line-clamp-2 block text-sm leading-6 font-normal"
                      >
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

      <footer className="border-outline-var bg-surface-container-lowest absolute inset-x-0 bottom-0 z-20 flex h-[76px] items-center border-t px-4">
        <Button
          unstyled
          className="bg-primary text-on-primary disabled:bg-surface-container-high disabled:text-outline h-12 w-full rounded-xl text-base font-semibold active:opacity-90"
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
