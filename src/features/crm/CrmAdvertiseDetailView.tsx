import { useState } from "react";
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
import { ConfirmModal, type ConfirmState } from "./CrmLayout";

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
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  if (detail.isLoading) return <DetailSkeleton />;
  if (!detail.advertise) return <AdvertiseEmptyState />;

  const handleAccept = async () => {
    await detail.updateStatus("accepted");
  };

  const handleRejectClick = () => {
    setConfirm({
      body: "لطفاً دلیل رد آگهی را وارد کنید. این دلیل برای ثبت‌کننده ثبت و ارسال می‌شود.",
      confirmLabel: "رد آگهی",
      onConfirm: async (reason) => {
        const normalizedReason = reason?.trim();
        if (!normalizedReason) throw new Error("دلیل رد آگهی الزامی است.");
        await detail.updateStatus("rejected", normalizedReason);
      },
      prompt: {
        label: "دلیل رد آگهی",
        placeholder: "دلیل رد آگهی (مثلاً: اطلاعات ناقص، عکس نامناسب، قیمت نامتعارف)",
        required: true,
      },
      title: "رد آگهی",
    });
  };

  const handleDeleteClick = () => {
    setConfirm({
      body: "این آگهی از فهرست فعال خارج شده و در وضعیت حذف‌شده قرار می‌گیرد. آیا مطمئن هستید؟",
      confirmLabel: "حذف آگهی",
      onConfirm: async () => {
        await detail.updateStatus("deleted");
      },
      title: "حذف آگهی",
    });
  };

  return (
    <div className="pb-8" dir="rtl">
      <AdvertiseHeader
        advertiseId={advertiseId}
        isUpdatingStatus={detail.isUpdatingStatus}
        onAccept={handleAccept}
        onDelete={handleDeleteClick}
        onReject={handleRejectClick}
        status={detail.advertise.status}
      />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <main className="min-w-0 space-y-4">
          <AdvertiseGallerySection
            age={detail.age}
            area={detail.area}
            coverImage={detail.coverImage}
            createdAt={detail.createdAt}
            floor={detail.floor}
            formCode={detail.formCode}
            hasVideo={detail.hasVideo}
            images={detail.images}
            locationTitle={detail.locationTitle}
            pricePresentation={detail.pricePresentation}
            rooms={detail.rooms}
            title={detail.title}
            trackCode={detail.trackCode}
            videos={detail.videos}
            virtualTourLink={detail.virtualTourLink}
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
          agency={detail.agency}
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

      <ConfirmModal confirm={confirm} notify={notify} onClose={() => setConfirm(null)} />
    </div>
  );
}
