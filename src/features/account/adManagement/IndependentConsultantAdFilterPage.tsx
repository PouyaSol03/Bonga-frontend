import { useMemo, useState } from "react";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";

import { PageFrame } from "../../../shared/layout/PageFrame";
import LinearLocation from "../../../shared/icons/LinearLocation";
import LinearRealestate from "../../../shared/icons/LinearRealestate";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { FormChoiceChip } from "../../../shared/form/FormControls";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { SelectionCheckIndicator } from "../../../shared/components/SelectionCheckIndicator";
import { SwitchButton } from "../../../shared/components/SwitchButton";
import { TopBar } from "../../../shared/components/TopBar";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { SearchInputBar } from "../../../shared/ui/SearchBar";
import { useNeighborhoodListQuery } from "../../locations/api/neighborhood.hooks";
import { useAgencyConsultantsQuery } from "../../agencies/api/agency.hooks";
import { useMyAgencyProfileQuery } from "../api/account.hooks";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { Link, useLocation } from "react-router";
import {
  getNeighborhoodHierarchyDescription,
  type NeighborhoodDto,
} from "../../locations/api/neighborhood.service";
import {
  adManagementPaths,
  adManagementPropertyGroupsByTransaction,
  adManagementPropertyTypeLabels,
  adManagementTransactionOptions,
  getAdManagementRouteState,
  type AdManagementFilters,
  type AdManagementPropertyType,
  type AdManagementSelectedNeighborhood,
  type AdManagementTransaction,
} from "./adManagementData";
import LinearApartment from "../../../shared/icons/LinearApartment";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearArrowDown1 from "../../../shared/icons/LinearArrowDown1";

const neighborhoodSearchDebounceMs = 250;

const statusOptions = ["در انتظار", "فعال", "غیر فعال", "نیمه کاره"];

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

