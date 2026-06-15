import { useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { PageFrame } from "../../app/PageFrame";
import {
  FormChoiceChip,
  FormSegmentedControl,
  FormSelectField,
  FormSwitch,
  FormTextField,
} from "../../components/form/FormControls";
import { TopBar } from "../../components/TopBar";
import { RouteLink } from "../../routes/RouteLink";

type TransactionType = "sale" | "rent" | "dailyRent" | "project";

type CategoryKey =
  | "apartment"
  | "villaHouse"
  | "gardenVilla"
  | "land"
  | "office"
  | "shop"
  | "industrial"
  | "warehouse"
  | "hotelApartment";

type FilterBlock =
  | "neighborhood"
  | "area"
  | "landArea"
  | "salePrice"
  | "rentPrice"
  | "depositPrice"
  | "age"
  | "bedrooms"
  | "floor"
  | "renovated"
  | "furnished"
  | "suitableFor"
  | "unitType"
  | "homeType"
  | "gardenVillaType"
  | "unitOrientation"
  | "landOrientation"
  | "heating"
  | "amenities"
  | "advertiser"
  | "publicationTime"
  | "adFlags";

type FilterState = {
  advertiser?: string;
  publicationTime?: string;
  transaction: TransactionType;
  category?: CategoryKey;
  neighborhoods: string[];
  areaMinimum: string;
  areaMaximum: string;
  priceMinimum: string;
  priceMaximum: string;
  rentMinimum: string;
  rentMaximum: string;
  depositMinimum: string;
  depositMaximum: string;
  age: string[];
  bedrooms?: string;
  floor?: string;
  renovated: boolean;
  furnished: boolean;
  suitableFor: string[];
  unitType: string[];
  homeType: string[];
  gardenVillaType: string[];
  unitOrientation?: string;
  landOrientation?: string;
  heating: string[];
  amenities: string[];
  featured: boolean;
  hasPhoto: boolean;
  hasVideo: boolean;
};

const initialFilters: FilterState = {
  transaction: "rent",
  category: undefined,
  advertiser: undefined,
  publicationTime: undefined,
  neighborhoods: [],
  areaMinimum: "",
  areaMaximum: "",
  priceMinimum: "",
  priceMaximum: "",
  rentMinimum: "",
  rentMaximum: "",
  depositMinimum: "",
  depositMaximum: "",
  age: [],
  bedrooms: undefined,
  floor: undefined,
  renovated: false,
  furnished: true,
  suitableFor: [],
  unitType: [],
  homeType: [],
  gardenVillaType: [],
  unitOrientation: undefined,
  landOrientation: undefined,
  heating: [],
  amenities: [],
  featured: false,
  hasPhoto: true,
  hasVideo: false,
};

const categoryLabels: Record<CategoryKey, string> = {
  apartment: "آپارتمان",
  villaHouse: "خانه ویلایی",
  gardenVilla: "باغ، ویلا",
  land: "زمین",
  office: "واحد اداری",
  shop: "واحد تجاری",
  industrial: "صنعتی، کشاورزی و تجاری",
  warehouse: "انبار، سوله",
  hotelApartment: "هتل، هتل آپارتمان",
};

const categoryGroupsByTransaction: Record<
  TransactionType,
  { title: string; items: CategoryKey[] }[]
> = {
  sale: [
    {
      title: "مسکونی",
      items: ["apartment", "land", "villaHouse", "gardenVilla"],
    },
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["office", "shop", "industrial", "warehouse", "hotelApartment"],
    },
  ],

  rent: [
    {
      title: "مسکونی",
      items: ["apartment", "villaHouse", "gardenVilla"],
    },
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["office", "shop", "industrial", "warehouse", "hotelApartment"],
    },
  ],

  dailyRent: [
    {
      title: "اقامتی",
      items: ["apartment", "villaHouse", "gardenVilla", "hotelApartment"],
    },
  ],

  project: [
    {
      title: "پروژه",
      items: ["apartment", "villaHouse", "gardenVilla", "land", "office", "shop"],
    },
  ],
};

