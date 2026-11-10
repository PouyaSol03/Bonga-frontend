import { SwitchButton } from "../../components/NewAdControls";
import { Typography } from "../../../../../shared/ui/Typography";

export function PriceToggleRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex h-16 items-center justify-between [direction:ltr]">
      <SwitchButton checked={checked} onChange={onChange} />

      <Typography
        as="span"
        variant="label"
        size="large"
        weight="semibold"
        className="text-on-surface text-right [direction:rtl]"
      >
        {label}
      </Typography>
    </div>
  );
}
