import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { BottomSheet } from "../../../shared/components/BottomSheet";
import {
  FormChoiceChip,
  FormSegmentedControl,
  FormTextField,
} from "../../../shared/form/FormControls";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { ChoiceIndicator } from "../../../shared/ui/Choice";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import LinearArrowDown1 from "../../../shared/icons/LinearArrowDown1";
import LinearRuler from "../../../shared/icons/LinearRuler";
import LinearMoney from "../../../shared/icons/LinearMoney";
import { useNeighborhoodListQuery } from "../../../core/hooks/neighborhood.hooks";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { formatBigNumber } from "../../../shared/lib/MoneyHandler";
import { ageOptions, floorOptions, roomOptions } from "../../newAd/data";
import type { NeighborhoodDto } from "../../../core/services/neighborhood.service";
import {
  categoryGroupsByTransaction,
  categoryLabels,
  getAdvertiseFormCode,
  getListingFromFormCode,
  transactionTabs,
  type CategoryKey,
  type TransactionType,
} from "../SearchMapFilterPage";

export type SearchMapQuickFilterId =
  | "category"
  | "neighborhood"
  | "area"
  | "price"
  | "rooms"
  | "floor"
  | "building_age";

type SearchMapQuickFilterBottomSheetProps = {
  filterId: SearchMapQuickFilterId | null;
  isOpen: boolean;
  onApply: (params: URLSearchParams) => void;
  onClose: () => void;
  resultCount: number;
  search: string;
};

const neighborhoodSearchDebounceMs = 250;

function toEnglishDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);

    if (code >= 0x06f0 && code <= 0x06f9) return String(code - 0x06f0);
    if (code >= 0x0660 && code <= 0x0669) return String(code - 0x0660);

    return digit;
  });
}

function toPersianDigits(value: string | number) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

function normalizeNumber(value: string) {
  return toEnglishDigits(value).replace(/[^\d.]/g, "");
}

function formatGroupedNumber(value: string) {
  const normalized = normalizeNumber(value);
  const numericValue = Number(normalized);

  if (!normalized || !Number.isFinite(numericValue)) return "";

  return new Intl.NumberFormat("fa-IR").format(numericValue);
}

function normalizeChoiceValue(value: string) {
  const normalized = toEnglishDigits(value)
    .replace(/‌/g, " ")
    .replace(/سال/g, "")
    .replace(/اتاق/g, "")
    .replace(/طبقه/g, "")
    .replace(/و بیشتر/g, "")
    .replace(/بیشتر از/g, "")
    .replace(/\+/g, "")
    .trim();

  if (normalized === "همکف" || normalized === "بدون") return "0";
  if (normalized === "بدون اتاق") return "0";

  const numericValue = normalized.replace(/[^\d.-]/g, "");

  return numericValue || normalized;
}

function getNeighborhoodId(neighborhood: Pick<NeighborhoodDto, "_id" | "id" | "name">) {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

function getNeighborhoodDescription(neighborhood: NeighborhoodDto) {
  const value = neighborhood.sub_neighbors;

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (!item || typeof item !== "object") return "";

        const record = item as Record<string, unknown>;
        const name = record.name ?? record.title ?? record.label;

        return typeof name === "string" ? name.trim() : "";
      })
      .filter(Boolean)
      .join("، ");
  }

  if (typeof value === "string") {
    return value
      .split(/[،,|]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .join("، ");
  }

  return "";
}

function splitParam(value: string | null) {
  return (value ?? "").split(/[_،,]/).filter(Boolean);
}

function getSheetTitle(filterId: SearchMapQuickFilterId | null) {
  switch (filterId) {
    case "category":
      return "دسته‌بندی";
    case "neighborhood":
      return "محله";
    case "area":
      return "متراژ";
    case "price":
      return "قیمت";
    case "rooms":
      return "تعداد اتاق";
    case "floor":
      return "طبقه";
    case "building_age":
      return "سن ساخت";
    default:
      return "فیلتر";
  }
}

type AreaBound = "minimum" | "maximum";

const quickAreaCustomOptionLabel = "وارد کردن مقدار";
const quickAreaRangeOptions = ["۱۰۰", "۱۱۰", "۱۶۰", "۲۰۰", "۲۵۰"];

function formatAreaValue(value: string) {
  const normalized = normalizeNumber(value);

  return normalized ? toPersianDigits(normalized) : "";
}

