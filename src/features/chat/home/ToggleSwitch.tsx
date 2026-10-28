import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

export function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Button
      unstyled
      aria-pressed={checked}
      className={`focus-visible:outline-primary/40 relative h-6 w-11 rounded-full transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 ${
        checked ? "bg-primary" : "bg-outline-var"
      }`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`bg-surface-container-lowest absolute top-0.5 h-5 w-5 rounded-full shadow-sm transition-transform ${
          checked ? "right-[22px]" : "right-0.5"
        }`}
      />
    </Button>
  );
}
