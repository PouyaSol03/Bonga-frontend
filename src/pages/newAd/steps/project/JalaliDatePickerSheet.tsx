import { useEffect, useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persianFa from "react-date-object/locales/persian_fa";

import { BottomSheet } from "../../../../components/BottomSheet";

import "./JalaliDatePickerSheet.css";
import { Button } from "../../../../components/ui/Button";

type JalaliDatePickerSheetProps = {
  isOpen: boolean;
  value: string;
  title?: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
};

function getInitialDate(value: string) {
  if (!value) return null;

  try {
    return new DateObject({
      date: value,
      format: "YYYY/MM/DD",
      calendar: persian,
      locale: persianFa,
    });
  } catch {
    return null;
  }
}

export function JalaliDatePickerSheet({
  isOpen,
  value,
  title = "تاریخ تحویل",
  onClose,
  onConfirm,
}: JalaliDatePickerSheetProps) {
  const [draftDate, setDraftDate] = useState<DateObject | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDraftDate(getInitialDate(value));
  }, [isOpen, value]);

  return (
    <BottomSheet
      ariaLabel={title}
      className="rounded-t-[14px]"
      contentClassName="p-0"
      heightClassName="h-auto max-h-[calc(100dvh-48px)]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="p-0"
      showBackButton
      showHandle={false}
      showHeader
      showHeaderDivider={false}
      title={title}
      titleAlign="right"
    >
      <div className="jalali-date-sheet" dir="rtl">
        <div className="jalali-calendar-container">
          <Calendar
            value={draftDate}
            onChange={(date) => {
              if (!date || Array.isArray(date)) {
                setDraftDate(null);
                return;
              }

              setDraftDate(date as DateObject);
            }}
            calendar={persian}
            locale={persianFa}
            format="YYYY/MM/DD"
            shadow={false}
            weekDays={["ش", "ی", "د", "س", "چ", "پ", "ج"]}
          />
        </div>

        <div className="jalali-date-actions">
          <Button unstyled
            className="jalali-date-action jalali-date-cancel"
            type="button"
            onClick={onClose}
          >
            لغو
          </Button>

          <Button unstyled
            className="jalali-date-action jalali-date-confirm"
            type="button"
            disabled={!draftDate}
            onClick={() => {
              if (!draftDate) return;
              onConfirm(draftDate.format("YYYY/MM/DD"));
            }}
          >
            تایید
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
