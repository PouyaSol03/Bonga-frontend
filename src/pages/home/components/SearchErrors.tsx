import NoSavedSearchIcon from "/vectors/NoSavedSearch.svg";
import NoSearchIcon from "/vectors/NoSearch.svg";
import NotFoundSearchIcon from "/vectors/NotFoundSearch.svg";

type SearchErrorVariant = "no-search" | "not-found" | "no-saved-search";

type SearchErrorsProps = {
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
    iconClassName: "w-[82px] h-[82px]",
  },

  "not-found": {
    icon: NotFoundSearchIcon,
    title: "هیچ نتیجه‌ای یافت نشد!",
    description: "فیلترها یا عبارت جستجو را تغییر دهید و دوباره تلاش کنید.",
    iconClassName: "w-[82px] h-[82px]",
  },

  "no-saved-search": {
    icon: NoSavedSearchIcon,
    title: "هیچ جستجوی ذخیره‌شده‌ای وجود ندارد",
    description: "جستجوهای موردنظر خود را ذخیره کنید تا در این بخش نمایش داده شوند.",
    iconClassName: "w-[78px] h-[78px]",
  },
};

export default function SearchErrors({
  variant = "no-search",
}: SearchErrorsProps) {
  const content = searchErrorContent[variant];

  return (
    <div className="flex h-full min-h-[520px] w-full items-center justify-center px-6">
      <div className="flex max-w-[280px] flex-col items-center text-center">
        <img
          src={content.icon}
          alt=""
          className={`${content.iconClassName} mb-4 object-contain`}
          draggable={false}
        />

        <h3 className="mb-2 font-bold leading-6 text-[#111827]">
          {content.title}
        </h3>

        <p className="text-sm font-normal leading-6 text-[#4D4D4D]">
          {content.description}
        </p>
      </div>
    </div>
  );
}