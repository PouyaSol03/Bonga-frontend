import { getApiErrorMessage } from "../../../../shared/api/api";
import {
  useAgencyAdvertisementPreviewQuery,
  useAdvertisementDetailQuery,
  useAdvertisementPreviewQuery,
} from "../../api/advertisement.hooks";
import {
  DetailInfoFullPage,
  buildPropertyDetailSections,
  getDetailPageTitle,
  useViewAdRouteContext,
} from "../viewAdDetails";
import { LoadingState, NotFoundState, ViewAdErrorState } from "../ViewAdRouteStates";
import { shouldUseAgencyAllocationPreview } from "../viewAdPreviewContext";

export function ViewAdPropertyInfoPage() {
  const { adId, isPreview } = useViewAdRouteContext();
  const useAgencyAllocationPreview = isPreview && shouldUseAgencyAllocationPreview();
  const detailQuery = useAdvertisementDetailQuery(isPreview ? null : adId);
  const agencyPreviewQuery = useAgencyAdvertisementPreviewQuery(
    useAgencyAllocationPreview ? adId : null,
  );
  const previewQuery = useAdvertisementPreviewQuery(
    isPreview && (!useAgencyAllocationPreview || agencyPreviewQuery.isError) ? adId : null,
  );
  const {
    data: ad,
    error,
    isError,
    isLoading,
    refetch,
  } = isPreview
    ? useAgencyAllocationPreview && !agencyPreviewQuery.isError
      ? agencyPreviewQuery
      : previewQuery
    : detailQuery;

  if (adId == null) return <NotFoundState />;

  if (isLoading) return <LoadingState />;

  if (isError) {
    return (
      <ViewAdErrorState
        error={error}
        message={getApiErrorMessage(error, "دریافت اطلاعات ملک با خطا مواجه شد.")}
        onRetry={() => void refetch()}
      />
    );
  }

  const resolvedAd = ad;
  if (!resolvedAd) return isError ? <NotFoundState /> : <LoadingState />;

  const features = Array.isArray(resolvedAd.features) ? resolvedAd.features : [];

  return (
    <DetailInfoFullPage
      adId={adId}
      sections={buildPropertyDetailSections(resolvedAd)}
      title={getDetailPageTitle(
        features,
        typeof resolvedAd.form_code === "string" ? resolvedAd.form_code : "",
      )}
    />
  );
}
