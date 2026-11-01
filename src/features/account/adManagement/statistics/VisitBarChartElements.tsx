import { Button } from "../../../../shared/ui/Button";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";

export function ChartRangeControls({
  maxOffset,
  offset,
  setOffset,
}: {
  maxOffset: number;
  offset: number;
  setOffset: (updater: (current: number) => number) => void;
}) {
  return (
    <div className="flex items-center">
      <Button
        unstyled
        aria-label="بازه قبلی"
        className={`grid h-12 w-12 place-items-center ${
          offset >= maxOffset ? "text-outline-var" : "text-on-surface-var"
        }`}
        disabled={offset >= maxOffset}
        onClick={() => setOffset((current) => Math.min(current + 1, maxOffset))}
        type="button"
      >
        <LinearArrowLeft1 className="h-5 w-5" />
      </Button>
      <Button
        unstyled
        aria-label="بازه بعدی"
        className={`grid h-12 w-12 place-items-center ${
          offset === 0 ? "text-outline-var" : "text-on-surface-var"
        }`}
        disabled={offset === 0}
        onClick={() => setOffset((current) => Math.max(current - 1, 0))}
        type="button"
      >
        <LinearArrowRight1 className="h-5 w-5" />
      </Button>
    </div>
  );
}

export function SelectedVisitBarLabel({
  index,
  selectedIndex,
  tooltipText,
  width,
  x,
  y,
}: {
  index: number;
  selectedIndex: number;
  tooltipText: string;
  width: number;
  x: number;
  y: number;
}) {
  if (index !== selectedIndex) return null;

  const labelWidth = Math.max(48, tooltipText.length * 10 + 18);
  const labelHeight = 28;
  const centerX = x + width / 2;
  const labelX = centerX - labelWidth / 2;
  const labelY = Math.max(0, y - labelHeight - 8);

  return (
    <g aria-hidden="true" pointerEvents="none">
      <rect
        fill="var(--on-surface-var)"
        height={labelHeight}
        rx={6}
        width={labelWidth}
        x={labelX}
        y={labelY}
      />
      <path
        d={`M ${centerX - 5} ${labelY + labelHeight - 1} L ${centerX} ${labelY + labelHeight + 6} L ${centerX + 5} ${labelY + labelHeight - 1} Z`}
        fill="var(--on-surface-var)"
      />
      <text
        direction="rtl"
        dominantBaseline="middle"
        fill="var(--surface-container-lowest)"
        fontSize="12"
        fontWeight="500"
        textAnchor="middle"
        x={centerX}
        y={labelY + labelHeight / 2}
      >
        {tooltipText}
      </text>
    </g>
  );
}
