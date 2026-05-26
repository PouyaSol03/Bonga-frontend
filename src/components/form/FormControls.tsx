import type { ChangeEventHandler, ReactNode } from "react";

type SegmentOption<T extends string> = {
  label: string;
  value: T;
};

type FormSegmentedControlProps<T extends string> = {
  ariaLabel: string;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  value: T;
};

export function FormSegmentedControl<T extends string>({
  ariaLabel,
  onChange,
  options,
  value,
}: FormSegmentedControlProps<T>) {
  return (
    <div
      aria-label={ariaLabel}
      className="flex h-10 w-full overflow-hidden rounded-xl border border-[#808080] bg-white"
      dir="rtl"
      role="radiogroup"
    >
      {options.map((option, index) => {
        const selected = option.value === value;

        return (
          <button
            aria-checked={selected}
            className={`flex min-w-0 flex-1 items-center justify-center border-[#808080] text-base font-medium leading-6 transition-colors ${
              index < options.length - 1 ? "border-l" : ""
            } ${
              selected ? "bg-[#dbe8ff] text-[#0048c4]" : "bg-white text-[#4d4d4d]"
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

type FormChoiceChipProps = {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  removable?: boolean;
  selected?: boolean;
};

export function FormChoiceChip({
  icon,
  label,
  onClick,
  removable = false,
  selected = false,
}: FormChoiceChipProps) {
  return (
    <button
      aria-pressed={selected}
      className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium leading-5 transition-colors ${
        selected
          ? "border-[#0048c4] bg-[#e6efff] text-[#0048c4]"
          : "border-[#cccccc] bg-white text-[#4d4d4d]"
      }`}
      onClick={onClick}
      type="button"
    >
      {removable && selected ? <CloseIcon /> : null}
      <span>{label}</span>
      {icon}
    </button>
  );
}

type FormTextFieldProps = {
  badge?: string;
  className?: string;
  label?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClear?: () => void;
  placeholder: string;
  supportingText?: string;
  value: string;
};

export function FormTextField({
  badge,
  className = "",
  label,
  onChange,
  onClear,
  placeholder,
  supportingText,
  value,
}: FormTextFieldProps) {
  const hasValue = value.length > 0;

  return (
    <label className={`block min-w-0 ${className}`}>
      <span
        className={`relative flex h-14 items-center rounded-xl border bg-white px-3 transition-colors focus-within:border-[#0048c4] ${
          hasValue ? "border-[#0048c4]" : "border-[#cccccc]"
        }`}
      >
        {hasValue && label ? (
          <span className="absolute -top-2 right-3 bg-white px-1 text-xs font-normal leading-4 text-[#0048c4]">
            {label}
          </span>
        ) : null}
        <input
          className="min-w-0 flex-1 border-0 bg-transparent text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
          dir="rtl"
          inputMode="numeric"
          onChange={onChange}
          placeholder={placeholder}
          value={value}
        />
        {badge ? (
          <span className="mr-2 shrink-0 text-sm font-normal leading-5 text-[#a6a6a6]">
            {badge}
          </span>
        ) : null}
        {hasValue && onClear ? (
          <button
            aria-label="پاک کردن"
            className="mr-2 grid h-5 w-5 shrink-0 place-items-center text-[#a6a6a6]"
            onClick={(event) => {
              event.preventDefault();
              onClear();
            }}
            type="button"
          >
            <ClearCircleIcon />
          </button>
        ) : null}
      </span>
      {supportingText ? (
        <span className="mt-1 block px-3 text-right text-xs font-normal leading-4 text-[#808080]">
          {supportingText}
        </span>
      ) : null}
    </label>
  );
}

type FormSelectFieldProps = {
  label: string;
  onClick?: () => void;
  placeholder: string;
  value?: string;
};

export function FormSelectField({
  label,
  onClick,
  placeholder,
  value,
}: FormSelectFieldProps) {
  return (
    <div>
      <p className="m-0 mb-2 text-right text-base font-medium leading-6 text-[#1a1a1a]">
        {label}
      </p>
      <button
        className="flex h-14 w-full items-center justify-between rounded-xl border border-[#cccccc] bg-white px-3 [direction:ltr]"
        onClick={onClick}
        type="button"
      >
        {value ? <ClearCircleIcon /> : <ChevronDownIcon />}
        <span
          className={`min-w-0 truncate text-right text-sm font-normal leading-5 [direction:rtl] ${
            value ? "text-[#1a1a1a]" : "text-[#a6a6a6]"
          }`}
        >
          {value ?? placeholder}
        </span>
      </button>
    </div>
  );
}

type FormSwitchProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

export function FormSwitch({ checked, label, onChange }: FormSwitchProps) {
  return (
    <label className="flex h-14 w-full items-center justify-between [direction:ltr]">
      <button
        aria-checked={checked}
        className={`flex h-6 w-11 items-center rounded-full px-1 transition-colors [direction:ltr] ${
          checked ? "justify-end bg-[#0048c4]" : "justify-start bg-[#e5e5e5]"
        }`}
        onClick={() => onChange(!checked)}
        role="switch"
        type="button"
      >
        <span
          className={`h-4 w-4 rounded-full ${
            checked ? "bg-white" : "bg-[#808080]"
          }`}
        />
      </button>
      <span className="text-right text-base font-medium leading-6 text-[#1a1a1a] [direction:rtl]">
        {label}
      </span>
    </label>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function ClearCircleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="m7.5 7.5 5 5m0-5-5 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-[#4d4d4d]" fill="none" viewBox="0 0 20 20">
      <path d="m6 8 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}
