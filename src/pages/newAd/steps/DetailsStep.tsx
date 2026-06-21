import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

import { BottomSheet, BottomSheetActionList } from "../../../components/BottomSheet";
import {
  exchangeTargets,
  facilityItems,
  heatingItems,
  landFacilityItems,
} from "../data";
import {
  getBasicPropertyFields,
  getMoreFeatureFields,
  getMoreFeatureTags,
  getParams,
  navigateTo,
} from "../utils";
import type { NewAdFormValues, SelectKey, SheetState } from "../types";
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
import { DailyHotelRoomsSection } from "./dailyHotel/DailyHotelRoomsSection";
import { JalaliDatePickerSheet } from "./project/JalaliDatePickerSheet";
import { ProjectSaleTermsFields } from "./project/ProjectSaleTermsFields";
import { ProjectSpecsSection } from "./project/ProjectSpecsSection";

function toggleArray(current: string[], id: string) {
  return current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
}

export function DetailsStep({
  label,
  onNext,
  onMoreFeatures,
  onProjectDetails,
}: {
  label: string;
  onNext: () => void;
  onMoreFeatures: () => void;
  onProjectDetails: () => void;
}) {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [showAllHeating, setShowAllHeating] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
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
  const moreFeatureTags = getMoreFeatureTags(values, moreFeatureFields);
  const basicPropertyFields = getBasicPropertyFields();

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
          <div className="space-y-4">
            <InputBox
              numeric
              leftText="تومان"
              onChange={(value) => setField("minPrice", value)}
              placeholder="حداقل قیمت *"
              value={values.minPrice}
            />
            <InputBox
              numeric
              leftText="تومان"
              onChange={(value) => setField("maxPrice", value)}
              placeholder="حداکثر قیمت *"
              value={values.maxPrice}
            />
            <ProjectSaleTermsFields values={values} setField={setField} />
          </div>
        </Section>
      );
    }

    if (isDailyRent) {
      return (
        <Section icon="money.svg" title="اطلاعات قیمت">
          <div className="space-y-4">
            <InputBox
              numeric
              leftText="تومان"
              onChange={(value) => setField("minPrice", value)}
              placeholder="حداقل قیمت *"
              value={values.minPrice}
            />
            <InputBox
              numeric
              leftText="تومان"
              onChange={(value) => setField("maxPrice", value)}
              placeholder="حداکثر قیمت *"
              value={values.maxPrice}
            />
          </div>
        </Section>
      );
    }

    if (isRent) {
      return (
        <Section icon="money.svg" title="اطلاعات قیمت">
          <div className="space-y-4">
            <InputBox
              numeric
              leftText="تومان"
              onChange={(value) => setField("mortgagePrice", value)}
              placeholder="رهن *"
              value={values.mortgagePrice}
            />
            <InputBox
              numeric
              leftText="تومان"
              onChange={(value) => setField("rentPrice", value)}
              placeholder="اجاره *"
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
            numeric
            leftText="تومان"
            onChange={(value) => setField("price", value)}
            placeholder="قیمت *"
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
                    numeric
                    leftText="تومان"
                    onChange={(value) => setField("loanAmount", value)}
                    placeholder="مبلغ وام"
                    value={values.loanAmount}
                  />

                  <InputBox
                    numeric
                    leftText="تومان"
                    onChange={(value) => setField("loanInstallment", value)}
                    placeholder="قسط وام"
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
                <span className="[direction:rtl]">معاوضه با</span>

                <button
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
                  <span>انتخاب</span>
                  <span>‹</span>
                </button>
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
            </div>
          ) : null}
        </div>
      </Section>
    );
  };

  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-3" dir="rtl">
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
            <div className="space-y-4">
              {basicPropertyFields.map((field) => {
                const placeholder = `${field.label}${field.required ? " *" : ""}`;
                const value = values[field.key];

                if (field.control === "input") {
                  return (
                    <InputBox
                      key={field.key}
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

              {!isDailyHotelRent && moreFeatureTags.length ? (
                <div className="flex flex-wrap justify-start gap-2 pt-2" dir="rtl">
                  {moreFeatureTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex h-9 items-center rounded-[7px] border border-[#0048c4] bg-[#0048c41f] px-3 text-sm font-medium leading-5 text-[#0048c4]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {!isDailyHotelRent && moreFeatureFields.length ? (
                <button
                  className="mx-auto flex h-9 items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4]"
                  onClick={onMoreFeatures}
                  type="button"
                >
                  <span>ثبت مشخصات بیشتر</span>
                  <span>‹</span>
                </button>
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
        onBack={() => navigateTo("/new-ad/category")}
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
        <BottomSheetActionList
          align="center"
          isOpen={Boolean(sheet)}
          items={(sheet?.options ?? []).map((option) => ({
            id: option,
            title: option,
          }))}
          itemClassName="h-12 text-sm font-normal leading-5"
          onSelect={(item) => {
            if (!sheet) return;

            if (sheet.kind === "select") {
              setField(sheet.key, item.title);
              setSheet(null);
              return;
            }

            if (sheet.kind === "exchange") {
              setField(
                "exchangeTargets",
                toggleArray(values.exchangeTargets, item.title),
              );
            }
          }}
          selectedId={sheet?.kind === "select" ? values[sheet.key] : undefined}
          showCheckIcon={sheet?.kind === "exchange"}
          showDividers={false}
        />
      </BottomSheet>
    </>
  );
}
