export type PieSelectionDatum = {
  value: number;
};

export const pieChartSize = 220;
export const pieCenter = pieChartSize / 2;
export const pieOuterRadius = 74;
export const pieSelectedOffset = 9;
export const pieTooltipWidth = 76;
export const pieTooltipHeight = 48;
export const pieTooltipGap = 28;
export const pieTooltipLineOverlap = 6;

export function getPieSelectionGeometry(data: PieSelectionDatum[], selectedIndex: number) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) return null;
  const precedingValue = data.slice(0, selectedIndex).reduce((sum, item) => sum + item.value, 0);
  const selectedValue = data[selectedIndex]?.value ?? 0;
  const startAngle = 90 - (precedingValue / total) * 360;
  const midAngle = startAngle - (selectedValue / total) * 180;
  const radians = (Math.PI / 180) * midAngle;
  const selectedCenterX = pieCenter + pieSelectedOffset * Math.cos(radians);
  const selectedCenterY = pieCenter - pieSelectedOffset * Math.sin(radians);

  const dot = {
    x: selectedCenterX + 38 * Math.cos(radians),
    y: selectedCenterY - 38 * Math.sin(radians),
  };
  const isLeft = dot.x < pieCenter;
  const isTop = dot.y < pieCenter;
  const tooltipLeft = isLeft ? dot.x - pieTooltipWidth - pieTooltipGap : dot.x + pieTooltipGap;
  const tooltipTop = isTop ? dot.y - pieTooltipHeight - pieTooltipGap : dot.y + pieTooltipGap;

  return {
    dotX: dot.x,
    dotY: dot.y,
    endAngle: startAngle - (selectedValue / total) * 360,
    lineEndX: isLeft ? tooltipLeft + pieTooltipWidth - pieTooltipLineOverlap : tooltipLeft + pieTooltipLineOverlap,
    lineEndY: isTop ? tooltipTop + pieTooltipHeight - pieTooltipLineOverlap : tooltipTop + pieTooltipLineOverlap,
    lineStartX: dot.x,
    lineStartY: dot.y,
    midAngle,
    startAngle,
    tooltipLeft,
    tooltipTop,
  };
}
