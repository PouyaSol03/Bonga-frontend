import { useMemo } from "react";
import "../../advertisements/components/AdCard.css";
import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { USER } from "../../../shared/constants/roles.constants";
import {
  useAdvertisementDailyViewsQuery,
  useMyAdvertisementDetailQuery,
} from "../../advertisements/api/advertisement.hooks";
import {
  adManagementPaths,
  getAdManagementRouteState,
  getAdStatePath,
  getSelectedConsultantAd,
} from "./adManagementData";

import {
  createAdSummary,
  readAdIdFromPath,
  readEntityId,
  readQueryAdId,
} from "./statistics/statisticsHelpers";
import {
  createManagerChartConfigs,
  createUserChartConfig,
} from "./statistics/statisticsChartConfigs";
import { UserAdVisitStatisticsView } from "./statistics/UserAdVisitStatisticsView";
import { ManagerAdVisitStatisticsView } from "./statistics/ManagerAdVisitStatisticsView";

export function AdVisitStatisticsPage() {
  const routeState = getAdManagementRouteState();
  const adId =
    readAdIdFromPath() ??
    readQueryAdId() ??
    readEntityId(routeState.ad) ??
    readEntityId(routeState.card);
  const query = useMyAdvertisementDetailQuery(adId ?? null);
  const dailyViewsQuery = useAdvertisementDailyViewsQuery(adId ?? null);
  const card = routeState.card ?? getSelectedConsultantAd(adId);
  const ad = query.data ?? routeState.ad ?? card;
  const activeRole = getActiveAuthRole(getStoredAuthSession());
  const isUserRole = activeRole === USER;
  const backTo =
    routeState.visitStatisticsReturnTo ?? (adId ? getAdStatePath(adId) : adManagementPaths.root);
  const summary = useMemo(() => createAdSummary(ad, card), [ad, card]);
  const userChart = useMemo(
    () => createUserChartConfig(ad, dailyViewsQuery.data),
    [ad, dailyViewsQuery.data],
  );
  const managerCharts = useMemo(
    () => createManagerChartConfigs(ad, dailyViewsQuery.data),
    [ad, dailyViewsQuery.data],
  );
  const isLoading = query.isLoading || dailyViewsQuery.isLoading;
  const isError = query.isError || dailyViewsQuery.isError;
  const retry = () => {
    void query.refetch();
    void dailyViewsQuery.refetch();
  };

  if (isUserRole) {
    return (
      <UserAdVisitStatisticsView
        ad={ad}
        adId={adId}
        backTo={backTo}
        card={card}
        chart={userChart}
        isError={isError}
        isLoading={isLoading}
        onRetry={retry}
        returnTo={routeState.returnTo}
      />
    );
  }

  return (
    <ManagerAdVisitStatisticsView
      backTo={backTo}
      charts={managerCharts}
      isError={isError}
      isLoading={isLoading}
      onRetry={retry}
      returnTo={routeState.returnTo}
      summary={summary}
    />
  );
}
