import { Button } from "../../../shared/ui/Button";
import { ChoiceIndicator } from "../../../shared/ui/Choice";
import { Typography } from "../../../shared/ui/Typography";
import { PaymentOptionIcon } from "../../account/adManagement/AdManagementIcons";

export function PaymentMethodOption({
  active,
  disabled = false,
  icon,
  label,
  onClick,
  subLabel,
  subLabelClassName = "text-outline",
}: {
  active: boolean;
  disabled?: boolean;
  icon: "consultant" | "credit" | "online" | "wallet";
  label: string;
  onClick: () => void;
  subLabel: string;
  subLabelClassName?: string;
}) {
  return (
    <Button
      unstyled
      aria-pressed={active}
      className={`bg-surface-container-lowest flex h-[72px] w-full items-center justify-between border-0 px-4 text-inherit [direction:ltr] ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <ChoiceIndicator
        checked={active}
        className={`ml-1 ${!active && !disabled ? "!border-outline-var" : ""}`}
        disabled={disabled}
        type="radio"
      />
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="inline-flex items-center gap-2 text-right [direction:rtl]"
      >
        <PaymentOptionIcon className="text-on-surface-var h-6 w-6 shrink-0" icon={icon} />
        <Typography as="span" variant="body" size="medium" weight="regular" className="block">
          <strong className="text-on-surface block text-base leading-6 font-normal">{label}</strong>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className={`block text-sm leading-5 font-normal ${subLabelClassName}`}
          >
            {subLabel}
          </Typography>
        </Typography>
      </Typography>
    </Button>
  );
}
