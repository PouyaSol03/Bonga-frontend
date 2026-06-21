import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { BottomSheet, BottomSheetActionList } from "../../../components/BottomSheet";
import { moreFeatureKeys, moreFeatureOptions } from "../data";
import type { MoreFeatureFormKey, MoreFeatureSelectKey, MoreFeaturesFormValues, NewAdFormValues } from "../types";
import { getMoreFeatureFields, pickMoreFeatures } from "../utils";
import { CompactToggle, InputBox, MoreFeaturesFooter, SelectBox } from "../components/NewAdControls";

export function MoreFeaturesStep({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { getValues, setValue } = useFormContext<NewAdFormValues>();
  const fields = getMoreFeatureFields();

  const [sheet, setSheet] = useState<{
    key: MoreFeatureSelectKey;
    title: string;
  } | null>(null);

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

  const openSelect = (key: MoreFeatureSelectKey, title: string) => {
    setSheet({ key, title });
  };

  const getDraftString = (key: MoreFeatureFormKey) => {
    const value = draft[key];
    return typeof value === "string" ? value : "";
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
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 py-6"
        dir="rtl"
      >
        {fields.length ? (
          <div className="space-y-5">
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

              return (
                <SelectBox
                  key={field.key}
                  onClear={() => setDraftField(field.key, "")}
                  onClick={() => openSelect(field.key as MoreFeatureSelectKey, field.label)}
                  placeholder={field.label}
                  value={getDraftString(field.key)}
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
          items={(sheet ? moreFeatureOptions[sheet.key] : []).map((option) => ({
            id: option,
            title: option,
          }))}
          itemClassName="h-12 text-sm font-normal leading-5"
          onSelect={(item) => {
            if (!sheet) return;

            setDraftField(sheet.key, item.title);
            setSheet(null);
          }}
          selectedId={sheet ? getDraftString(sheet.key) : undefined}
          showDividers={false}
        />
      </BottomSheet>
    </>
  );
}

