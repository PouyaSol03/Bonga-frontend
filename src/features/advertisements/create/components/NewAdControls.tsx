import { useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearArrowLeft2 from "../../../../shared/icons/LinearArrowLeft2";
import LinearArrowRight2 from "../../../../shared/icons/LinearArrowRight2";
import LinearCancelCircle from "../../../../shared/icons/LinearCancelCircle";
import LinearCancelSmall from "../../../../shared/icons/LinearCancelSmall";
import { Button } from "../../../../shared/ui/Button";
import { Chip as UiChip } from "../../../../shared/ui/Chip";
import { SelectField } from "../../../../shared/ui/SelectField";
import { Switch } from "../../../../shared/ui/Switch";
import { TextField } from "../../../../shared/ui/TextField";
import { FeaturesIcons } from "../../components/FeaturesIcons";
import { TopBar } from "../../../../shared/components/TopBar";
import { normalizeNumberInput } from "../utils";
import { formatNumber as formatPrice } from "../../../../shared/lib/numberUtils";
import { preserveNewAdDraftStateKey } from "../session";
import type { ChipItem } from "../types";
import { useNewAdDesktopLayout } from "../NewAdLayoutContext";
import { Typography } from "../../../../shared/ui/Typography";
import { cn } from "../../../../design-system/classes";
import LinearInformation from "../../../../shared/icons/LinearInformation";
import LinearImage from "../../../../shared/icons/LinearImage";
import LinearMoney from "../../../../shared/icons/LinearMoney";
import LinearLocation from "../../../../shared/icons/LinearLocation";
import LinearTemperature from "../../../../shared/icons/LinearTemperature";
import LinearSettingBuilding from "../../../../shared/icons/LinearSettingBuilding";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";

export function Header({ title, onBack }: { title: string; onBack?: () => void }) {
  const navigate = useNavigate();
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }

    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/new-ad/category", { replace: true });
    }
  }, [navigate, onBack]);

  return <TopBar onBack={handleBack} title={title} />;
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
      className={
        desktop
          ? "border-outline-var bg-surface-container-lowest rounded-xl border p-4 text-right shadow-[0_6px_20px_rgba(30,50,80,0.04)] [direction:rtl]"
          : "border-surface-container bg-surface-container-lowest border-b-[10px] p-4 text-right [direction:rtl] last:border-b-0"
      }
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon === "image.svg" || icon === "image" ? (
            <LinearImage className="text-on-surface-var h-6 w-6" />
          ) : icon === "money.svg" || icon === "money" ? (
            <LinearMoney className="text-on-surface-var h-6 w-6" />
          ) : icon === "location.svg" || icon === "location" ? (
            <LinearLocation className="text-on-surface-var h-6 w-6" />
          ) : icon === "tempreture.svg" || icon === "temperature.svg" || icon === "temperature" ? (
            <LinearTemperature className="text-on-surface-var h-6 w-6" />
          ) : icon === "features.svg" || icon === "facilities" || icon === "settings" ? (
            <LinearSettingBuilding className="text-on-surface-var h-6 w-6" />
          ) : (
            <LinearInformation className="text-on-surface-var h-6 w-6" />
          )}

          <Typography variant="label" size="large" weight="medium" className="text-on-surface">
            {title}
          </Typography>
        </div>

        {warning ? (
          <LinearInfoCircle className="text-on-surface-var h-6 w-6" />
        ) : (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="h-7 w-7 shrink-0"
          />
        )}
      </div>

      {contentClassName ? <div className={contentClassName}>{children}</div> : children}
    </section>
  );
}

function ClearFieldButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      unstyled
      aria-label="پاک کردن"
      className="text-on-surface-var active:bg-surface-container-high grid h-6 w-6 shrink-0 place-items-center rounded-full opacity-40 transition-colors duration-150"
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
  const displayValue =
    numeric && formatNumeric && value
      ? formatPrice(Number(normalizeNumberInput(value).replace(/,/g, "")))
      : value;
  const unitMovesToFloatingLabel = Boolean(leftText) && floatingLabel === undefined;
  const resolvedFloatingLabel =
    floatingLabel ??
    (leftText
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
      onChange={(event) =>
        onChange(numeric ? normalizeNumberInput(event.target.value) : event.target.value)
      }
      onClear={() => onChange("")}
      placeholder={placeholder}
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
      leadingSlot={
        leadingSlot ?? (value && onClear ? <ClearFieldButton onClick={onClear} /> : undefined)
      }
      onClick={onClick}
      placeholder={placeholder}
      value={value}
    />
  );
}