export function IndependentConsultantAdFilterPage() {
  const location = useLocation();
  const routeState = useMemo(() => getAdManagementRouteState(location.state), [location.state]);
  const tab = routeState.tab ?? "active";
  const isAssignedTab = tab === "status";
  const initialFilters = routeState.filters ?? emptyFilters;
  const previousOnlyMine = routeState.onlyMine ?? false;
  const [onlyMine, setOnlyMine] = useState(previousOnlyMine);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState(initialFilters.neighborhoods);
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
    publisher: isAssignedTab ? undefined : publisher,
    status: isAssignedTab ? undefined : status,
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

  const confirmPropertyType = (nextPropertyTypes: AdManagementPropertyType[]) => {
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
    setPropertyTypes((current) => current.filter((item) => item !== targetPropertyType));
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
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{
          filters: initialFilters,
          onlyMine: isAssignedTab ? false : previousOnlyMine,
          tab,
        }}
        backTo={adManagementPaths.root}
        className="bg-surface-container"
        title="فیلتر"
      />

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-6 [-webkit-overflow-scrolling:touch]">
        {!isAssignedTab ? (
          <section
            className="bg-surface-container-lowest flex items-center justify-between p-4"
            aria-label="نمایش آگهی من"
          >
            <Typography
              as="h2"
              variant="label"
              size="large"
              weight="medium"
              className="text-on-surface m-0"
            >
              آگهی من
            </Typography>
            <SwitchButton ariaLabel="نمایش آگهی من" checked={onlyMine} onChange={setOnlyMine} />
          </section>
        ) : null}

        <NeighborhoodPickerRow
          onChange={setSelectedNeighborhoods}
          selectedNeighborhoods={selectedNeighborhoods}
        />

        <section
          className="bg-surface-container-lowest mt-2 px-4 pt-4 pb-4"
          aria-label="نوع معامله"
        >
          <div className="text-on-surface mb-4 flex items-center justify-start gap-2 text-base leading-6 font-medium">
            <LinearApartment className="text-on-surface-var h-6 w-6 shrink-0" />
            <Typography as="p" variant="label" size="large" className="m-0">
              نوع معامله
            </Typography>
          </div>

          <div className="grid grid-cols-3 gap-2" dir="rtl">
            {adManagementTransactionOptions.map((option) => {
              const isSelected = transaction === option.id;

              return (
                <Button
                  unstyled
                  aria-pressed={isSelected}
                  className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/16 text-primary"
                      : "border-outline-var bg-surface-container-lowest text-on-surface"
                  }`}
                  key={option.id}
                  onClick={() => selectTransaction(option.id)}
                  type="button"
                  size="x-medium"
                >
                  <Typography variant="label" size="medium" weight="medium">
                    {option.label}
                  </Typography>
                </Button>
              );
            })}
          </div>

          <div className="bg-outline-var mt-4 h-px" />

          <Button
            unstyled
            className="mt-4 flex h-10 w-full items-center justify-between active:bg-primary-container/20 [direction:ltr]"
            onClick={() => {
              if (!transaction) {
                setTransaction("sale");
              }
              setIsPropertyTypePickerOpen(true);
            }}
            type="button"
          >
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="flex min-w-0 items-center gap-1 text-sm leading-5 font-medium text-primary"
            >
              <LinearArrowLeft1 className="text-on-surface-var h-6 w-6" />
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="large"
              weight="medium"
              className="text-on-surface flex shrink-0 items-center gap-2 text-base leading-6 font-medium [direction:rtl]"
            >
              <Typography as="span" variant="label" size="large" weight="medium">
                نوع ملک
              </Typography>
            </Typography>
          </Button>

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

        {!isAssignedTab ? (
          <section
            className="bg-surface-container-lowest mt-2 space-y-6 px-4 py-6"
            aria-label="فیلترهای تکمیلی"
          >
            <SingleSelectField
              indicator="radio"
              label="وضعیت آگهی"
              onChange={setStatus}
              options={statusOptions}
              value={status}
            />
            <PublisherSelectField onChange={setPublisher} value={publisher} />
          </section>
        ) : null}
      </main>

      <footer className="bg-surface-container-lowest shrink-0 px-4 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <Link
            className="bg-primary text-on-primary inline-flex h-10 items-center justify-center rounded-lg text-sm leading-5 font-medium no-underline"
            state={{ filters, onlyMine: isAssignedTab ? false : onlyMine, tab }}
            to={adManagementPaths.root}
          >
            اعمال
          </Link>
          <Button
            unstyled
            className="border-primary bg-surface-container-lowest text-primary h-10 rounded-lg border text-sm leading-5 font-medium"
            onClick={resetFilters}
            type="button"
          >
            حذف فیلتر
          </Button>
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
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden"
      variant="flush"
    >
      <div className="bg-surface-container shrink-0">
        <TopBar
          centerClassName="px-0"
          className="bg-surface-container"
          onBack={onBack}
          title="انتخاب دسته‌بندی"
        />
      </div>

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-0">
        {adManagementPropertyGroupsByTransaction[transaction].map((group) => (
          <section key={group.title} className="mb-6 last:mb-0">
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="medium"
              className="border-outline-var text-outline mb-4 border-b pb-2 text-right text-base font-medium"
            >
              {group.title}
            </Typography>

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

      <footer className="bg-surface-container-lowest shrink-0 px-4 py-3 shadow-[0_-4px_10px_rgba(26,26,26,0.04)]">
        <Button
          unstyled
          className="bg-primary text-on-primary flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!draftPropertyTypes.length}
          onClick={() => {
            if (!draftPropertyTypes.length) return;
            onConfirm(draftPropertyTypes);
          }}
          type="button"
        >
          تایید
        </Button>
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
    <section className="bg-surface-container-lowest mt-2 p-4" aria-label="محله">
      <Button
        unstyled
        className="flex w-full items-center justify-between gap-4 text-right [direction:ltr]"
        onClick={() => setIsPickerOpen(true)}
        type="button"
      >
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="text-primary flex items-center gap-1 text-sm font-medium"
        >
          <LinearArrowLeft1 className="h-5 w-5" />
          <Typography as="span" variant="label" size="medium" weight="medium">
            {selectionLabel}
          </Typography>
        </Typography>
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="medium"
          className="text-on-surface flex items-center gap-2 text-base font-medium"
        >
          <Typography as="span" variant="label" size="large" weight="medium">
            محله
          </Typography>
          <LinearLocation className="text-on-surface-var h-6 w-6 shrink-0" />
        </Typography>
      </Button>

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
        <div className="shrink-0 px-3 pt-3 pb-2">
          <div className="flex h-11 items-center gap-2 [direction:ltr]">
            <SearchInputBar
              containerClassName="flex-1 border-outline"
              debounceMs={300}
              onClear={() => setQuery("")}
              onDebouncedChange={setQuery}
              onValueChange={setQuery}
              placeholder="جستجو محله"
              size="dense"
              value={query}
            />

            <Button
              unstyled
              aria-label="بازگشت"
              className="text-on-surface-var grid h-10 w-10 shrink-0 place-items-center"
              onClick={() => setIsPickerOpen(false)}
              type="button"
            >
              <LinearArrowLeft1 className="h-6 w-6 rotate-180" />
            </Button>
          </div>

          {selectedNeighborhoods.length > 0 ? (
            <div className="-mx-3 mt-2 flex [scrollbar-width:none] gap-2 overflow-x-auto px-3 pb-1 [direction:rtl] [&::-webkit-scrollbar]:hidden">
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-2 pb-3" dir="rtl">
          {!cityId ? (
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-outline m-0 mx-auto w-full px-2 py-3 text-center text-sm leading-6 font-normal"
            >
              برای انتخاب محله، ابتدا شهر را انتخاب کنید.
            </Typography>
          ) : neighborhoodsQuery.isLoading ? (
            <NeighborhoodSkeleton />
          ) : neighborhoods.length > 0 ? (
            <div className="space-y-1">
              {neighborhoods.map((neighborhood) => {
                const neighborhoodId = getNeighborhoodId(neighborhood);
                const isSelected = selectedIds.has(neighborhoodId);

                return (
                  <Button
                    unstyled
                    aria-pressed={isSelected}
                    className="bg-surface-container-lowest active:bg-primary-container/20 flex min-h-[72px] w-full items-center justify-between gap-4 rounded-[10px] py-2 pr-0 pl-3 text-right transition-colors [direction:ltr]"
                    key={neighborhoodId}
                    onClick={() => toggleNeighborhood(neighborhood)}
                    type="button"
                  >
                    <SelectionCheckIndicator checked={isSelected} />
                    <Typography
                      as="span"
                      variant="body"
                      size="medium"
                      weight="regular"
                      className="min-w-0 flex-1 [direction:rtl]"
                    >
                      <Typography
                        as="span"
                        variant="label"
                        size="medium"
                        weight="medium"
                        className="text-on-surface block truncate text-sm leading-5 font-medium"
                      >
                        {neighborhood.name}
                      </Typography>
                      <Typography
                        as="span"
                        variant="body"
                        size="small"
                        weight="regular"
                        className="text-outline mt-1 line-clamp-2 block text-xs leading-5 font-normal"
                      >
                        {getNeighborhoodHierarchyDescription(neighborhood) ||
                          selectedCity?.name ||
                          "شهر انتخاب‌شده"}
                      </Typography>
                    </Typography>
                  </Button>
                );
              })}
            </div>
          ) : query.trim() ? (
            <SearchEmptyState compact />
          ) : (
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-outline m-0 mx-auto w-full px-2 py-3 text-center text-sm leading-6 font-normal"
            >
              محله‌ای برای این شهر ثبت نشده است.
            </Typography>
          )}
        </div>

        <footer className="bg-surface-container-lowest shrink-0 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-6px_16px_rgba(26,26,26,0.06)]">
          <Button
            unstyled
            className="bg-primary text-on-primary flex h-10 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium"
            onClick={() => setIsPickerOpen(false)}
            type="button"
          >
            تایید
          </Button>
        </footer>
      </BottomSheet>
    </section>
  );
}

type PublisherFilterOption = {
  id: string;
  image?: string;
  name: string;
  type: "agency" | "consultant";
};

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
  const agencyQuery = useMyAgencyProfileQuery({ enabled: isOpen });
  const consultantsQuery = useAgencyConsultantsQuery({
    enabled: isOpen,
    page: 1,
    perPage: 100,
  });
  const publisherOptions = useMemo<PublisherFilterOption[]>(() => {
    const options: PublisherFilterOption[] = [];
    const agencyName = agencyQuery.data?.name?.trim();

    if (agencyName) {
      options.push({
        id: String(agencyQuery.data?.id ?? agencyQuery.data?._id ?? "agency"),
        image: agencyQuery.data?.logo ?? agencyQuery.data?.img ?? undefined,
        name: agencyName,
        type: "agency",
      });
    }

    (consultantsQuery.data?.data ?? []).forEach((consultant) => {
      if (!consultant.name?.trim()) return;
      const id = String(consultant.agentId ?? consultant.userId);

      options.push({
        id,
        image: consultant.avatar,
        name: consultant.name.trim(),
        type: "consultant",
      });
    });

    return options;
  }, [agencyQuery.data, consultantsQuery.data]);
  const selectedPublisher = publisherOptions.find(
    (publisherOption) => publisherOption.name === value,
  );
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPublishers = useMemo(
    () =>
      normalizedQuery
        ? publisherOptions.filter((publisherOption) =>
            publisherOption.name.toLowerCase().includes(normalizedQuery),
          )
        : publisherOptions,
    [normalizedQuery, publisherOptions],
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
                        className={`bg-surface-container-lowest grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full`}
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
            ) : agencyQuery.isLoading || consultantsQuery.isLoading ? (
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
      <div className="border-outline-var bg-surface-container-lowest relative flex h-14 w-full items-center rounded-xl border px-3 [direction:ltr]">
        {value ? (
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className="bg-surface-container-lowest text-outline absolute -top-2 [direction:rtl]"
          >
            {label}
          </Typography>
        ) : null}
        {value ? (
          <Button
            unstyled
            aria-label="پاک کردن انتخاب"
            className="text-outline grid h-5 w-5 shrink-0 place-items-center"
            onClick={() => onChange(undefined)}
            type="button"
          >
            <ClearCircleIcon />
          </Button>
        ) : (
          <LinearArrowDown1 className="text-on-surface-var h-5 w-5" />
        )}
        <Button
          unstyled
          className="min-w-0 flex-1 truncate text-right text-sm leading-5 font-normal [direction:rtl]"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className={value ? "text-on-surface" : "text-outline"}
          >
            {value ?? label}
          </Typography>
        </Button>
      </div>

      <BottomSheet
        ariaLabel={label}
        contentClassName="px-4 mb-0 pt-4"
        maxHeight="50svh"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={label}
      >
        <div className="space-y-2 pb-6" dir="rtl">
          {options.map((option) => {
            const isSelected = value === option;

            return (
              <Button
                unstyled
                aria-pressed={isSelected}
                className={`flex h-12 w-full items-center justify-between rounded-[10px] px-1 text-right text-sm leading-5 font-normal [direction:ltr] ${
                  isSelected ? "text-primary" : "text-on-surface"
                }`}
                key={option}
                onClick={() => {
                  onChange(isSelected ? undefined : option);
                  setIsOpen(false);
                }}
                type="button"
              >
                {indicator === "radio" ? (
                  <RadioIndicator checked={isSelected} />
                ) : (
                  <SelectionCheckIndicator checked={isSelected} />
                )}
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="min-w-0 flex-1 truncate text-right [direction:rtl]"
                >
                  {option}
                </Typography>
              </Button>
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
      <div className="bg-surface-container h-12 rounded-[10px]" />
      <div className="bg-surface-container h-12 rounded-[10px]" />
      <div className="bg-surface-container h-12 rounded-[10px]" />
    </div>
  );
}

function ClearCircleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="m7.5 7.5 5 5m0-5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}
