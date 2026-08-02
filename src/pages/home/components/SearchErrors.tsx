import NoSearchIcon from "../../../shared/assets/icons/NoSearch.svg";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { Typography } from "../../../shared/ui/Typography";

type SearchErrorVariant = "no-search" | "not-found" | "no-saved-search";

type SearchErrorsProps = {
  className?: string;
  variant?: SearchErrorVariant;
};

const searchErrorContent: Record<
  SearchErrorVariant,
  {
    icon: string;
    title: string;
    description: string;
    iconClassName: string;
  }
> = {
  "no-search": {
    icon: NoSearchIcon,
    title: "هنوز جستجویی انجام نداده‌اید",
    description: "پس از اولین جستجو، سوابق آن در این بخش نمایش داده خواهد شد.",
    iconClassName: "w-[66px] h-[66px]",
  },

  "not-found": {
    icon: NoSearchIcon,
    title: "هیچ نتیجه‌ای یافت نشد!",
    description: "فیلترها یا عبارت جستجو را تغییر دهید و دوباره تلاش کنید.",
    iconClassName: "w-[66px] h-[66px]",
  },

  "no-saved-search": {
    icon: NoSearchIcon,
    title: "هیچ جستجوی ذخیره‌شده‌ای وجود ندارد",
    description: "جستجوهای موردنظر خود را ذخیره کنید تا در این بخش نمایش داده شوند.",
    iconClassName: "w-[66px] h-[66px]",
  },
};

export default function SearchErrors({
  className = "min-h-[520px]",
  variant = "no-search",
}: SearchErrorsProps) {
  if (variant === "not-found") {
    return <SearchEmptyState className={className} />;
  }

  const content = searchErrorContent[variant];

  return (
    <div className={`mx-auto flex h-full w-full items-center justify-center px-6 ${className}`}>
      <div className="mx-auto flex w-full max-w-[280px] flex-col items-center text-center">
        <img
          src={content.icon}
          alt=""
          className={`${content.iconClassName} mb-4 object-contain`}
          draggable={false}
        />

        <Typography as="p" variant="title" size="medium" weight="semibold" className="mb-2 text-[#1a1a1a]">
          {content.title}
        </Typography>

        <Typography as="p" variant="body" size="medium" weight="regular" className="text-[#4D4D4D]">
          {content.description}
        </Typography>
      </div>
    </div>
  );
}
