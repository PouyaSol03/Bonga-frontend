import LinearCancel from "../../../../shared/icons/LinearCancel";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";

export function ReceivedRequestsGuide({ onClose }: { onClose: () => void }) {
  return (
    <section className="border-surface-container bg-surface-container-lowest border-b-8 px-4 py-4">
      <div className="bg-primary-container text-primary rounded-2xl px-4 pt-5 pb-4">
        <div className="flex items-center justify-between [direction:ltr]">
          <Button
            unstyled
            aria-label="بستن راهنما"
            className="text-on-surface-var focus-visible:outline-primary/40 active:bg-surface-container-lowest/60 grid h-8 w-8 place-items-center rounded-full transition focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
            onClick={onClose}
            type="button"
          >
            <LinearCancel className="h-5 w-5" />
          </Button>

          <div className="text-primary flex items-center gap-2 [direction:rtl]">
            <LinearInfoCircle className="h-6 w-6 shrink-0" />
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="m-0 text-base leading-6 font-semibold"
            >
              راهنما
            </Typography>
          </div>
        </div>

        <Typography
          as="p"
          variant="body"
          size="large"
          weight="regular"
          className="m-0 mt-3 text-right text-[15px] leading-7 font-normal [direction:rtl]"
        >
          در این بخش، درخواست‌های ملکی کاربران نمایش داده می‌شود. شما می‌توانید براساس نیازهای
          اعلام‌شده، ملک مناسب را پیدا کرده و فایل مرتبط را برای مشتری منتشر کنید. این بخش به شما
          کمک می‌کند سریع‌تر و دقیق‌تر نیاز مشتری را برطرف کنید.
        </Typography>
      </div>
    </section>
  );
}