const rentBlocksByCategory: Partial<Record<CategoryKey, FilterBlock[]>> = {
  apartment: [
    "neighborhood",
    "area",
    "rentPrice",
    "depositPrice",
    "age",
    "bedrooms",
    "floor",
    "renovated",
    "furnished",
    "suitableFor",
    "unitType",
    "unitOrientation",
    "heating",
    "amenities",
    "advertiser",
    "publicationTime",
    "adFlags",
  ],

  villaHouse: [
    "neighborhood",
    "landArea",
    "rentPrice",
    "depositPrice",
    "age",
    "bedrooms",
    "renovated",
    "furnished",
    "landOrientation",
    "homeType",
    "heating",
    "amenities",
    "advertiser",
    "publicationTime",
    "adFlags",
  ],

  gardenVilla: [
    "neighborhood",
    "landArea",
    "rentPrice",
    "depositPrice",
    "age",
    "bedrooms",
    "furnished",
    "gardenVillaType",
    "heating",
    "amenities",
    "advertiser",
    "publicationTime",
    "adFlags",
  ],
};

const chipSections = {
  bedrooms: ["بدون اتاق", "۱", "۲", "۳", "۴", "+۵"],

  floors: ["همکف", "۱", "۲", "۳", "۴", "۵"],

  age: [
    "نوساز",
    "۱ سال",
    "۲ سال",
    "۳ سال",
    "۴ سال",
    "۱۰ سال",
    "۱۵ سال",
    "۲۰ سال",
    "۳۰ سال بیشتر",
  ],

  suitableFor: ["شرکت‌ها", "مهندسین", "بیمه", "وکلا", "آموزشگاه"],

  unitType: ["تک طبقه", "دو طبقه", "سه طبقه", "دوبلکس", "تریبلکس"],

  homeType: ["ویلایی مستقل", "آپارتمانی", "ویلایی شهرکی", "دوبلکس", "تریبلکس"],

  gardenVillaType: [
    "تک طبقه",
    "دو طبقه",
    "سه طبقه",
    "دوبلکس",
    "فورپلکس",
    "پنت هاوس",
  ],

  orientations: ["شمالی", "جنوبی", "شرقی", "غربی"],

  landOrientations: ["شمالی", "جنوبی", "دو نبش", "سه نبش", "چهار نبش"],

  heating: [
    "کولر گازی",
    "کولر آبی",
    "پکیج",
    "آبگرمکن",
    "بخاری",
    "شوفاژ",
  ],

  amenities: ["آسانسور", "پارکینگ", "انباری", "تراس", "لابی", "نگهبانی"],
} as const;

function getFilterBlocks(
  transaction: TransactionType,
  category?: CategoryKey,
): FilterBlock[] {
  if (!category) {
    return [];
  }

  if (transaction === "rent") {
    return (
      rentBlocksByCategory[category] ?? [
        "neighborhood",
        "area",
        "rentPrice",
        "depositPrice",
        "age",
        "heating",
        "amenities",
        "advertiser",
        "publicationTime",
        "adFlags",
      ]
    );
  }

  if (transaction === "sale") {
    return [
      "neighborhood",
      "area",
      "salePrice",
      "age",
      "bedrooms",
      "floor",
      "renovated",
      "heating",
      "amenities",
      "advertiser",
      "publicationTime",
      "adFlags",
    ];
  }

  if (transaction === "dailyRent") {
    return [
      "neighborhood",
      "area",
      "rentPrice",
      "bedrooms",
      "furnished",
      "heating",
      "amenities",
      "advertiser",
      "publicationTime",
      "adFlags",
    ];
  }

  return [
    "neighborhood",
    "area",
    "salePrice",
    "advertiser",
    "publicationTime",
    "adFlags",
  ];
}

const neighborhoodSamples = ["صیاد شیرازی", "دانش آموز", "شهید قانع", "آیت الله عبادی"];

