import { ViewAdPerformanceKpiCards } from "./ViewAdPerformanceKpiCards";
import { ViewAdPerformanceProgressCharts } from "./ViewAdPerformanceProgressCharts";
import { ViewAdPerformanceFunnelCard } from "./ViewAdPerformanceFunnelCard";

export interface ViewAdPerformanceSectionProps {
  adId?: string | number;
  ad?: Record<string, unknown>;
  className?: string;
}

export function ViewAdPerformanceSection({
  adId,
  ad,
  className = "",
}: ViewAdPerformanceSectionProps) {
  return (
    <section
      aria-label="بخش عملکرد آگهی"
      className={`flex flex-col [direction:rtl] ${className}`}
    >
      <ViewAdPerformanceKpiCards adId={adId} sourceAd={ad} />
      <div className="h-4 bg-surface-container" />
      <ViewAdPerformanceProgressCharts adId={adId} />
      <div className="h-4 bg-surface-container" />
      <ViewAdPerformanceFunnelCard />
    </section>
  );
}

export default ViewAdPerformanceSection;
