import { Link } from "react-router";
import { Typography } from "../../../../shared/ui/Typography";
import { PlusIcon } from "./icons";

export function EmptyAccountState({
  description,
  iconSrc,
  title,
}: {
  description: string;
  iconSrc: string;
  title: string;
}) {
  return (
    <section className="mx-auto flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center px-9 text-center">
      <img alt="" aria-hidden="true" className="mb-5 h-[66px] w-[66px]" src={iconSrc} />
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0 text-base leading-6 font-bold"
      >
        {title}
      </Typography>
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 max-w-[290px] text-sm leading-6 font-normal"
      >
        {description}
      </Typography>
    </section>
  );
}

export function AccountMyAdsEmptyState({
  description: customDescription,
  filterLabel,
  mode,
  showAction,
  title: customTitle,
}: {
  description?: string;
  filterLabel?: string;
  mode?: "compact" | "full";
  showAction?: boolean;
  title?: string;
}) {
  const isAllFilter = filterLabel === "همه";
  const title =
    customTitle ??
    (isAllFilter
      ? "هیچ آگهی‌ای برای نمایش وجود ندارد!"
      : `هیچ آگهی‌ای در وضعیت ${filterLabel} وجود ندارد!`);
  const description =
    customDescription ??
    (isAllFilter
      ? "می‌توانید همین حالا آگهی جدید ثبت کنید و وضعیت آن را از این بخش پیگیری نمایید."
      : "وقتی آگهی‌ای در این وضعیت داشته باشید، همین‌جا نمایش داده می‌شود.");
  const heightClass = mode === "full" ? "h-full min-h-0 flex-1" : "h-full min-h-0 flex-1";
  const shouldShowAction = showAction ?? (customTitle ? false : isAllFilter);

  return (
    <section
      className={`mx-auto flex ${heightClass} w-full flex-col items-center justify-center px-10 text-center`}
    >
      <img
        alt=""
        aria-hidden="true"
        className="mb-4 h-[66px] w-[66px] object-contain"
        src="/vectors/NoAdd.svg"
      />
      <Typography
        as="p"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0"
      >
        {title}
      </Typography>
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface-var m-0 mt-2"
      >
        {description}
      </Typography>
      {shouldShowAction ? (
        <Link
          className="bg-primary text-on-primary mt-4 inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm leading-5 font-medium"
          to="/new-ad/category"
        >
          <PlusIcon className="h-5 w-5" />
          ثبت آگهی
        </Link>
      ) : null}
    </section>
  );
}
