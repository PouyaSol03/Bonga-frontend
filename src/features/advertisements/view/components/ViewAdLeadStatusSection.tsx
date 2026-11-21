import { useEffect, useState } from "react";
import { Typography } from "../../../../shared/ui/Typography";
import { Chip } from "../../../../shared/ui/Chip";
import { TextField } from "../../../../shared/ui/TextField";
import { SelectField } from "../../../../shared/ui/SelectField";
import { Button } from "../../../../shared/ui/Button";
import { BottomSheet, BottomSheetActionList } from "../../../../shared/components/BottomSheet";
import { JalaliDatePickerSheet } from "../../../advertisements/create/steps/project/JalaliDatePickerSheet";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";

export const STAGE_OPTIONS = [
  { key: "visit", label: "بازدید" },
  { key: "followup", label: "پیگیری" },
  { key: "cancel", label: "انصراف" },
] as const;

const TIME_OPTIONS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

interface ViewAdLeadStatusSectionProps {
  currentStage?: string;
  isMutating?: boolean;
  onStageChange?: (stageKey: string) => void;
  onVisitConfirmed?: () => void;
  serverDate?: string;
  serverTime?: string;
}

function resolveStageKey(stage?: string): string {
  if (!stage) return "visit";
  const s = stage.trim().toLowerCase();
  if (s === "visit" || s === "بازدید") return "visit";
  if (s === "followup" || s === "پیگیری") return "followup";
  if (s === "cancel" || s === "انصراف") return "cancel";
  if (s === "closed" || s === "معامله شد") return "closed";
  if (s === "new" || s === "جدید") return "new";
  return s;
}

export function ViewAdLeadStatusSection({
  currentStage = "visit",
  isMutating = false,
  onStageChange,
  onVisitConfirmed,
  serverDate = "",
  serverTime = "",
}: ViewAdLeadStatusSectionProps) {
  const activeKey = resolveStageKey(currentStage);
  const [visitDate, setVisitDate] = useState(serverDate);
  const [visitTime, setVisitTime] = useState(serverTime);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimeSheetOpen, setIsTimeSheetOpen] = useState(false);

  useEffect(() => {
    if (serverDate) setVisitDate(serverDate);
    if (serverTime) setVisitTime(serverTime);
  }, [serverDate, serverTime]);

  const handleChipClick = (stageKey: string) => {
    if (isMutating || stageKey === activeKey) return;
    onStageChange?.(stageKey);
  };

  return (
    <section className="bg-surface-container-lowest flex flex-col gap-4 p-4">
      <Typography as="h3" variant="label" size="large" weight="medium" className="text-on-surface">
        انتخاب وضعیت سرنخ
      </Typography>

      <div className="flex items-center gap-2">
        {STAGE_OPTIONS.map((item) => {
          const isSelected = activeKey === item.key;
          return (
            <Chip
              key={item.key}
              selected={isSelected}
              disabled={isMutating}
              onClick={() => handleChipClick(item.key)}
              className="flex-1 shrink justify-center py-2.5 disabled:opacity-50"
            >
              {item.label}
            </Chip>
          );
        })}
      </div>

      <div className="border-surface-container bg-surface-container-lowest flex flex-col gap-4 rounded-2xl border p-4 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <LinearCalendar className="text-on-surface-var h-5 w-5" />
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="semibold"
            className="text-on-surface-var"
          >
            هماهنگی بازدید
          </Typography>
        </div>

        <div className="relative">
          <TextField
            label="تاریخ بازدید"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            onClear={() => setVisitDate("")}
            trailingSlot={
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(true)}
                className="text-on-surface-var cursor-pointer p-1 transition"
                title="انتخاب از تقویم"
              >
                <LinearCalendar className="h-5 w-5" />
              </button>
            }
          />
        </div>

        <SelectField
          placeholder="ساعت بازدید"
          value={visitTime ? toPersianDigits(visitTime) : undefined}
          onClick={() => setIsTimeSheetOpen(true)}
        />

        <div className="flex items-center justify-between gap-3 pt-1">
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-on-surface-var flex-1 text-xs leading-5"
          >
            درصورتی که بازدید را انجام دادید دکمه «بازدید شد» را بفشارید
          </Typography>

          <Button
            type="button"
            disabled={isMutating}
            onClick={() => onVisitConfirmed?.()}
            variant={activeKey === "visit" ? "primary" : "secondary"}
            size="x-medium"
            radius="medium"
            className="shrink-0"
          >
            {isMutating ? "در حال ثبت..." : "بازدید شد"}
          </Button>
        </div>
      </div>

      <JalaliDatePickerSheet
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onConfirm={(date) => {
          setVisitDate(toPersianDigits(date));
          setIsDatePickerOpen(false);
        }}
        title="تاریخ بازدید"
        value={visitDate}
      />

      <BottomSheet
        ariaLabel="ساعت بازدید"
        className="rounded-t-[14px]"
        contentClassName="pt-0 pb-4"
        handleClassName="h-1 w-[42px] rounded-full bg-outline-var"
        heightClassName="h-auto max-h-[50svh]"
        maxHeight="50svh"
        isOpen={isTimeSheetOpen}
        headerButtonAriaLabel="بازگشت"
        onBack={() => setIsTimeSheetOpen(false)}
        onClose={() => setIsTimeSheetOpen(false)}
        panelPaddingClassName="pt-3"
        showBackButton
        showHandle
        showHeader
        showHeaderDivider={false}
        title="ساعت بازدید"
        titleAlign="right"
      >
        <div className="px-2" dir="rtl">
          <BottomSheetActionList
            align="right"
            isOpen={isTimeSheetOpen}
            items={TIME_OPTIONS.map((time) => ({
              id: time,
              title: toPersianDigits(time),
            }))}
            itemClassName="h-12 text-sm font-normal leading-5"
            onSelect={(item) => {
              setVisitTime(item.id);
              setIsTimeSheetOpen(false);
            }}
            selectedId={visitTime}
            showCheckIcon
            showDividers={false}
          />
        </div>
      </BottomSheet>
    </section>
  );
}
