import { ConsultantPerformanceSummary } from "./ConsultantPerformanceSummary";

interface ConsultantPerformanceTabProps {
  onViewCharts: () => void;
}

export function ConsultantPerformanceTab({
  onViewCharts,
}: ConsultantPerformanceTabProps) {
  return <ConsultantPerformanceSummary onViewCharts={onViewCharts} />;
}
