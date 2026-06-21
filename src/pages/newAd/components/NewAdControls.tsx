import type { ReactNode } from "react";

import { FeaturesIcons } from "../../../components/FeaturesIcons";
import { formatPrice } from "../../../lib/MoneyHandler";
import { normalizeNumberInput, navigateTo } from "../utils";
import type { ChipItem } from "../types";

export function Header({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <header className="shrink-0 bg-[#f0f0f0] pt-2 [direction:rtl]">
      <div className="flex h-20 items-center gap-2 px-4">
        <button
          aria-label="بازگشت"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#4d4d4d] active:bg-[#1a1a1a0a]"
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }

            window.history.length > 1
              ? window.history.back()
              : navigateTo("/new-ad/category");
          }}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 7l5 5-5 5M20 12H4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>

        <h1 className="m-0 min-w-0 flex-1 truncate text-right text-xl font-semibold leading-7 text-[#1a1a1a]">
          {title}
        </h1>
      </div>
    </header>
  );
}

export function Section({
  title,
  icon,
  warning,
  children,
}: {
  title: string;
  icon: string;
  warning?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className="border-b-[10px] border-[#f0f0f0] bg-white px-4 py-7 text-right last:border-b-0 [direction:rtl]"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={`/icons/add_advertisement/${icon}`}
            alt=""
            className="h-6 w-6 shrink-0 object-contain"
          />

          <h2 className="m-0 min-w-0 truncate text-right font-semibold leading-7 text-[#1a1a1a]">
            {title}
          </h2>
        </div>

        {warning ? (
          <img src="/icons/add_advertisement/warning.svg" alt="" />
        ) : (
          <span className="h-7 w-7 shrink-0" />
        )}
      </div>

      {children}
    </section>
  );
}

