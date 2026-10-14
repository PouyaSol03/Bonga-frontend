import { useMemo, useState } from "react";

import { PageFrame } from "../../shared/layout/PageFrame";
import LinearArrowDown1 from "../../shared/icons/LinearArrowDown1";
import LinearChat from "../../shared/icons/LinearChat";
import LinearSearch from "../../shared/icons/LinearSearch";
import { TopBar } from "../../shared/components/TopBar";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { Link } from "react-router";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

const SUPPORT_PATH = "/account/support";
const SUPPORT_CHAT_PATH = "/account/support/chat";

type FaqCategory = "all" | "account" | "advertises" | "property" | "chat" | "support";

type FaqItem = {
  answer: string;
  category: Exclude<FaqCategory, "all">;
  id: string;
  question: string;
};

const faqCategories: Array<{ id: FaqCategory; label: string }> = [
  { id: "all", label: "همه" },
  { id: "account", label: "حساب کاربری" },
  { id: "advertises", label: "آگهی‌ها" },
  { id: "property", label: "املاک" },
  { id: "chat", label: "چت" },
  { id: "support", label: "پشتیبانی" },
];

const faqItems: FaqItem[] = [
  {
    id: "create-account",
    category: "account",
    question: "چگونه حساب کاربری ایجاد کنم؟",
    answer: "برای ثبت‌نام، شماره موبایل خود را وارد کرده و کد تأیید ارسال‌شده را ثبت کنید.",
  },
  {
    id: "edit-profile",
    category: "account",
    question: "چگونه اطلاعات پروفایل خود را ویرایش کنم؟",
    answer:
      "از بخش حساب من وارد مشخصات من شوید، اطلاعات موردنظر را تغییر دهید و سپس گزینه ذخیره را انتخاب کنید.",
  },
  {
    id: "create-advertise",
    category: "advertises",
    question: "چگونه آگهی جدید ثبت کنم؟",
    answer:
      "از دکمه ثبت آگهی استفاده کنید، دسته‌بندی و مشخصات ملک را تکمیل کرده و در پایان آگهی را برای بررسی ارسال کنید.",
  },
  {
    id: "advertise-pending",
    category: "advertises",
    question: "چرا آگهی من هنوز منتشر نشده است؟",
    answer:
      "آگهی‌های جدید پیش از انتشار بررسی می‌شوند. وضعیت بررسی را می‌توانید از بخش آگهی‌های من مشاهده کنید.",
  },
  {
    id: "edit-advertise",
    category: "advertises",
    question: "چگونه آگهی خود را ویرایش کنم؟",
    answer:
      "در بخش آگهی‌های من، آگهی موردنظر را باز کنید و از گزینه ویرایش برای تغییر اطلاعات استفاده کنید.",
  },
  {
    id: "delete-advertise",
    category: "advertises",
    question: "چگونه آگهی خود را حذف کنم؟",
    answer:
      "آگهی را از بخش آگهی‌های من انتخاب کنید و پس از ورود به مدیریت آگهی، گزینه حذف را بزنید.",
  },
  {
    id: "rejected-advertise",
    category: "advertises",
    question: "چرا آگهی من رد شده است؟",
    answer:
      "علت رد آگهی در جزئیات آن نمایش داده می‌شود. پس از اصلاح موارد اعلام‌شده می‌توانید آگهی را دوباره ارسال کنید.",
  },
  {
    id: "increase-credit",
    category: "account",
    question: "چگونه اعتبار حساب خود را افزایش دهم؟",
    answer:
      "از حساب من وارد کیف پول شوید، مبلغ موردنظر را انتخاب کنید و مراحل پرداخت را انجام دهید.",
  },
  {
    id: "find-property",
    category: "property",
    question: "چگونه ملک موردنظر خود را پیدا کنم؟",
    answer:
      "از جستجو و فیلترهای صفحه آگهی‌ها برای انتخاب شهر، محله، نوع ملک و محدوده قیمت استفاده کنید.",
  },
  {
    id: "start-chat",
    category: "chat",
    question: "چگونه با آگهی‌دهنده گفتگو کنم؟",
    answer: "در صفحه جزئیات آگهی، گزینه گفتگو را انتخاب کنید تا صفحه چت با آگهی‌دهنده باز شود.",
  },
  {
    id: "support-request",
    category: "support",
    question: "چگونه درخواست پشتیبانی ثبت کنم؟",
    answer: "از صفحه پشتیبانی وارد درخواست‌های من شوید و گزینه ایجاد درخواست جدید را انتخاب کنید.",
  },
];

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase("fa-IR");
}

