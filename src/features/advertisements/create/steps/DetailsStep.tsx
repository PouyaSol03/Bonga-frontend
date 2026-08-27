import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

import { BottomSheet, BottomSheetActionList } from "../../../../shared/components/BottomSheet";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import { ChoiceIndicator } from "../../../../shared/ui/Choice";
import { formatBigNumber } from "../../../../shared/lib/MoneyHandler";
import {
  exchangeTargets,
  facilityItems,
  heatingItems,
  landFacilityItems,
  saleApartmentFacilityItems,
  saleApartmentHeatingItems,
  saleLandFacilityItems,
  saleCommercialFacilityItems,
  saleCommercialHeatingItems,
  saleFactoryFacilityItems,
  saleFactoryHeatingItems,
  saleOfficeFacilityItems,
  saleOfficeHeatingItems,
  saleHotelFacilityItems,
  saleHotelHeatingItems,
  saleVillaHouseFacilityItems,
  saleVillaHouseHeatingItems,
  rentApartmentFacilityItems,
  rentCommercialFacilityItems,
  rentFactoryFacilityItems,
  rentVillaHouseFacilityItems,
  rentOfficeFacilityItems,
  rentHotelFacilityItems,
  rentHeatingItems,
  dailyRentHeatingItems,
  dailyStayFacilityItems,
  dailyHotelFacilityItems,
  dailyWorkspaceFacilityItems,
  elevatorCountOptions,
  projectFacilityItems,
  projectHeatingItems,
  rentConversionPolicyOptions,
  dailyRentalPeriodOptions,
  rentPetPolicyOptions,
  timeOptions,
} from "../data";
import {
  formatUnitsPerFloorLabel,
  getBasicPropertyFields,
  getMoreFeatureFields,
  getParams,
  navigateTo,
} from "../utils";
import type { MoreFeatureFormKey, NewAdFieldErrorKey, NewAdFieldErrors, NewAdFormValues, SelectKey, SheetState } from "../types";
import {
  Chip,
  Footer,
  InputBox,
  LocationBox,
  MoreButton,
  Section,
  SelectBox,
  SwitchButton,
  Tag,
  Toggle,
} from "../components/NewAdControls";
import { CrmTargetOwnerSelect } from "../components/CrmTargetOwnerSelect";
import { RentPriceConversion } from "../components/RentPriceConversion";
import { useNewAdDesktopLayout } from "../NewAdLayoutContext";
import { DailyHotelRoomsSection } from "./dailyHotel/DailyHotelRoomsSection";
import { ProjectSaleTermsFields } from "./project/ProjectSaleTermsFields";
import { ProjectSpecsSection } from "./project/ProjectSpecsSection";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";

function toggleArray(current: string[], id: string) {
  return current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
}

function moneySupportingText(value: string, includeCurrency = true) {
  const number = Number(value.replace(/,/g, ""));

  if (!Number.isFinite(number) || number <= 0) return "";

  const formattedValue = formatBigNumber(number);

  return includeCurrency ? `${formattedValue} تومان` : formattedValue;
}

function formatPersianCount(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function ExchangeCheckIcon({ checked }: { checked: boolean }) {
  return <ChoiceIndicator checked={checked} />;
}

function PriceToggleRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex h-16 items-center justify-between [direction:ltr]">
      <SwitchButton checked={checked} onChange={onChange} />

      <Typography
        as="span"
        variant="label"
        size="large"
        weight="semibold"
        className="text-right text-[#1a1a1a] [direction:rtl]"
      >
        {label}
      </Typography>
    </div>
  );
}

