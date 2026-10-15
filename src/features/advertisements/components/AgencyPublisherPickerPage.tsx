import { useEffect, useMemo, useState } from "react";

import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { TopBar } from "../../../shared/components/TopBar";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearBuilding2 from "../../../shared/icons/LinearBuilding2";
import LinearUserSolid from "../../../shared/icons/LinearUserSolid";
import { Button } from "../../../shared/ui/Button";
import { SearchInputBar } from "../../../shared/ui/SearchBar";
import { Typography } from "../../../shared/ui/Typography";

export type AgencyPublisherOption = {
  id: string;
  image?: string;
  name: string;
  type: "agency" | "consultant";
};

export function AgencyPublisherAvatar({
  publisher,
  size,
}: {
  publisher: AgencyPublisherOption;
  size: "large" | "small";
}) {
  const sizeClass = size === "large" ? "h-14 w-14" : "h-12 w-12";
  const radiusClass = publisher.type === "agency" ? "rounded-lg" : "rounded-full";

  if (publisher.image) {
    return (
      <img
        alt=""
        className={`${sizeClass} shrink-0 object-cover ${radiusClass}`}
        draggable={false}
        src={publisher.image}
      />
    );
  }

  return (
    <div
      className={`grid ${sizeClass} bg-surface-container text-outline shrink-0 place-items-center ${radiusClass}`}
    >
      {publisher.type === "agency" ? (
        <LinearBuilding2 className="h-6 w-6" />
      ) : (
        <LinearUserSolid className="h-6 w-6" />
      )}
    </div>
  );
}

export function AgencyPublisherPickerPage({
  confirmLabel = "انتقال",
  isLoading = false,
  onBack,
  onConfirm,
  options,
  selectedPublisher,
  title = "تغییر منتشرکننده",
}: {
  confirmLabel?: string;
  isLoading?: boolean;
  onBack: () => void;
  onConfirm: (publisher: AgencyPublisherOption) => void;
  options: AgencyPublisherOption[];
  selectedPublisher?: AgencyPublisherOption;
  title?: string;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [draftPublisherId, setDraftPublisherId] = useState(selectedPublisher?.id ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDraftPublisherId(selectedPublisher?.id ?? "");
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedPublisher]);

  const normalizedSearch = searchValue.trim();
  const visiblePublishers = useMemo(() => {
    if (!normalizedSearch) return options;

    return options.filter((publisher) => publisher.name.includes(normalizedSearch));
  }, [normalizedSearch, options]);

  const draftPublisher =
    options.find((publisher) => publisher.id === draftPublisherId) ?? selectedPublisher;

  return (
    <section
      aria-label={title}
      className="bg-surface-container-lowest text-on-surface fixed inset-y-0 left-1/2 z-[1200] flex w-full max-w-[500px] -translate-x-1/2 flex-col overflow-hidden [direction:rtl]"
    >
      <TopBar
        centerClassName="px-0"
        className="bg-surface-container"
        onBack={onBack}
        placement="inline"
        reserveStartSpace
        title={title}
        titleClassName="text-center text-base font-semibold leading-6"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto px-4 pt-5 pb-28">
        <SearchInputBar
          aria-label="جستجو مشاور"
          containerClassName="rounded-xl border-outline-var"
          inputClassName="text-base leading-6"
          onClear={() => setSearchValue("")}
          onValueChange={setSearchValue}
          placeholder="جستجو مشاور"
          size="default"
          type="search"
          value={searchValue}
        />

        <div className="mt-5" role="radiogroup" aria-label="انتخاب منتشرکننده">
          {isLoading ? (
            <div className="text-outline grid min-h-40 place-items-center text-sm">
              در حال دریافت منتشرکننده‌ها...
            </div>
          ) : visiblePublishers.length === 0 ? (
            <SearchEmptyState />
          ) : (
            visiblePublishers.map((publisher, index) => {
              const selected = draftPublisherId === publisher.id;
              const shouldShowDivider =
                publisher.type === "agency" &&
                visiblePublishers.slice(index + 1).some((item) => item.type === "consultant");

              return (
                <div key={publisher.id}>
                  <Button
                    unstyled
                    aria-checked={selected}
                    className="active:bg-surface-container flex min-h-[76px] w-full items-center justify-between gap-3 px-4 py-2 text-right [direction:ltr]"
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
                      <AgencyPublisherAvatar publisher={publisher} size="large" />
                      <Typography
                        as="span"
                        variant="body"
                        size="large"
                        weight="regular"
                        className="text-on-surface truncate"
                      >
                        {publisher.name}
                      </Typography>
                    </Typography>
                  </Button>

                  {shouldShowDivider ? (
                    <div className="bg-outline-var mx-2 h-px" aria-hidden="true" />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <Button
          unstyled
          className="bg-primary text-on-primary inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl text-base leading-6 font-medium active:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!draftPublisher || isLoading}
          onClick={() => {
            if (draftPublisher) onConfirm(draftPublisher);
          }}
          type="button"
        >
          <Typography as="span" variant="label" size="large" weight="medium">
            {confirmLabel}
          </Typography>
          <LinearArrowLeft1 aria-hidden="true" className="h-5 w-5" />
        </Button>
      </footer>
    </section>
  );
}
