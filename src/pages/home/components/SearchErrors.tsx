import NoSearchIcon from "/vectors/NoSearch.svg";
import NotFoundSearchIcon from "/vectors/NotFoundSearch.svg";

import { EmptyState } from "../../../components/EmptyState";

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
  }
> = {
  "no-search": {
    icon: NoSearchIcon,
    title: "هنوز جستجویی انجام نداده‌اید",
    description: "پس از اولین جستجو، سوابق آن در این بخش نمایش داده خواهد شد.",
  },
  "not-found": {
    icon: NotFoundSearchIcon,
    title: "هیچ نتیجه‌ای یافت نشد!",
    description: "فیلترها یا عبارت جستجو را تغییر دهید و دوباره تلاش کنید.",
  },
  "no-saved-search": {
    icon: NoSearchIcon,
    title: "هیچ جستجوی ذخیره‌شده‌ای وجود ندارد",
    description: "جستجوهای موردنظر خود را ذخیره کنید تا در این بخش نمایش داده شوند.",
  },
};

export default function SearchErrors({
  className = "",
  variant = "no-search",
}: SearchErrorsProps) {
  const content = searchErrorContent[variant];

  return (
    <EmptyState
      className={className}
      description={content.description}
      iconSrc={content.icon}
      title={content.title}
    />
  );
}
