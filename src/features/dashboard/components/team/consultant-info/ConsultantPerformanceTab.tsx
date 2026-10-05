import { ConsultantPerformanceSummary } from "./ConsultantPerformanceSummary";

interface ConsultantPerformanceTabProps {
  agentId?: number | string;
  onViewCharts: () => void;
}

export function ConsultantPerformanceTab({
  agentId,
  onViewCharts,
}: ConsultantPerformanceTabProps) {
  return <ConsultantPerformanceSummary agentId={agentId} onViewCharts={onViewCharts} />;
}
