import { getApiErrorMessage } from "../../../core/api/api";
import { useAdvertisementDetailQuery, useAdvertisementPreviewQuery } from "../../../core/hooks/advertisement.hooks";
import {
  DetailInfoFullPage,
  buildFacilitiesDetailSections,
  parseViewAdIdFromPath,
} from "../viewAdDetails";
import { LoadingState, NotFoundState, ViewAdErrorState } from "../ViewAdRouteStates";

export function ViewAdEquipmentFacilitiesPage() {
  const adId = parseViewAdIdFromPath(window.location.pathname);
  const isPreview = window.location.pathname.startsWith("/preview-ad/");
  const detailQuery = useAdvertisementDetailQuery(isPreview ? null : adId);
  const previewQuery = useAdvertisementPreviewQuery(isPreview ? adId : null);
  const { data: ad, error, isError, isLoading, refetch } = isPreview ? previewQuery : detailQuery;

  if (adId == null) return <NotFoundState />;

  if (isLoading) return <LoadingState />;

  if (isError) {
    return (
      <ViewAdErrorState
        error={error}
        message={getApiErrorMessage(error, "دریافت تجهیزات و امکانات با خطا مواجه شد.")}
        onRetry={() => void refetch()}
      />
    );
  }

  const resolvedAd = ad;
  if (!resolvedAd) return <NotFoundState />;

  return (
    <DetailInfoFullPage
      adId={adId}
      sections={buildFacilitiesDetailSections(resolvedAd)}
      title="تجهیزات و امکانات"
    />
  );
}
