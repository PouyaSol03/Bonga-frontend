import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

import { BottomSheet, BottomSheetActionList } from "../../../components/BottomSheet";
import { ChoiceIndicator } from "../../../components/ui/Choice";
import { formatBigNumber } from "../../../lib/MoneyHandler";
import {
  exchangeTargets,
  facilityItems,
  heatingItems,
  landFacilityItems,
} from "../data";
import {
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
  Tag,
  Toggle,
} from "../components/NewAdControls";
import { useNewAdDesktopLayout } from "../NewAdLayoutContext";
import { DailyHotelRoomsSection } from "./dailyHotel/DailyHotelRoomsSection";
import { JalaliDatePickerSheet } from "./project/JalaliDatePickerSheet";
import { ProjectSaleTermsFields } from "./project/ProjectSaleTermsFields";
import { ProjectSpecsSection } from "./project/ProjectSpecsSection";
import { Typography } from "../../../components/ui/Typography";
import { Button } from "../../../components/ui/Button";

function toggleArray(current: string[], id: string) {
  return current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
}

function moneySupportingText(value: string) {
  const number = Number(value.replace(/,/g, ""));

  return Number.isFinite(number) && number > 0
    ? `${formatBigNumber(number)} تومان`
    : "";
}

function formatPersianCount(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function ExchangeCheckIcon({ checked }: { checked: boolean }) {
  return <ChoiceIndicator checked={checked} />;
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
  const [isDeliveryDateOpen, setIsDeliveryDateOpen] = useState(false);

  const { transaction, category } = getParams();
  const isProject = transaction === "project";
  const isPartnership = isProject && category === "project-partnership";
  const isRent = transaction === "rent";
  const isDailyRent = isRent && category.startsWith("daily-");
  const isDailyHotelRent = isRent && category === "daily-hotel-apartment";
  const isSaleGardenVilla = transaction === "sale" && category === "garden-villa";
  const hideHeatingCooling =
    isPartnership || category === "land" || category === "factory-workshop";
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

      if (typeof value === "string" && value.trim()) {
        return { key: field.key, label: `${field.label}: ${value}` };
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

  const facilityItemsForCategory = useMemo(
    () =>
      category === "land" || category === "factory-workshop"
        ? landFacilityItems
        : facilityItems,
    [category],
  );

  const initialVisibleChipCount = 8;
  const visibleHeating = showAllHeating
    ? heatingItems
    : heatingItems.slice(0, initialVisibleChipCount);
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

  const removeMoreFeature = (key: MoreFeatureFormKey) => {
    const field = moreFeatureFields.find((item) => item.key === key);

    setValue(key as never, (field?.control === "toggle" ? false : "") as never, {
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
            onChange={(value) => setField("builderSharePercent", value)}
            placeholder="سهم سازنده به درصد *"
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
              placeholder="حداقل قیمت *"
              supportingText={moneySupportingText(values.minPrice)}
              value={values.minPrice}
            />
            <InputBox
              error={errors.maxPrice}
              formatNumeric
              numeric
              leftText="تومان"
              onChange={(value) => setField("maxPrice", value)}
              placeholder="حداکثر قیمت *"
              supportingText={moneySupportingText(values.maxPrice)}
              value={values.maxPrice}
            />
            <ProjectSaleTermsFields errors={errors} values={values} setField={setField} />
          </div>
        </Section>
      );
    }

    if (isDailyRent) {
      return (
        <Section icon="money.svg" title="اطلاعات قیمت">
          <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            <InputBox
              error={errors.minPrice}
              formatNumeric
              numeric
              leftText="تومان"
              onChange={(value) => setField("minPrice", value)}
              placeholder="حداقل قیمت *"
              supportingText={moneySupportingText(values.minPrice)}
              value={values.minPrice}
            />
            <InputBox
              error={errors.maxPrice}
              formatNumeric
              numeric
              leftText="تومان"
              onChange={(value) => setField("maxPrice", value)}
              placeholder="حداکثر قیمت *"
              supportingText={moneySupportingText(values.maxPrice)}
              value={values.maxPrice}
            />
          </div>
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
              onChange={(value) => setField("mortgagePrice", value)}
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
        </Section>
      );
    }

    return (
      <Section icon="money.svg" title="اطلاعات قیمت">
        <div className="space-y-4">
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

                <Button unstyled
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
                  <Typography as="span" variant="body" size="medium" weight="regular">‹</Typography>
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
  };

  return (
    <>
      <main className={desktop
        ? "min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f5f7fb] px-6 py-5 [&>section]:mx-auto [&>section]:mb-5 [&>section]:max-w-[1120px]"
        : "min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-3"} dir="rtl">
        <Section icon="location.svg" title="موقعیت ملک">
          <LocationBox label={label} value={values.location} />
        </Section>

        {isProject ? (
          <ProjectSpecsSection
            values={values}
            setField={setField}
            onOpenSelect={openSelectSheet}
            onOpenDeliveryDate={() => setIsDeliveryDateOpen(true)}
            onOpenProjectDetails={onProjectDetails}
          />
        ) : (
          <Section icon="info.svg" title="مشخصات ملک">
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

              {isDailyHotelRent ? <DailyHotelRoomsSection /> : null}

              {!isDailyHotelRent && registeredMoreFeatures.length ? (
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
                    className="mx-auto flex h-9 items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4] active:text-[#00379a]"
                    onClick={onMoreFeatures}
                    type="button"
                  >
                    <Typography as="span" variant="body" size="medium" weight="regular">ویرایش مشخصات</Typography>
                    <Typography as="span" variant="title" size="large" weight="medium" className="text-lg leading-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M11.2249 6.22456C11.469 5.98048 11.8646 5.98049 12.1087 6.22456C12.3528 6.46864 12.3528 6.86427 12.1087 7.10835L9.21729 9.99979L12.1087 12.8912C12.3528 13.1353 12.3528 13.5309 12.1087 13.775C11.8646 14.0191 11.469 14.0191 11.2249 13.775L7.8916 10.4417C7.77441 10.3245 7.7085 10.1655 7.7085 9.99979C7.70851 9.83405 7.77441 9.67509 7.8916 9.55789L11.2249 6.22456Z" fill="#0048c4" />
                      </svg>
                    </Typography>
                  </Button>
                </div>
              ) : !isDailyHotelRent && moreFeatureFields.length ? (
                <Button unstyled
                  className="mx-auto flex h-9 items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4] active:text-[#00379a]"
                  onClick={onMoreFeatures}
                  type="button"
                >
                  <Typography as="span" variant="body" size="medium" weight="regular">ثبت {formatPersianCount(moreFeatureFields.length)} مشخصات دیگر</Typography>
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

        {!hideHeatingCooling ? (
          <Section icon="tempreture.svg" title="سرمایش و گرمایش">
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
            {heatingItems.length > initialVisibleChipCount ? (
              <MoreButton
                count={heatingItems.length - initialVisibleChipCount}
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
                  key={item.id}
                  item={item}
                  selected={values.facilities.includes(item.id)}
                  onClick={() =>
                    setField("facilities", toggleArray(values.facilities, item.id))
                  }
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

        {renderPriceSection()}
      </main>

      <Footer
        onBack={onBack ?? (() => navigateTo(`/new-ad/category${window.location.search}`))}
        onPrimary={onNext}
        primary="مرحله بعد"
      />

      <JalaliDatePickerSheet
        isOpen={isDeliveryDateOpen}
        value={values.projectDeliveryDate}
        onClose={() => setIsDeliveryDateOpen(false)}
        onConfirm={(date) => {
          setField("projectDeliveryDate", date);
          setIsDeliveryDateOpen(false);
        }}
      />

      <BottomSheet
        ariaLabel={sheet?.title ?? "انتخاب"}
        className="rounded-t-[14px]"
        contentClassName="pt-0 pb-6"
        handleClassName="h-1 w-[42px] rounded-full bg-[#e0e0e0]"
        heightClassName="h-auto max-h-[calc(100dvh-102px)]"
        isOpen={Boolean(sheet)}
        onClose={() => setSheet(null)}
        panelPaddingClassName="pt-3"
        showBackButton={false}
        showHandle
        showHeader
        showHeaderDivider
        title={sheet?.title ?? "انتخاب"}
        titleAlign="center"
      >
        {sheet?.kind === "exchange" ? (
          <div className="px-4 pb-2" dir="rtl">
            {sheet.options.map((option) => {
              const checked = values.exchangeTargets.includes(option);

              return (
                <Button unstyled
                  className="flex h-12 w-full items-center justify-start gap-3 text-right text-base font-medium leading-6 text-[#1a1a1a]"
                  key={option}
                  onClick={() =>
                    setField(
                      "exchangeTargets",
                      toggleArray(values.exchangeTargets, option),
                    )
                  }
                  type="button"
                >
                  <ExchangeCheckIcon checked={checked} />
                  <Typography as="span" variant="body" size="medium" weight="regular">{option}</Typography>
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

              setField(sheet.key, item.title);
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
