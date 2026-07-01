import { useEffect, useMemo, useState } from "react";

import { PageFrame } from "../../../app/PageFrame";
import LinearLocation from "../../../components/(icons)/LinearLocation";
import LinearRealestate from "../../../components/(icons)/LinearRealestate";
import { BottomSheet } from "../../../components/BottomSheet";
import { FormChoiceChip } from "../../../components/form/FormControls";
import { RadioIndicator } from "../../../components/RadioIndicator";
import { SelectionCheckIndicator } from "../../../components/SelectionCheckIndicator";
import { SwitchButton } from "../../../components/SwitchButton";
import { TopBar } from "../../../components/TopBar";
import { useNeighborhoodListQuery } from "../../../hooks/neighborhood.hooks";
import { readStoredSelectedCity } from "../../../lib/selectedCityStorage";
import { RouteLink } from "../../../routes/RouteLink";
import type { NeighborhoodDto } from "../../../services/neighborhood.service";
import { ChevronDownIcon, ChevronLeftIcon, SearchIcon } from "./AdManagementIcons";
import {
  adManagementPaths,
  adManagementPropertyGroupsByTransaction,
  adManagementPropertyTypeLabels,
  adManagementPublisherOptions,
  adManagementTransactionOptions,
  getAdManagementRouteState,
  type AdManagementFilters,
  type AdManagementPropertyType,
  type AdManagementSelectedNeighborhood,
  type AdManagementTransaction,
} from "./adManagementData";
import LinearApartment from "../../../components/(icons)/LinearApartment";

const neighborhoodSearchDebounceMs = 250;

const statusOptions = [
  "منتشر شده",
  "منقضی شده",
  "حذف شده",
  "در انتظار پرداخت",
  "معامله موفق",
  "معامله ناموفق",
];

const emptyFilters: AdManagementFilters = {
  neighborhoods: [],
};