export function InputBox({ value, placeholder, leftText, numeric, formatNumeric, supportingText, onChange }: { value: string; placeholder: string; leftText?: string; numeric?: boolean; formatNumeric?: boolean; supportingText?: string; onChange: (value: string) => void }) {
  const displayValue = numeric && formatNumeric && value
    ? formatPrice(Number(normalizeNumberInput(value).replace(/,/g, "")))
    : value;

  return (
    <div>
      <label className="flex h-14 w-full items-center gap-3 rounded-[12px] border border-[#cccccc] bg-white px-4 text-base font-normal leading-6 text-[#1a1a1a] focus-within:border-[#0048c4] [direction:ltr]">
        {value ? (
          <button aria-label="پاک کردن" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#cccccc] text-[#a6a6a6]" onClick={() => onChange("")} type="button">×</button>
        ) : leftText ? <span className="shrink-0 text-[#a6a6a6]">{leftText}</span> : null}
        <input
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right outline-none placeholder:text-[#a6a6a6] [direction:rtl]"
          inputMode={numeric ? "numeric" : "text"}
          onChange={(event) => onChange(numeric ? normalizeNumberInput(event.target.value) : event.target.value)}
          placeholder={placeholder}
          value={displayValue}
        />
      </label>
      {supportingText ? (
        <p className="mt-1 px-4 text-right text-xs font-normal leading-5 text-[#808080]">
          {supportingText}
        </p>
      ) : null}
    </div>
  );
}

export function SelectBox({
  value,
  placeholder,
  onClick,
}: {
  value: string;
  placeholder: string;
  onClick: () => void;
}) {
  return (
    <button
      className="flex h-14 w-full items-center gap-3 rounded-[12px] border border-[#cccccc] bg-white px-4 text-base font-normal leading-6 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] [direction:rtl]"
      onClick={onClick}
      type="button"
    >
      <span
        className={`min-w-0 flex-1 truncate text-right ${value ? "text-[#1a1a1a]" : "text-[#a6a6a6]"
          }`}
      >
        {value || placeholder}
      </span>

      <svg
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-[#4d4d4d]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M7 10l5 5 5-5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

export function LocationBox({ value, label }: { value: string; label: string }) {
  return (
    <button
      className="flex h-14 w-full items-center gap-3 rounded-[12px] border border-[#cccccc] bg-white px-4 text-base font-normal leading-6 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] [direction:rtl]"
      onClick={() => {
        const search = window.location.search || `?label=${encodeURIComponent(label)}`;
        navigateTo(`/new-ad/location${search}`);
      }}
      type="button"
    >
      <span
        className={`min-w-0 flex-1 truncate text-right ${value ? "text-[#1a1a1a]" : "text-[#a6a6a6]"
          }`}
      >
        {value || "تعیین مکان"}
      </span>

      <svg
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-[#4d4d4d]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M15 6l-6 6 6 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

export function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <button className="flex h-9 items-center gap-2 rounded-[7px] border border-[#0048c4] bg-[#0048c41f] px-3 text-sm font-medium leading-5 text-[#0048c4]" onClick={onRemove} type="button"><span>{label}</span><span className="text-base leading-none">×</span></button>;
}

export function Chip({
  item,
  selected,
  onClick,
}: {
  item: ChipItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={selected}
      className={`flex h-9 items-center justify-center gap-1.5 rounded-[8px] border px-3 text-sm font-medium leading-5 ${selected
        ? "border-[#0048c4] bg-[#0048c41f] text-[#0048c4]"
        : "border-[#cccccc] bg-white text-[#4d4d4d]"
        }`}
      onClick={onClick}
      type="button"
    >
      <span>{item.label}</span>

      <FeaturesIcons
        feature={item.label}
        className={`h-5 w-5 shrink-0 object-contain ${selected
          ? "[filter:brightness(0)_saturate(100%)_invert(20%)_sepia(95%)_saturate(2950%)_hue-rotate(211deg)_brightness(88%)_contrast(105%)]"
          : "[filter:brightness(0)_saturate(100%)_invert(28%)_sepia(0%)_saturate(0%)_hue-rotate(178deg)_brightness(95%)_contrast(85%)]"
          }`}
      />
    </button>
  );
}

export function SwitchButton({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      aria-checked={checked}
      className={`relative h-6 w-11 shrink-0 rounded-full ${checked ? "bg-[#0048c4]" : "bg-[#d1d1d1]"
        }`}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        className={`absolute left-1 top-1 h-4 w-4 rounded-full ${checked
          ? "translate-x-5 bg-white"
          : "translate-x-0 bg-[#808080]"
          }`}
      />
    </button>
  );
}

export function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex h-16 items-center justify-between border-y border-[#cccccc] [direction:ltr]">
      <SwitchButton checked={checked} onChange={onChange} />

      <span className="text-right text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
        {label}
      </span>
    </div>
  );
}

export function Footer({
  primary,
  onPrimary,
  onBack,
  disabled = false,
}: {
  primary: string;
  onPrimary: () => void;
  onBack: () => void;
  disabled?: boolean;
}) {
  return (
    <footer className="grid shrink-0 grid-cols-2 gap-3 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-16px_24px_rgba(255,255,255,0.96)] [direction:ltr]">
      <button
        className="flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#0048c4] text-base font-medium leading-6 text-white disabled:bg-[#e0e0e0] disabled:text-[#a6a6a6] [direction:rtl]"
        disabled={disabled}
        onClick={onPrimary}
        type="button"
      >
        <span>{primary}</span>
        <span className="text-xl leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.49992 5.83301L3.33325 9.99962L7.49989 14.1664M3.33325 9.99962L16.6666 9.99987" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </button>

      <button
        className="flex h-12 items-center justify-center gap-2 rounded-[10px] border border-[#0048c4] bg-white text-base font-medium leading-6 text-[#0048c4] [direction:rtl]"
        onClick={onBack}
        type="button"
      >
        <span className="text-xl leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.4999 5.8335L16.6666 10.0002L12.5 14.1668M16.6666 10.0002H3.33325" stroke="#0048C4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span>مرحله قبل</span>
      </button>
    </footer>
  );
}


export function MoreButton({
  count,
  expanded,
  onClick,
}: {
  count: number;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="mx-auto mt-5 flex h-9 items-center justify-center gap-1.5 rounded-full px-4 !text-sm !font-medium leading-5 text-[#0048C4] active:bg-[#0048c40f]"
      onClick={onClick}
      type="button"
    >
      <span>
        {expanded ? "نمایش کمتر" : `نمایش ${count} مورد بیشتر`}
      </span>

      <svg
        aria-hidden="true"
        className="h-5 w-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d={expanded ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5"}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

export function CompactToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex h-14 items-center justify-between [direction:ltr]">
      <SwitchButton checked={checked} onChange={onChange} />

      <span className="text-right text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
        {label}
      </span>
    </div>
  );
}

export function MoreFeaturesFooter({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <footer className="grid shrink-0 grid-cols-2 gap-3 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-16px_24px_rgba(255,255,255,0.96)] [direction:ltr]">
      <button
        className="h-12 rounded-[10px] bg-[#0048c4] text-base font-medium leading-6 text-white"
        onClick={onConfirm}
        type="button"
      >
        تایید
      </button>

      <button
        className="h-12 rounded-[10px] border border-[#0048c4] bg-white text-base font-medium leading-6 text-[#0048c4]"
        onClick={onCancel}
        type="button"
      >
        انصراف
      </button>
    </footer>
  );
}

