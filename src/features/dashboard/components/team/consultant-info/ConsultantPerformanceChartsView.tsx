import { useState } from "react";
import { TopBar } from "../../../../../shared/components/TopBar";
import { toPersianNumber } from "../../../../../shared/lib/numberUtils";
import { ConsultantPieCard } from "./ConsultantPieCard";
import { ConsultantProgressLineCard } from "./ConsultantProgressLineCard";
import {
  useAgencyConsultantChartsQuery,
  useAgencyConsultantPublishedAdsMetricQuery,
  useAgencyConsultantRenewalUsageMetricQuery,
  useAgencyConsultantSpecialUsageMetricQuery,
} from "../../../../agencies/api/agency.hooks";
import type { ConsultantMetricData } from "../../../../agencies/api/agency.service";
import type { ConsultantPieDatum, PeriodKey } from "./types";

function createPieCardData({
  data,
  fallbackTitle,
  agencyColorVar,
  consultantColorVar,
  badgeColorVar,
  badgeBgColorVar,
}: {
  data?: ConsultantMetricData;
  fallbackTitle: string;
  agencyColorVar: string;
  consultantColorVar: string;
  badgeColorVar: string;
  badgeBgColorVar: string;
}): ConsultantPieDatum {
  const agentSlice = data?.slices?.find((s) => s.key === "agent");
  const restSlice = data?.slices?.find((s) => s.key === "rest_of_agency");

  const agentCount = data?.agent_count ?? data?.count ?? agentSlice?.value ?? 0;
  const totalCount = data?.total_count ?? 0;

  const consultantValue =
    agentSlice?.percentage !== undefined
      ? agentSlice.percentage
      : totalCount > 0
        ? Math.round((agentCount / totalCount) * 100)
        : 0;

  const agencyValue =
    restSlice?.percentage !== undefined
      ? restSlice.percentage
      : totalCount > 0
        ? 100 - consultantValue
        : 0;

  return {
    agencyColorVar,
    agencyValue,
    badge: toPersianNumber(agentCount),
    badgeBgColorVar,
    badgeColorVar,
    consultantColorVar,
    consultantValue,
    subtitle:
      totalCount > 0
        ? `${toPersianNumber(agentCount)} مورد از ${toPersianNumber(totalCount)} مورد ثبت شده`
        : "هیچ موردی ثبت نشده است",
    title: data?.title || fallbackTitle,
  };
}

export function ConsultantPerformanceChartsView({
  agentId,
  onBack,
}: {
  agentId?: number | string;
  onBack: () => void;
}) {
  const [adsPeriod, setAdsPeriod] = useState<PeriodKey>("month");
  const [updatesPeriod, setUpdatesPeriod] = useState<PeriodKey>("month");
  const [featuredPeriod, setFeaturedPeriod] = useState<PeriodKey>("month");
  const [trendPeriod, setTrendPeriod] = useState<PeriodKey>("year");

  // 1. Ads independent metric query
  const adsMetricQuery = useAgencyConsultantPublishedAdsMetricQuery({
    agentId: agentId ?? "",
    enabled: Boolean(agentId),
    period: adsPeriod,
  });

  // 2. Renewal independent metric query
  const updatesMetricQuery = useAgencyConsultantRenewalUsageMetricQuery({
    agentId: agentId ?? "",
    enabled: Boolean(agentId),
    period: updatesPeriod,
  });

  // 3. Special independent metric query
  const featuredMetricQuery = useAgencyConsultantSpecialUsageMetricQuery({
    agentId: agentId ?? "",
    enabled: Boolean(agentId),
    period: featuredPeriod,
  });

  // 4. Trend chart query (progress line)
  const trendChartsQuery = useAgencyConsultantChartsQuery({
    agentId: agentId ?? "",
    enabled: Boolean(agentId),
    period: trendPeriod,
  });

  const adsCard = createPieCardData({
    agencyColorVar: "var(--primary-900)",
    badgeBgColorVar: "color-mix(in srgb, var(--primary-400) 8%, transparent)",
    badgeColorVar: "var(--primary-400)",
    consultantColorVar: "var(--primary-400)",
    data: adsMetricQuery.data,
    fallbackTitle: "آگهی منتشر شده در آژانس",
  });

  const updatesCard = createPieCardData({
    agencyColorVar: "var(--tertiary-900)",
    badgeBgColorVar: "color-mix(in srgb, var(--tertiary-400) 8%, transparent)",
    badgeColorVar: "var(--tertiary-400)",
    consultantColorVar: "var(--tertiary-400)",
    data: updatesMetricQuery.data,
    fallbackTitle: "بروزرسانی منتشر شده در آژانس",
  });

  const featuredCard = createPieCardData({
    agencyColorVar: "var(--warning-900)",
    badgeBgColorVar: "color-mix(in srgb, var(--warning-200) 8%, transparent)",
    badgeColorVar: "var(--warning-200)",
    consultantColorVar: "var(--warning-200)",
    data: featuredMetricQuery.data,
    fallbackTitle: "ویژه منتشر شده در آژانس",
  });

  const trendData =
    trendChartsQuery.data?.progress && trendChartsQuery.data.progress.length > 0
      ? trendChartsQuery.data.progress.map((item) => ({
          month: item.label,
          value: item.value,
        }))
      : [];

  return (
    <section
      className="mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-surface-container-low text-on-surface"
      dir="rtl"
    >
      <TopBar
        centerClassName="px-0"
        onBack={onBack}
        reserveStartSpace
        title="نمودار عملکرد مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto space-y-4 bg-surface-container-low">
        <ConsultantPieCard
          card={adsCard}
          isLoading={adsMetricQuery.isLoading}
          onPeriodChange={setAdsPeriod}
          period={adsPeriod}
          showTooltip={true}
        />

        <ConsultantPieCard
          card={updatesCard}
          isLoading={updatesMetricQuery.isLoading}
          onPeriodChange={setUpdatesPeriod}
          period={updatesPeriod}
        />

        <ConsultantPieCard
          card={featuredCard}
          isLoading={featuredMetricQuery.isLoading}
          onPeriodChange={setFeaturedPeriod}
          period={featuredPeriod}
        />

        <ConsultantProgressLineCard
          data={trendData}
          isLoading={trendChartsQuery.isLoading}
          onPeriodChange={setTrendPeriod}
          period={trendPeriod}
        />
      </main>
    </section>
  );
}
