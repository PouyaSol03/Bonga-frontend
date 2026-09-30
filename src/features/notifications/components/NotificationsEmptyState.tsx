import { Typography } from "../../../shared/ui/Typography";

export function NotificationsEmptyState({
  isFiltered = false,
}: {
  isFiltered?: boolean;
}) {
  return (
    <section className="mx-auto flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center px-10 text-center">
      <img
        alt=""
        aria-hidden="true"
        className="mb-4 h-[66px] w-[66px] object-contain"
        src="/vectors/NoNotification.svg"
      />
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 font-semibold text-on-surface"
      >
        {isFiltered
          ? "اعلانی با فیلترهای انتخاب‌شده پیدا نشد"
          : "هنوز اعلانی دریافت نکرده‌اید"}
      </Typography>
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="m-0 mt-2 text-sm font-normal leading-6 text-on-surface-var"
      >
        {isFiltered
          ? "فیلترها را تغییر دهید یا پاک کنید."
          : "تغییرات مربوط به آگهی‌ها، درخواست‌ها، پرداخت‌ها و فعالیت آژانس‌ها از اینجا به شما اطلاع داده می‌شود."}
      </Typography>
    </section>
  );
}
