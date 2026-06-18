import { useEffect, useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persianFa from "react-date-object/locales/persian_fa";

import { BottomSheet } from "../../../../components/BottomSheet";

type JalaliDatePickerSheetProps = {
  isOpen: boolean;
  value: string;
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
      ariaLabel="تاریخ تحویل"
      className="rounded-t-[14px]"
      contentClassName="pb-4 pt-0"
      handleClassName="h-1 w-[42px] rounded-full bg-[#e0e0e0]"
      heightClassName="h-auto max-h-[calc(100dvh-48px)]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      showBackButton={false}
      showHandle
      showHeader
      showHeaderDivider={false}
      title="تاریخ تحویل"
      titleAlign="center"
    >
      <div className="px-4 pb-4 pt-2" dir="rtl">
        <div className="flex justify-center">
          <Calendar
            value={draftDate}
            onChange={(date) => setDraftDate(date as DateObject | null)}
            calendar={persian}
            locale={persianFa}
            format="YYYY/MM/DD"
            shadow={false}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            className="h-12 rounded-[10px] border border-[#0048c4] bg-white text-base font-medium leading-6 text-[#0048c4]"
            type="button"
            onClick={onClose}
          >
            لغو
          </button>

          <button
            className="h-12 rounded-[10px] bg-[#0048c4] text-base font-medium leading-6 text-white active:bg-[#003ba1]"
            type="button"
            onClick={() => {
              if (!draftDate) return;
              onConfirm(draftDate.format("YYYY/MM/DD"));
            }}
          >
            تایید
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
