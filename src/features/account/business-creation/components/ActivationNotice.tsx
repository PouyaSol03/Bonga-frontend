import Dashboard from "../../../../shared/icons/Dashboard";
import LinearCancelSmall from "../../../../shared/icons/LinearCancelSmall";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { BusinessType } from "../types";

export function ActivationNotice({
  businessType,
  onClose,
}: {
  businessType: BusinessType;
  onClose: () => void;
}) {
  const isAgency = businessType === "agency";

  return (
    <section className="border-tertiary bg-tertiary-container/20 text-tertiary rounded-2xl border p-4 text-right">
      <div className="flex items-start gap-3 [direction:ltr]">
        <div className="min-w-0 flex-1 [direction:rtl]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2.5">
              <Dashboard className="h-6 w-6" />
              <Typography
                as="h2"
                variant="body"
                size="large"
                weight="medium"
                className="text-tertiary m-0"
              >
                پنل شما آماده فعال‌سازی است!
              </Typography>
            </div>

            <Button
              unstyled
              aria-label="بستن پیام"
              className="text-on-surface-var active:bg-surface-container grid h-6 w-6 shrink-0 place-items-center rounded-full"
              onClick={onClose}
              type="button"
            >
              <LinearCancelSmall className="h-6 w-6" />
            </Button>
          </div>

          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-tertiary m-0 mt-3 text-sm leading-6 font-normal"
          >
            {isAgency
              ? "پس از ورود به پنل آژانس، پرداخت اشتراک پنل آژانس خود را به مدت ۱ سال فعال کنید و از بسته‌های پیش‌فرض حرفه‌ای بهره‌مند شوید."
              : "با ایجاد کسب‌وکار مشاور، پروفایل حرفه‌ای خود را فعال کنید و به ابزارهای تخصصی مدیریت فایل‌ها، مشتریان و فعالیت‌های روزانه دسترسی داشته باشید."}
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-tertiary m-0 mt-4 text-sm leading-6 font-normal"
          >
            {isAgency
              ? "همین حالا ثبت‌نام را انجام دهید و وارد دنیای حرفه‌ای املاک شوید!"
              : "همین حالا کسب‌وکار خود را ایجاد کنید و فعالیت حرفه‌ای خود را در بازار املاک آغاز کنید!"}
          </Typography>
        </div>
      </div>
    </section>
  );
}
