import { useCallback, type ReactNode } from "react";
import { motion } from "motion/react";

import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearArrowLeft2 from "../../../../shared/icons/LinearArrowLeft2";
import LinearArrowRight2 from "../../../../shared/icons/LinearArrowRight2";
import LinearCancelCircle from "../../../../shared/icons/LinearCancelCircle";
import { Button } from "../../../../shared/ui/Button";
import { Chip as UiChip } from "../../../../shared/ui/Chip";
import { SelectField } from "../../../../shared/ui/SelectField";
import { Switch } from "../../../../shared/ui/Switch";
import { TextField } from "../../../../shared/ui/TextField";
import { FeaturesIcons } from "../../components/FeaturesIcons";
import { TopBar } from "../../../../shared/components/TopBar";
import { formatPrice } from "../../../../shared/lib/MoneyHandler";
import { normalizeNumberInput, navigateTo } from "../utils";
import type { ChipItem } from "../types";
import { useNewAdDesktopLayout } from "../NewAdLayoutContext";
import { Typography } from "../../../../shared/ui/Typography";
import LinearInformation from "../../../../shared/icons/LinearInformation";
import LinearImage from "../../../../shared/icons/LinearImage";
import LinearMoney from "../../../../shared/icons/LinearMoney";
import LinearLocation from "../../../../shared/icons/LinearLocation";
import LinearTemperature from "../../../../shared/icons/LinearTemperature";
import LinearSettingBuilding from "../../../../shared/icons/LinearSettingBuilding";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";

export function Header({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo("/new-ad/category");
    }
  }, [onBack]);

  return (
    <TopBar onBack={handleBack} title={title} />
  );
}

export function Section({
  title,
  icon,
  warning,
  children,
  contentClassName = "",
}: {
  title: string;
  icon: string;
  warning?: boolean;
  children: ReactNode;
  contentClassName?: string;
}) {
  const desktop = useNewAdDesktopLayout();

  return (
    <section
      className={desktop
        ? "rounded-xl border border-outline-var bg-surface-container-lowest p-4 text-right shadow-[0_6px_20px_rgba(30,50,80,0.04)] [direction:rtl]"
        : "border-b-[10px] border-outline-var bg-surface-container-lowest p-4 text-right last:border-b-0 [direction:rtl]"}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon === "image.svg" || icon === "image" ? (
            <LinearImage className="h-6 w-6 text-on-surface-var" />
          ) : icon === "money.svg" || icon === "money" ? (
            <LinearMoney className="h-6 w-6 text-on-surface-var" />
          ) : icon === "location.svg" || icon === "location" ? (
            <LinearLocation className="h-6 w-6 text-on-surface-var" />
          ) : icon === "tempreture.svg" || icon === "temperature.svg" || icon === "temperature" ? (
            <LinearTemperature className="h-6 w-6 text-on-surface-var" />
          ) : icon === "features.svg" || icon === "facilities" || icon === "settings" ? (
            <LinearSettingBuilding className="h-6 w-6 text-on-surface-var" />
          ) : (
            <LinearInformation className="h-6 w-6 text-on-surface-var" />
          )}

          <Typography variant="label" size="large" weight="medium" className="text-on-surface">
            {title}
          </Typography>
        </div>

        {warning ? (
          <LinearInfoCircle className="w-6 h-6 text-on-surface-var" />
        ) : (
          <Typography as="span" variant="body" size="medium" weight="regular" className="h-7 w-7 shrink-0" />
        )}
      </div>

      {contentClassName ? <div className={contentClassName}>{children}</div> : children}
    </section>
  );
}

function ClearFieldButton({ onClick }: { onClick: () => void }) {
  return (
    <Button unstyled
      aria-label="پاک کردن"
      className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-on-surface-var opacity-40 transition-colors duration-150 hover:bg-surface-container active:bg-surface-container-high"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      type="button"
    >
      <LinearCancelCircle aria-hidden="true" className="h-6 w-6" />
    </Button>
  );
}

