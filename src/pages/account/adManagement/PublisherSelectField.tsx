import { useMemo, useState } from "react";

import { TopBar } from "../../../components/TopBar";
import { ChevronLeftIcon, SearchIcon } from "./AdManagementIcons";
import { adManagementPublisherOptions, type AdManagementPublisherOption } from "./adManagementData";
import LinearArrowLeft1 from "../../../components/(icons)/LinearArrowLeft1";

type PublisherSelectFieldProps = {
  buttonLabel?: string;
  onChange: (publisher?: AdManagementPublisherOption) => void;
  value?: string;
};

export function PublisherSelectField({
  buttonLabel = "تغییر منتشر کننده",
  onChange,
  value,
}: PublisherSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftValue, setDraftValue] = useState<string | undefined>(value);
  const [query, setQuery] = useState("");
  const selectedPublisher = adManagementPublisherOptions.find(
    (publisherOption) => publisherOption.name === value,
  ) ?? adManagementPublisherOptions[0];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPublishers = useMemo(
    () =>
      normalizedQuery
        ? adManagementPublisherOptions.filter((publisherOption) =>
            publisherOption.name.toLowerCase().includes(normalizedQuery),
          )
        : adManagementPublisherOptions,
    [normalizedQuery],
  );

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
    onChange(
      adManagementPublisherOptions.find(
        (publisherOption) => publisherOption.name === draftValue,
      ),
    );
    setQuery("");
    setIsOpen(false);
  };

  return (
    <>
      <PublisherCard publisher={selectedPublisher} />

      <button
        className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-[#0048c4] bg-white text-base font-medium leading-6 text-[#0048c4]"
        onClick={openPicker}
        type="button"
      >
        {buttonLabel}
        <LinearArrowLeft1 className="h-5 w-5"/>
      </button>

      {isOpen ? (
        <section
          aria-label="انتخاب منتشر کننده"
          aria-modal="true"
          className="fixed inset-y-0 left-1/2 z-[1100] flex w-full max-w-[500px] -translate-x-1/2 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
          role="dialog"
        >
          <TopBar
            centerClassName="px-0"
            centerSlot={
              <h2 className="m-0 truncate text-center text-base font-semibold leading-6 text-[#1a1a1a]">
                منتشر کننده
              </h2>
            }
            className="bg-[#f0f0f0]"
            onBack={closePicker}
            reserveStartSpace
          />

          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pb-28 pt-4 [-webkit-overflow-scrolling:touch]">
            <label className="flex h-[46px] items-center gap-2 rounded-[10px] border border-[#808080] bg-white px-3 focus-within:border-[#0048c4] [direction:ltr]">
              <SearchIcon className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
              <input
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] [direction:rtl]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جستجو"
                type="search"
                value={query}
              />
              {query ? (
                <button
                  aria-label="پاک کردن جستجو"
                  className="grid h-6 w-6 shrink-0 place-items-center text-[#a6a6a6]"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  <ClearCircleIcon />
                </button>
              ) : null}
            </label>

            {filteredPublishers.length > 0 ? (
              <div className="mt-8 space-y-5">
                {filteredPublishers.map((publisherOption) => {
                  const isSelected = draftValue === publisherOption.name;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`flex min-h-16 w-full items-center gap-5 rounded-xl py-1 pl-4 pr-10 text-right transition-colors active:bg-[#0048c40a] ${
                        isSelected ? "text-[#0048c4]" : "text-[#1a1a1a]"
                      }`}
                      key={publisherOption.id}
                      onClick={() =>
                        setDraftValue(isSelected ? undefined : publisherOption.name)
                      }
                      type="button"
                    >
                      <span
                        className={`grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border bg-white ${
                          isSelected ? "border-[#0048c4]" : "border-[#cccccc]"
                        }`}
                      >
                        <img
                          alt=""
                          className="h-full w-full object-cover"
                          src={publisherOption.image}
                        />
                      </span>
                      <span className="min-w-0 truncate text-base font-normal leading-6">
                        {publisherOption.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="m-0 px-2 py-8 text-center text-sm font-normal leading-6 text-[#808080]">
                منتشر کننده‌ای با این عبارت پیدا نشد.
              </p>
            )}
          </main>

          <footer className="shrink-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
            <button
              className="flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
              onClick={confirmSelection}
              type="button"
            >
              تایید
            </button>
          </footer>
        </section>
      ) : null}
    </>
  );
}

export function PublisherCard({ publisher }: { publisher: AdManagementPublisherOption }) {
  return (
    <div className="flex p-3 items-center justify-end gap-4 rounded-xl bg-[#f0f0f0] [direction:ltr]">
      <span className="py-0.5 text-right [direction:rtl]">
        <strong className="block text-[#4d4d4d]">
          {publisher.name}
        </strong>
        <span className="block text-sm font-normal text-[#808080]">
          مالک
        </span>
      </span>
      <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white">
        <img alt="" className="h-full w-full object-cover" src={publisher.image} />
      </span>
    </div>
  );
}

function ClearCircleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="m7.5 7.5 5 5m0-5-5 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    </svg>
  );
}
