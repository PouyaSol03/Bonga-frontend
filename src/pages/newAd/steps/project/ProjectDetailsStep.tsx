import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  projectFloorOptions,
  projectPositionOptions,
  projectRoomOptions,
} from "../../data";
import type { NewAdFormValues, ProjectDetailItem } from "../../types";
import {
  InputBox,
} from "../../components/NewAdControls";

function createProjectDetailItem(): ProjectDetailItem {
  return {
    id: crypto.randomUUID(),
    minMeterage: "",
    maxMeterage: "",
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

function OptionChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex h-8 items-center justify-center rounded-[7px] border px-3 text-sm font-medium leading-5 transition-colors ${
        selected
          ? "border-[#0048c4] bg-[#0048c41f] text-[#0048c4]"
          : "border-[#cccccc] bg-white text-[#1a1a1a]"
      }`}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      {selected ? <span className="mr-1">×</span> : null}
    </button>
  );
}

function ProjectDetailCard({
  index,
  onRemove,
}: {
  index: number;
  onRemove: () => void;
}) {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const currentItem = watch(`projectDetails.${index}`);

  const setItemField = <T extends keyof ProjectDetailItem>(
    key: T,
    value: ProjectDetailItem[T],
  ) => {
    setValue(`projectDetails.${index}.${key}` as never, value as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-4 border-b border-[#e0e0e0] pb-5 last:border-b-0">
      <div className="space-y-3">
        <div className="text-right text-sm font-medium leading-5 text-[#1a1a1a]">
          متراژ
        </div>

        <InputBox
          numeric
          leftText="متر مربع"
          onChange={(value) => setItemField("minMeterage", value)}
          placeholder="متراژ کمتر"
          value={currentItem?.minMeterage ?? ""}
        />

        <InputBox
          numeric
          leftText="متر مربع"
          onChange={(value) => setItemField("maxMeterage", value)}
          placeholder="متراژ بیشتر"
          value={currentItem?.maxMeterage ?? ""}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium leading-5 text-[#1a1a1a]">
            طبقه
          </span>
          <span className="text-sm font-medium leading-5 text-[#0048c4]">
            انتخاب
          </span>
        </div>

        <div className="flex flex-wrap justify-start gap-2" dir="rtl">
          {projectFloorOptions.map((floor) => (
            <OptionChip
              key={floor}
              label={floor}
              selected={(currentItem?.floors ?? []).includes(floor)}
              onClick={() =>
                setItemField(
                  "floors",
                  toggleArray(currentItem?.floors ?? [], floor),
                )
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium leading-5 text-[#1a1a1a]">
            تعداد اتاق
          </span>
          <span className="text-sm font-medium leading-5 text-[#0048c4]">
            انتخاب
          </span>
        </div>

        <div className="flex flex-wrap justify-start gap-2" dir="rtl">
          {projectRoomOptions.map((room) => (
            <OptionChip
              key={room}
              label={room}
              selected={(currentItem?.rooms ?? []).includes(room)}
              onClick={() =>
                setItemField(
                  "rooms",
                  toggleArray(currentItem?.rooms ?? [], room),
                )
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium leading-5 text-[#1a1a1a]">
            موقعیت
          </span>
          <span className="text-sm font-medium leading-5 text-[#0048c4]">
            انتخاب
          </span>
        </div>

        <div className="flex flex-wrap justify-start gap-2" dir="rtl">
          {projectPositionOptions.map((position) => (
            <OptionChip
              key={position}
              label={position}
              selected={(currentItem?.positions ?? []).includes(position)}
              onClick={() =>
                setItemField(
                  "positions",
                  toggleArray(currentItem?.positions ?? [], position),
                )
              }
            />
          ))}
        </div>
      </div>

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
  const { control } = useFormContext<NewAdFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projectDetails",
    keyName: "fieldId",
  });

  useEffect(() => {
    if (fields.length) return;
    append(createProjectDetailItem());
  }, [append, fields.length]);

  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pb-3 pt-4" dir="rtl">
        <div className="space-y-5">
          {fields.map((field, index) => (
            <ProjectDetailCard
              key={field.fieldId}
              index={index}
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
    </>
  );
}
