import { useState } from "react";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { TopBar } from "../../../shared/components/TopBar";
import { Button } from "../../../shared/ui/Button";
import { SearchInputBar } from "../../../shared/ui/SearchBar";
import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";
import { PublisherAvatar } from "./PublisherAvatar";
import type { ManagerPublisher } from "./types";

export function ManagerPublisherPickerPage({
  onClose,
  onConfirm,
  options,
  selectedPublisher,
}: {
  onClose: () => void;
  onConfirm: (publisher: ManagerPublisher) => void;
  options: ManagerPublisher[];
  selectedPublisher?: ManagerPublisher;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [draftPublisherId, setDraftPublisherId] = useState(selectedPublisher?.id ?? "");
  const normalizedSearch = searchValue.trim();
  const visiblePublishers = normalizedSearch
    ? options.filter((publisher) => publisher.name.includes(normalizedSearch))
    : options;
  const draftPublisher =
    options.find((publisher) => publisher.id === draftPublisherId) ?? selectedPublisher;

  return (
    <section
      aria-label="تغییر منتشرکننده"
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
        title="تغییر منتشرکننده"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto px-4 pt-3 pb-24">
        <SearchInputBar
          aria-label="جستجوی مشاور"
          containerClassName="rounded-lg border-outline-var"
          inputClassName="text-xs leading-5"
          onClear={() => setSearchValue("")}
          onValueChange={setSearchValue}
          placeholder="جستجوی مشاور"
          size="dense"
          type="search"
          value={searchValue}
        />

        <div className="mt-5 grid gap-2" role="radiogroup" aria-label="انتخاب منتشرکننده">
          {visiblePublishers.length === 0 ? (
            <SearchEmptyState />
          ) : (
            visiblePublishers.map((publisher) => {
              const selected = draftPublisherId === publisher.id;

              return (
                <Button
                  unstyled
                  aria-checked={selected}
                  className="bg-surface-container-lowest active:bg-surface-container flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2 text-right [direction:ltr]"
                  key={publisher.id}
                  onClick={() => setDraftPublisherId(publisher.id)}
                  role="radio"
                  type="button"
                >
                  <RadioIndicator checked={selected} />
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="flex min-w-0 flex-1 items-center gap-3 [direction:rtl]"
                  >
                    <PublisherAvatar publisher={publisher} size="large" />
                    <Typography
                      as="span"
                      variant="body"
                      size="medium"
                      weight="regular"
                      className="text-on-surface"
                    >
                      {publisher.name}
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
          className="bg-primary text-on-primary inline-flex h-10 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium active:opacity-90"
          disabled={!draftPublisher}
          onClick={() => {
            if (draftPublisher) onConfirm(draftPublisher);
          }}
          type="button"
        >
          انتخاب
        </Button>
      </footer>
    </section>
  );
}
