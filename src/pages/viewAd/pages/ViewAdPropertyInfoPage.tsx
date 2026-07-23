import { getApiErrorMessage } from "../../../api/api";
import { useAdvertisementDetailQuery, useAdvertisementPreviewQuery } from "../../../hooks/advertisement.hooks";
import {
  DetailInfoFullPage,
  buildPropertyDetailSections,
  getDetailPageTitle,
  parseViewAdIdFromPath,
} from "../viewAdDetails";
import { mockAdIds, singleAdMockData } from "../viewAdMockData";
import { LoadingState, NotFoundState, ViewAdErrorState } from "../ViewAdRouteStates";

export function ViewAdPropertyInfoPage() {
  const adId = parseViewAdIdFromPath(window.location.pathname);
  const isPreview = window.location.pathname.startsWith("/preview-ad/");
  const detailQuery = useAdvertisementDetailQuery(isPreview ? null : adId);
  const previewQuery = useAdvertisementPreviewQuery(isPreview ? adId : null);
  const { data: ad, error, isError, isLoading, refetch } = isPreview ? previewQuery : detailQuery;

  if (adId == null) return <NotFoundState />;

  const isMockAdRequest = mockAdIds.has(adId);
  if (isLoading && !isMockAdRequest) return <LoadingState />;

  if (isError && !isMockAdRequest) {
    return (
      <ViewAdErrorState
        error={error}
        message={getApiErrorMessage(error, "دریافت اطلاعات ملک با خطا مواجه شد.")}
        onRetry={() => void refetch()}
      />
    );
  }

  const resolvedAd = isMockAdRequest ? singleAdMockData : ad;
  if (!resolvedAd) return <NotFoundState />;

  const features = Array.isArray(resolvedAd.features) ? resolvedAd.features : [];

  return (
    <DetailInfoFullPage
      adId={adId}
      sections={buildPropertyDetailSections(resolvedAd)}
      title={getDetailPageTitle(features)}
    />
  );
}
