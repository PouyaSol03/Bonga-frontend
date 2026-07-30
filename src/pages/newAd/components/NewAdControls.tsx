import type { ReactNode } from "react";

import LinearArrowDown1 from "../../../components/(icons)/LinearArrowDown1";
import LinearArrowLeft1 from "../../../components/(icons)/LinearArrowLeft1";
import LinearArrowLeft2 from "../../../components/(icons)/LinearArrowLeft2";
import LinearArrowRight2 from "../../../components/(icons)/LinearArrowRight2";
import LinearArrowUp1 from "../../../components/(icons)/LinearArrowUp1";
import LinearCancelSmall from "../../../components/(icons)/LinearCancelSmall";
import { Button } from "../../../components/ui/Button";
import { Chip as UiChip } from "../../../components/ui/Chip";
import { SelectField } from "../../../components/ui/SelectField";
import { Switch } from "../../../components/ui/Switch";
import { TextField } from "../../../components/ui/TextField";
import { FeaturesIcons } from "../../../components/FeaturesIcons";
import { TopBar } from "../../../components/TopBar";
import { formatPrice } from "../../../lib/MoneyHandler";
import { normalizeNumberInput, navigateTo } from "../utils";
import type { ChipItem } from "../types";
import { useNewAdDesktopLayout } from "../NewAdLayoutContext";
import { Typography } from "../../../components/ui/Typography";

export function Header({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo("/new-ad/category");
    }
  };

  return (
    <TopBar onBack={handleBack} title={title} />
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
  const desktop = useNewAdDesktopLayout();

  return (
    <section
      className={desktop
        ? "rounded-xl border border-[#e1e7f0] bg-white px-6 py-6 text-right shadow-[0_6px_20px_rgba(30,50,80,0.04)] [direction:rtl]"
        : "border-b-[10px] border-[#f0f0f0] bg-white px-4 pt-4 pb-2 text-right last:border-b-0 [direction:rtl]"}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={`/icons/add_advertisement/${icon}`}
            alt=""
            className="h-6 w-6 shrink-0 object-contain"
          />

          <Typography variant="label" size="large" weight="medium" className="text-[#1a1a1a]">
            {title}
          </Typography>
        </div>

        {warning ? (
          <img src="/icons/add_advertisement/warning.svg" alt="" />
        ) : (
          <Typography as="span" variant="body" size="medium" weight="regular" className="h-7 w-7 shrink-0" />
        )}
      </div>

      {children}
    </section>
  );
}

function ClearFieldButton({ onClick }: { onClick: () => void }) {
  return (
    <Button unstyled
      aria-label="پاک کردن"
      className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border border-[#cccccc] text-[#a6a6a6] transition active:bg-[#f0f0f0]"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      type="button"
    >
      <LinearCancelSmall aria-hidden="true" className="h-3 w-3" />
    </Button>
  );
}

export function InputBox({
  error,
  formatNumeric,
  leftText,
  numeric,
  onChange,
  placeholder,
  supportingText,
  value,
}: {
  error?: string;
  formatNumeric?: boolean;
  leftText?: string;
  numeric?: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  supportingText?: string;
  value: string;
}) {
  const hasValue = Boolean(value);
  const displayValue = numeric && formatNumeric && value
    ? formatPrice(Number(normalizeNumberInput(value).replace(/,/g, "")))
    : value;
  const floatingLabel = leftText
    ? placeholder.replace(/\s\*$/, ` (${leftText}) *`)
    : placeholder;

  return (
    <TextField
      error={error}
      inputMode={numeric ? "numeric" : "text"}
      label={floatingLabel}
      leadingSlot={hasValue ? <ClearFieldButton onClick={() => onChange("")} /> : leftText ? <Typography as="span" variant="body" size="medium" weight="regular" className="shrink-0 text-sm text-[#a6a6a6]">{leftText}</Typography> : undefined}
      onChange={(event) => onChange(numeric ? normalizeNumberInput(event.target.value) : event.target.value)}
      placeholder={hasValue ? "" : placeholder}
      supportingText={supportingText}
      value={displayValue}
    />
  );
}

export function SelectBox({
  error,
  onClick,
  onClear,
  placeholder,
  value,
}: {
  error?: string;
  onClick: () => void;
  onClear?: () => void;
  placeholder: string;
  value: string;
}) {
  return (
    <SelectField
      error={error}
      leadingSlot={value && onClear ? <ClearFieldButton onClick={onClear} /> : undefined}
      onClick={onClick}
      placeholder={placeholder}
      value={value}
    />
  );
}

export function LocationBox({ value, label }: { value: string; label: string }) {
  return (
    <SelectField
      onClick={() => {
        const search = window.location.search || `?label=${encodeURIComponent(label)}`;
        navigateTo(`/new-ad/location${search}`);
      }}
      placeholder="تعیین مکان"
      value={value}
      leadingSlot={
        <LinearArrowLeft1 aria-hidden="true" className="h-5 w-5 shrink-0 text-[#4d4d4d]" />
      }
    />
  );
}

export function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <UiChip onClick={onRemove} removable selected>{label}</UiChip>;
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
    <UiChip
      icon={
        <FeaturesIcons
          feature={item.label}
          className={`h-5 w-5 shrink-0 object-contain ${selected
            ? "[filter:brightness(0)_saturate(100%)_invert(20%)_sepia(95%)_saturate(2950%)_hue-rotate(211deg)_brightness(88%)_contrast(105%)]"
            : "[filter:brightness(0)_saturate(100%)_invert(28%)_sepia(0%)_saturate(0%)_hue-rotate(178deg)_brightness(95%)_contrast(85%)]"
            }`}
        />
      }
      onClick={onClick}
      selected={selected}
    >
      {item.label}
    </UiChip>
  );
}

