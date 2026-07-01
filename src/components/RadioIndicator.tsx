type RadioIndicatorProps = {
  checked: boolean;
  className?: string;
};

export function RadioIndicator({
  checked,
  className = "",
}: RadioIndicatorProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border ${
        checked ? "border-[#0048c4] bg-[#0048c4]" : "border-[#808080] bg-white"
      } ${className}`}
    >
      {checked ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
    </span>
  );
}