export function SearchMapFilterPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleArrayValue = (
    key:
      | "age"
      | "amenities"
      | "heating"
      | "homeType"
      | "unitType"
      | "gardenVillaType"
      | "suitableFor",
    value: string,
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  };

  const changeCategory = (
    transaction: TransactionType,
    category: CategoryKey,
  ) => {
    setFilters({
      ...initialFilters,
      transaction,
      category,
    });
  };

  const openCategoryPicker = () => {
    setFilters((current) => ({
      ...current,
      category: undefined,
    }));
  };

  const setSingleValue = (
    key: "bedrooms" | "floor" | "unitOrientation" | "landOrientation",
    value: string,
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key] === value ? undefined : value,
    }));
  };

  if (!filters.category) {
    return (
      <CategorySelectionScreen
        initialTransaction={filters.transaction}
        onConfirm={changeCategory}
      />
    );
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a]"
      variant="flush"
    >
      <div className="shrink-0 bg-[#f0f0f0]">
        <TopBar
          backTo="/search"
          centerClassName="px-0"
          className="bg-[#f0f0f0]"
          title="فیلترها"
        />

        <div className="border-b-8 border-[#f0f0f0] bg-white px-4 py-3">
          <button
            className="flex w-full items-center justify-between"
            onClick={openCategoryPicker}
            type="button"
          >
            <FormChoiceChip
              label={categoryLabels[filters.category]}
              selected
              onClick={openCategoryPicker}
            />

            <div className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a]">
              <span>انتخاب دسته</span>
              <BuildingIcon />
            </div>
          </button>
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-4">
        {getFilterBlocks(filters.transaction, filters.category).map((block) => (
          <FilterBlockRenderer
            key={block}
            block={block}
            filters={filters}
            setFilters={setFilters}
            toggleArrayValue={toggleArrayValue}
            setSingleValue={setSingleValue}
          />
        ))}
      </main>

      <footer className="shrink-0 bg-white px-4 py-3 shadow-[0_-4px_10px_rgba(26,26,26,0.04)]">
        <div className="flex items-center gap-4 [direction:ltr]">
          <button
            className="flex h-10 w-[119px] items-center justify-center gap-2 rounded-lg border border-[#0048c4] bg-white text-sm font-medium leading-5 text-[#0048c4]"
            onClick={() => setFilters(initialFilters)}
            type="button"
          >
            <TrashIcon />
            <span>حذف همه</span>
          </button>
          <RouteLink
            className="flex h-10 min-w-0 flex-1 items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white no-underline"
            to="/search"
          >
            نمایش ۱۲٬۴۰۰ آگهی
          </RouteLink>
        </div>
      </footer>
    </PageFrame>
  );
}

type FilterSectionProps = {
  children: ReactNode;
  icon: ReactNode;
  title: string;
};

function FilterSection({ children, icon, title }: FilterSectionProps) {
  return (
    <section className="border-b-8 border-[#f0f0f0] bg-white px-4 pb-4 pt-4">
      <div className="mb-2 flex h-8 items-center justify-end gap-2 text-[#4d4d4d] [direction:ltr]">
        <h2 className="m-0 text-base font-medium leading-6 text-[#1a1a1a]">
          {title}
        </h2>
        {icon}
      </div>
      {children}
    </section>
  );
}

type ChipSectionProps = {
  icon: ReactNode;
  more?: boolean;
  onToggle: (value: string) => void;
  options: readonly string[];
  selected: string[];
  title: string;
};

function ChipSection({
  icon,
  more = false,
  onToggle,
  options,
  selected,
  title,
}: ChipSectionProps) {
  return (
    <FilterSection icon={icon} title={title}>
      <div className="flex flex-wrap justify-end gap-2" dir="rtl">
        {options.map((option) => (
          <FormChoiceChip
            key={option}
            label={option}
            onClick={() => onToggle(option)}
            selected={selected.includes(option)}
          />
        ))}
      </div>
      {more ? <MoreButton /> : null}
    </FilterSection>
  );
}

type SingleChoiceSectionProps = {
  icon: ReactNode;
  more?: boolean;
  onSelect: (value: string) => void;
  options: readonly string[];
  selected?: string;
  title: string;
};

