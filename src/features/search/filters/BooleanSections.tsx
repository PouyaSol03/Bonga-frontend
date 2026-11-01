import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { ChoiceIndicator } from "../../../shared/ui/Choice";

export function SwitchOnlySection({
  checked,
  groupEnd,
  groupStart,
  label,
  onChange,
}: {
  checked: boolean;
  groupEnd: boolean;
  groupStart: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <section
      className={`bg-surface-container-lowest px-4 ${groupStart ? "pt-[7.5px]" : ""} ${
        groupEnd ? "border-surface-container border-b-8 pb-[7.5px]" : ""
      }`}
      dir="rtl"
    >
      <CheckboxRow checked={checked} divider={!groupEnd} label={label} onChange={onChange} />
    </section>
  );
}

export function LoanFilterSection({
  checked,
  onChange,
}: {
  checked: boolean;
  groupStart?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <section
      className="border-surface-container bg-surface-container-lowest border-b-8 px-4"
      data-filter-section="hasLoan"
      dir="rtl"
    >
      <Button
        unstyled
        aria-pressed={checked}
        className="bg-surface-container-lowest flex h-[56px] w-full items-center justify-between gap-3 pl-3 text-right"
        onClick={() => onChange(!checked)}
        type="button"
      >
        <Typography
          as="span"
          variant="title"
          size="medium"
          weight="medium"
          className="text-on-surface min-w-0 flex-1"
        >
          با وام
        </Typography>
        <ChoiceIndicator checked={checked} className="rounded" />
      </Button>
    </section>
  );
}

export function CheckboxRow({
  checked,
  divider = false,
  label,
  onChange,
}: {
  bottomFilter?: boolean;
  checked: boolean;
  divider?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Button
      unstyled
      aria-pressed={checked}
      className={`bg-surface-container-lowest flex h-[59px] w-full items-center justify-between gap-3 pl-3 text-right ${
        divider ? "border-outline-var border-b" : ""
      }`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <Typography
        as="span"
        variant="title"
        size="medium"
        weight="medium"
        className="text-on-surface min-w-0 flex-1"
      >
        {label}
      </Typography>
      <ChoiceIndicator checked={checked} className="rounded" />
    </Button>
  );
}
