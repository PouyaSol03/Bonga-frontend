type SwitchButtonProps = {
  ariaLabel?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export function SwitchButton({ ariaLabel, checked, disabled = false, onChange }: SwitchButtonProps) {
  return (
    <button
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`flex h-6 w-11 shrink-0 items-center rounded-full px-1 [direction:ltr] ${
        checked ? "justify-end bg-[#0048c4]" : "justify-start bg-[#1A1A1A14]"
      } disabled:cursor-wait disabled:opacity-60`}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span className={`block h-4 w-4 rounded-full ${checked ? "bg-white" : "bg-[#808080]"}`} />
    </button>
  );
}