export function LocationBox({ value, label }: { value: string; label: string }) {
  const navigate = useNavigate();
  return (
    <SelectField
      onClick={() => {
        const search = window.location.search || `?label=${encodeURIComponent(label)}`;
        const currentState =
          typeof window !== "undefined" &&
          window.history.state &&
          typeof window.history.state === "object"
            ? window.history.state
            : {};
        navigate(`/new-ad/location${search}`, {
          state: {
            ...currentState,
            [preserveNewAdDraftStateKey]: true,
          },
        });
      }}
      placeholder="تعیین مکان"
      value={value}
      leadingSlot={
        <LinearArrowLeft1 aria-hidden="true" className="text-on-surface-var h-5 w-5 shrink-0" />
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
      removeIcon={<LinearCancelSmall aria-hidden="true" className="h-5 w-5" />}
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
      icon={
        <FeaturesIcons
          feature={item.label}
          selected={selected}
          className={cn("h-5 w-5 shrink-0 object-contain", selected ? "text-primary" : "text-on-surface-var")}
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
    <div className="border-outline-var flex items-center justify-between border-t py-5 [direction:ltr]">
      <SwitchButton checked={checked} onChange={onChange} />

      <div className="flex gap-2">
        <LinearInfoCircle className="text-on-surface-var h-6 w-6" />
        <Typography
          as="span"
          variant="title"
          size="medium"
          weight="medium"
          className="text-on-surface [direction:rtl]"
        >
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
    <footer
      className={
        desktop
          ? "border-outline-var bg-surface-container-lowest flex shrink-0 justify-end gap-3 border-t px-6 py-4 [direction:ltr]"
          : "bg-surface-container-lowest grid shrink-0 grid-cols-2 gap-3 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_0_rgba(26,26,26,0.08)] [direction:ltr]"
      }
    >
      <Button
        className={desktop ? "w-48" : ""}
        disabled={disabled}
        fullWidth={!desktop}
        onClick={onPrimary}
        trailingIcon={<LinearArrowLeft2 aria-hidden="true" className="h-5 w-5 shrink-0" />}
      >
        <Typography as="span" variant="body" size="medium" weight="regular">
          {primary}
        </Typography>
      </Button>

      <Button
        className={desktop ? "w-40" : ""}
        fullWidth={!desktop}
        onClick={onBack}
        leadingIcon={<LinearArrowRight2 aria-hidden="true" className="h-5 w-5 shrink-0" />}
        variant="secondary"
      >
        <Typography as="span" variant="body" size="medium" weight="regular">
          مرحله قبل
        </Typography>
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
    <Button
      unstyled
      className="text-primary active:bg-primary-container/20 mx-auto mt-4 flex items-center justify-center gap-1.5 rounded-full py-2.5 !text-sm leading-5 !font-medium"
      onClick={onClick}
      type="button"
    >
      <Typography as="span" variant="label" size="medium" className="text-primary">
        {expanded ? "مشاهده کمتر" : `مشاهده ${countLabel} مورد بیشتر`}
      </Typography>

      <motion.div
        animate={{ rotate: expanded ? 180 : 0 }}
        transition={{ duration: 0.24, ease: "easeInOut" }}
        className="text-primary inline-flex shrink-0 items-center justify-center"
      >
        <LinearArrowDown1 aria-hidden="true" className="text-primary h-5 w-5 shrink-0" />
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

      <Typography
        as="span"
        variant="label"
        size="large"
        weight="semibold"
        className="text-on-surface text-right text-base leading-6 font-semibold [direction:rtl]"
      >
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
    <footer
      className={
        desktop
          ? "border-outline-var bg-surface-container-lowest flex shrink-0 justify-end gap-3 border-t px-6 py-4 [direction:ltr]"
          : "bg-surface-container-lowest grid shrink-0 grid-cols-2 gap-3 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_0_rgba(26,26,26,0.08)] [direction:ltr]"
      }
    >
      <Button className={desktop ? "w-48" : ""} fullWidth={!desktop} onClick={onConfirm}>
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