export function SwitchButton({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return <Switch checked={checked} onChange={onChange} />;
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
    <div className="flex pt-3 items-center justify-between border-t border-[#cccccc] [direction:ltr]">
      <SwitchButton checked={checked} onChange={onChange} />

      <Typography as="span" variant="label" size="large" weight="semibold" className="text-right text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
        {label}
      </Typography>
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
  const desktop = useNewAdDesktopLayout();

  return (
    <footer className={desktop
      ? "flex shrink-0 justify-end gap-3 border-t border-[#e1e7f0] bg-white px-6 py-4 [direction:ltr]"
      : "grid shrink-0 grid-cols-2 gap-3 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-16px_24px_rgba(255,255,255,0.96)] [direction:ltr]"}>
      <Button
        className={desktop ? "w-48" : ""}
        disabled={disabled}
        fullWidth={!desktop}
        onClick={onPrimary}
        trailingIcon={<LinearArrowLeft2 aria-hidden="true" className="h-5 w-5 shrink-0" />}
      >
        <Typography as="span" variant="body" size="medium" weight="regular">{primary}</Typography>
      </Button>

      <Button
        className={desktop ? "w-40" : ""}
        fullWidth={!desktop}
        onClick={onBack}
        leadingIcon={<LinearArrowRight2 aria-hidden="true" className="h-5 w-5 shrink-0" />}
        variant="secondary"
      >
        <Typography as="span" variant="body" size="medium" weight="regular">مرحله قبل</Typography>
      </Button>
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
    <Button unstyled
      className="mx-auto mt-4 flex items-center justify-center gap-1.5 rounded-full py-2.5 !text-sm !font-medium leading-5 text-[#0048C4] active:bg-[#0048c40f]"
      onClick={onClick}
      type="button"
    >
      <Typography as="span" variant="label" size="medium">
        {expanded ? "نمایش کمتر" : `نمایش ${count} مورد بیشتر`}
      </Typography>

      {expanded ? (
        <LinearArrowUp1 aria-hidden="true" className="h-5 w-5 shrink-0" />
      ) : (
        <LinearArrowDown1 aria-hidden="true" className="h-5 w-5 shrink-0" />
      )}
    </Button>
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

      <Typography as="span" variant="label" size="large" weight="semibold" className="text-right text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
        {label}
      </Typography>
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
  const desktop = useNewAdDesktopLayout();

  return (
    <footer className={desktop
      ? "flex shrink-0 justify-end gap-3 border-t border-[#e1e7f0] bg-white px-6 py-4 [direction:ltr]"
      : "grid shrink-0 grid-cols-2 gap-3 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-16px_24px_rgba(255,255,255,0.96)] [direction:ltr]"}>
      <Button
        className={desktop ? "w-48" : ""}
        fullWidth={!desktop}
        onClick={onConfirm}
      >
        تایید
      </Button>

      <Button
        className={desktop ? "w-40" : ""}
        fullWidth={!desktop}
        onClick={onCancel}
        variant="secondary"
      >
        انصراف
      </Button>
    </footer>
  );
}