export function DetailsStep({
  errors = {},
  label,
  onClearError,
  onBack,
  onNext,
  onMoreFeatures,
  onProjectDetails,
}: {
  errors?: NewAdFieldErrors;
  label: string;
  onClearError?: (key: NewAdFieldErrorKey) => void;
  onBack?: () => void;
  onNext: () => void;
  onMoreFeatures: () => void;
  onProjectDetails: () => void;
}) {
  const desktop = useNewAdDesktopLayout();
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [showAllHeating, setShowAllHeating] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [showRegisteredMoreFeatures, setShowRegisteredMoreFeatures] = useState(false);
  const isCrm = new URLSearchParams(window.location.search).get("editSource") === "crm";

  const { transaction, category } = getParams();
  const isProject = transaction === "project";
  const isPartnership = isProject && category === "project-partnership";
  const isRent = transaction === "rent";
  const isDailyRent = isRent && category.startsWith("daily-");
  const isDailyHotelRent = isRent && category === "daily-hotel-apartment";
  const isDailyApartmentRent = isRent && category === "daily-apartment-suite";
  const isDailyVillaRent = isRent && category === "daily-garden-villa";
  const isDailyWorkspaceRent = isRent && category === "daily-workspace";
  const isSaleGardenVilla = transaction === "sale" && category === "garden-villa";
  const isSaleApartment = transaction === "sale" && category === "apartment";
  const isSaleVillaHouse = transaction === "sale" && category === "villa-house";
  const isSaleLand = transaction === "sale" && category === "land";
  const isSaleOffice = transaction === "sale" && category === "office";
  const isSaleCommercial = transaction === "sale" && category === "commercial-unit";
  const isSaleFactory = transaction === "sale" && category === "factory-workshop";
  const isSaleHotel = transaction === "sale" && category === "hotel-apartment";
  const isRentApartment = transaction === "rent" && category === "apartment";
  const isRentVillaHouse = transaction === "rent" && category === "villa-house";
  const isRentOffice = transaction === "rent" && category === "office";
  const isRentHotel = transaction === "rent" && category === "hotel-apartment";
  const isRentCommercial = transaction === "rent" && category === "commercial-unit";
  const isRentFactory = transaction === "rent" && category === "factory-workshop";
  const isSaleResidential = transaction === "sale" && ["apartment", "villa-house", "land"].includes(category);
  const isRentResidential = transaction === "rent" && ["apartment", "villa-house", "garden-villa"].includes(category);
  const hideHeatingCooling = isPartnership || category === "land";
  const showFacilitiesSection = !isPartnership;

  const values = watch();
  const moreFeatureFields = getMoreFeatureFields();
  const basicPropertyFields = getBasicPropertyFields();
  const registeredMoreFeatures = moreFeatureFields
    .map((field) => {
      const value = values[field.key];

      if (field.control === "toggle") {
        return value === true ? { key: field.key, label: field.label } : null;
      }

      if (Array.isArray(value) && value.length) {
        const displayValue = value.filter(Boolean).join("، ");
        return displayValue
          ? { key: field.key, label: `${field.label}: ${displayValue}` }
          : null;
      }

      if (typeof value === "string" && value.trim()) {
        const displayValue = field.key === "unitsPerFloor"
          ? formatUnitsPerFloorLabel(value)
          : value;

        if (!displayValue) return null;

        return { key: field.key, label: `${field.label}: ${displayValue}` };
      }

      return null;
    })
    .filter((item): item is { key: MoreFeatureFormKey; label: string } => Boolean(item));
  const initialVisibleMoreFeatureTagCount = 4;
  const hiddenMoreFeatureCount = Math.max(
    registeredMoreFeatures.length - initialVisibleMoreFeatureTagCount,
    0,
  );
  const visibleMoreFeatureTags = showRegisteredMoreFeatures
    ? registeredMoreFeatures
    : registeredMoreFeatures.slice(0, initialVisibleMoreFeatureTagCount);

  const heatingItemsForListing = isProject
    ? projectHeatingItems
    : isSaleApartment
    ? saleApartmentHeatingItems
    : isSaleVillaHouse
      ? saleVillaHouseHeatingItems
      : isSaleOffice
        ? saleOfficeHeatingItems
      : isSaleCommercial
        ? saleCommercialHeatingItems
        : isSaleFactory
          ? saleFactoryHeatingItems
          : isSaleHotel
            ? saleHotelHeatingItems
              : isDailyRent
                ? dailyRentHeatingItems
              : isRentApartment || isRentVillaHouse || isRentOffice || isRentHotel || isRentCommercial || isRentFactory
                ? rentHeatingItems
            : heatingItems;

  const facilityItemsForCategory = useMemo(
    () => {
      if (isProject) return projectFacilityItems;
      if (isSaleApartment) return saleApartmentFacilityItems;
      if (isSaleVillaHouse) return saleVillaHouseFacilityItems;
      if (isSaleLand) return saleLandFacilityItems;
      if (isSaleOffice) return saleOfficeFacilityItems;
      if (isSaleCommercial) return saleCommercialFacilityItems;
      if (isSaleFactory) return saleFactoryFacilityItems;
      if (isSaleHotel) return saleHotelFacilityItems;
      if (isRentApartment) return rentApartmentFacilityItems;
      if (isRentVillaHouse) return rentVillaHouseFacilityItems;
      if (isRentOffice) return rentOfficeFacilityItems;
      if (isRentHotel) return rentHotelFacilityItems;
      if (isRentCommercial) return rentCommercialFacilityItems;
      if (isRentFactory) return rentFactoryFacilityItems;
      if (isDailyApartmentRent || isDailyVillaRent) return dailyStayFacilityItems;
      if (isDailyHotelRent) return dailyHotelFacilityItems;
      if (isDailyWorkspaceRent) return dailyWorkspaceFacilityItems;

      return category === "land" || category === "factory-workshop"
        ? landFacilityItems
        : facilityItems;
    },
    [category, isProject, isDailyApartmentRent, isDailyHotelRent, isDailyVillaRent, isDailyWorkspaceRent, isRentApartment, isRentCommercial, isRentFactory, isRentHotel, isRentOffice, isRentVillaHouse, isSaleApartment, isSaleCommercial, isSaleFactory, isSaleHotel, isSaleLand, isSaleOffice, isSaleVillaHouse],
  );

  const initialVisibleChipCount = 8;
  const visibleHeating = showAllHeating
    ? heatingItemsForListing
    : heatingItemsForListing.slice(0, initialVisibleChipCount);
  const visibleFacilities = showAllFacilities
    ? facilityItemsForCategory
    : facilityItemsForCategory.slice(0, initialVisibleChipCount);

  const setField = <T extends keyof NewAdFormValues>(
    key: T,
    value: NewAdFormValues[T],
  ) => {
    setValue(key as never, value as never, { shouldDirty: true });
    onClearError?.(key);
  };

  const handleFacilityClick = (id: string) => {
    if (id !== "elevator") {
      setField("facilities", toggleArray(values.facilities, id));
      return;
    }

    if (values.facilities.includes("elevator")) {
      setField(
        "facilities",
        values.facilities.filter((facilityId) => facilityId !== "elevator"),
      );
      setField("elevatorCount", "");
      return;
    }

    setSheet({
      kind: "select",
      key: "elevatorCount",
      title: "تعداد آسانسور",
      options: elevatorCountOptions,
    });
  };

  const removeMoreFeature = (key: MoreFeatureFormKey) => {
    const field = moreFeatureFields.find((item) => item.key === key);

    const emptyValue = field?.control === "toggle"
      ? false
      : field?.control === "multiSelect"
        ? []
        : "";

    setValue(key as never, emptyValue as never, {
      shouldDirty: true,
    });
  };

  const openSelectSheet = (key: SelectKey, title: string, options: string[]) => {
    setSheet({
      kind: "select",
      key,
      title,
      options,
    });
  };

  const renderPriceSection = () => {
    if (isPartnership) {
      return (
        <Section icon="money.svg" title="شرایط مشارکت">
          <InputBox
            error={errors.builderSharePercent}
            numeric
            leftText="درصد"
            onChange={(value) => {
              const normalizedPercent = value.replace(/,/g, "");

              if (normalizedPercent === "" || Number(normalizedPercent) <= 100) {
                setField("builderSharePercent", normalizedPercent);
              }
            }}
            placeholder="درصد مشارکت / درصد سهم *"
            value={values.builderSharePercent}
          />
        </Section>
      );
    }

    if (isProject) {
      return (
        <Section icon="money.svg" title="اطلاعات قیمت">
          <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            <InputBox
              error={errors.minPrice}
              formatNumeric
              numeric
              leftText="تومان"
              onChange={(value) => setField("minPrice", value)}
              placeholder="حداقل قیمت متری *"
              supportingText={moneySupportingText(values.minPrice)}
              value={values.minPrice}
            />
            <InputBox
              error={errors.maxPrice}
              formatNumeric
              numeric
              leftText="تومان"
              onChange={(value) => setField("maxPrice", value)}
              placeholder="حداکثر قیمت متری *"
              supportingText={moneySupportingText(values.maxPrice)}
              value={values.maxPrice}
            />
            <ProjectSaleTermsFields errors={errors} values={values} setField={setField} />

            <Toggle
              checked={values.exchangeEnabled}
              label="معاوضه"
              onChange={(checked) => setField("exchangeEnabled", checked)}
            />

            {values.exchangeEnabled ? (
              <div className="rounded-[14px] border border-[#e0e0e0] px-4 py-4">
                <div className="mb-4 flex items-center justify-between text-base font-medium leading-6 [direction:rtl]">
                  <Typography as="span" variant="body" size="medium" weight="regular">معاوضه با</Typography>
                  <Button
                    unstyled
                    className="flex items-center gap-1 text-[#0048c4]"
                    onClick={() => setSheet({ kind: "exchange", title: "معاوضه با", options: exchangeTargets })}
                    type="button"
                  >
                    <Typography as="span" variant="body" size="medium" weight="regular">انتخاب</Typography>
                    <LinearArrowLeft1 aria-hidden="true" className="h-5 w-5" />
                  </Button>
                </div>

                {values.exchangeTargets.length ? (
                  <div className="flex flex-wrap justify-start gap-2" dir="rtl">
                    {values.exchangeTargets.map((target) => (
                      <Tag
                        key={target}
                        label={target}
                        onRemove={() => setField("exchangeTargets", values.exchangeTargets.filter((item) => item !== target))}
                      />
                    ))}
                  </div>
                ) : null}

                {errors.exchangeTargets ? (
                  <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-3 text-right text-xs text-[#ff3b30]">
                    {errors.exchangeTargets}
                  </Typography>
                ) : null}
              </div>
            ) : null}
          </div>
        </Section>
      );
    }

    if (isDailyRent) {
      return (
        <Section icon="money.svg" title="اطلاعات قیمت">
          <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            <InputBox error={errors.minPrice} formatNumeric numeric leftText="تومان" onChange={(value) => setField("minPrice", value)} placeholder="حداقل قیمت *" supportingText={moneySupportingText(values.minPrice)} value={values.minPrice} />
            <InputBox error={errors.maxPrice} formatNumeric numeric leftText="تومان" onChange={(value) => setField("maxPrice", value)} placeholder="حداکثر قیمت *" supportingText={moneySupportingText(values.maxPrice)} value={values.maxPrice} />
          </div>

          <div className="my-5 border-t border-dashed border-[#cccccc]" />

          {isDailyHotelRent ? (
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-right text-sm leading-6 text-[#808080]">
              قیمت روزهای عادی، آخر هفته و روزهای خاص برای هر نوع اتاق در بخش «مشخصات اتاق‌ها» ثبت می‌شود.
            </Typography>
          ) : (
            <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
              <InputBox error={errors.normalDailyPrice} formatNumeric numeric leftText="تومان" onChange={(value) => setField("normalDailyPrice", value)} placeholder="روزهای عادی (شنبه تا چهارشنبه) *" supportingText={moneySupportingText(values.normalDailyPrice)} value={values.normalDailyPrice} />
              <InputBox error={errors.weekendDailyPrice} formatNumeric numeric leftText="تومان" onChange={(value) => setField("weekendDailyPrice", value)} placeholder="آخر هفته (چهار شنبه تا جمعه) *" supportingText={moneySupportingText(values.weekendDailyPrice)} value={values.weekendDailyPrice} />
              <InputBox error={errors.specialDailyPrice} formatNumeric numeric leftText="تومان" onChange={(value) => setField("specialDailyPrice", value)} placeholder="روزهای خاص (تعطیلات و مناسبت ها) *" supportingText={moneySupportingText(values.specialDailyPrice)} value={values.specialDailyPrice} />
              <InputBox error={errors.extraPersonPrice} formatNumeric numeric leftText="تومان" onChange={(value) => setField("extraPersonPrice", value)} placeholder="هزینه هر نفر اضافه" supportingText={moneySupportingText(values.extraPersonPrice)} value={values.extraPersonPrice} />
            </div>
          )}
        </Section>
      );
    }

    if (isRent) {
      return (
        <Section icon="money.svg" title="اطلاعات قیمت">
          <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            <InputBox
              error={errors.mortgagePrice}
              formatNumeric
              numeric
              leftText="تومان"
              onChange={(value) => {
                setField("mortgagePrice", value);
                if (values.rentConversionEnabled) {
                  setField("rentConversionMortgagePrice", value.replace(/,/g, ""));
                }
              }}
              placeholder="رهن *"
              supportingText={moneySupportingText(values.mortgagePrice)}
              value={values.mortgagePrice}
            />
            <InputBox
              error={errors.rentPrice}
              formatNumeric
              numeric
              leftText="تومان"
              onChange={(value) => setField("rentPrice", value)}
              placeholder="اجاره *"
              supportingText={moneySupportingText(values.rentPrice)}
              value={values.rentPrice}
            />
          </div>

          <div className="mt-4">
            <SelectBox
              onClick={() => openSelectSheet("rentConversionPolicy", "تبدیل رهن و اجاره", rentConversionPolicyOptions)}
              placeholder="تبدیل رهن و اجاره"
              value={values.rentConversionPolicy}
            />
          </div>

          <RentPriceConversion
            enabled={values.rentConversionEnabled}
            mortgagePrice={values.mortgagePrice}
            onEnabledChange={(checked) => setField("rentConversionEnabled", checked)}
            onMortgagePriceChange={(value) => setField("mortgagePrice", value)}
            onRentPriceChange={(value) => setField("rentPrice", value)}
            onSelectedMortgageChange={(value) => setField("rentConversionMortgagePrice", value)}
            rentPrice={values.rentPrice}
            selectedMortgagePrice={values.rentConversionMortgagePrice}
          />
        </Section>
      );
    }

    const priceSupportingText = moneySupportingText(values.price);
    const priceHasSupportingText = Boolean(errors.price || priceSupportingText);

    if (desktop) {
      return (
        <Section icon="money.svg" title="اطلاعات قیمت">
          <div className="space-y-2">
            <InputBox
              error={errors.price}
              formatNumeric
              numeric
              leftText="تومان"
              onChange={(value) => setField("price", value)}
              placeholder="قیمت *"
              supportingText={moneySupportingText(values.price)}
              value={values.price}
            />

            {!isSaleGardenVilla ? (
              <>
                <Toggle
                  checked={values.loanEnabled}
                  label="وام دارد"
                  onChange={(checked) => setField("loanEnabled", checked)}
                />

                {values.loanEnabled ? (
                  <div className="space-y-3">
                    <InputBox
                      error={errors.loanAmount}
                      formatNumeric
                      numeric
                      leftText="تومان"
                      onChange={(value) => setField("loanAmount", value)}
                      placeholder="مبلغ وام"
                      supportingText={moneySupportingText(values.loanAmount)}
                      value={values.loanAmount}
                    />

                    <InputBox
                      error={errors.loanInstallment}
                      formatNumeric
                      numeric
                      leftText="تومان"
                      onChange={(value) => setField("loanInstallment", value)}
                      placeholder="قسط وام"
                      supportingText={moneySupportingText(values.loanInstallment)}
                      value={values.loanInstallment}
                    />
                  </div>
                ) : null}
              </>
            ) : null}

            <Toggle
              checked={values.exchangeEnabled}
              label="معاوضه می‌شود"
              onChange={(checked) => setField("exchangeEnabled", checked)}
            />

            {values.exchangeEnabled ? (
              <div className="rounded-[14px] border border-[#e0e0e0] px-4 py-4">
                <div className="mb-4 flex items-center justify-between text-base font-medium leading-6 [direction:rtl]">
                  <Typography as="span" variant="body" size="medium" weight="regular" className="[direction:rtl]">معاوضه با</Typography>

                  <Button
                    unstyled
                    className="flex items-center gap-1 text-[#0048c4]"
                    onClick={() =>
                      setSheet({
                        kind: "exchange",
                        title: "معاوضه با",
                        options: exchangeTargets,
                      })
                    }
                    type="button"
                  >
                    <Typography as="span" variant="body" size="medium" weight="regular">انتخاب</Typography>
                    <LinearArrowLeft1 aria-hidden="true" className="h-5 w-5" />
                  </Button>
                </div>

                {values.exchangeTargets.length ? (
                  <div className="flex flex-wrap justify-start gap-2" dir="rtl">
                    {values.exchangeTargets.map((target) => (
                      <Tag
                        key={target}
                        label={target}
                        onRemove={() =>
                          setField(
                            "exchangeTargets",
                            values.exchangeTargets.filter((item) => item !== target),
                          )
                        }
                      />
                    ))}
                  </div>
                ) : null}
                {errors.exchangeTargets ? (
                  <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-3 text-right text-xs font-normal leading-5 text-[#ff3b30]">
                    {errors.exchangeTargets}
                  </Typography>
                ) : null}
              </div>
            ) : null}
          </div>
        </Section>
      );
    }

    return (
      <Section
        contentClassName={values.exchangeEnabled ? "pt-3 pb-6" : "pt-3 pb-1"}
        icon="money.svg"
        title="اطلاعات قیمت"
      >
        <InputBox
          error={errors.price}
          floatingLabel="قیمت *"
          formatNumeric
          highlightWhenFilled={false}
          numeric
          leftText="تومان"
          onChange={(value) => setField("price", value)}
          placeholder="قیمت *"
          supportingText={priceSupportingText}
          value={values.price}
        />

        {!isSaleGardenVilla ? (
          <>
            <div
              className={`${priceHasSupportingText ? "mt-4" : "mt-5"} border-t border-[#cccccc]`}
            >
              <PriceToggleRow
                checked={values.loanEnabled}
                label="وام دارد"
                onChange={(checked) => setField("loanEnabled", checked)}
              />
            </div>

            {values.loanEnabled ? (
              <div className="mt-3 space-y-4">
                <InputBox
                  error={errors.loanAmount}
                  floatingLabel="مبلغ وام"
                  formatNumeric
                  highlightWhenFilled={false}
                  numeric
                  leftText="تومان"
                  onChange={(value) => setField("loanAmount", value)}
                  placeholder="مبلغ وام"
                  supportingText={moneySupportingText(values.loanAmount)}
                  value={values.loanAmount}
                />

                <InputBox
                  error={errors.loanInstallment}
                  floatingLabel="قسط وام"
                  formatNumeric
                  highlightWhenFilled={false}
                  numeric
                  leftText="تومان"
                  onChange={(value) => setField("loanInstallment", value)}
                  placeholder="قسط وام"
                  supportingText={moneySupportingText(values.loanInstallment)}
                  value={values.loanInstallment}
                />
              </div>
            ) : null}
          </>
        ) : null}

        <div
          className={`${
            isSaleGardenVilla
              ? priceHasSupportingText
                ? "mt-4"
                : "mt-5"
              : values.loanEnabled
                ? "mt-4"
                : ""
          } border-t border-[#cccccc]`}
        >
          <PriceToggleRow
            checked={values.exchangeEnabled}
            label="معاوضه می‌شود"
            onChange={(checked) => setField("exchangeEnabled", checked)}
          />
        </div>

        {values.exchangeEnabled ? (
          <div className="mt-3 rounded-2xl border border-[#f0f0f0] px-4 py-6">
            <div className="mb-4 flex items-center justify-between [direction:rtl]">
              <Typography
                as="span"
                variant="label"
                size="large"
                weight="medium"
                className="text-[#1a1a1a] [direction:rtl]"
              >
                معاوضه با
              </Typography>

              <Button
                unstyled
                className="flex items-center gap-1 text-[#0048c4]"
                onClick={() =>
                  setSheet({
                    kind: "exchange",
                    title: "معاوضه با",
                    options: exchangeTargets,
                  })
                }
                type="button"
              >
                <Typography as="span" variant="label" size="medium" weight="medium">
                  انتخاب
                </Typography>
                <LinearArrowLeft1 aria-hidden="true" className="h-5 w-5" />
              </Button>
            </div>

            {values.exchangeTargets.length ? (
              <div className="flex flex-wrap justify-start gap-2" dir="rtl">
                {values.exchangeTargets.map((target) => (
                  <Tag
                    className="h-9 px-2 py-0"
                    key={target}
                    label={target}
                    onRemove={() =>
                      setField(
                        "exchangeTargets",
                        values.exchangeTargets.filter((item) => item !== target),
                      )
                    }
                  />
                ))}
              </div>
            ) : null}

            {errors.exchangeTargets ? (
              <Typography
                as="p"
                variant="body"
                size="small"
                weight="regular"
                className="m-0 mt-3 text-right text-[#ff3b30]"
              >
                {errors.exchangeTargets}
              </Typography>
            ) : null}
          </div>
        ) : null}
      </Section>
    );
  };

  return (
    <>
      <main className={desktop
        ? "min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f5f7fb] px-6 py-5 [&>section]:mx-auto [&>section]:mb-5 [&>section]:max-w-[1120px]"
        : "min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-3"} dir="rtl">
        <Section icon="location.svg" title={isSaleResidential || isRentResidential ? "موقعیت آگهی" : "موقعیت ملک"}>
          <LocationBox label={label} value={values.location} />
        </Section>

        {isProject ? (
          <ProjectSpecsSection
            errors={errors}
            values={values}
            projectDetailsError={errors.projectDetails}
            setField={setField}
            onOpenSelect={openSelectSheet}
            onOpenProjectDetails={onProjectDetails}
            onOpenMoreFeatures={onMoreFeatures}
          />
        ) : (
          <Section icon="info.svg" title={isDailyVillaRent ? "مشخصات ویلا" : isDailyRent ? "مشخصات آگهی" : isSaleApartment || isRentApartment ? "مشخصات آپارتمان" : isSaleVillaHouse || isRentVillaHouse ? "مشخصات بنا" : isSaleOffice || isRentOffice ? "مشخصات اداری" : isSaleCommercial || isRentCommercial ? "مشخصات تجاری" : isSaleFactory || isSaleHotel || isRentHotel || isRentFactory ? "مشخصات آگهی" : "مشخصات ملک"}>
            <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
              {basicPropertyFields.map((field) => {
                const placeholder = `${field.label}${field.required ? " *" : ""}`;
                const value = values[field.key];

                if (field.control === "input") {
                  return (
                    <InputBox
                      key={field.key}
                      error={errors[field.key]}
                      numeric={field.numeric}
                      leftText={field.leftText}
                      onChange={(nextValue) => setField(field.key, nextValue)}
                      placeholder={placeholder}
                      value={String(value ?? "")}
                    />
                  );
                }

                if (field.control === "multiSelect") {
                  const selectedValues = values.suitableFor;

                  return (
                    <SelectBox
                      key={field.key}
                      error={errors[field.key]}
                      onClear={() => setField("suitableFor", [])}
                      onClick={() =>
                        setSheet({
                          kind: "multiSelect",
                          key: "suitableFor",
                          title: field.label,
                          options: field.options ?? [],
                        })
                      }
                      placeholder={placeholder}
                      value={selectedValues.join("، ")}
                    />
                  );
                }

                return (
                  <SelectBox
                    key={field.key}
                    error={errors[field.key]}
                    onClear={() => setField(field.key, "")}
                    onClick={() =>
                      setSheet({
                        kind: "select",
                        key: field.key as SelectKey,
                        title: field.label,
                        options: field.options ?? [],
                      })
                    }
                    placeholder={placeholder}
                    value={String(value ?? "")}
                  />
                );
              })}

              {isDailyHotelRent ? (
                <>
                  <SelectBox
                    onClear={() => setField("rentalPeriod", "")}
                    onClick={() => openSelectSheet("rentalPeriod", "دوره اجاره", dailyRentalPeriodOptions)}
                    placeholder="دوره اجاره"
                    value={values.rentalPeriod}
                  />
                  <InputBox
                    numeric
                    leftText="روز"
                    onChange={(value) => setField("minStayDays", value)}
                    placeholder="حداقل مدت اقامت"
                    value={values.minStayDays}
                  />
                  <SelectBox
                    onClear={() => setField("checkInTime", "")}
                    onClick={() => openSelectSheet("checkInTime", "ساعت ورود", timeOptions)}
                    placeholder="ساعت ورود"
                    value={values.checkInTime}
                  />
                  <SelectBox
                    onClear={() => setField("checkOutTime", "")}
                    onClick={() => openSelectSheet("checkOutTime", "ساعت خروج", timeOptions)}
                    placeholder="ساعت خروج"
                    value={values.checkOutTime}
                  />
                  <SelectBox
                    onClear={() => setField("petPolicy", "")}
                    onClick={() => openSelectSheet("petPolicy", "حیوان خانگی", rentPetPolicyOptions)}
                    placeholder="حیوان خانگی"
                    value={values.petPolicy}
                  />
                </>
              ) : null}

              {registeredMoreFeatures.length ? (
                <div className="space-y-3 pt-2" dir="rtl">
                  <div className="flex flex-wrap justify-start gap-2">
                    {visibleMoreFeatureTags.map((item) => (
                      <Tag
                        key={item.key}
                        label={item.label}
                        onRemove={() => removeMoreFeature(item.key)}
                      />
                    ))}
                  </div>

                  {hiddenMoreFeatureCount > 0 ? (
                    <Button unstyled
                      className="flex h-8 items-start justify-start gap-1.5 text-sm font-normal leading-5 text-[#808080] active:text-[#0048c4]"
                      onClick={() => setShowRegisteredMoreFeatures((current) => !current)}
                      type="button"
                    >
                      <Typography as="span" variant="body" size="medium" weight="regular">
                        {showRegisteredMoreFeatures
                          ? "نمایش کمتر"
                          : `${formatPersianCount(hiddenMoreFeatureCount)} مشخصات دیگر`}
                      </Typography>
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d={showRegisteredMoreFeatures ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5"}
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </Button>
                  ) : null}

                  <Button unstyled
                    className="mx-auto flex py-2.5 items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4] active:text-[#00379a]"
                    onClick={onMoreFeatures}
                    type="button"
                  >
                    <Typography variant="label" size="medium" weight="medium">ویرایش مشخصات</Typography>
                    <Typography as="span" variant="title" size="large" weight="medium" className="text-lg leading-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M11.2249 6.22456C11.469 5.98048 11.8646 5.98049 12.1087 6.22456C12.3528 6.46864 12.3528 6.86427 12.1087 7.10835L9.21729 9.99979L12.1087 12.8912C12.3528 13.1353 12.3528 13.5309 12.1087 13.775C11.8646 14.0191 11.469 14.0191 11.2249 13.775L7.8916 10.4417C7.77441 10.3245 7.7085 10.1655 7.7085 9.99979C7.70851 9.83405 7.77441 9.67509 7.8916 9.55789L11.2249 6.22456Z" fill="#0048c4" />
                      </svg>
                    </Typography>
                  </Button>
                </div>
              ) : moreFeatureFields.length ? (
                <Button unstyled
                  className="mx-auto py-2.5 flex items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4] active:text-[#00379a]"
                  onClick={onMoreFeatures}
                  type="button"
                >
                  <Typography variant="label" size="medium" weight="medium">ثبت {formatPersianCount(moreFeatureFields.length)} مشخصات دیگر</Typography>
                  <Typography as="span" variant="title" size="large" weight="medium" className="text-lg leading-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M11.2249 6.22456C11.469 5.98048 11.8646 5.98049 12.1087 6.22456C12.3528 6.46864 12.3528 6.86427 12.1087 7.10835L9.21729 9.99979L12.1087 12.8912C12.3528 13.1353 12.3528 13.5309 12.1087 13.775C11.8646 14.0191 11.469 14.0191 11.2249 13.775L7.8916 10.4417C7.77441 10.3245 7.7085 10.1655 7.7085 9.99979C7.70851 9.83405 7.77441 9.67509 7.8916 9.55789L11.2249 6.22456Z" fill="#0048c4" />
                    </svg>
                  </Typography>
                </Button>
              ) : null}
            </div>
          </Section>
        )}

        {isDailyHotelRent ? (
          <Section icon="info.svg" title="مشخصات اتاق‌ها">
            <DailyHotelRoomsSection />
          </Section>
        ) : null}

        {!hideHeatingCooling ? (
          <Section icon="tempreture.svg" title="گرمایش و سرمایش">
            <div className="flex flex-wrap justify-start gap-2" dir="rtl">
              {visibleHeating.map((item) => (
                <Chip
                  key={item.id}
                  item={item}
                  selected={values.heatingCooling.includes(item.id)}
                  onClick={() =>
                    setField(
                      "heatingCooling",
                      toggleArray(values.heatingCooling, item.id),
                    )
                  }
                />
              ))}
            </div>
            {heatingItemsForListing.length > initialVisibleChipCount ? (
              <MoreButton
                count={heatingItemsForListing.length - initialVisibleChipCount}
                expanded={showAllHeating}
                onClick={() => setShowAllHeating((current) => !current)}
              />
            ) : null}
          </Section>
        ) : null}

        {showFacilitiesSection ? (
          <Section icon="features.svg" title="امکانات">
            <div className="flex flex-wrap justify-start gap-2" dir="rtl">
              {visibleFacilities.map((item) => (
                <Chip
                  displayLabel={item.id === "elevator" && values.elevatorCount
                    ? `${item.label} (${values.elevatorCount})`
                    : undefined}
                  key={item.id}
                  item={item}
                  selected={values.facilities.includes(item.id)}
                  onClick={() => handleFacilityClick(item.id)}
                />
              ))}
            </div>
            {facilityItemsForCategory.length > initialVisibleChipCount ? (
              <MoreButton
                count={facilityItemsForCategory.length - initialVisibleChipCount}
                expanded={showAllFacilities}
                onClick={() => setShowAllFacilities((current) => !current)}
              />
            ) : null}
          </Section>
        ) : null}

        {isCrm && (
          <Section icon="personal-card.svg" title="انتخاب مالک آگهی (پنل مدیریت)">
            <div className="flex flex-col gap-4">
              <div className="grid h-11 grid-cols-2 overflow-hidden rounded-xl border border-[#cccccc]" dir="ltr">
                <Button unstyled
                  className={`text-sm font-bold transition ${values.targetOwnerType === "agency" ? "bg-[#0048c4] text-white" : "bg-white text-[#4d4d4d]"}`}
                  onClick={() => setValue("targetOwnerType", "agency")}
                  type="button"
                >
                  آژانس املاک
                </Button>
                <Button unstyled
                  className={`border-r border-[#cccccc] text-sm font-bold transition ${values.targetOwnerType === "user" ? "bg-[#0048c4] text-white" : "bg-white text-[#4d4d4d]"}`}
                  onClick={() => setValue("targetOwnerType", "user")}
                  type="button"
                >
                  کاربر عادی
                </Button>
              </div>

              {values.targetOwnerType && (
                <CrmTargetOwnerSelect
                  type={values.targetOwnerType}
                  value={values.targetOwnerId}
                  onChange={(id) => setValue("targetOwnerId", id)}
                />
              )}
            </div>
          </Section>
        )}

        {renderPriceSection()}
      </main>

      <Footer
        onBack={onBack ?? (() => navigateTo(`/new-ad/category${window.location.search}`))}
        onPrimary={onNext}
        primary="مرحله بعد"
      />

      <BottomSheet
        ariaLabel={sheet?.title ?? "انتخاب"}
        className={sheet?.kind === "exchange" ? "!rounded-t-[24px]" : "rounded-t-[14px]"}
        contentClassName={
          sheet?.kind === "exchange"
            ? "min-h-0 flex-1 overflow-y-auto pt-1"
            : "pb-6 pt-0"
        }
        handleClassName={
          sheet?.kind === "exchange"
            ? "h-1 w-[56px] rounded-full bg-[#cccccc]"
            : "h-1 w-[42px] rounded-full bg-[#e0e0e0]"
        }
        headerButtonAriaLabel="بازگشت"
        headerClassName={sheet?.kind === "exchange" ? "!gap-0 !px-2" : ""}
        heightClassName={
          sheet?.kind === "exchange"
            ? "h-[min(660px,calc(100svh-24px))]"
            : "h-auto"
        }
        isOpen={Boolean(sheet)}
        onBack={() => setSheet(null)}
        onClose={() => setSheet(null)}
        panelPaddingClassName={sheet?.kind === "exchange" ? "flex flex-col pt-3" : "pt-3"}
        showBackButton={sheet?.kind === "exchange" || sheet?.kind === "multiSelect"}
        showHandle
        showHeader
        showHeaderDivider={sheet?.kind !== "exchange" && sheet?.kind !== "multiSelect"}
        title={sheet?.title ?? "انتخاب"}
        titleAlign={sheet?.kind === "exchange" || sheet?.kind === "multiSelect" ? "right" : "center"}
      >
        {sheet?.kind === "exchange" ? (
          <div className="px-4" dir="rtl">
            {sheet.options.map((option) => {
              const checked = values.exchangeTargets.includes(option);

              return (
                <Button unstyled
                  className="flex h-[72px] w-full items-center justify-between gap-3 pl-5 pr-4 text-right text-[#1a1a1a]"
                  key={option}
                  onClick={() =>
                    setField(
                      "exchangeTargets",
                      toggleArray(values.exchangeTargets, option),
                    )
                  }
                  type="button"
                >
                  <Typography as="span" variant="body" size="large" weight="regular">
                    {option}
                  </Typography>
                  <ExchangeCheckIcon checked={checked} />
                </Button>
              );
            })}
          </div>
        ) : sheet?.kind === "multiSelect" ? (
          <div className="px-5 pb-4 pt-3" dir="rtl">
            {sheet.options.map((option) => {
              const checked = values[sheet.key].includes(option);

              return (
                <Button
                  unstyled
                  className="flex h-[72px] w-full items-center justify-between gap-3 text-right text-[#1a1a1a]"
                  key={option}
                  onClick={() =>
                    setField(sheet.key, toggleArray(values[sheet.key], option))
                  }
                  type="button"
                >
                  <Typography as="span" variant="body" size="large" weight="regular">
                    {option}
                  </Typography>
                  <ChoiceIndicator checked={checked} />
                </Button>
              );
            })}
          </div>
        ) : (
          <BottomSheetActionList
            align="center"
            isOpen={Boolean(sheet)}
            items={(sheet?.options ?? []).map((option) => ({
              id: option,
              title: option,
            }))}
            itemClassName="h-12 text-sm font-normal leading-5"
            onSelect={(item) => {
              if (!sheet || sheet.kind !== "select") return;

              if (sheet.key === "elevatorCount") {
                setField("elevatorCount", item.title);
                if (!values.facilities.includes("elevator")) {
                  setField("facilities", [...values.facilities, "elevator"]);
                }
              } else {
                setField(sheet.key, item.title);
              }
              setSheet(null);
            }}
            selectedId={sheet?.kind === "select" ? values[sheet.key] : undefined}
            showDividers={false}
          />
        )}
      </BottomSheet>
    </>
  );
}
