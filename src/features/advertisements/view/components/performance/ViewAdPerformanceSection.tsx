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
    <section aria-label="بخش عملکرد آگهی" className={`flex flex-col [direction:rtl] ${className}`}>
      <ViewAdPerformanceKpiCards adId={adId} sourceAd={ad} />
      <div className="bg-surface-container h-4" />
      <ViewAdPerformanceProgressCharts adId={adId} />
      <div className="bg-surface-container h-4" />
      <ViewAdPerformanceFunnelCard adId={adId} />
    </section>
  );
}

export default ViewAdPerformanceSection;