function getNeighborhoodId(neighborhood: NeighborhoodDto) {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

function toSelectedNeighborhood(neighborhood: NeighborhoodDto): AdManagementSelectedNeighborhood {
  return {
    id: getNeighborhoodId(neighborhood),
    name: neighborhood.name,
  };
}

function buildFilters({
  neighborhoods,
  propertyType,
  propertyTypes,
  publisher,
  status,
  transaction,
}: AdManagementFilters): AdManagementFilters {
  return {
    neighborhoods,
    propertyType: propertyTypes?.[0] ?? propertyType,
    propertyTypes,
    publisher,
    status,
    transaction,
  };
}

function getInitialPropertyTypes(filters: AdManagementFilters) {
  return filters.propertyTypes ?? (filters.propertyType ? [filters.propertyType] : []);
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}

export function IndependentConsultantAdFilterPage() {
  const routeState = getAdManagementRouteState();
  const tab = routeState.tab ?? "active";
  const initialFilters = routeState.filters ?? emptyFilters;
  const previousOnlyMine = routeState.onlyMine ?? false;
  const [onlyMine, setOnlyMine] = useState(previousOnlyMine);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState(
    initialFilters.neighborhoods,
  );
  const [transaction, setTransaction] = useState(initialFilters.transaction);
  const [propertyTypes, setPropertyTypes] = useState<AdManagementPropertyType[]>(
    getInitialPropertyTypes(initialFilters),
  );
  const [status, setStatus] = useState(initialFilters.status);
  const [publisher, setPublisher] = useState(initialFilters.publisher);
  const [isPropertyTypePickerOpen, setIsPropertyTypePickerOpen] = useState(false);
  const filters = buildFilters({
    neighborhoods: selectedNeighborhoods,
    propertyTypes,
    publisher,
    status,
    transaction,
  });

  const selectTransaction = (nextTransaction: AdManagementTransaction) => {
    const isSelected = transaction === nextTransaction;

    if (isSelected) {
      setTransaction(undefined);
      setPropertyTypes([]);
      return;
    }

    setTransaction(nextTransaction);
    setPropertyTypes([]);
  };

  const confirmPropertyType = (
    nextPropertyTypes: AdManagementPropertyType[],
  ) => {
    setPropertyTypes(nextPropertyTypes);
    setIsPropertyTypePickerOpen(false);
  };

  const resetFilters = () => {
    setOnlyMine(false);
    setSelectedNeighborhoods([]);
    setTransaction(undefined);
    setPropertyTypes([]);
    setStatus(undefined);
    setPublisher(undefined);
  };

  const removePropertyType = (targetPropertyType: AdManagementPropertyType) => {
    setPropertyTypes((current) =>
      current.filter((item) => item !== targetPropertyType),
    );
  };

  if (isPropertyTypePickerOpen && transaction) {
    return (
      <PropertyTypeSelectionScreen
        initialPropertyTypes={propertyTypes}
        transaction={transaction}
        onBack={() => setIsPropertyTypePickerOpen(false)}
        onConfirm={confirmPropertyType}
      />
    );
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ filters: initialFilters, onlyMine: previousOnlyMine, tab }}
        backTo={adManagementPaths.root}
        className="bg-[#f0f0f0]"
        title="فیلتر"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-6 [-webkit-overflow-scrolling:touch]">
        <section className="flex items-center justify-between bg-white p-4" aria-label="نمایش آگهی من">
          <h2 className="m-0 text-base font-medium text-[#1a1a1a]">
            آگهی من
          </h2>
          <SwitchButton
            ariaLabel="نمایش آگهی من"
            checked={onlyMine}
            onChange={setOnlyMine}
          />
        </section>

        <NeighborhoodPickerRow
          onChange={setSelectedNeighborhoods}
          selectedNeighborhoods={selectedNeighborhoods}
        />

        <section className="mt-2 bg-white px-4 pb-4 pt-4" aria-label="نوع معامله">
          <div className="mb-4 flex items-center justify-start gap-2 text-base font-medium leading-6 text-[#1a1a1a]">
            <LinearApartment className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
            <h2 className="m-0">نوع معامله</h2>
          </div>

          <div className="grid grid-cols-3 gap-2" dir="rtl">
            {adManagementTransactionOptions.map((option) => {
              const isSelected = transaction === option.id;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-[#0048c4] bg-[#e6efff] text-[#0048c4]"
                      : "border-[#cccccc] bg-white text-[#1a1a1a]"
                  }`}
                  key={option.id}
                  onClick={() => selectTransaction(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 h-px bg-[#cccccc]" />

          <button
            aria-disabled={!transaction}
            className={`mt-4 flex h-10 w-full items-center justify-between [direction:ltr] ${
              transaction
                ? "active:bg-[#0048c40a]"
                : "cursor-not-allowed"
            }`}
            disabled={!transaction}
            onClick={() => {
              if (!transaction) return;
              setIsPropertyTypePickerOpen(true);
            }}
            type="button"
          >
            <span
              className={`flex min-w-0 items-center gap-1 text-sm font-medium leading-5 ${
                transaction ? "text-[#0048c4]" : "text-[#cccccc]"
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5 shrink-0" />
              <span className="truncate [direction:rtl]">
                {propertyTypes.length
                  ? `${propertyTypes.length} انتخاب`
                  : "انتخاب"}
              </span>
            </span>
            <span
              className={`flex shrink-0 items-center gap-2 text-base font-medium leading-6 [direction:rtl] ${
                transaction ? "text-[#1a1a1a]" : "text-[#cccccc]"
              }`}
            >
              <span>نوع ملک</span>
              <LinearRealestate className="h-6 w-6" />
            </span>
          </button>

          {propertyTypes.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2" dir="rtl">
              {propertyTypes.map((selectedPropertyType) => (
                <FormChoiceChip
                  key={selectedPropertyType}
                  label={adManagementPropertyTypeLabels[selectedPropertyType]}
                  onClick={() => removePropertyType(selectedPropertyType)}
                  removable
                  selected
                />
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-2 space-y-6 bg-white px-4 py-6" aria-label="فیلترهای تکمیلی">
          <SingleSelectField
            indicator="radio"
            label="وضعیت آگهی"
            onChange={setStatus}
            options={statusOptions}
            value={status}
          />
          <PublisherSelectField
            onChange={setPublisher}
            value={publisher}
          />
        </section>
      </main>

      <footer className="shrink-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-4 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <RouteLink
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white no-underline"
            state={{ filters, onlyMine, tab }}
            to={adManagementPaths.root}
          >
            اعمال
          </RouteLink>
          <button
            className="h-10 rounded-lg border border-[#0048c4] bg-white text-sm font-medium leading-5 text-[#0048c4]"
            onClick={resetFilters}
            type="button"
          >
            حذف فیلتر
          </button>
        </div>
      </footer>
    </PageFrame>
  );
}

type PropertyTypeSelectionScreenProps = {
  initialPropertyTypes: AdManagementPropertyType[];
  transaction: AdManagementTransaction;
  onBack: () => void;
  onConfirm: (propertyTypes: AdManagementPropertyType[]) => void;
};

function PropertyTypeSelectionScreen({
  initialPropertyTypes,
  transaction,
  onBack,
  onConfirm,
}: PropertyTypeSelectionScreenProps) {
  const [draftPropertyTypes, setDraftPropertyTypes] =
    useState<AdManagementPropertyType[]>(initialPropertyTypes);

  const togglePropertyType = (nextPropertyType: AdManagementPropertyType) => {
    setDraftPropertyTypes((current) =>
      current.includes(nextPropertyType)
        ? current.filter((item) => item !== nextPropertyType)
        : [...current, nextPropertyType],
    );
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <div className="shrink-0 bg-[#f0f0f0]">
        <TopBar
          centerClassName="px-0"
          className="bg-[#f0f0f0]"
          onBack={onBack}
          title="انتخاب دسته‌بندی"
        />
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pb-0 pt-4">
        {adManagementPropertyGroupsByTransaction[transaction].map((group) => (
          <section key={group.title} className="mb-6 last:mb-0">
            <h2 className="mb-4 border-b border-[#e6e6e6] pb-2 text-right text-base font-medium text-[#808080]">
              {group.title}
            </h2>

            <div className="flex flex-wrap justify-start gap-2" dir="rtl">
              {group.items.map((item) => (
                <FormChoiceChip
                  key={item}
                  label={adManagementPropertyTypeLabels[item]}
                  onClick={() => togglePropertyType(item)}
                  selected={draftPropertyTypes.includes(item)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="shrink-0 bg-white px-4 py-3 shadow-[0_-4px_10px_rgba(26,26,26,0.04)]">
        <button
          className="flex h-11 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!draftPropertyTypes.length}
          onClick={() => {
            if (!draftPropertyTypes.length) return;
            onConfirm(draftPropertyTypes);
          }}
          type="button"
        >
          تایید
        </button>
      </footer>
    </PageFrame>
  );
}

function NeighborhoodPickerRow({
  onChange,
  selectedNeighborhoods,
}: {
  onChange: (neighborhoods: AdManagementSelectedNeighborhood[]) => void;
  selectedNeighborhoods: AdManagementSelectedNeighborhood[];
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), neighborhoodSearchDebounceMs);
  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isPickerOpen && Boolean(cityId),
    page: 1,
    perPage: 100,
    q: debouncedQuery,
  });
  const neighborhoods = neighborhoodsQuery.data ?? [];
  const selectedIds = useMemo(
    () => new Set(selectedNeighborhoods.map((neighborhood) => neighborhood.id)),
    [selectedNeighborhoods],
  );
  const selectionLabel = selectedNeighborhoods.length
    ? `${selectedNeighborhoods.length} انتخاب`
    : "انتخاب";

  const toggleNeighborhood = (neighborhood: NeighborhoodDto) => {
    const selectedNeighborhood = toSelectedNeighborhood(neighborhood);

    onChange(
      selectedIds.has(selectedNeighborhood.id)
        ? selectedNeighborhoods.filter((item) => item.id !== selectedNeighborhood.id)
        : [...selectedNeighborhoods, selectedNeighborhood],
    );
  };

  const removeNeighborhood = (id: string) => {
    onChange(selectedNeighborhoods.filter((item) => item.id !== id));
  };

  return (
    <section className="mt-2 bg-white p-4" aria-label="محله">
      <button
        className="flex w-full items-center justify-between gap-4 text-right [direction:ltr]"
        onClick={() => setIsPickerOpen(true)}
        type="button"
      >
        <span className="flex items-center gap-1 text-sm font-medium text-[#0048c4]">
          <ChevronLeftIcon className="h-5 w-5" />
          <span>{selectionLabel}</span>
        </span>
        <span className="flex items-center gap-2 text-base font-medium text-[#1a1a1a]">
          <span>محله</span>
          <LinearLocation className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
        </span>
      </button>

      {selectedNeighborhoods.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2" dir="rtl">
          {selectedNeighborhoods.map((neighborhood) => (
            <FormChoiceChip
              key={neighborhood.id}
              label={neighborhood.name}
              onClick={() => removeNeighborhood(neighborhood.id)}
              removable
              selected
            />
          ))}
        </div>
      ) : null}

      <BottomSheet
        ariaLabel="انتخاب محله"
        contentClassName="flex min-h-0 flex-1 flex-col"
        heightClassName="h-[min(100dvh,640px)]"
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        panelPaddingClassName="flex flex-col"
        showHandle={false}
        showHeader={false}
      >
        <div className="shrink-0 px-3 pb-2 pt-3">
          <div className="flex h-11 items-center gap-2 [direction:ltr]">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-[#a6a6a6] bg-white px-3 focus-within:border-[#0048c4]" dir="rtl">
              <SearchIcon className="h-5 w-5 shrink-0 text-[#a6a6a6]" />
              <input
                className="h-9 min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جستجو محله"
                type="search"
                value={query}
              />
              {query ? (
                <button
                  aria-label="پاک کردن جستجوی محله"
                  className="grid h-6 w-6 shrink-0 place-items-center text-[#4d4d4d]"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  <ClearCircleIcon />
                </button>
              ) : null}
            </label>

            <button
              aria-label="بازگشت"
              className="grid h-10 w-10 shrink-0 place-items-center text-[#4d4d4d]"
              onClick={() => setIsPickerOpen(false)}
              type="button"
            >
              <ChevronLeftIcon className="h-6 w-6 rotate-180" />
            </button>
          </div>

          {selectedNeighborhoods.length > 0 ? (
            <div className="-mx-3 mt-2 flex gap-2 overflow-x-auto px-3 pb-1 [direction:rtl] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {selectedNeighborhoods.map((neighborhood) => (
                <FormChoiceChip
                  key={neighborhood.id}
                  label={neighborhood.name}
                  onClick={() => removeNeighborhood(neighborhood.id)}
                  removable
                  selected
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-2" dir="rtl">
          {!cityId ? (
            <p className="m-0 px-2 py-3 text-right text-sm font-normal leading-6 text-[#808080]">
              برای انتخاب محله، ابتدا شهر را انتخاب کنید.
            </p>
          ) : neighborhoodsQuery.isLoading ? (
            <NeighborhoodSkeleton />
          ) : neighborhoods.length > 0 ? (
            <div className="space-y-1">
              {neighborhoods.map((neighborhood) => {
                const neighborhoodId = getNeighborhoodId(neighborhood);
                const isSelected = selectedIds.has(neighborhoodId);

                return (
                  <button
                    aria-pressed={isSelected}
                    className="flex min-h-[72px] w-full items-center justify-between gap-4 rounded-[10px] bg-white py-2 pl-3 pr-0 text-right transition-colors active:bg-[#0048c40a] [direction:ltr]"
                    key={neighborhoodId}
                    onClick={() => toggleNeighborhood(neighborhood)}
                    type="button"
                  >
                    <SelectionCheckIndicator checked={isSelected} />
                    <span className="min-w-0 flex-1 [direction:rtl]">
                      <span className="block truncate text-sm font-medium leading-5 text-[#1a1a1a]">
                        {neighborhood.name}
                      </span>
                      <span className="mt-1 block line-clamp-2 text-xs font-normal leading-5 text-[#808080]">
                        {selectedCity?.name ?? "شهر انتخاب‌شده"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="m-0 px-2 py-3 text-right text-sm font-normal leading-6 text-[#808080]">
              محله‌ای با این عبارت پیدا نشد.
            </p>
          )}
        </div>

        <footer className="shrink-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-6px_16px_rgba(26,26,26,0.06)]">
          <button
            className="flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
            onClick={() => setIsPickerOpen(false)}
            type="button"
          >
            تایید
          </button>
        </footer>
      </BottomSheet>
    </section>
  );
}


function PublisherSelectField({
  onChange,
  value,
}: {
  onChange: (value?: string) => void;
  value?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftValue, setDraftValue] = useState<string | undefined>(value);
  const [query, setQuery] = useState("");
  const selectedPublisher = adManagementPublisherOptions.find(
    (publisherOption) => publisherOption.name === value,
  );
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
    onChange(draftValue);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative flex h-14 w-full items-center rounded-xl border border-[#cccccc] bg-white px-4 [direction:ltr]">
        {value ? (
          <span className="absolute -top-2 right-3 bg-white px-1 text-xs font-normal leading-4 text-[#808080] [direction:rtl]">
            نشر دهنده
          </span>
        ) : null}
        {value ? (
          <button
            aria-label="پاک کردن انتخاب نشر دهنده"
            className="grid h-5 w-5 shrink-0 place-items-center text-[#a6a6a6]"
            onClick={() => onChange(undefined)}
            type="button"
          >
            <ClearCircleIcon />
          </button>
        ) : (
          <ChevronDownIcon className="h-5 w-5 shrink-0 text-[#4d4d4d]" />
        )}
        <button
          className="min-w-0 flex-1 truncate pr-3 text-right text-sm font-normal leading-5 [direction:rtl]"
          onClick={openPicker}
          type="button"
        >
          <span className={value ? "text-[#1a1a1a]" : "text-[#a6a6a6]"}>
            {selectedPublisher?.name ?? value ?? "نشر دهنده"}
          </span>
        </button>
      </div>

      {isOpen ? (
        <section
          aria-label="انتخاب نشر دهنده"
          aria-modal="true"
          className="fixed inset-y-0 left-1/2 z-[1100] flex w-full max-w-[500px] -translate-x-1/2 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
          role="dialog"
        >
          <TopBar
            centerClassName="px-0"
            centerSlot={
              <h2 className="m-0 truncate text-center text-base font-semibold leading-6 text-[#1a1a1a]">
                نشر دهنده
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
                نشر دهنده‌ای با این عبارت پیدا نشد.
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

function SingleSelectField({
  indicator = "check",
  label,
  onChange,
  options,
  value,
}: {
  indicator?: "check" | "radio";
  label: string;
  onChange: (value?: string) => void;
  options: string[];
  value?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative flex h-14 w-full items-center rounded-xl border border-[#cccccc] bg-white px-4 [direction:ltr]">
        {value ? (
          <span className="absolute -top-2 right-3 bg-white px-1 text-xs font-normal leading-4 text-[#808080] [direction:rtl]">
            {label}
          </span>
        ) : null}
        {value ? (
          <button
            aria-label="پاک کردن انتخاب"
            className="grid h-5 w-5 shrink-0 place-items-center text-[#a6a6a6]"
            onClick={() => onChange(undefined)}
            type="button"
          >
            <ClearCircleIcon />
          </button>
        ) : (
          <ChevronDownIcon className="h-5 w-5 shrink-0 text-[#4d4d4d]" />
        )}
        <button
          className="min-w-0 flex-1 truncate pr-3 text-right text-sm font-normal leading-5 [direction:rtl]"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <span className={value ? "text-[#1a1a1a]" : "text-[#a6a6a6]"}>
            {value ?? label}
          </span>
        </button>
      </div>

      <BottomSheet
        ariaLabel={label}
        contentClassName="px-4 mb-0 pt-4"
        heightClassName=""
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={label}
      >
        <div className="space-y-2" dir="rtl">
          {options.map((option) => {
            const isSelected = value === option;

            return (
              <button
                aria-pressed={isSelected}
                className={`flex h-12 w-full items-center justify-between rounded-[10px] px-1 text-right text-sm font-normal leading-5 [direction:ltr] ${
                  isSelected ? "text-[#0048c4]" : "text-[#1a1a1a]"
                }`}
                key={option}
                onClick={() => {
                  onChange(isSelected ? undefined : option);
                }}
                type="button"
              >
                {indicator === "radio" ? (
                  <RadioIndicator checked={isSelected} />
                ) : (
                  <SelectionCheckIndicator checked={isSelected} />
                )}
                <span className="min-w-0 flex-1 truncate text-right [direction:rtl]">
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </>
  );
}

function NeighborhoodSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
      <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
      <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
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