function SingleChoiceSection({
  icon,
  more = false,
  onSelect,
  options,
  selected,
  title,
}: SingleChoiceSectionProps) {
  return (
    <FilterSection icon={icon} title={title}>
      <div className="flex flex-wrap justify-end gap-2" dir="rtl">
        {options.map((option) => (
          <FormChoiceChip
            key={option}
            label={option}
            onClick={() => onSelect(option)}
            selected={selected === option}
          />
        ))}
      </div>
      {more ? <MoreButton /> : null}
    </FilterSection>
  );
}

function MoreButton() {
  return (
    <button
      className="mt-2 flex h-10 w-full items-center justify-center gap-2 text-sm font-medium leading-5 text-[#0048c4]"
      type="button"
    >
      <span>موارد بیشتر</span>
      <ArrowLeftIcon />
    </button>
  );
}

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24">
      {children}
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="M6 6v9m4-9v9m4-9v9M4 5h12M8 3h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path d="m11.5 5.5-4 4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function BuildingIcon() {
  return <IconFrame><path d="M6 21V4h10v17M4 21h16M9 8h1m3 0h1m-5 4h1m3 0h1m-5 4h1m3 0h1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></IconFrame>;
}

function LocationIcon() {
  return <IconFrame><path d="M12 21s6-6.1 6-11a6 6 0 1 0-12 0c0 4.9 6 11 6 11Z" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" /></IconFrame>;
}

function RulerIcon() {
  return <IconFrame><path d="M4 17 17 4l3 3L7 20H4v-3Zm8-8 3 3m-6 0 1.5 1.5m4.5-7L16.5 8" stroke="currentColor" strokeWidth="1.5" /></IconFrame>;
}

function MoneyIcon() {
  return <IconFrame><path d="M4 7h16v10H4V7Zm4 0v10m8-10v10" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" /><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" /></IconFrame>;
}

function BedIcon() {
  return <IconFrame><path d="M4 18V9m0 5h16v4m-16-4h16v-3a2 2 0 0 0-2-2h-6v5M6 9h4v5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></IconFrame>;
}

function FloorIcon() {
  return <IconFrame><path d="M6 21V4h9v17M4 21h16M9 8h3m-3 4h3m-3 4h3m6 5v-9h-3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></IconFrame>;
}

function YearIcon() {
  return <IconFrame><path d="M7 3v3m10-3v3M5 9h14M6 5h12a1 1 0 0 1 1 1v13H5V6a1 1 0 0 1 1-1Z" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /><path d="M9 13h2m2 0h2m-6 3h2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></IconFrame>;
}

function OrientationIcon() {
  return <IconFrame><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" /><path d="m14.5 9.5-1.6 3.4-3.4 1.6 1.6-3.4 3.4-1.6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" /></IconFrame>;
}

function TemperatureIcon() {
  return <IconFrame><path d="M12 4a2 2 0 0 0-2 2v7.2a4 4 0 1 0 4 0V6a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth="1.5" /><path d="M12 10v6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></IconFrame>;
}

function SettingsIcon() {
  return <IconFrame><path d="M8 4h8v5H8V4Zm-2 7h12v9H6v-9Zm3 3h6m-6 3h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></IconFrame>;
}


type CategorySelectionScreenProps = {
  initialTransaction: TransactionType;
  onConfirm: (transaction: TransactionType, category: CategoryKey) => void;
};

