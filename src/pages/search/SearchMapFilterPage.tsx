import { useState, type ReactNode } from "react";
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

type TransactionType = "sale" | "rent" | "project" | "consultants";

type FilterState = {
  advertiser?: string;
  age: string[];
  amenities: string[];
  areaMaximum: string;
  areaMinimum: string;
  bedrooms?: string;
  featured: boolean;
  floor?: string;
  furnished: boolean;
  heating: string[];
  homeType: string[];
  hasPhoto: boolean;
  hasVideo: boolean;
  neighborhoods: string[];
  orientation?: string;
  priceMaximum: string;
  priceMinimum: string;
  propertyTypes: string[];
  publicationTime?: string;
  renovated: boolean;
  titleType: string[];
  transaction: TransactionType;
};

const initialFilters: FilterState = {
  age: [],
  amenities: [],
  areaMaximum: "",
  areaMinimum: "",
  featured: false,
  furnished: false,
  heating: [],
  homeType: [],
  hasPhoto: false,
  hasVideo: true,
  neighborhoods: [],
  priceMaximum: "",
  priceMinimum: "",
  propertyTypes: [],
  renovated: false,
  titleType: [],
  transaction: "sale",
};

const chipSections = {
  propertyTypes: ["آپارتمان", "خانه ویلایی", "زمین", "واحد اداری", "واحد تجاری"],
  bedrooms: ["ندارد", "۱", "۲", "۳", "۴", "+۵"],
  floors: ["همکف", "۱", "۲", "۳", "۴", "۵"],
  age: ["نوساز", "۱سال", "۲ سال", "۳ سال", "۴ سال", "۵ سال", "۶ سال", "۷ سال"],
  orientations: ["شمالی", "جنوبی", "شرقی", "غربی"],
  titleType: ["ملکی", "آستانه", "اوقاف", "موقوفه", "قولنامه، وکالت"],
  homeType: ["تک واحدی", "دو واحدی", "چند واحدی", "دوبلکس", "پنت هاوس"],
  heating: ["هواساز", "بخاری", "کولر آبی", "گرمایش از کف", "موتورخانه"],
  amenities: ["تراس", "حیاط", "شومینه", "پارکینگ", "انباری"],
} as const;

const neighborhoodSamples = ["صیاد شیرازی", "دانش آموز", "شهید قانع", "آیت الله عبادی"];

