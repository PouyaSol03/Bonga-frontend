import { useState } from "react";
import { Typography } from "../../../../shared/ui/Typography";
import { Chip } from "../../../../shared/ui/Chip";
import { TextField } from "../../../../shared/ui/TextField";
import { SelectField } from "../../../../shared/ui/SelectField";
import { Button } from "../../../../shared/ui/Button";
import { BottomSheet, BottomSheetActionList } from "../../../../shared/components/BottomSheet";
import { JalaliDatePickerSheet } from "../../../advertisements/create/steps/project/JalaliDatePickerSheet";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";

const STATUS_OPTIONS = ["بازدید", "پیگیری", "انصراف"] as const;

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

export interface ViewAdLeadStatusSectionProps {
  initialStatus?: string;
  onVisitConfirmed?: (date: string, time: string) => void;
}

export function ViewAdLeadStatusSection({
  initialStatus = "بازدید",
  onVisitConfirmed,
}: ViewAdLeadStatusSectionProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [visitDate, setVisitDate] = useState("۱۴۰۴/۱۲/۱۲");
  const [visitTime, setVisitTime] = useState("18:00");
  const [isVisited, setIsVisited] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimeSheetOpen, setIsTimeSheetOpen] = useState(false);

  const handleVisitedClick = () => {
    if (isVisited) return;
    setIsVisited(true);
    onVisitConfirmed?.(visitDate, toPersianDigits(visitTime));
  };

  return (
    <section className="bg-surface-container-lowest p-4 flex flex-col gap-4">
      <Typography
        as="h3"
        variant="label"
        size="large"
        weight="medium"
        className="text-on-surface"
      >
        انتخاب وضعیت سرنخ
      </Typography>

      <div className="flex items-center gap-2">
        {STATUS_OPTIONS.map((status) => {
          const isSelected = selectedStatus === status;
          return (
            <Chip
              key={status}
              selected={isSelected}
              onClick={() => setSelectedStatus(status)}
              className="flex-1 shrink justify-center py-2.5"
            >
              {status}
            </Chip>
          );
        })}
      </div>

      <div className="rounded-2xl border border-surface-container bg-surface-container-lowest p-4 flex flex-col gap-4 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <LinearCalendar className="h-5 w-5 text-on-surface-var" />
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="semibold"
            className="text-on-surface-var"
          >
            تاریخ و ساعت بازدید
          </Typography>
        </div>

        <div className="relative">
          <TextField
            label="تاریخ بازدید *"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            onClear={() => setVisitDate("")}
            trailingSlot={
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(true)}
                className="p-1 text-on-surface-var hover:text-on-surface transition cursor-pointer"
                title="انتخاب از تقویم"
              >
                <LinearCalendar className="h-5 w-5" />
              </button>
            }
          />
        </div>

        <SelectField
          placeholder="ساعت بازدید *"
          value={visitTime ? toPersianDigits(visitTime) : undefined}
          onClick={() => setIsTimeSheetOpen(true)}
        />

        <div className="flex items-center justify-between gap-3 pt-1">
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="flex-1 text-on-surface-var text-xs leading-5"
          >
            درصورتی که بازدید را انجام دادید دکمه «بازدید شد» را بفشارید
          </Typography>

          <Button
            type="button"
            onClick={handleVisitedClick}
            variant={isVisited ? "primary" : "secondary"}
            size="x-medium"
            radius="medium"
            className="shrink-0"
          >
            {isVisited ? "بازدید شد ✓" : "بازدید شد"}
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
