type SelectionCheckIndicatorProps = {
  checked: boolean;
  className?: string;
};

export function SelectionCheckIndicator({
  checked,
  className = "",
}: SelectionCheckIndicatorProps) {
  return (
    <span
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border ${
        checked
          ? "border-[#0048c4] bg-[#0048c4] text-white"
          : "border-[#808080] bg-white"
      } ${className}`}
    >
      {checked ? <img alt="" src="/icons/checkTick.svg" /> : null}
    </span>
  );
}
