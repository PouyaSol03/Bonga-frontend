export function renderChartTooltip(
  selectedIndex: number,
  tooltipText: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any,
) {
  const { index, x, y, width } = props;
  if (index !== selectedIndex || x == null || y == null || width == null) return null;
  const cx = x + width / 2;
  return (
    <g aria-hidden="true" pointerEvents="none">
      <rect fill="#4D4D4D" height={24} rx={4} width={44} x={cx - 22} y={Math.max(0, y - 30)} />
      <path d={`M ${cx - 4} ${y - 6} L ${cx} ${y} L ${cx + 4} ${y - 6} Z`} fill="#4D4D4D" />
      <text
        dominantBaseline="middle"
        fill="white"
        fontSize={11}
        fontWeight="bold"
        textAnchor="middle"
        x={cx}
        y={Math.max(0, y - 30) + 12}
      >
        {tooltipText}
      </text>
    </g>
  );
}
