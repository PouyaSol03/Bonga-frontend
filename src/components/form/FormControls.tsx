import type { ChangeEventHandler, ReactNode } from "react";
import LinearCancelCircle from "../(icons)/LinearCancelCircle";
import { Chip } from "../ui/Chip";
import { SelectField } from "../ui/SelectField";
import { Switch } from "../ui/Switch";
import { TextField } from "../ui/TextField";
import { Typography } from "../ui/Typography";

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
  return (
    <TextField
      badge={badge}
      className="text-sm leading-5"
      containerClassName={className}
      inputMode="numeric"
      label={label}
      onChange={onChange}
      onClear={onClear}
      placeholder={placeholder}
      supportingText={supportingText}
      value={value}
    />
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
    <SelectField
      label={label}
      leadingSlot={value ? <LinearCancelCircle aria-hidden="true" className="h-5 w-5" /> : undefined}
      onClick={onClick}
      placeholder={placeholder}
      value={value}
    />
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
      <Switch checked={checked} onChange={onChange} />
      <Typography as="span" variant="label" size="large" weight="medium" className="text-right text-base font-medium leading-6 text-[#1a1a1a] [direction:rtl]">
        {label}
      </Typography>
    </label>
  );
}
