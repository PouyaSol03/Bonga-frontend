import { AdvertiseDescriptionSection } from "./advertise-detail/components/AdvertiseDescriptionSection";
import { AdvertiseEmptyState } from "./advertise-detail/components/AdvertiseEmptyState";
import { AdvertiseFeaturesSection } from "./advertise-detail/components/AdvertiseFeaturesSection";
import { AdvertiseGallerySection } from "./advertise-detail/components/AdvertiseGallerySection";
import { AdvertiseHeader } from "./advertise-detail/components/AdvertiseHeader";
import { AdvertiseSidebar } from "./advertise-detail/components/AdvertiseSidebar";
import {
  DetailSkeleton,
  PublicStyleSection,
} from "./advertise-detail/components/DetailPrimitives";
import { LifecycleHistoryTimeline } from "./advertise-detail/components/LifecycleHistoryTimeline";
import { useCrmAdvertiseDetail } from "./advertise-detail/useCrmAdvertiseDetail";

export interface CrmAdvertiseDetailViewProps {
  advertiseId: string;
  notify: (message: string, tone?: "error" | "success") => void;
  refreshNonce: number;
}

export function CrmAdvertiseDetailView({
  advertiseId,
  notify,
  refreshNonce,
}: CrmAdvertiseDetailViewProps) {
  const detail = useCrmAdvertiseDetail({ advertiseId, notify, refreshNonce });

  if (detail.isLoading) return <DetailSkeleton />;
  if (!detail.advertise) return <AdvertiseEmptyState />;

  return (
    <div className="pb-6" dir="rtl">
      <AdvertiseHeader advertiseId={advertiseId} status={detail.advertise.status} />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <main className="min-w-0 space-y-4">
          <AdvertiseGallerySection
            coverImage={detail.coverImage}
            createdAt={detail.createdAt}
            images={detail.images}
            locationTitle={detail.locationTitle}
            pricePresentation={detail.pricePresentation}
            title={detail.title}
            trackCode={detail.trackCode}
          />
          <AdvertiseFeaturesSection visibleFeatures={detail.visibleFeatures} />
          <AdvertiseDescriptionSection
            address={detail.address}
            adminNote={detail.adminNote}
            description={detail.description}
          />
          <PublicStyleSection title="تاریخچه وضعیت و رویدادهای آگهی">
            <LifecycleHistoryTimeline logs={detail.statusLogs} />
          </PublicStyleSection>
        </main>

        <AdvertiseSidebar
          address={detail.address}
          advertise={detail.advertise}
          area={detail.area}
          categoryName={detail.categoryName}
          cityName={detail.cityName}
          createdAt={detail.createdAt}
          formCode={detail.formCode}
          hasMapPosition={detail.hasMapPosition}
          latitude={detail.latitude}
          longitude={detail.longitude}
          neighborhoodName={detail.neighborhoodName}
          ownerName={detail.ownerName}
          ownerPhone={detail.ownerPhone}
          pricePresentation={detail.pricePresentation}
          trackCode={detail.trackCode}
        />
      </div>
    </div>
  );
}
