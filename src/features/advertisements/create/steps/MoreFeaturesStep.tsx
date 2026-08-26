import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { BottomSheet, BottomSheetActionList } from "../../../../shared/components/BottomSheet";
import { moreFeatureKeys, moreFeatureOptions, timeOptions } from "../data";
import type { MoreFeatureDateKey, MoreFeatureFormKey, MoreFeatureSelectKey, MoreFeatureTimeKey, MoreFeaturesFormValues, NewAdFormValues } from "../types";
import {
  formatUnitsPerFloorLabel,
  getMoreFeatureFields,
  normalizeUnitsPerFloorValue,
  pickMoreFeatures,
} from "../utils";
import { CompactToggle, InputBox, MoreFeaturesFooter, SelectBox } from "../components/NewAdControls";
import { useNewAdDesktopLayout } from "../NewAdLayoutContext";
import { JalaliDatePickerSheet } from "./project/JalaliDatePickerSheet";

export function MoreFeaturesStep({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const desktop = useNewAdDesktopLayout();
  const { getValues, setValue } = useFormContext<NewAdFormValues>();
  const fields = getMoreFeatureFields();

  const [sheet, setSheet] = useState<{
    key: MoreFeatureSelectKey | MoreFeatureTimeKey;
    title: string;
    options: string[];
  } | null>(null);
  const [dateField, setDateField] = useState<MoreFeatureDateKey | null>(null);

  const [draft, setDraft] = useState<MoreFeaturesFormValues>(() =>
    pickMoreFeatures(getValues()),
  );

  const setDraftField = (
    key: MoreFeatureFormKey,
    value: string | boolean,
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const openSelect = (key: MoreFeatureSelectKey | MoreFeatureTimeKey, title: string, options?: string[]) => {
    const fallbackOptions = key === "checkInTime" || key === "checkOutTime" ? timeOptions : moreFeatureOptions[key as MoreFeatureSelectKey];
    setSheet({ key, title, options: options ?? fallbackOptions });
  };

  const getDraftString = (key: MoreFeatureFormKey) => {
    const value = draft[key];
    return typeof value === "string" ? value : "";
  };

  const getDisplayValue = (key: MoreFeatureFormKey) => {
    const value = getDraftString(key);

    return key === "unitsPerFloor" ? formatUnitsPerFloorLabel(value) : value;
  };

  const commit = () => {
    moreFeatureKeys.forEach((key) => {
      setValue(key as never, draft[key] as never, { shouldDirty: true });
    });

    onConfirm();
  };

  return (
    <>
      <main
        className={desktop
          ? "min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f5f7fb] px-6 py-5"
          : "min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 py-6"}
        dir="rtl"
      >
        {fields.length ? (
          <div className={desktop
            ? "mx-auto grid max-w-[1120px] grid-cols-2 gap-5 rounded-xl border border-[#e1e7f0] bg-white p-6 shadow-[0_6px_20px_rgba(30,50,80,0.04)]"
            : "space-y-5"}>
            {fields.map((field) => {
              if (field.control === "toggle") {
                return (
                  <CompactToggle
                    checked={Boolean(draft[field.key])}
                    key={field.key}
                    label={field.label}
                    onChange={(checked) => setDraftField(field.key, checked)}
                  />
                );
              }

              if (field.control === "number") {
                return (
                  <InputBox
                    key={field.key}
                    leftText={field.leftText}
                    numeric
                    onChange={(value) => setDraftField(field.key, value)}
                    placeholder={field.label}
                    value={getDraftString(field.key)}
                  />
                );
              }

              if (field.control === "time") {
                return (
                  <SelectBox
                    key={field.key}
                    onClear={() => setDraftField(field.key, "")}
                    onClick={() => openSelect(field.key as MoreFeatureTimeKey, field.label, timeOptions)}
                    placeholder={field.label}
                    value={getDraftString(field.key)}
                  />
                );
              }

              if (field.control === "date") {
                return (
                  <SelectBox
                    key={field.key}
                    onClear={() => setDraftField(field.key, "")}
                    onClick={() => setDateField(field.key as MoreFeatureDateKey)}
                    placeholder={field.label}
                    value={getDraftString(field.key)}
                  />
                );
              }

              return (
                <SelectBox
                  key={field.key}
                  onClear={() => setDraftField(field.key, "")}
                  onClick={() => openSelect(field.key as MoreFeatureSelectKey, field.label, field.options)}
                  placeholder={field.label}
                  value={getDisplayValue(field.key)}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-[12px] bg-[#f5f5f5] px-4 py-5 text-center text-sm leading-6 text-[#4d4d4d]">
            برای این دسته‌بندی مشخصات بیشتری تعریف نشده است.
          </div>
        )}
      </main>

      <MoreFeaturesFooter onCancel={onCancel} onConfirm={commit} />

      <JalaliDatePickerSheet
        isOpen={Boolean(dateField)}
        onClose={() => setDateField(null)}
        onConfirm={(date) => {
          if (dateField) setDraftField(dateField, date);
          setDateField(null);
        }}
        title={dateField === "projectDeliveryDate" ? "تاریخ تحویل" : "تاریخ آماده تحویل"}
        value={dateField ? getDraftString(dateField) : ""}
      />

      <BottomSheet
        ariaLabel={sheet?.title ?? "انتخاب"}
        className="rounded-t-[14px]"
        contentClassName="pt-0 pb-6"
        handleClassName="h-1 w-[42px] rounded-full bg-[#e0e0e0]"
        heightClassName="h-auto max-h-[calc(100dvh-102px)]"
        isOpen={Boolean(sheet)}
        headerButtonAriaLabel="بازگشت"
        onBack={() => setSheet(null)}
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
            title: sheet?.key === "unitsPerFloor"
              ? formatUnitsPerFloorLabel(option)
              : option,
          }))}
          itemClassName="h-12 text-sm font-normal leading-5"
          onSelect={(item) => {
            if (!sheet) return;

            setDraftField(
              sheet.key,
              sheet.key === "unitsPerFloor"
                ? normalizeUnitsPerFloorValue(item.id)
                : item.id,
            );
            setSheet(null);
          }}
          selectedId={sheet
            ? sheet.key === "unitsPerFloor"
              ? normalizeUnitsPerFloorValue(getDraftString(sheet.key))
              : getDraftString(sheet.key)
            : undefined}
          showDividers={false}
        />
      </BottomSheet>
    </>
  );
}
