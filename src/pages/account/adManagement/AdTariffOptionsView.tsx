import type { ReactNode } from "react";

export type AdTariffOptionId = "refresh" | "special" | "renew" | "refreshSpecial";

export type AdTariffOption = {
  description: string;
  disabled?: boolean;
  id: AdTariffOptionId;
  price: number;
  title: string;
  warning?: string;
};

const baseTariffOptions: Omit<AdTariffOption, "disabled" | "price" | "warning">[] = [
  {
    description:
      "آگهی شما به مدت ۳ روز، هر ۶ ساعت در اولویت نمایش قرار می‌گیرد.",
    id: "refresh",
    title: "بروزرسانی",
  },
  {
    description:
      "آگهی شما به مدت ۳ روز با برچسب ویژه، برای جلب توجه بیشتر و دیده شدن بهتر نمایش داده می‌شود.",
    id: "special",
    title: "ویژه",
  },
  {
    description:
      "آگهی شما پیش از انقضا، برای یک ماه دیگر تمدید می‌شود.",
    id: "renew",
    title: "تمدید",
  },
  {
    description:
      "آگهی بروزرسانی و ویژه به صورت همزمان فعال می‌شود.",
    id: "refreshSpecial",
    title: "بروزرسانی و ویژه",
  },
];

export function createAdTariffOptions({
  disabledIds = [],
  price,
  warning,
}: {
  disabledIds?: AdTariffOptionId[];
  price: number;
  warning?: string;
}) {
  return baseTariffOptions.map((option) => ({
    ...option,
    disabled: disabledIds.includes(option.id),
    price,
    warning: disabledIds.includes(option.id) ? warning : undefined,
  }));
}

export function formatTariffToman(value: number) {
  return `${new Intl.NumberFormat("fa-IR").format(value)}`;
}

export function getTariffTotal(options: AdTariffOption[], selectedIds: AdTariffOptionId[]) {
  return selectedIds.reduce((total, selectedId) => {
    const option = options.find((item) => item.id === selectedId);

    return total + (option?.price ?? 0);
  }, 0);
}

export function AdTariffOptionsList({
  options,
  selectedIds,
  onToggle,
}: {
  options: AdTariffOption[];
  selectedIds: AdTariffOptionId[];
  onToggle: (id: AdTariffOptionId) => void;
}) {
  return (
    <div className="divide-y divide-[#e6e6e6] bg-white">
      {options.map((option) => (
        <AdTariffOptionRow
          checked={selectedIds.includes(option.id)}
          key={option.id}
          onToggle={onToggle}
          option={option}
        />
      ))}
    </div>
  );
}

function AdTariffOptionRow({
  checked,
  onToggle,
  option,
}: {
  checked: boolean;
  onToggle: (id: AdTariffOptionId) => void;
  option: AdTariffOption;
}) {
  const isDisabled = Boolean(option.disabled);
  const rowClassName = checked ? "bg-[#f3f5ff]" : "bg-white";
  const priceClassName = isDisabled ? "text-[#c2c2c2]" : "text-[#1a1a1a]";
  const titleClassName = isDisabled ? "text-[#b8b8b8]" : checked ? "text-[#1a1a1a]" : "text-[#4d4d4d]";
  const descriptionClassName = isDisabled ? "text-[#b8b8b8]" : "text-[#4d4d4d]";

  return (
    <button
      aria-disabled={isDisabled}
      aria-pressed={checked}
      className={`block w-full border-0 px-4 py-4 text-inherit ${rowClassName}`}
      onClick={() => {
        if (!isDisabled) onToggle(option.id);
      }}
      type="button"
    >
      <span className="flex items-start justify-between gap-5 [direction:ltr]">
        <span className={`flex shrink-0 items-center gap-1 pt-1 text-sm font-semibold leading-5 [direction:rtl] ${priceClassName}`}>
          {formatTariffToman(option.price)}
          <AdCardTomanIcon className="h-5 w-5" />
        </span>

        <span className="min-w-0 flex-1 text-right [direction:rtl]">
          <span className={`flex items-center justify-start gap-2 text-base font-semibold leading-6 ${titleClassName}`}>
            <SelectionBox checked={checked} disabled={isDisabled} />
            {option.title}
          </span>
          <span className={`mt-4 block text-sm font-normal leading-6 ${descriptionClassName}`}>
            {option.description}
          </span>
        </span>
      </span>

      {option.warning ? (
        <TariffNotice>
          {option.warning}
        </TariffNotice>
      ) : null}
    </button>
  );
}

function TariffNotice({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 mt-3 flex min-h-9 items-center gap-2 rounded-lg bg-[#fff5db] px-3 py-2 text-right text-xs font-medium leading-5 text-[#ff6d00]">
      <CircleInfoIcon className="h-5 w-5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function SelectionBox({
  checked,
  disabled = false,
}: {
  checked: boolean;
  disabled?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-[4px] ${
        checked
          ? disabled
            ? "bg-[#b8b8b8] text-white"
            : "bg-[#0048c4] text-white"
          : disabled
            ? "border border-[#c2c2c2] bg-white text-transparent"
            : "border border-[#808080] bg-white text-transparent"
      }`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16">
        <path
          d="m3.5 8.5 3 3 6-7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </span>
  );
}

export function AdCardTomanIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path
        d="M16.844 10.742c.88 2.604 1.213 3.708-1.214 3.708h-1.214m0 0h-2.022c-2.185 0-1.455-3.131 0-3.131 1.454 0 1.86 1.071 2.022 3.131Zm0 0c.189 2.405-.809 2.473-3.398 3.05M5.678 13.461l1.861.989c1.294.688 2.114-2.22.81-2.884-1.1-.56-1.825.101-2.671 1.895Zm0 0c-.708 1.504-2.831 1.57-2.831-.247l-.162-4.12M7.62 2.5l.405 2.885c.323 1.648-.98 2.417-2.508 2.719-2.744.543-3.641-1.895-2.59-4.78M13.608 9.505h1.213m.81 0h1.213M4.708 2.5H5.92"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function CircleInfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9.25v4.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      <circle cx="10" cy="6.5" fill="currentColor" r="1" />
    </svg>
  );
}
