import type { ChangeEventHandler, FocusEventHandler, ReactNode, Ref } from "react";
import { Chip } from "../ui/Chip";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";

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
          <Button unstyled
            aria-checked={selected}
            className={`flex min-w-0 flex-1 items-center justify-center border-[#808080] text-base font-medium leading-6 transition focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] ${
              index < options.length - 1 ? "border-l" : ""
            } ${
              selected ? "bg-[#edf0fb] text-[#0048c4]" : "bg-white text-[#4d4d4d] hover:bg-[#f5f5f5] active:bg-[#e5e5e5]"
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            type="button"
          >
            {option.label}
          </Button>
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
    <Chip
      className="h-10 gap-2"
      icon={icon}
      onClick={onClick}
      removable={removable}
      selected={selected}
    >
      {label}
    </Chip>
  );
}

type FormTextFieldProps = {
  badge?: string;
  className?: string;
  forceHighlight?: boolean;
  forceLabel?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  label?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onClear?: () => void;
  placeholder: string;
  readOnly?: boolean;
  supportingText?: string;
  trailingSlot?: ReactNode;
  value: string;
};

export function FormTextField({
  badge,
  className = "",
  forceHighlight = false,
  forceLabel = false,
  inputRef,
  label,
  onChange,
  onClear,
  onFocus,
  placeholder,
  readOnly = false,
  supportingText,
  trailingSlot,
  value,
}: FormTextFieldProps) {
  return (
    <TextField
      badge={badge}
      className="text-sm"
      containerClassName={className}
      forceHighlight={forceHighlight}
      forceLabel={forceLabel}
      inputMode="numeric"
      inputRef={inputRef}
      label={label}
      onChange={onChange}
      onClear={onClear}
      onFocus={onFocus}
      placeholder={placeholder}
      readOnly={readOnly}
      supportingText={supportingText}
      trailingSlot={trailingSlot}
      value={value}
    />
  );
}

