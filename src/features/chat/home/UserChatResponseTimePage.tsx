import { useResponseAvailability } from "./useResponseAvailability";
import { useState } from "react";
import { TopBar } from "../../../shared/components/TopBar";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { ChevronLeftIcon, CloseIcon } from "./listIcons";
import {
  formatResponseTime,
  getResponseDayLabel,
  type ResponseTimeSheet,
} from "./responseAvailability";
import { ResponseTimeDaysSheet } from "./ResponseTimeDaysSheet";
import { ResponseTimeHourSheet } from "./ResponseTimeHourSheet";
import { ResponseTimeSelectBox } from "./ResponseTimeSelectBox";

export function UserChatResponseTimePage() {
  const [openSheet, setOpenSheet] = useState<ResponseTimeSheet>(null);
  const {
    availabilityQuery,
    updateAvailabilityMutation,
    selectedDays,
    startHour,
    endHour,
    setStartHour,
    setEndHour,
    toggleDay,
    saveAvailability,
    isBusy,
  } = useResponseAvailability();

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backLabel="بازگشت به چت‌ها"
        backTo="/chat"
        className="border-outline-var border-b"
        contentClassName="px-0"
        heightClassName="h-[60px]"
        title="ساعت پاسخگویی"
        titleClassName="text-base font-semibold leading-6"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto pb-28">
        <section className="text-on-surface px-4 pt-5 pb-4 text-right text-xs leading-5 font-normal">
          <Typography as="p" variant="body" size="medium" weight="regular">
            ساعت پاسخگویی خود را در چت مشخص کنید.
          </Typography>
          <Typography as="p" variant="body" size="medium" weight="regular">
            این ساعت زیر اسم شما در چت و برای کاربران نمایش داده می‌شود.
          </Typography>
        </section>

        {availabilityQuery.isError ? (
          <div className="bg-error-container/30 text-error mx-4 mb-3 rounded-lg px-3 py-2 text-xs leading-5">
            دریافت ساعت پاسخگویی با خطا مواجه شد.
            <Button
              unstyled
              className="text-primary mr-2 font-semibold"
              onClick={() => void availabilityQuery.refetch()}
              type="button"
            >
              تلاش دوباره
            </Button>
          </div>
        ) : null}

        <Button
          unstyled
          className="focus-visible:outline-inset focus-visible:outline-primary/40 flex h-14 w-full items-center gap-3 px-4 text-right focus-visible:outline-3 disabled:cursor-wait disabled:opacity-60"
          disabled={availabilityQuery.isLoading}
          onClick={() => setOpenSheet("days")}
          type="button"
        >
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="semibold"
            className="text-on-surface min-w-0 flex-1 text-xs leading-5 font-semibold"
          >
            روزهای هفته
          </Typography>
          <ChevronLeftIcon className="text-on-surface-var h-4 w-4 shrink-0" />
        </Button>

        {selectedDays.length ? (
          <div className="flex flex-wrap justify-start gap-2 px-4 pt-1 pb-4 [direction:rtl]">
            {selectedDays.map((day) => (
              <Button
                unstyled
                className="border-primary bg-primary-container/20 text-primary flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[11px] leading-4 font-medium"
                key={day}
                onClick={() => toggleDay(day)}
                type="button"
              >
                <Typography as="span" variant="body" size="medium" weight="regular">
                  {getResponseDayLabel(day)}
                </Typography>
                <CloseIcon className="h-3 w-3" />
              </Button>
            ))}
          </div>
        ) : (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline px-4 pb-4 text-[11px] leading-4"
          >
            با ثبت بدون انتخاب روز، ساعت پاسخگویی پاک می‌شود.
          </Typography>
        )}

        <section className="border-outline-var border-t px-4 pt-5">
          <Typography
            as="h2"
            variant="title"
            size="small"
            weight="semibold"
            className="text-on-surface mb-4 text-right text-xs leading-5 font-semibold"
          >
            تعیین ساعت شروع و پایان
          </Typography>
          <div className="flex gap-2 [direction:rtl]">
            <ResponseTimeSelectBox
              label="از ساعت"
              onClick={() => setOpenSheet("start")}
              onClear={() => setStartHour(undefined)}
              value={startHour ? formatResponseTime(startHour) : undefined}
            />
            <ResponseTimeSelectBox
              label="تا ساعت"
              onClick={() => setOpenSheet("end")}
              onClear={() => setEndHour(undefined)}
              value={endHour ? formatResponseTime(endHour) : undefined}
            />
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 z-20 px-4 pt-3 pb-4 shadow-[0_-8px_22px_rgba(0,0,0,0.05)]">
        <Button
          unstyled
          className="bg-primary focus-visible:outline-primary/40 h-11 w-full rounded-lg text-sm leading-5 font-semibold text-white focus-visible:outline-3 focus-visible:outline-offset-2 active:opacity-90 disabled:cursor-wait disabled:opacity-60"
          disabled={isBusy}
          onClick={() => void saveAvailability()}
          type="button"
        >
          {updateAvailabilityMutation.isPending
            ? "در حال ثبت..."
            : availabilityQuery.isLoading
              ? "در حال دریافت..."
              : "ثبت"}
        </Button>
      </footer>

      <ResponseTimeDaysSheet
        isOpen={openSheet === "days"}
        onClose={() => setOpenSheet(null)}
        onToggleDay={toggleDay}
        selectedDays={selectedDays}
      />
      <ResponseTimeHourSheet
        isOpen={openSheet === "start"}
        onClose={() => setOpenSheet(null)}
        onSelect={setStartHour}
        title="از ساعت"
      />
      <ResponseTimeHourSheet
        isOpen={openSheet === "end"}
        onClose={() => setOpenSheet(null)}
        onSelect={setEndHour}
        title="تا ساعت"
      />
    </PageFrame>
  );
}
