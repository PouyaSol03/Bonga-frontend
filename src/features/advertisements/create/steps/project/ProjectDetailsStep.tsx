import { useEffect, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { BottomSheet } from "../../../../../shared/components/BottomSheet";
import ChevronLeftIcon from "../../../../../shared/icons/ChevronLeftIcon";
import LinearAdd from "../../../../../shared/icons/LinearAdd";
import LinearArrowDown1 from "../../../../../shared/icons/LinearArrowDown1";
import LinearDelete from "../../../../../shared/icons/LinearDelete";
import { projectFloorOptions, projectPositionOptions, projectRoomOptions } from "../../data";
import type { NewAdFormValues, ProjectDetailItem } from "../../types";
import { InputBox, Tag } from "../../components/NewAdControls";
import { useNewAdDesktopLayout } from "../../NewAdLayoutContext";
import { Typography } from "../../../../../shared/ui/Typography";
import { Button } from "../../../../../shared/ui/Button";

type MultiProjectKey = "floors" | "rooms" | "positions";

type ProjectMultiSheet = {
  index: number;
  key: MultiProjectKey;
  title: string;
  options: string[];
};

function generateDetailId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function createProjectDetailItem(): ProjectDetailItem {
  return {
    id: generateDetailId(),
    meterage: "",
    floors: [],
    rooms: [],
    positions: [],
  };
}

function sortByOptionsOrder(values: string[], options: string[]): string[] {
  const orderMap = new Map(options.map((option, index) => [option, index]));

  return [...values].sort((a, b) => {
    const indexA = orderMap.get(a) ?? Number.MAX_SAFE_INTEGER;
    const indexB = orderMap.get(b) ?? Number.MAX_SAFE_INTEGER;
    return indexA - indexB;
  });
}

function toggleArray(current: string[], value: string, options: string[]) {
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
  return sortByOptionsOrder(next, options);
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
    <div className="border-outline-var border-b">
      <div className="flex items-center justify-between py-3.5">
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="medium"
          className="text-on-surface"
        >
          {title}
        </Typography>

        <Button
          unstyled
          className="border-outline-var bg-surface-container-lowest text-on-surface-var flex h-9 items-center gap-1 rounded-[10px] border px-3"
          onClick={onOpen}
          type="button"
        >
          <Typography as="span" variant="label" size="medium" weight="medium">
            انتخاب
          </Typography>
          <ChevronLeftIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
        </Button>
      </div>

      {values.length > 0 && (
        <div className="flex flex-wrap justify-start gap-2 pb-3.5" dir="rtl">
          {values.map((value) => (
            <Tag key={value} label={value} onRemove={() => onRemove(value)} />
          ))}
        </div>
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
  const [isOpen, setIsOpen] = useState(true);

  const setItemField = <T extends keyof ProjectDetailItem>(key: T, value: ProjectDetailItem[T]) => {
    setValue(`projectDetails.${index}.${key}` as never, value as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeMultiValue = (key: MultiProjectKey, value: string) => {
    setItemField(
      key,
      (item?.[key] ?? []).filter((current) => current !== value),
    );
  };

  return (
    <div className="border-outline-var border-b pb-5 last:border-b-0">
      <Button
        unstyled
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-2 text-right"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="medium"
          className="text-on-surface"
        >
          متراژ
        </Typography>
        <LinearArrowDown1
          aria-hidden="true"
          className={`text-on-surface-var h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </Button>

      {isOpen && (
        <div className="pt-2">
          <div className="border-outline-var border-b pb-4">
            <InputBox
              numeric
              onChange={(value) => setItemField("meterage", value)}
              placeholder="متراژ (متر مربع)"
              value={item?.meterage ?? item?.minMeterage ?? ""}
            />
          </div>

          <MultiSelectRow
            title="طبقه"
            values={sortByOptionsOrder(item?.floors ?? [], projectFloorOptions)}
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
            values={sortByOptionsOrder(item?.rooms ?? [], projectRoomOptions)}
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
            values={sortByOptionsOrder(item?.positions ?? [], projectPositionOptions)}
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

          <div className="pt-4">
            <Button
              unstyled
              className="border-error bg-surface-container-lowest text-error flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border text-sm leading-5 font-medium"
              onClick={onRemove}
              type="button"
            >
              <LinearDelete aria-hidden="true" className="text-error h-5 w-5" />
              <Typography as="span" variant="body" size="medium" weight="regular" className="text-error">
                حذف
              </Typography>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectDetailsStep({ onBack }: { onBack: () => void }) {
  const desktop = useNewAdDesktopLayout();
  const { control, getValues, setValue } = useFormContext<NewAdFormValues>();
  const [sheet, setSheet] = useState<ProjectMultiSheet | null>(null);
  const watchedProjectDetails = useWatch({ control, name: "projectDetails" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projectDetails",
    keyName: "fieldId",
  });

  useEffect(() => {
    const current = getValues("projectDetails");
    if (Array.isArray(current) && current.length > 0) return;
    append(createProjectDetailItem());
  }, [append, fields.length, getValues]);

  const toggleSheetValue = (value: string) => {
    if (!sheet) return;

    const path = `projectDetails.${sheet.index}.${sheet.key}` as const;
    const current = getValues().projectDetails?.[sheet.index]?.[sheet.key] ?? [];

    setValue(path as never, toggleArray(current, value, sheet.options) as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const selectedSheetValues = sheet
    ? (watchedProjectDetails?.[sheet.index]?.[sheet.key] ?? [])
    : [];

  return (
    <>
      <main
        className={
          desktop
            ? "bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-6 py-5"
            : "bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pt-4 pb-3"
        }
        dir="rtl"
      >
        <div className={desktop ? "mx-auto max-w-[1120px] space-y-5" : "space-y-5"}>
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

      <footer
        className={
          desktop
            ? "border-outline-var bg-surface-container-lowest flex justify-end gap-3 border-t px-6 py-4"
            : "bg-surface-container-lowest grid grid-cols-2 gap-3 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_0_rgba(0,0,0,0.08)]"
        }
        dir="rtl"
      >
        <Button
          unstyled
          className={`border-primary bg-surface-container-lowest text-primary flex h-12 items-center justify-center gap-1.5 rounded-[12px] border text-base leading-6 font-medium ${desktop ? "w-44" : ""}`}
          onClick={() => append(createProjectDetailItem())}
          type="button"
        >
          <LinearAdd aria-hidden="true" className="h-5 w-5" />
          <span>اضافه کردن</span>
        </Button>

        <Button
          unstyled
          className={`bg-primary text-on-primary active:bg-primary/90 flex h-12 items-center justify-center rounded-[12px] text-base leading-6 font-medium ${desktop ? "w-44" : ""}`}
          onClick={onBack}
          type="button"
        >
          تایید
        </Button>
      </footer>

      <BottomSheet
        ariaLabel={sheet?.title ?? "انتخاب"}
        className="rounded-t-[14px]"
        contentClassName="pt-0 pb-6"
        handleClassName="h-1 w-[42px] rounded-full bg-outline-var"
        heightClassName="h-auto max-h-[50svh]"
        maxHeight="50svh"
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
        <div className="py-2">
          {(sheet?.options ?? []).map((option) => {
            const checked = selectedSheetValues.includes(option);

            return (
              <Button
                unstyled
                className="bg-surface-container-lowest text-on-surface flex h-12 w-full items-center justify-between px-5 text-sm leading-5 font-normal"
                key={option}
                onClick={() => toggleSheetValue(option)}
                type="button"
              >
                <Typography as="span" variant="body" size="medium" weight="regular">
                  {option}
                </Typography>
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className={`grid h-4 w-4 place-items-center rounded-[3px] border ${
                    checked
                      ? "border-primary bg-primary text-on-primary"
                      : "border-outline bg-surface-container-lowest text-transparent"
                  }`}
                >
                  <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 12 12">
                    <path
                      d="M2.4 6.1 4.8 8.5 9.6 3.5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.6"
                    />
                  </svg>
                </Typography>
              </Button>
            );
          })}
        </div>
      </BottomSheet>
    </>
  );
}