function QuickAreaRangeField({
  active,
  inputRef,
  isCustom,
  label,
  onChange,
  onClick,
  value,
}: {
  active: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  isCustom: boolean;
  label: string;
  onChange: (value: string) => void;
  onClick: () => void;
  value: string;
}) {
  const displayedValue = formatAreaValue(value);

  return (
    <div
      className={`min-w-0 flex-1`}
      onClick={() => {
        if (!isCustom) onClick();
      }}
    >
      <FormTextField
        className={`w-full [&_input]:placeholder:text-[#8c8c8c] ${active ? "[&>span]:border-2" : ""}`}
        forceHighlight={active}
        forceLabel={active}
        inputRef={inputRef}
        label={label}
        onChange={
          isCustom
            ? (event) => onChange(normalizeNumber(event.target.value))
            : undefined
        }
        onFocus={() => {
          if (!isCustom) onClick();
        }}
        placeholder={active ? "" : label}
        readOnly={!isCustom}
        trailingSlot={
          <LinearArrowDown1
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 ${active ? "text-[#b8b8b8]" : "text-[#4d4d4d]"}`}
          />
        }
        value={displayedValue}
      />
    </div>
  );
}

export function SearchMapQuickFilterBottomSheet({
  filterId,
  isOpen,
  onApply,
  onClose,
  resultCount,
  search,
}: SearchMapQuickFilterBottomSheetProps) {
  const shouldReduceMotion = useReducedMotion();
  const [transaction, setTransaction] = useState<TransactionType>("sale");
  const [category, setCategory] = useState<CategoryKey | undefined>();
  const [selectedNeighborhoodIds, setSelectedNeighborhoodIds] = useState<string[]>([]);
  const [neighborhoodQuery, setNeighborhoodQuery] = useState("");
  const [debouncedNeighborhoodQuery, setDebouncedNeighborhoodQuery] = useState("");
  const [areaMinimum, setAreaMinimum] = useState("");
  const [areaMaximum, setAreaMaximum] = useState("");
  const [activeAreaBound, setActiveAreaBound] = useState<AreaBound | null>(null);
  const [customAreaBound, setCustomAreaBound] = useState<AreaBound | null>(null);
  const [priceMinimum, setPriceMinimum] = useState("");
  const [priceMaximum, setPriceMaximum] = useState("");
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

  const selectedCity = readStoredSelectedCity();
  const minimumAreaInputRef = useRef<HTMLInputElement>(null);
  const maximumAreaInputRef = useRef<HTMLInputElement>(null);
  const cityId = selectedCity?.id ?? "";
  const isNeighborhoodSheet = isOpen && filterId === "neighborhood";
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isNeighborhoodSheet && Boolean(cityId),
    page: 1,
    perPage: 50,
    q: debouncedNeighborhoodQuery,
  });
  const neighborhoods = neighborhoodsQuery.data ?? [];
  const selectedNeighborhoodSet = useMemo(
    () => new Set(selectedNeighborhoodIds),
    [selectedNeighborhoodIds],
  );

  useEffect(() => {
    if (!isOpen || !filterId) return;

    const params = new URLSearchParams(search);
    const formCode = params.get("form_code") || params.get("from_code") || "";
    const listing = getListingFromFormCode(formCode);

    setTransaction(listing?.transaction ?? "sale");
    setCategory(listing?.category);
    setSelectedNeighborhoodIds(
      splitParam(params.get("neighborhood_id") || params.get("neighborhoods")),
    );
    setNeighborhoodQuery("");
    setDebouncedNeighborhoodQuery("");
    setAreaMinimum(params.get("area_min") ?? "");
    setAreaMaximum(params.get("area_max") ?? "");
    setActiveAreaBound(null);
    setCustomAreaBound(null);
    setPriceMinimum(params.get("price_min") ?? "");
    setPriceMaximum(params.get("price_max") ?? "");

    if (filterId === "rooms") {
      setSelectedChoices(splitParam(params.get("rooms")));
    } else if (filterId === "floor") {
      setSelectedChoices(splitParam(params.get("floor")));
    } else if (filterId === "building_age") {
      setSelectedChoices(params.get("building_age") ? [params.get("building_age") as string] : []);
    } else {
      setSelectedChoices([]);
    }
  }, [filterId, isOpen, search]);

  useEffect(() => {
    if (filterId !== "area" || !activeAreaBound || customAreaBound !== activeAreaBound) return;

    const input = activeAreaBound === "minimum" ? minimumAreaInputRef.current : maximumAreaInputRef.current;
    const timer = window.setTimeout(() => input?.focus(), 0);

    return () => window.clearTimeout(timer);
  }, [activeAreaBound, customAreaBound, filterId]);

  useEffect(() => {
    if (!isNeighborhoodSheet) return;

    const timer = window.setTimeout(
      () => setDebouncedNeighborhoodQuery(neighborhoodQuery.trim()),
      neighborhoodSearchDebounceMs,
    );

    return () => window.clearTimeout(timer);
  }, [isNeighborhoodSheet, neighborhoodQuery]);

  const applyCurrentFilter = () => {
    if (!filterId) return;

    const params = new URLSearchParams(search);
    params.delete("focus");

    switch (filterId) {
      case "category": {
        const formCode = category ? getAdvertiseFormCode(transaction, category) : "";

        if (formCode) {
          params.set("form_code", formCode);
          params.set("from_code", formCode);
        } else {
          params.delete("form_code");
          params.delete("from_code");
        }
        break;
      }
      case "neighborhood": {
        const value = selectedNeighborhoodIds.join("_");

        if (value) {
          params.set("neighborhood_id", value);
          params.set("neighborhoods", value);
        } else {
          params.delete("neighborhood_id");
          params.delete("neighborhoods");
        }
        break;
      }
      case "area":
        areaMinimum ? params.set("area_min", areaMinimum) : params.delete("area_min");
        areaMaximum ? params.set("area_max", areaMaximum) : params.delete("area_max");
        break;
      case "price":
        priceMinimum ? params.set("price_min", priceMinimum) : params.delete("price_min");
        priceMaximum ? params.set("price_max", priceMaximum) : params.delete("price_max");
        break;
      case "rooms": {
        const value = selectedChoices.join("_");
        value ? params.set("rooms", value) : params.delete("rooms");
        break;
      }
      case "floor": {
        const value = selectedChoices.join("_");
        value ? params.set("floor", value) : params.delete("floor");
        break;
      }
      case "building_age":
        selectedChoices[0]
          ? params.set("building_age", selectedChoices[0])
          : params.delete("building_age");
        break;
      default:
        break;
    }

    onApply(params);
    onClose();
  };

  const choiceOptions =
    filterId === "rooms"
      ? roomOptions
      : filterId === "floor"
        ? floorOptions.filter((option) => !option.includes("بیشتر"))
        : filterId === "building_age"
          ? ageOptions
          : [];

  const isAreaSheet = filterId === "area";
  const isAreaValueListOpen = isAreaSheet && activeAreaBound !== null;

  return (
    <BottomSheet
      ariaLabel={getSheetTitle(filterId)}
      className={`flex flex-col ${
        isAreaSheet
          ? "rounded-t-[24px] transition-[height] duration-300 ease-out motion-reduce:transition-none"
          : ""
      }`}
      contentClassName="flex min-h-0 flex-1 flex-col"
      handleClassName={isAreaSheet ? "h-1 w-[56px] rounded-full bg-[#cccccc]" : undefined}
      heightClassName={
        isAreaSheet
          ? isAreaValueListOpen
            ? "h-[min(85svh,681px)]"
            : "h-[220px]"
          : filterId === "category"
          ? "h-[min(82svh,680px)]"
          : filterId === "neighborhood"
            ? "h-[min(76svh,640px)]"
            : undefined
      }
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      showBackButton={false}
      showHeader={!isAreaSheet}
      showHeaderDivider={!isAreaSheet}
      title={getSheetTitle(filterId)}
      titleIcon={filterId === "price" ? <LinearMoney aria-hidden="true" className="h-6 w-6" /> : undefined}
      variant="form"
    >
      <div
        className={
          isAreaSheet
            ? "min-h-0 flex-1 overflow-hidden px-4 pt-[14px]"
            : "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        }
      >
        {filterId === "category" ? (
          <div className="space-y-5" dir="rtl">
            <FormSegmentedControl
              ariaLabel="نوع معامله"
              onChange={(value) => {
                setTransaction(value);
                setCategory(undefined);
              }}
              options={transactionTabs}
              value={transaction}
            />

            {categoryGroupsByTransaction[transaction].map((group) => (
              <section key={group.title}>
                <Typography
                  as="h3"
                  variant="title"
                  size="medium"
                  weight="medium"
                  className="mb-3 border-b border-[#f0f0f0] pb-2 text-right text-[#808080]"
                >
                  {group.title}
                </Typography>
                <div className="flex flex-wrap justify-start gap-2">
                  {group.items.map((item) => (
                    <FormChoiceChip
                      key={item}
                      label={categoryLabels[item]}
                      onClick={() => setCategory(item)}
                      selected={category === item}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : null}

        {filterId === "neighborhood" ? (
          <div className="flex min-h-full flex-col" dir="rtl">
            <label className="mb-3 flex h-12 shrink-0 items-center rounded-xl border border-[#808080] bg-white px-4 focus-within:border-[#0048c4]">
              <input
                className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] [&::-webkit-search-cancel-button]:hidden"
                onChange={(event) => setNeighborhoodQuery(event.target.value)}
                placeholder="جستجو محله"
                type="search"
                value={neighborhoodQuery}
              />
            </label>

            {selectedNeighborhoodIds.length > 0 ? (
              <div className="mb-3 flex flex-wrap justify-start gap-2">
                {selectedNeighborhoodIds.map((id) => {
                  const neighborhood = neighborhoods.find((item) => getNeighborhoodId(item) === id);

                  return (
                    <FormChoiceChip
                      key={id}
                      label={neighborhood?.name ?? id}
                      onClick={() =>
                        setSelectedNeighborhoodIds((current) => current.filter((item) => item !== id))
                      }
                      removable
                      selected
                    />
                  );
                })}
              </div>
            ) : null}

            {!cityId ? (
              <Typography as="p" variant="body" size="small" weight="regular" className="py-4 text-right text-[#808080]">
                برای انتخاب محله، ابتدا شهر را انتخاب کنید.
              </Typography>
            ) : neighborhoodsQuery.isLoading ? (
              <div>
                {Array.from({ length: 5 }, (_, index) => (
                  <div className="flex min-h-[72px] animate-pulse items-center justify-between gap-5 border-b border-[#f0f0f0] py-3" key={index}>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="mr-auto h-5 w-28 rounded bg-[#f0f0f0]" />
                      <div className="mr-auto h-4 w-3/4 rounded bg-[#f4f4f4]" />
                    </div>
                    <div className="h-[18px] w-[18px] rounded-sm bg-[#eeeeee]" />
                  </div>
                ))}
              </div>
            ) : neighborhoodsQuery.isError ? (
              <div className="flex min-h-52 flex-col items-center justify-center text-center text-sm leading-7 text-[#a43232]">
                دریافت محله‌ها با خطا مواجه شد.
                <Button unstyled className="mt-2 font-semibold text-[#0048c4]" onClick={() => void neighborhoodsQuery.refetch()} type="button">
                  تلاش دوباره
                </Button>
              </div>
            ) : neighborhoods.length > 0 ? (
              <div>
                {neighborhoods.map((neighborhood) => {
                  const id = getNeighborhoodId(neighborhood);
                  const selected = selectedNeighborhoodSet.has(id);
                  const description = getNeighborhoodDescription(neighborhood);

                  return (
                    <Button
                      unstyled
                      aria-pressed={selected}
                      className="flex min-h-[72px] w-full items-center justify-between gap-5 border-b border-[#f0f0f0] bg-white py-3 text-right"
                      key={id}
                      onClick={() =>
                        setSelectedNeighborhoodIds((current) =>
                          current.includes(id)
                            ? current.filter((item) => item !== id)
                            : [...current, id],
                        )
                      }
                      type="button"
                    >
                      <span className="min-w-0 flex-1">
                        <Typography as="span" variant="body" size="medium" weight="regular" className="block text-[#1a1a1a]">
                          {neighborhood.name}
                        </Typography>
                        {description ? (
                          <Typography as="span" variant="body" size="small" weight="regular" className="mt-0.5 block line-clamp-1 text-[#a6a6a6]">
                            {description}
                          </Typography>
                        ) : null}
                      </span>
                      <ChoiceIndicator checked={selected} />
                    </Button>
                  );
                })}
              </div>
            ) : neighborhoodQuery.trim() ? (
              <SearchEmptyState compact />
            ) : (
              <Typography as="p" variant="body" size="small" weight="regular" className="py-4 text-right text-[#808080]">
                محله‌ای برای این شهر ثبت نشده است.
              </Typography>
            )}
          </div>
        ) : null}

        {filterId === "area" ? (
          <div className="flex h-full min-h-0 flex-col" dir="rtl">
            <div className="flex items-center gap-2 text-[#1a1a1a]">
              <LinearRuler aria-hidden="true" className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
              <Typography as="span" variant="title" size="medium" weight="medium">
                متراژ
              </Typography>
              <Typography as="span" variant="label" size="medium" weight="medium" className="text-[#808080]">
                (متر)
              </Typography>
            </div>

            <div className="mt-6 flex min-h-[66px] items-start gap-4">
              <QuickAreaRangeField
                active={activeAreaBound === "minimum"}
                inputRef={minimumAreaInputRef}
                isCustom={customAreaBound === "minimum"}
                label="حداقل"
                onChange={setAreaMinimum}
                onClick={() => {
                  setActiveAreaBound("minimum");
                  setCustomAreaBound(null);
                }}
                value={areaMinimum}
              />
              <QuickAreaRangeField
                active={activeAreaBound === "maximum"}
                inputRef={maximumAreaInputRef}
                isCustom={customAreaBound === "maximum"}
                label="حداکثر"
                onChange={setAreaMaximum}
                onClick={() => {
                  setActiveAreaBound("maximum");
                  setCustomAreaBound(null);
                }}
                value={areaMaximum}
              />
            </div>

            <AnimatePresence initial={false}>
              {activeAreaBound ? (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="mt-4 flex min-h-0 flex-1 flex-col border-t border-[#e5e5e5] pt-[17px]"
                  exit={{ opacity: 0 }}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  key="area-value-list"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.18, ease: "easeOut" }
                  }
                >
                  <Button
                    unstyled
                    className="flex h-[72px] w-full shrink-0 items-center justify-center bg-white px-2 text-center text-[#1a1a1a]"
                    onClick={() => setCustomAreaBound(activeAreaBound)}
                    type="button"
                  >
                    <Typography as="span" variant="body" size="large" weight="regular">
                      {quickAreaCustomOptionLabel}
                    </Typography>
                  </Button>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    {quickAreaRangeOptions.map((option) => {
                      const normalizedOption = normalizeNumber(option);

                      return (
                        <Button
                          unstyled
                          className="flex h-[72px] w-full shrink-0 items-center justify-center bg-white px-2 text-center text-[#1a1a1a]"
                          key={option}
                          onClick={() => {
                            if (activeAreaBound === "minimum") {
                              setAreaMinimum(normalizedOption);
                            } else {
                              setAreaMaximum(normalizedOption);
                            }

                            setCustomAreaBound(null);
                            setActiveAreaBound(null);
                          }}
                          type="button"
                        >
                          <Typography as="span" variant="body" size="medium" weight="regular">
                            {option}
                          </Typography>
                        </Button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ) : null}

        {filterId === "price" ? (
          <div className="space-y-4" dir="rtl">
            <FormTextField
              badge="تومان"
              label="حداقل"
              onChange={(event) => setPriceMinimum(normalizeNumber(event.target.value))}
              onClear={() => setPriceMinimum("")}
              placeholder="حداقل"
              supportingText={priceMinimum ? formatBigNumber(Number(priceMinimum)) : undefined}
              value={formatGroupedNumber(priceMinimum)}
            />
            <FormTextField
              badge="تومان"
              label="حداکثر"
              onChange={(event) => setPriceMaximum(normalizeNumber(event.target.value))}
              onClear={() => setPriceMaximum("")}
              placeholder="حداکثر"
              supportingText={priceMaximum ? formatBigNumber(Number(priceMaximum)) : undefined}
              value={formatGroupedNumber(priceMaximum)}
            />
          </div>
        ) : null}

        {filterId === "rooms" || filterId === "floor" || filterId === "building_age" ? (
          <div className="flex flex-wrap justify-start gap-2" dir="rtl">
            {choiceOptions.map((option) => {
              const normalizedOption = normalizeChoiceValue(option);
              const isSelected = selectedChoices.some(
                (value) => normalizeChoiceValue(value) === normalizedOption,
              );

              return (
                <FormChoiceChip
                  key={option}
                  label={option}
                  onClick={() => {
                    if (filterId === "building_age") {
                      setSelectedChoices(isSelected ? [] : [normalizedOption]);
                      return;
                    }

                    setSelectedChoices((current) =>
                      isSelected
                        ? current.filter((value) => normalizeChoiceValue(value) !== normalizedOption)
                        : [...current, normalizedOption],
                    );
                  }}
                  selected={isSelected}
                />
              );
            })}
          </div>
        ) : null}
      </div>

      <footer
        className={`shrink-0 bg-white px-4 ${
          isAreaSheet ? "pb-3 pt-0" : "border-t border-[#f0f0f0] py-3"
        }`}
      >
        <Button
          unstyled
          className="flex h-10 w-full items-center justify-center rounded-[10px] bg-[#0048c4] text-sm font-medium text-white"
          onClick={applyCurrentFilter}
          type="button"
        >
          نمایش {toPersianDigits(resultCount)} آگهی
        </Button>
      </footer>
    </BottomSheet>
  );
}
