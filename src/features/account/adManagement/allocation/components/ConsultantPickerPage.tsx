import { useState } from "react";
import { Button } from "../../../../../shared/ui/Button";
import { RadioIndicator } from "../../../../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../../../../shared/components/SearchEmptyState";
import { SearchInputBar } from "../../../../../shared/ui/SearchBar";
import { TopBar } from "../../../../../shared/components/TopBar";
import { Typography } from "../../../../../shared/ui/Typography";
import type { SelectableConsultant } from "../types";
import { ConsultantAvatar } from "./PublisherOptionCard";

export function ConsultantPickerPage({
  consultants,
  isError,
  isLoading,
  onClose,
  onConfirm,
  onRetry,
  selectedConsultant,
}: {
  consultants: SelectableConsultant[];
  isError: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (consultant: SelectableConsultant) => void;
  onRetry: () => void;
  selectedConsultant: SelectableConsultant | null;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [draftConsultantId, setDraftConsultantId] = useState<string | null>(
    selectedConsultant?.id ?? consultants[0]?.id ?? null,
  );
  const normalizedSearch = searchValue.trim();
  const visibleConsultants = normalizedSearch
    ? consultants.filter((consultant) => consultant.name.includes(normalizedSearch))
    : consultants;
  const draftConsultant =
    consultants.find((consultant) => consultant.id === draftConsultantId) ?? null;

  return (
    <section
      aria-label="انتخاب مشاور"
      aria-modal="true"
      className="bg-surface-container-lowest text-on-surface fixed inset-y-0 left-1/2 z-[1200] flex w-full max-w-[500px] -translate-x-1/2 flex-col overflow-hidden [direction:rtl]"
      role="dialog"
    >
      <TopBar
        placement="inline"
        centerClassName="px-0"
        className="bg-surface-container"
        onBack={onClose}
        reserveStartSpace
        title="انتخاب مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto px-4 pt-3 pb-24">
        <SearchInputBar
          compact
          containerClassName="border-outline"
          debounceMs={300}
          onClear={() => setSearchValue("")}
          onDebouncedChange={setSearchValue}
          onValueChange={setSearchValue}
          placeholder="جستجوی مشاور"
          value={searchValue}
        />

        <div className="mt-6 grid gap-6">
          {isLoading ? (
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-outline py-10 text-center text-sm"
            >
              در حال دریافت مشاوران...
            </Typography>
          ) : isError ? (
            <div className="text-outline py-8 text-center text-sm leading-6">
              دریافت فهرست مشاوران با خطا مواجه شد.
              <Button
                unstyled
                className="text-primary mt-3 block w-full font-semibold"
                onClick={onRetry}
                type="button"
              >
                تلاش دوباره
              </Button>
            </div>
          ) : visibleConsultants.length === 0 ? (
            <SearchEmptyState />
          ) : (
            visibleConsultants.map((consultant) => {
              const selected = draftConsultantId === consultant.id;

              return (
                <Button
                  unstyled
                  aria-checked={selected}
                  className="bg-surface-container-lowest active:bg-surface-container flex w-full items-center justify-between gap-3 rounded-lg px-6 text-right [direction:ltr]"
                  key={consultant.id}
                  onClick={() => setDraftConsultantId(consultant.id)}
                  role="radio"
                  type="button"
                >
                  <RadioIndicator checked={selected} />
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="flex flex-1 items-center gap-3 [direction:rtl]"
                  >
                    <ConsultantAvatar consultant={consultant} className="h-14 w-14" />
                    <Typography
                      as="span"
                      variant="body"
                      size="medium"
                      weight="regular"
                      className="text-on-surface leading-5"
                    >
                      {consultant.name}
                    </Typography>
                  </Typography>
                </Button>
              );
            })
          )}
        </div>
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Button
          unstyled
          className={`inline-flex h-10 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium ${
            draftConsultant
              ? "bg-primary text-on-primary"
              : "bg-surface-container-high text-outline"
          }`}
          disabled={!draftConsultant}
          onClick={() => {
            if (draftConsultant) onConfirm(draftConsultant);
          }}
          type="button"
        >
          انتخاب و پرداخت
        </Button>
      </footer>
    </section>
  );
}
