import { Switch } from "./ui/Switch";

type SwitchButtonProps = {
  ariaLabel?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export function SwitchButton({ ariaLabel, checked, disabled = false, onChange }: SwitchButtonProps) {
  return <Switch aria-label={ariaLabel} checked={checked} disabled={disabled} onChange={onChange} />;
}
