import { useEffect, useMemo, useState } from "react";

import { PageFrame } from "../../app/PageFrame";
import { getStoredAuthSession, storeLoginRedirectPath } from "../../auth/auth-storage";
import { TopBar } from "../../components/TopBar";
import { draftKey, locationKey, locationLatKey, locationLngKey, neighborhoodIdKey } from "./data";

type TransactionType = "sale" | "rent" | "project";
type RegistrantType = "" | "personal" | "agency";

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
  { id: "land", label: "زمین" },
  { id: "villa-house", label: "خانه ویلایی" },
  { id: "garden-villa", label: "باغ، ویلا" },
];

const residentialRentOptions: CategoryOption[] = [
  { id: "apartment", label: "آپارتمان" },
  { id: "villa-house", label: "خانه ویلایی" },
  { id: "garden-villa", label: "باغ، ویلا" },
];

const dailyRentOptions: CategoryOption[] = [
  { id: "daily-apartment-suite", label: "آپارتمان، سوئیت" },
  { id: "daily-garden-villa", label: "باغ، ویلا" },
  { id: "daily-hotel-apartment", label: "هتل، هتل آپارتمان" },
  { id: "daily-workspace", label: "دفاتر کار، غرفه، نمایشگاه" },
];

const commercialOptions: CategoryOption[] = [
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
    pageTitle: "انتخاب دسته‌بندی",
    sections: [
      {
        id: "sale-residential",
        title: "مسکونی",
        options: residentialSaleOptions,
      },
      {
        id: "sale-commercial",
        title: "اداری، تجاری، صنعتی، اقامتی",
        options: commercialOptions,
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
        title: "مسکونی",
        options: residentialRentOptions,
      },
      {
        id: "daily-rent",
        title: "روزانه",
        options: dailyRentOptions,
      },
      {
        id: "rent-commercial",
        title: "اداری، تجاری، صنعتی، اقامتی",
        options: commercialOptions,
      },
    ],
  },
  project: {
    id: "project",
    label: "پروژه",
    pageTitle: "انتخاب نوع پروژه",
    sections: [
      {
        id: "project-commercial",
        title: "اداری، تجاری، صنعتی، اقامتی",
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

function getLoginRequiredPath(returnTo: string) {
  const params = new URLSearchParams({ returnTo });

  return `/login-required?${params.toString()}`;
}

function getInitialType(): TransactionType {
  const type = new URLSearchParams(window.location.search).get("transaction");

  if (type === "rent" || type === "project" || type === "sale") {
    return type;
  }

  return "sale";
}

function getInitialRegistrantType(): RegistrantType {
  const registrantType = new URLSearchParams(window.location.search).get("registrantType");

  if (registrantType === "personal" || registrantType === "agency") {
    return registrantType;
  }

  if (window.location.pathname === "/new-ad/personal") return "personal";
  if (window.location.pathname === "/new-ad/jaliliyan-agency") return "agency";

  return "";
}

function PageHeader({ title }: { title: string }) {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    navigateTo("/home");
  };

  return (
    <TopBar onBack={handleBack} title={title} />
  );
}
function TransactionSegmentedControl({
  activeType,
  onChange,
}: {
  activeType: TransactionType;
  onChange: (type: TransactionType) => void;
}) {
  return (
    <div className="bg-[#f0f0f0] px-4 pb-4">
      <div
        aria-label="نوع معامله"
        className="grid grid-cols-3 overflow-hidden rounded-[17px] border border-[#808080] bg-white [direction:rtl]"
        role="tablist"
      >
        {transactionTabs.map((type, index) => {
          const config = transactionConfigs[type];
          const isActive = type === activeType;

          return (
            <button
              aria-selected={isActive}
              className={`min-w-0 py-2 text-center text-base font-medium leading-7 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440] ${index > 0 ? "border-r border-[#cccccc]" : ""
                } ${isActive ? "bg-[#0048c41f] text-[#002099]" : "bg-white text-[#1a1a1a]"}`}
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

function SelectedCheckIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path
        d="M4.5 10.2l3.4 3.4 7.6-8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
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
      className={`flex items-center justify-center gap-1 rounded-[10px] border p-2 max-h-9 !text-sm !font-medium leading-7 [direction:rtl] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${isSelected
        ? "border-[#0048c4] bg-[#0048c41f] text-[#0048c4]"
        : "border-[#cccccc] bg-white text-[#1a1a1a]"
        }`}
      onClick={onClick}
      type="button"
    >
      {isSelected ? <SelectedCheckIcon /> : null}
      <span>{label}</span>
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
    <section className="bg-white p-4">
      <div className="border-b border-[#e0e0e0] pb-2">
        <h2 className="m-0 text-right font-medium leading-7 text-[#808080]">
          {section.title}
        </h2>
      </div>

      <div className="flex flex-wrap justify-start gap-3 pt-4 [direction:rtl]">
        {section.options.map((option) => (
          <CategoryChip
            isSelected={option.id === selectedOptionId}
            key={option.id}
            label={option.label}
            onClick={() => onSelect(option.id)}
          />
        ))}
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
    <footer className="relative z-20 shrink-0 bg-white px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] shadow-[0_-10px_28px_rgba(0,0,0,0.10)] before:pointer-events-none before:absolute before:inset-x-0 before:-top-8 before:h-8 before:bg-gradient-to-t before:from-white before:to-transparent">
      <button
        className={`w-full rounded-[10px] py-2 text-lg font-medium leading-7 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${disabled
            ? "bg-[#e0e0e0] text-[#a6a6a6]"
            : "bg-[#0048c4] text-white active:bg-[#003ba1]"
          }`}
        disabled={disabled}
        onClick={onNext}
        type="button"
      >
        ادامه
      </button>
    </footer>
  );
}

export function NewAdCategoryPage() {
  useEffect(() => {
    if (getStoredAuthSession()) return;

    const returnTo = `${window.location.pathname}${window.location.search}`;
    storeLoginRedirectPath(returnTo);
    navigateTo(getLoginRequiredPath(returnTo));
  }, []);

  const registrantType = getInitialRegistrantType();
  const [activeType, setActiveType] = useState<TransactionType>(getInitialType);
  const [selectedOptionsByType, setSelectedOptionsByType] = useState<
    Record<TransactionType, string | null>
  >({
    sale: null,
    rent: null,
    project: null,
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
      className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white text-right text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <PageHeader title={activeConfig.pageTitle} />

      <TransactionSegmentedControl
        activeType={activeType}
        onChange={(type) => setActiveType(type)}
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
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
      </main>

      <NextActionBar
        disabled={!hasSelection}
        onNext={() => {
          if (!selectedOption) return;

          window.localStorage.removeItem(draftKey);
          window.localStorage.removeItem(locationKey);
          window.localStorage.removeItem(locationLatKey);
          window.localStorage.removeItem(locationLngKey);
          window.localStorage.removeItem(neighborhoodIdKey);

          const params = new URLSearchParams({
            transaction: activeType,
            category: selectedOption.id,
            label: selectedOption.label,
          });

          if (registrantType) {
            params.set("registrantType", registrantType);
          }

          navigateTo(`/new-ad/details?${params.toString()}`);
        }}
      />
    </PageFrame>
  );
}
