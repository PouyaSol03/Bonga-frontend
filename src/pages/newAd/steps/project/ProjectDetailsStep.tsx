import { useEffect, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { BottomSheet } from "../../../../components/BottomSheet";
import {
  projectFloorOptions,
  projectPositionOptions,
  projectRoomOptions,
} from "../../data";
import type { NewAdFormValues, ProjectDetailItem } from "../../types";
import { InputBox, Tag } from "../../components/NewAdControls";

type MultiProjectKey = "floors" | "rooms" | "positions";

type ProjectMultiSheet = {
  index: number;
  key: MultiProjectKey;
  title: string;
  options: string[];
};

function createProjectDetailItem(): ProjectDetailItem {
  return {
    id: crypto.randomUUID(),
    meterage: "",
    floors: [],
    rooms: [],
    positions: [],
  };
}

function toggleArray(current: string[], value: string) {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

function MultiSelectRow({
  title,
  values,
  onOpen,
  onRemove,
}: {
  title: string;
  values: string[];
  onOpen: () => void;
  onRemove: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium leading-5 text-[#1a1a1a]">
          {title}
        </span>

        <button
          className="text-sm font-medium leading-5 text-[#0048c4]"
          onClick={onOpen}
          type="button"
        >
          انتخاب
        </button>
      </div>

      {values.length ? (
        <div className="flex flex-wrap justify-start gap-2" dir="rtl">
          {values.map((value) => (
            <Tag key={value} label={value} onRemove={() => onRemove(value)} />
          ))}
        </div>
      ) : (
        <button
          className="flex h-10 w-full items-center justify-center rounded-[8px] border border-dashed border-[#cccccc] bg-white text-sm font-normal leading-5 text-[#808080]"
          onClick={onOpen}
          type="button"
        >
          برای انتخاب ضربه بزنید
        </button>
      )}
    </div>
  );
}

function ProjectDetailCard({
  index,
  item,
  onOpenSelect,
  onRemove,
}: {
  index: number;
  item?: ProjectDetailItem;
  onOpenSelect: (sheet: ProjectMultiSheet) => void;
  onRemove: () => void;
}) {
  const { setValue } = useFormContext<NewAdFormValues>();

  const setItemField = <T extends keyof ProjectDetailItem>(
    key: T,
    value: ProjectDetailItem[T],
  ) => {
    setValue(`projectDetails.${index}.${key}` as never, value as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeMultiValue = (key: MultiProjectKey, value: string) => {
    setItemField(key, (item?.[key] ?? []).filter((current) => current !== value));
  };

  return (
    <div className="space-y-4 border-b border-[#e0e0e0] pb-5 last:border-b-0">
      <InputBox
        numeric
        leftText="متر مربع"
        onChange={(value) => setItemField("meterage", value)}
        placeholder="متراژ *"
        value={item?.meterage ?? item?.minMeterage ?? ""}
      />

      <MultiSelectRow
        title="طبقه"
        values={item?.floors ?? []}
        onOpen={() =>
          onOpenSelect({
            index,
            key: "floors",
            title: "طبقه",
            options: projectFloorOptions,
          })
        }
        onRemove={(value) => removeMultiValue("floors", value)}
      />

      <MultiSelectRow
        title="تعداد اتاق"
        values={item?.rooms ?? []}
        onOpen={() =>
          onOpenSelect({
            index,
            key: "rooms",
            title: "تعداد اتاق",
            options: projectRoomOptions,
          })
        }
        onRemove={(value) => removeMultiValue("rooms", value)}
      />

      <MultiSelectRow
        title="موقعیت"
        values={item?.positions ?? []}
        onOpen={() =>
          onOpenSelect({
            index,
            key: "positions",
            title: "موقعیت",
            options: projectPositionOptions,
          })
        }
        onRemove={(value) => removeMultiValue("positions", value)}
      />

      <button
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[8px] border border-[#cccccc] bg-white text-sm font-medium leading-5 text-[#1a1a1a]"
        onClick={onRemove}
        type="button"
      >
        <span>حذف</span>
        <span>🗑</span>
      </button>
    </div>
  );
}

export function ProjectDetailsStep({
  onBack,
}: {
  onBack: () => void;
}) {
  const { control, getValues, setValue } = useFormContext<NewAdFormValues>();
  const [sheet, setSheet] = useState<ProjectMultiSheet | null>(null);
  const watchedProjectDetails = useWatch({ control, name: "projectDetails" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projectDetails",
    keyName: "fieldId",
  });

  useEffect(() => {
    if (fields.length) return;
    append(createProjectDetailItem());
  }, [append, fields.length]);

  const toggleSheetValue = (value: string) => {
    if (!sheet) return;

    const path = `projectDetails.${sheet.index}.${sheet.key}` as const;
    const current = getValues().projectDetails?.[sheet.index]?.[sheet.key] ?? [];

    setValue(path as never, toggleArray(current, value) as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const selectedSheetValues = sheet
    ? watchedProjectDetails?.[sheet.index]?.[sheet.key] ?? []
    : [];

  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pb-3 pt-4" dir="rtl">
        <div className="space-y-5">
          {fields.map((field, index) => (
            <ProjectDetailCard
              key={field.fieldId}
              index={index}
              item={watchedProjectDetails?.[index]}
              onOpenSelect={setSheet}
              onRemove={() => {
                if (fields.length === 1) {
                  remove(index);
                  append(createProjectDetailItem());
                  return;
                }

                remove(index);
              }}
            />
          ))}
        </div>
      </main>

      <footer className="grid grid-cols-2 gap-3 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-16px_24px_rgba(255,255,255,0.94)]">
        <button
          className="h-12 rounded-[10px] border border-[#0048c4] bg-white text-base font-medium leading-6 text-[#0048c4]"
          onClick={onBack}
          type="button"
        >
          بازگشت
        </button>

        <button
          className="flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#0048c4] text-base font-medium leading-6 text-white active:bg-[#003ba1]"
          onClick={() => append(createProjectDetailItem())}
          type="button"
        >
          <span>+</span>
          <span>اضافه کردن</span>
        </button>
      </footer>

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
        <div className="py-2">
          {(sheet?.options ?? []).map((option) => {
            const checked = selectedSheetValues.includes(option);

            return (
              <button
                className="flex h-12 w-full items-center justify-between bg-white px-5 text-sm font-normal leading-5 text-[#1a1a1a]"
                key={option}
                onClick={() => toggleSheetValue(option)}
                type="button"
              >
                <span>{option}</span>
                <span
                  className={`grid h-4 w-4 place-items-center rounded-[3px] border ${
                    checked
                      ? "border-[#0048c4] bg-[#0048c4] text-white"
                      : "border-[#808080] bg-white text-transparent"
                  }`}
                >
                  <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 12 12">
                    <path d="M2.4 6.1 4.8 8.5 9.6 3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </>
  );
}