function FaqCategoryTabs({
  activeCategory,
  onChange,
}: {
  activeCategory: FaqCategory;
  onChange: (category: FaqCategory) => void;
}) {
  return (
    <nav
      aria-label="دسته‌بندی سوالات متداول"
      className="flex h-11 [scrollbar-width:none] gap-2 overflow-x-auto px-3 pb-2 [-ms-overflow-style:none] [direction:rtl] [&::-webkit-scrollbar]:hidden"
    >
      {faqCategories.map((category) => {
        const isActive = activeCategory === category.id;

        return (
          <Button
            unstyled
            aria-pressed={isActive}
            className={`focus-visible:outline-primary/25 flex h-9 shrink-0 items-center justify-center rounded-lg border px-3 text-xs leading-4 font-medium transition-colors focus-visible:outline-3 focus-visible:outline-offset-1 ${
              isActive
                ? "border-primary bg-primary-container text-primary"
                : "border-outline-var bg-surface-container-lowest text-on-surface-var active:bg-surface-container-low"
            }`}
            key={category.id}
            onClick={() => onChange(category.id)}
            type="button"
          >
            {category.label}
          </Button>
        );
      })}
    </nav>
  );
}

function FaqAccordionItem({
  isOpen,
  item,
  onToggle,
}: {
  isOpen: boolean;
  item: FaqItem;
  onToggle: () => void;
}) {
  return (
    <article className="border-outline-var bg-surface-container-lowest overflow-hidden rounded-xl border p-4">
      <Button
        unstyled
        aria-expanded={isOpen}
        className="active:bg-surface-container-low focus-visible:ring-primary/25 flex w-full items-center justify-between gap-3 text-right transition-colors outline-none focus-visible:ring-3 focus-visible:ring-inset"
        onClick={onToggle}
        type="button"
      >
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="semibold"
          className={`min-w-0 flex-1 text-sm font-semibold ${
            isOpen ? "text-primary" : "text-on-surface"
          }`}
        >
          {item.question}
        </Typography>

        <LinearArrowDown1
          className={`text-on-surface-var h-5 w-5 shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </Button>

      <div
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface-var m-0 pt-4 text-right text-sm leading-6 font-normal"
          >
            {item.answer}
          </Typography>
        </div>
      </div>
    </article>
  );
}

export function AccountSupportFaqPage() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("all");
  const [expandedId, setExpandedId] = useState<string>(faqItems[0].id);
  const [search, setSearch] = useState("");

  const visibleItems = useMemo(() => {
    const normalizedSearch = normalizeSearchText(search);

    return faqItems.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        normalizeSearchText(item.question).includes(normalizedSearch) ||
        normalizeSearchText(item.answer).includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden"
      variant="flush"
    >
      <TopBar
        backTo={SUPPORT_PATH}
        className="border-outline-var border-b"
        heightClassName="h-[52px]"

        reserveStartSpace
        title="سوالات متداول"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <section className="border-outline-var bg-surface-container-lowest shrink-0 border-b pt-3">
        <label className="border-outline bg-surface-container-lowest text-outline focus-within:border-primary focus-within:ring-primary/20 mx-3 mb-2 flex h-12 items-center gap-2 rounded-xl border px-3 focus-within:ring-3">
          <input
            aria-label="جستجو در سوالات متداول"
            className="text-on-surface placeholder:text-outline min-w-0 flex-1 bg-transparent text-right text-sm leading-5 font-normal outline-none"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="دنبال چه چیزی هستید؟"
            type="search"
            value={search}
          />
          <LinearSearch className="h-5 w-5 shrink-0" />
        </label>

        <FaqCategoryTabs
          activeCategory={activeCategory}
          onChange={(category) => {
            setActiveCategory(category);
            setExpandedId("");
          }}
        />
      </section>

      <main className="bg-surface-container-lowest flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pt-3 pb-24">
        <div className="space-y-2.5">
          {visibleItems.map((item) => (
            <FaqAccordionItem
              isOpen={expandedId === item.id}
              item={item}
              key={item.id}
              onToggle={() => setExpandedId((currentId) => (currentId === item.id ? "" : item.id))}
            />
          ))}
        </div>

        {visibleItems.length === 0 ? (
          <SearchEmptyState description="دسته‌بندی یا عبارت جستجو را تغییر دهید و دوباره تلاش کنید." />
        ) : null}
      </main>

      <Link
        aria-label="گفتگو با پشتیبانی"
        className="bg-primary text-on-primary focus-visible:ring-surface-container-lowest focus-visible:ring-offset-primary absolute right-4 bottom-5 z-20 grid h-12 w-12 place-items-center rounded-full shadow-[0_6px_16px_rgba(0,72,196,0.24)] outline-none focus-visible:ring-3 focus-visible:ring-offset-2 active:scale-[0.98]"
        to={SUPPORT_CHAT_PATH}
      >
        <LinearChat className="h-5.5 w-5.5" />
      </Link>
    </PageFrame>
  );
}
