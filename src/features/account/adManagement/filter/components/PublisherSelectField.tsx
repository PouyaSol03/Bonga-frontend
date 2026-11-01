import { useState } from "react";
import { SearchEmptyState } from "../../../../../shared/components/SearchEmptyState";
import { TopBar } from "../../../../../shared/components/TopBar";
import LinearArrowDown1 from "../../../../../shared/icons/LinearArrowDown1";
import LinearRealestate from "../../../../../shared/icons/LinearRealestate";
import { Button } from "../../../../../shared/ui/Button";
import { SearchInputBar } from "../../../../../shared/ui/SearchBar";
import { Typography } from "../../../../../shared/ui/Typography";
import { usePublisherOptions } from "../usePublisherOptions";
import { ClearCircleIcon } from "./FilterIcons";

export function PublisherSelectField({
  onChange,
  value,
}: {
  onChange: (value?: string) => void;
  value?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftValue, setDraftValue] = useState<string | undefined>(value);
  const { filteredPublishers, isLoading, query, selectedPublisher, setQuery } =
    usePublisherOptions(isOpen, value);

  const openPicker = () => {
    setDraftValue(value);
    setQuery("");
    setIsOpen(true);
  };
  const closePicker = () => {
    setDraftValue(value);
    setQuery("");
    setIsOpen(false);
  };
  const confirmSelection = () => {
    onChange(draftValue);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <>
      <div className="border-outline-var bg-surface-container-lowest relative flex h-14 w-full items-center rounded-xl border px-4 [direction:ltr]">
        {value ? (
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className="bg-surface-container-lowest text-outline absolute -top-2 right-3 px-1 text-xs leading-4 font-normal [direction:rtl]"
          >
            نشر دهنده
          </Typography>
        ) : null}
        {value ? (
          <Button
            unstyled
            aria-label="پاک کردن انتخاب نشر دهنده"
            className="text-outline grid h-5 w-5 shrink-0 place-items-center"
            onClick={() => onChange(undefined)}
            type="button"
          >
            <ClearCircleIcon />
          </Button>
        ) : (
          <LinearArrowDown1 className="text-on-surface-var h-5 w-5 shrink-0" />
        )}
        <Button
          unstyled
          className="min-w-0 flex-1 truncate text-right text-sm leading-5 font-normal [direction:rtl]"
          onClick={openPicker}
          type="button"
        >
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className={value ? "text-on-surface" : "text-outline"}
          >
            {selectedPublisher?.name ?? value ?? "نشر دهنده"}
          </Typography>
        </Button>
      </div>

      {isOpen ? (
        <section
          aria-label="انتخاب نشر دهنده"
          aria-modal="true"
          className="bg-surface-container-lowest text-on-surface fixed inset-y-0 left-1/2 z-[1100] flex w-full max-w-[500px] -translate-x-1/2 flex-col overflow-hidden [direction:rtl]"
          role="dialog"
        >
          <TopBar
            placement="inline"
            centerClassName="px-0"
            centerSlot={
              <Typography
                as="h2"
                variant="title"
                size="medium"
                weight="semibold"
                className="text-on-surface m-0 text-right"
              >
                نشر دهنده
              </Typography>
            }
            className="bg-surface-container"
            onBack={closePicker}
            reserveStartSpace
          />

          <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pt-4 pb-28 [-webkit-overflow-scrolling:touch]">
            <SearchInputBar
              containerClassName="border-outline"
              debounceMs={300}
              onClear={() => setQuery("")}
              onDebouncedChange={setQuery}
              onValueChange={setQuery}
              placeholder="جستجو"
              size="compact"
              value={query}
            />

            {filteredPublishers.length > 0 ? (
              <div className="mt-6 space-y-5 px-2">
                {filteredPublishers.map((publisherOption) => {
                  const isSelected = draftValue === publisherOption.name;

                  return (
                    <Button
                      unstyled
                      aria-pressed={isSelected}
                      className={`flex min-h-16 w-full items-center gap-5 rounded-xl px-4 py-2 text-right transition-colors ${
                        isSelected ? "bg-primary-container text-primary" : "text-on-surface"
                      }`}
                      key={publisherOption.id}
                      onClick={() => setDraftValue(isSelected ? undefined : publisherOption.name)}
                      type="button"
                    >
                      <Typography
                        as="span"
                        variant="body"
                        size="large"
                        weight="regular"
                        className="bg-surface-container-lowest grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full"
                      >
                        {publisherOption.image ? (
                          <img
                            alt=""
                            className="h-full w-full object-cover"
                            src={publisherOption.image}
                          />
                        ) : (
                          <LinearRealestate className="text-outline h-7 w-7" />
                        )}
                      </Typography>
                      <Typography
                        as="span"
                        variant="body"
                        size="large"
                        weight="regular"
                        className="min-w-0 truncate text-base leading-6 font-normal"
                      >
                        {publisherOption.name}
                      </Typography>
                    </Button>
                  );
                })}
              </div>
            ) : isLoading ? (
              <Typography
                as="p"
                variant="body"
                size="medium"
                weight="regular"
                className="text-outline m-0 mt-8 text-center"
              >
                در حال دریافت نشر دهنده‌ها...
              </Typography>
            ) : (
              <SearchEmptyState compact />
            )}
          </main>

          <footer className="bg-surface-container-lowest shrink-0 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
            <Button
              unstyled
              className="bg-primary text-on-primary flex h-10 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium"
              onClick={confirmSelection}
              type="button"
            >
              تایید
            </Button>
          </footer>
        </section>
      ) : null}
    </>
  );
}
