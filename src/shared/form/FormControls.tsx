import type { ChangeEventHandler, FocusEventHandler, ReactNode, Ref } from "react";
import { motion } from "motion/react";
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
  showDividers?: boolean;
};

export function FormSegmentedControl<T extends string>({
  ariaLabel,
  onChange,
  options,
  showDividers = false,
  value,
}: FormSegmentedControlProps<T>) {
  const activeIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const count = options.length || 1;

  return (
    <div
      aria-label={ariaLabel}
      className="relative flex h-10 w-full overflow-hidden rounded-xl border border-[#808080] bg-white"
      dir="rtl"
      role="radiogroup"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 bg-[#edf0fb]"
        style={{ width: `${100 / count}%` }}
        animate={{ x: `${-activeIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 400, damping: 32, mass: 0.8 }}
      />
      {options.map((option, index) => {
        const selected = option.value === value;

        return (
          <Button unstyled
            aria-checked={selected}
            className={`relative flex min-w-0 flex-1 items-center justify-center border-[#808080] text-base font-medium leading-6 transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] ${
              showDividers && index < options.length - 1 ? "border-l" : ""
            } ${
              selected ? "text-[#0048c4] font-semibold" : "text-[#4d4d4d] hover:bg-[#f5f5f5]/50"
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            type="button"
          >
            <span className="relative z-10">{option.label}</span>
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
  showCheck?: boolean;
};

export function FormChoiceChip({
  icon,
  label,
  onClick,
  removable = false,
  selected = false,
  showCheck = false,
}: FormChoiceChipProps) {
  return (
    <Chip
      className="h-9"
      icon={icon}
      onClick={onClick}
      removable={removable}
      selected={selected}
      showCheck={showCheck}
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
      formatNumber
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