function CategorySelectionScreen({
  initialTransaction,
  onConfirm,
}: CategorySelectionScreenProps) {
  const [draftTransaction, setDraftTransaction] =
    useState<TransactionType>(initialTransaction);

  const [draftCategory, setDraftCategory] = useState<CategoryKey | undefined>(
    undefined,
  );

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <div className="shrink-0 bg-[#f0f0f0]">
        <TopBar
          backTo="/search"
          centerClassName="px-0"
          className="bg-[#f0f0f0]"
          title="انتخاب دسته‌بندی"
        />

        <div className="bg-[#f0f0f0] px-4 py-2">
          <FormSegmentedControl
            ariaLabel="نوع معامله"
            onChange={(transaction) => {
              setDraftTransaction(transaction);
              setDraftCategory(undefined);
            }}
            options={[
              { label: "فروش", value: "sale" },
              { label: "اجاره", value: "rent" },
              { label: "اجاره روزانه", value: "dailyRent" },
              { label: "پروژه", value: "project" },
            ]}
            value={draftTransaction}
          />
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pb-24 pt-4">
        {categoryGroupsByTransaction[draftTransaction].map((group) => (
          <section key={group.title} className="mb-6">
            <h2 className="mb-4 border-b border-[#e6e6e6] pb-2 text-right text-base font-medium text-[#808080]">
              {group.title}
            </h2>

            <div className="flex flex-wrap justify-end gap-2" dir="rtl">
              {group.items.map((item) => (
                <FormChoiceChip
                  key={item}
                  label={categoryLabels[item]}
                  onClick={() => setDraftCategory(item)}
                  selected={draftCategory === item}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="shrink-0 bg-white px-4 py-3 shadow-[0_-4px_10px_rgba(26,26,26,0.04)]">
        <button
          className="flex h-11 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!draftCategory}
          onClick={() => {
            if (!draftCategory) return;
            onConfirm(draftTransaction, draftCategory);
          }}
          type="button"
        >
          تایید
        </button>
      </footer>
    </PageFrame>
  );
}

type FilterBlockRendererProps = {
  block: FilterBlock;
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  toggleArrayValue: (
    key:
      | "age"
      | "amenities"
      | "heating"
      | "homeType"
      | "unitType"
      | "gardenVillaType"
      | "suitableFor",
    value: string,
  ) => void;
  setSingleValue: (
    key: "bedrooms" | "floor" | "unitOrientation" | "landOrientation",
    value: string,
  ) => void;
};

function FilterBlockRenderer({
  block,
  filters,
  setFilters,
  toggleArrayValue,
  setSingleValue,
}: FilterBlockRendererProps) {
  switch (block) {
    case "neighborhood":
      return (
        <FilterSection icon={<LocationIcon />} title="محله">
          <div className="mb-4 flex justify-start [direction:ltr]">
            <button
              className="inline-flex h-10 items-center gap-2 rounded-lg text-sm font-medium leading-5 text-[#0048c4]"
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  neighborhoods:
                    current.neighborhoods.length > 0
                      ? []
                      : [...neighborhoodSamples],
                }))
              }
              type="button"
            >
              <ArrowLeftIcon />
              <span>انتخاب</span>
            </button>
          </div>

          {filters.neighborhoods.length > 0 ? (
            <div className="flex flex-wrap justify-end gap-2" dir="rtl">
              {filters.neighborhoods.map((item) => (
                <FormChoiceChip
                  key={item}
                  label={item}
                  onClick={() =>
                    setFilters((current) => ({
                      ...current,
                      neighborhoods: current.neighborhoods.filter(
                        (neighborhood) => neighborhood !== item,
                      ),
                    }))
                  }
                  removable
                  selected
                />
              ))}
            </div>
          ) : null}
        </FilterSection>
      );

    case "area":
      return (
        <AreaRangeSection
          title="متراژ (متر)"
          minimum={filters.areaMinimum}
          maximum={filters.areaMaximum}
          onMinimumChange={(value) =>
            setFilters((current) => ({ ...current, areaMinimum: value }))
          }
          onMaximumChange={(value) =>
            setFilters((current) => ({ ...current, areaMaximum: value }))
          }
        />
      );

    case "landArea":
      return (
        <AreaRangeSection
          title="متراژ زمین (متر)"
          minimum={filters.areaMinimum}
          maximum={filters.areaMaximum}
          onMinimumChange={(value) =>
            setFilters((current) => ({ ...current, areaMinimum: value }))
          }
          onMaximumChange={(value) =>
            setFilters((current) => ({ ...current, areaMaximum: value }))
          }
        />
      );

    case "salePrice":
      return (
        <MoneyRangeSection
          title="قیمت"
          minimum={filters.priceMinimum}
          maximum={filters.priceMaximum}
          onMinimumChange={(value) =>
            setFilters((current) => ({ ...current, priceMinimum: value }))
          }
          onMaximumChange={(value) =>
            setFilters((current) => ({ ...current, priceMaximum: value }))
          }
        />
      );

    case "rentPrice":
      return (
        <MoneyRangeSection
          title="مبلغ اجاره"
          minimum={filters.rentMinimum}
          maximum={filters.rentMaximum}
          onMinimumChange={(value) =>
            setFilters((current) => ({ ...current, rentMinimum: value }))
          }
          onMaximumChange={(value) =>
            setFilters((current) => ({ ...current, rentMaximum: value }))
          }
        />
      );

    case "depositPrice":
      return (
        <MoneyRangeSection
          title="مبلغ رهن"
          minimum={filters.depositMinimum}
          maximum={filters.depositMaximum}
          onMinimumChange={(value) =>
            setFilters((current) => ({ ...current, depositMinimum: value }))
          }
          onMaximumChange={(value) =>
            setFilters((current) => ({ ...current, depositMaximum: value }))
          }
        />
      );

    case "age":
      return (
        <ChipSection
          icon={<YearIcon />}
          more
          onToggle={(value) => toggleArrayValue("age", value)}
          options={chipSections.age}
          selected={filters.age}
          title="سن ساخت"
        />
      );

    case "bedrooms":
      return (
        <SingleChoiceSection
          icon={<BedIcon />}
          onSelect={(value) => setSingleValue("bedrooms", value)}
          options={chipSections.bedrooms}
          selected={filters.bedrooms}
          title="تعداد اتاق"
        />
      );

    case "floor":
      return (
        <SingleChoiceSection
          icon={<FloorIcon />}
          more
          onSelect={(value) => setSingleValue("floor", value)}
          options={chipSections.floors}
          selected={filters.floor}
          title="طبقه"
        />
      );

    case "renovated":
      return (
        <SwitchOnlySection
          checked={filters.renovated}
          label="بازسازی شده"
          onChange={(renovated) =>
            setFilters((current) => ({ ...current, renovated }))
          }
        />
      );

    case "furnished":
      return (
        <SwitchOnlySection
          checked={filters.furnished}
          label="مبله با لوازم"
          onChange={(furnished) =>
            setFilters((current) => ({ ...current, furnished }))
          }
        />
      );

    case "suitableFor":
      return (
        <ChipSection
          icon={<SettingsIcon />}
          more
          onToggle={(value) => toggleArrayValue("suitableFor", value)}
          options={chipSections.suitableFor}
          selected={filters.suitableFor}
          title="مناسب برای"
        />
      );

    case "unitType":
      return (
        <ChipSection
          icon={<BedIcon />}
          onToggle={(value) => toggleArrayValue("unitType", value)}
          options={chipSections.unitType}
          selected={filters.unitType}
          title="تیپ واحد"
        />
      );

    case "homeType":
      return (
        <ChipSection
          icon={<BedIcon />}
          onToggle={(value) => toggleArrayValue("homeType", value)}
          options={chipSections.homeType}
          selected={filters.homeType}
          title="تیپ خانه"
        />
      );

    case "gardenVillaType":
      return (
        <ChipSection
          icon={<BedIcon />}
          onToggle={(value) => toggleArrayValue("gardenVillaType", value)}
          options={chipSections.gardenVillaType}
          selected={filters.gardenVillaType}
          title="تیپ باغ، ویلا"
        />
      );

    case "unitOrientation":
      return (
        <SingleChoiceSection
          icon={<OrientationIcon />}
          onSelect={(value) => setSingleValue("unitOrientation", value)}
          options={chipSections.orientations}
          selected={filters.unitOrientation}
          title="موقعیت واحد"
        />
      );

    case "landOrientation":
      return (
        <SingleChoiceSection
          icon={<OrientationIcon />}
          onSelect={(value) => setSingleValue("landOrientation", value)}
          options={chipSections.landOrientations}
          selected={filters.landOrientation}
          title="موقعیت زمین"
        />
      );

    case "heating":
      return (
        <ChipSection
          icon={<TemperatureIcon />}
          more
          onToggle={(value) => toggleArrayValue("heating", value)}
          options={chipSections.heating}
          selected={filters.heating}
          title="سرمایش و گرمایش"
        />
      );

    case "amenities":
      return (
        <ChipSection
          icon={<SettingsIcon />}
          more
          onToggle={(value) => toggleArrayValue("amenities", value)}
          options={chipSections.amenities}
          selected={filters.amenities}
          title="امکانات"
        />
      );

    case "advertiser":
      return (
        <SelectOnlySection
          label="آگهی دهنده"
          value={filters.advertiser}
          onClick={() =>
            setFilters((current) => ({
              ...current,
              advertiser: current.advertiser ? undefined : "شخصی",
            }))
          }
        />
      );

    case "publicationTime":
      return (
        <SelectOnlySection
          label="زمان انتشار آگهی"
          value={filters.publicationTime}
          onClick={() =>
            setFilters((current) => ({
              ...current,
              publicationTime: current.publicationTime ? undefined : "دیروز",
            }))
          }
        />
      );

    case "adFlags":
      return (
        <section className="bg-white px-4 pb-4 pt-0">
          <FormSwitch
            checked={filters.featured}
            label="آگهی ویژه"
            onChange={(featured) =>
              setFilters((current) => ({ ...current, featured }))
            }
          />

          <FormSwitch
            checked={filters.hasPhoto}
            label="آگهی با عکس"
            onChange={(hasPhoto) =>
              setFilters((current) => ({ ...current, hasPhoto }))
            }
          />

          <FormSwitch
            checked={filters.hasVideo}
            label="آگهی با ویدیو"
            onChange={(hasVideo) =>
              setFilters((current) => ({ ...current, hasVideo }))
            }
          />
        </section>
      );

    default:
      return null;
  }
}

type RangeSectionProps = {
  title: string;
  minimum: string;
  maximum: string;
  onMinimumChange: (value: string) => void;
  onMaximumChange: (value: string) => void;
};

function AreaRangeSection({
  title,
  minimum,
  maximum,
  onMinimumChange,
  onMaximumChange,
}: RangeSectionProps) {
  return (
    <FilterSection icon={<RulerIcon />} title={title}>
      <div className="flex items-center gap-3 [direction:ltr]">
        <FormTextField
          className="flex-1"
          label="حداکثر"
          onChange={(event) => onMaximumChange(event.target.value)}
          onClear={() => onMaximumChange("")}
          placeholder="حداکثر"
          value={maximum}
        />

        <FormTextField
          className="flex-1"
          label="حداقل"
          onChange={(event) => onMinimumChange(event.target.value)}
          onClear={() => onMinimumChange("")}
          placeholder="حداقل"
          value={minimum}
        />
      </div>
    </FilterSection>
  );
}

function MoneyRangeSection({
  title,
  minimum,
  maximum,
  onMinimumChange,
  onMaximumChange,
}: RangeSectionProps) {
  return (
    <FilterSection icon={<MoneyIcon />} title={title}>
      <div className="flex flex-col gap-4">
        <FormTextField
          badge="تومان"
          label="حداقل"
          onChange={(event) => onMinimumChange(event.target.value)}
          onClear={() => onMinimumChange("")}
          placeholder="حداقل"
          value={minimum}
        />

        <FormTextField
          badge="تومان"
          label="حداکثر"
          onChange={(event) => onMaximumChange(event.target.value)}
          onClear={() => onMaximumChange("")}
          placeholder="حداکثر"
          value={maximum}
        />
      </div>
    </FilterSection>
  );
}

function SwitchOnlySection({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="border-b-8 border-[#f0f0f0] bg-white px-4">
      <FormSwitch checked={checked} label={label} onChange={onChange} />
    </div>
  );
}

function SelectOnlySection({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: string;
  onClick: () => void;
}) {
  return (
    <section className="bg-white px-4">
      <FormSelectField
        label={label}
        onClick={onClick}
        placeholder="انتخاب"
        value={value}
      />
    </section>
  );
}
