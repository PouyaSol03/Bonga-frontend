import { useMemo, useState } from "react";

import { PageFrame } from "../../app/PageFrame";
import { TopBar } from "../../components/TopBar";

type TransactionType = "sale" | "rent" | "project";

type CategoryOption = {
  id: string;
  label: string;
};

type CategorySection = {
  id: string;
  title: string;
  options: CategoryOption[];
};

type TransactionConfig = {
  id: TransactionType;
  label: string;
  pageTitle: string;
  sections: CategorySection[];
};

const residentialSaleOptions: CategoryOption[] = [
  { id: "apartment", label: "آپارتمان" },
  { id: "villa-house", label: "خانه ویلایی" },
  { id: "garden-villa", label: "باغ، ویلا" },
  { id: "land", label: "زمین" },
];

const commercialSaleOptions: CategoryOption[] = [
  { id: "office", label: "واحد اداری" },
  { id: "commercial-unit", label: "واحد تجاری" },
  { id: "warehouse", label: "انبار، سوله" },
  { id: "hotel-apartment", label: "هتل، هتل آپارتمان" },
  { id: "factory-workshop", label: "کارخانه، کارگاه" },
];

const transactionConfigs: Record<TransactionType, TransactionConfig> = {
  sale: {
    id: "sale",
    label: "فروش",
    pageTitle: "انتخاب نوع معامله",
    sections: [
      {
        id: "sale-residential",
        title: "فروش مسکونی",
        options: residentialSaleOptions,
      },
      {
        id: "sale-commercial",
        title: "فروش اداری، تجاری، صنعتی، اقامتی",
        options: commercialSaleOptions,
      },
    ],
  },
  rent: {
    id: "rent",
    label: "اجاره",
    pageTitle: "انتخاب نوع معامله",
    sections: [
      {
        id: "rent-residential",
        title: "اجاره مسکونی",
        options: residentialSaleOptions.filter((option) => option.id !== "land"),
      },
      {
        id: "daily-rent",
        title: "اجاره روزانه",
        options: [
          { id: "daily-apartment-suite", label: "آپارتمان، سوئیت" },
          { id: "daily-villa-house", label: "خانه ویلایی" },
          { id: "daily-garden-villa", label: "باغ، ویلا" },
          { id: "daily-hotel-apartment", label: "هتل، هتل آپارتمان" },
          { id: "daily-workspace", label: "دفاتر کار، غرفه، نمایشگاه" },
        ],
      },
      {
        id: "rent-commercial",
        title: "اجاره اداری، تجاری، صنعتی، اقامتی",
        options: commercialSaleOptions,
      },
    ],
  },
  project: {
    id: "project",
    label: "پروژه",
    pageTitle: "انتخاب نوع پروژه",
    sections: [
      {
        id: "project",
        title: "پروژه",
        options: [
          { id: "project-presale", label: "پیش فروش، فروش پروژه" },
          { id: "project-partnership", label: "مشارکت" },
        ],
      },
    ],
  },
};

const transactionTabs: TransactionType[] = ["sale", "rent", "project"];

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function TransactionSegmentedControl({
  activeType,
  onChange,
}: {
  activeType: TransactionType;
  onChange: (type: TransactionType) => void;
}) {
  return (
    <div className="px-4 pb-4 pt-4">
      <div
        className="grid h-10 grid-cols-3 overflow-hidden rounded-[20px] border border-[#808080] bg-white [direction:rtl]"
        role="tablist"
        aria-label="نوع معامله"
      >
        {transactionTabs.map((type) => {
          const config = transactionConfigs[type];
          const isActive = type === activeType;

          return (
            <button
              aria-selected={isActive}
              className={`min-w-0 border-l border-[#808080] px-3 text-center text-base font-medium leading-6 transition-colors last:border-l-0 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440] ${
                isActive
                  ? "bg-[#0048c41f] text-[#002099]"
                  : "bg-white text-[#4d4d4d]"
              }`}
              key={type}
              onClick={() => onChange(type)}
              role="tab"
              type="button"
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CategoryChip({
  isSelected,
  label,
  onClick,
}: {
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`h-10 rounded-2xl border px-4 text-sm font-medium leading-5 transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${
        isSelected
          ? "border-[#0048c4] bg-[#0048c41f] text-[#0048c4]"
          : "border-[#cccccc] bg-white text-[#1a1a1a]"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function CategoryOptionSection({
  section,
  selectedOptionId,
  onSelect,
}: {
  section: CategorySection;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
}) {
  return (
    <section className="border-t-[16px] border-[#f0f0f0] bg-white px-4 py-6 first:border-t-0">
      <div className="mx-auto flex w-full max-w-[328px] flex-col gap-6">
        <h2 className="m-0 text-right text-base font-medium leading-6 text-[#1a1a1a]">
          {section.title}
        </h2>

        <div className="flex flex-wrap justify-start gap-x-4 gap-y-4 [direction:rtl]">
          {section.options.map((option) => (
            <CategoryChip
              isSelected={option.id === selectedOptionId}
              key={option.id}
              label={option.label}
              onClick={() => onSelect(option.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function NextActionBar({
  disabled,
  onNext,
}: {
  disabled: boolean;
  onNext: () => void;
}) {
  return (
    <footer className="shrink-0 bg-white px-4 py-3 shadow-[0_-12px_24px_rgba(255,255,255,0.92)]">
      <button
        className={`h-10 w-full rounded-[10px] text-sm font-medium leading-5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${
          disabled
            ? "bg-[#e0e0e0] text-[#a6a6a6]"
            : "bg-[#0048c4] text-white"
        }`}
        disabled={disabled}
        onClick={onNext}
        type="button"
      >
        مرحله بعد
      </button>
    </footer>
  );
}

export function NewAdCategoryPage() {
  const [activeType, setActiveType] = useState<TransactionType>("sale");
  const [selectedOptionsByType, setSelectedOptionsByType] = useState<
    Record<TransactionType, string | null>
  >({
    sale: null,
    rent: "apartment",
    project: "project-presale",
  });

  const activeConfig = transactionConfigs[activeType];
  const selectedOptionId = selectedOptionsByType[activeType];
  const hasSelection = selectedOptionId !== null;

  const selectedOption = useMemo(
    () =>
      activeConfig.sections
        .flatMap((section) => section.options)
        .find((option) => option.id === selectedOptionId),
    [activeConfig.sections, selectedOptionId],
  );

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f5f5f5] text-[#1a1a1a]"
      variant="flush"
    >
      <TopBar
        backIconDirection="right"
        onBack={() => {
          if (window.history.length > 1) {
            window.history.back();
            return;
          }

          navigateTo("/home");
        }}
        title={activeConfig.pageTitle}
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <TransactionSegmentedControl
          activeType={activeType}
          onChange={setActiveType}
        />

        <div className="bg-white">
          {activeConfig.sections.map((section) => (
            <CategoryOptionSection
              key={section.id}
              onSelect={(optionId) => {
                setSelectedOptionsByType((current) => ({
                  ...current,
                  [activeType]: optionId,
                }));
              }}
              section={section}
              selectedOptionId={selectedOptionId}
            />
          ))}
        </div>
      </main>

      <NextActionBar
        disabled={!hasSelection}
        onNext={() => {
          if (!selectedOption) return;

          navigateTo(
            `/new-ad/category/next?transaction=${activeType}&category=${selectedOption.id}`,
          );
        }}
      />
    </PageFrame>
  );
}