export function SearchMapFilterPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleArrayValue = (
    key: "age" | "amenities" | "heating" | "homeType" | "propertyTypes" | "titleType",
    value: string,
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  };

  const setSingleValue = (
    key: "bedrooms" | "floor" | "orientation",
    value: string,
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key] === value ? undefined : value,
    }));
  };

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

        <div className="bg-[#f0f0f0] px-4 py-2">
          <FormSegmentedControl
            ariaLabel="نوع معامله"
            onChange={(transaction) =>
              setFilters((current) => ({ ...current, transaction }))
            }
            options={[
              { label: "فروش", value: "sale" },
              { label: "اجاره", value: "rent" },
              { label: "پروژه", value: "project" },
              { label: "مشاورین", value: "consultants" },
            ]}
            value={filters.transaction}
          />
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-4">
        <ChipSection
          icon={<BuildingIcon />}
          more
          onToggle={(value) => toggleArrayValue("propertyTypes", value)}
          options={chipSections.propertyTypes}
          selected={filters.propertyTypes}
          title="نوع ملک"
        />

        <FilterSection icon={<LocationIcon />} title="محله">
          <div className="mb-4 flex justify-start [direction:ltr]">
            <button
              className="inline-flex h-10 items-center gap-2 rounded-lg text-sm font-medium leading-5 text-[#0048c4]"
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  neighborhoods:
                    current.neighborhoods.length > 0 ? [] : [...neighborhoodSamples],
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

        <FilterSection icon={<RulerIcon />} title="متراژ (متر)">
          <div className="flex items-center gap-3 [direction:ltr]">
            <FormTextField
              className="flex-1"
              label="حداکثر متراژ"
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  areaMaximum: event.target.value,
                }))
              }
              onClear={() =>
                setFilters((current) => ({ ...current, areaMaximum: "" }))
              }
              placeholder="حداکثر متراژ"
              value={filters.areaMaximum}
            />
            <span className="text-base font-medium text-[#4d4d4d]">تا</span>
            <FormTextField
              className="flex-1"
              label="حداقل متراژ"
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  areaMinimum: event.target.value,
                }))
              }
              onClear={() =>
                setFilters((current) => ({ ...current, areaMinimum: "" }))
              }
              placeholder="حداقل متراژ"
              value={filters.areaMinimum}
            />
          </div>
        </FilterSection>

        <FilterSection icon={<MoneyIcon />} title="قیمت (تومان)">
          <div className="flex flex-col gap-4">
            <FormTextField
              badge="تومان"
              label="حداقل قیمت"
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  priceMinimum: event.target.value,
                }))
              }
              onClear={() =>
                setFilters((current) => ({ ...current, priceMinimum: "" }))
              }
              placeholder="حداقل قیمت"
              supportingText={
                filters.priceMinimum ? "یک میلیارد و ۵۲۰ میلیون تومان" : undefined
              }
              value={filters.priceMinimum}
            />
            <FormTextField
              badge="تومان"
              label="حداکثر قیمت"
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  priceMaximum: event.target.value,
                }))
              }
              onClear={() =>
                setFilters((current) => ({ ...current, priceMaximum: "" }))
              }
              placeholder="حداکثر قیمت"
              value={filters.priceMaximum}
            />
          </div>
        </FilterSection>

        <SingleChoiceSection
          icon={<BedIcon />}
          onSelect={(value) => setSingleValue("bedrooms", value)}
          options={chipSections.bedrooms}
          selected={filters.bedrooms}
          title="تعداد اتاق"
        />
        <SingleChoiceSection
          icon={<FloorIcon />}
          more
          onSelect={(value) => setSingleValue("floor", value)}
          options={chipSections.floors}
          selected={filters.floor}
          title="طبقه"
        />
        <ChipSection
          icon={<YearIcon />}
          more
          onToggle={(value) => toggleArrayValue("age", value)}
          options={chipSections.age}
          selected={filters.age}
          title="سن ساخت"
        />

        <div className="border-b-8 border-[#f0f0f0] bg-white px-4">
          <FormSwitch
            checked={filters.renovated}
            label="بازسازی شده"
            onChange={(renovated) =>
              setFilters((current) => ({ ...current, renovated }))
            }
          />
          <FormSwitch
            checked={filters.furnished}
            label="مبله با لوازم"
            onChange={(furnished) =>
              setFilters((current) => ({ ...current, furnished }))
            }
          />
        </div>

        <SingleChoiceSection
          icon={<OrientationIcon />}
          onSelect={(value) => setSingleValue("orientation", value)}
          options={chipSections.orientations}
          selected={filters.orientation}
          title="موقعیت واحد"
        />
        <ChipSection
          icon={<DocumentIcon />}
          onToggle={(value) => toggleArrayValue("titleType", value)}
          options={chipSections.titleType}
          selected={filters.titleType}
          title="نوع سند"
        />
        <ChipSection
          icon={<BedIcon />}
          onToggle={(value) => toggleArrayValue("homeType", value)}
          options={chipSections.homeType}
          selected={filters.homeType}
          title="تیپ خانه"
        />
        <ChipSection
          icon={<TemperatureIcon />}
          more
          onToggle={(value) => toggleArrayValue("heating", value)}
          options={chipSections.heating}
          selected={filters.heating}
          title="سرمایش و گرمایش"
        />
        <ChipSection
          icon={<SettingsIcon />}
          more
          onToggle={(value) => toggleArrayValue("amenities", value)}
          options={chipSections.amenities}
          selected={filters.amenities}
          title="امکانات"
        />

        <section className="bg-white px-4 pb-4 pt-4">
          <div className="space-y-4">
            <FormSelectField
              label="آگهی دهنده"
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  advertiser: current.advertiser ? undefined : "شخصی",
                }))
              }
              placeholder="انتخاب آگهی دهنده"
              value={filters.advertiser}
            />
            <FormSelectField
              label="زمان انتشار آگهی"
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  publicationTime: current.publicationTime ? undefined : "دیروز",
                }))
              }
              placeholder="انتخاب زمان انتشار"
              value={filters.publicationTime}
            />
          </div>
          <div className="mt-4">
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
          </div>
        </section>
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

function DocumentIcon() {
  return <IconFrame><path d="M7 3h7l3 3v15H7V3Zm7 0v4h3M10 12h4m-4 4h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></IconFrame>;
}

function TemperatureIcon() {
  return <IconFrame><path d="M12 4a2 2 0 0 0-2 2v7.2a4 4 0 1 0 4 0V6a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth="1.5" /><path d="M12 10v6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></IconFrame>;
}

function SettingsIcon() {
  return <IconFrame><path d="M8 4h8v5H8V4Zm-2 7h12v9H6v-9Zm3 3h6m-6 3h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></IconFrame>;
}