export function InputBox({
  error,
  floatingLabel,
  formatNumeric,
  highlightWhenFilled,
  leftText,
  maxLength,
  numeric,
  onChange,
  placeholder,
  supportingText,
  type = "text",
  value,
}: {
  error?: string;
  floatingLabel?: string;
  formatNumeric?: boolean;
  highlightWhenFilled?: boolean;
  leftText?: string;
  maxLength?: number;
  numeric?: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  supportingText?: string;
  type?: "text" | "time";
  value: string;
}) {
  const hasValue = Boolean(value);
  const displayValue = numeric && formatNumeric && value
    ? formatPrice(Number(normalizeNumberInput(value).replace(/,/g, "")))
    : value;
  const unitMovesToFloatingLabel = Boolean(leftText) && floatingLabel === undefined;
  const resolvedFloatingLabel = floatingLabel ?? (leftText
    ? /\s\*$/.test(placeholder)
      ? placeholder.replace(/\s\*$/, ` (${leftText}) *`)
      : `${placeholder} (${leftText})`
    : placeholder);

  return (
    <TextField
      badge={leftText}
      error={error}
      hideBadgeWhenFloatingLabel={unitMovesToFloatingLabel}
      highlightWhenFilled={highlightWhenFilled ?? false}
      formatNumber={Boolean(numeric)}
      inputMode={numeric ? "numeric" : "text"}
      label={resolvedFloatingLabel}
      maxLength={maxLength}
      onChange={(event) => onChange(numeric ? normalizeNumberInput(event.target.value) : event.target.value)}
      onClear={() => onChange("")}
      placeholder={hasValue ? "" : placeholder}
      supportingText={supportingText}
      type={type}
      value={displayValue}
    />
  );
}

export function SelectBox({
  error,
  leadingSlot,
  onClick,
  onClear,
  placeholder,
  value,
}: {
  error?: string;
  leadingSlot?: ReactNode;
  onClick: () => void;
  onClear?: () => void;
  placeholder: string;
  value: string;
}) {
  return (
    <SelectField
      error={error}
      leadingSlot={leadingSlot ?? (value && onClear ? <ClearFieldButton onClick={onClear} /> : undefined)}
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
        <LinearArrowLeft1 aria-hidden="true" className="h-5 w-5 shrink-0 text-on-surface-var" />
      }
    />
  );
}

export function Tag({
  className = "",
  label,
  onRemove,
}: {
  className?: string;
  label: string;
  onRemove: () => void;
}) {
  return (
    <UiChip
      className={className}
      onClick={onRemove}
      removable
      removeIcon={<LinearCancelCircle aria-hidden="true" className="h-6 w-6" />}
      selected
    >
      {label}
    </UiChip>
  );
}

export function Chip({
  displayLabel,
  item,
  selected,
  onClick,
}: {
  displayLabel?: string;
  item: ChipItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <UiChip
      className="flex-row-reverse"
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
      {displayLabel ?? item.label}
    </UiChip>
  );
}

export function SwitchButton({
  checked,
  disabled = false,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return <Switch checked={checked} disabled={disabled} onChange={onChange} />;
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
    <div className="flex items-center justify-between border-t border-outline-var py-5 [direction:ltr]">
      <SwitchButton checked={checked} onChange={onChange} />

      <div className="flex gap-2">
        <LinearInfoCircle className="w-6 h-6 text-on-surface-var" />
        <Typography as="span" variant="title" size="medium" weight="medium" className="text-on-surface [direction:rtl]">
          {label}
        </Typography>
      </div>
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
      ? "flex shrink-0 justify-end gap-3 border-t border-outline-var bg-surface-container-lowest px-6 py-4 [direction:ltr]"
      : "grid shrink-0 grid-cols-2 gap-3 bg-surface-container-lowest px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-4px_16px_0_rgba(26,26,26,0.08)] [direction:ltr]"}>
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
  const countLabel = new Intl.NumberFormat("fa-IR").format(count);

  return (
    <Button unstyled
      className="mx-auto mt-4 flex items-center justify-center gap-1.5 rounded-full py-2.5 !text-sm !font-medium leading-5 text-primary active:bg-primary-container/20"
      onClick={onClick}
      type="button"
    >
      <Typography as="span" variant="label" size="medium" className="text-primary">
        {expanded ? "مشاهده کمتر" : `مشاهده ${countLabel} مورد بیشتر`}
      </Typography>

      <motion.div
        animate={{ rotate: expanded ? 180 : 0 }}
        transition={{ duration: 0.24, ease: "easeInOut" }}
        className="inline-flex items-center justify-center shrink-0 text-primary"
      >
        <LinearArrowDown1 aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
      </motion.div>
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

      <Typography as="span" variant="label" size="large" weight="semibold" className="text-right text-base font-semibold leading-6 text-on-surface [direction:rtl]">
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
      ? "flex shrink-0 justify-end gap-3 border-t border-outline-var bg-surface-container-lowest px-6 py-4 [direction:ltr]"
      : "grid shrink-0 grid-cols-2 gap-3 bg-surface-container-lowest px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-4px_16px_0_rgba(26,26,26,0.08)] [direction:ltr]"}>
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
