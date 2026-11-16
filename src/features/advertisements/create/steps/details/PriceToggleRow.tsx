import { useRef } from "react";
import { SwitchButton } from "../../components/NewAdControls";
import { Typography } from "../../../../../shared/ui/Typography";
import { scrollDownToRevealed } from "../../utils";

export function PriceToggleRow({
  checked,
  label,
  onChange,
  autoScroll = true,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  autoScroll?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleToggle = (nextChecked: boolean) => {
    onChange(nextChecked);
    if (nextChecked && autoScroll) {
      scrollDownToRevealed(rowRef.current, 220);
    }
  };

  return (
    <div
      ref={rowRef}
      className="flex h-16 cursor-pointer items-center justify-between select-none [direction:ltr]"
      onClick={() => handleToggle(!checked)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <SwitchButton checked={checked} onChange={handleToggle} />
      </div>

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

