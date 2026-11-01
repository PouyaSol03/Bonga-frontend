import { useState } from "react";
import "swiper/css";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { Toast } from "../../../shared/components/Toast";
import { getApiErrorMessage } from "../../../shared/api/api";
import { LoadingState, NotFoundState, ViewAdErrorState } from "./ViewAdRouteStates";
import { ViewAdAlbumPage } from "./pages/ViewAdAlbumPage";
import type { IconName } from "./viewAdTypes";
import { useViewAdNavigation } from "./page/useViewAdNavigation";
import { useViewAdQuery } from "./page/useViewAdQuery";
import { useViewAdToast } from "./page/useViewAdToast";
import { useViewAdContact } from "./page/useViewAdContact";
import { useViewAdSubmissions } from "./page/useViewAdSubmissions";
import { useViewAdBookmark } from "./page/useViewAdBookmark";
import { useViewAdChat } from "./page/useViewAdChat";
import { createViewAdRowAction } from "./page/viewAdRowAction";
import { shareAdvertisement } from "./page/shareAdvertisement";
import { buildViewAdPresentation } from "./page/viewAdPresentation";
import { ViewAdContactActions } from "./page/ViewAdContactActions";
import { ViewAdContactSheets } from "./page/ViewAdContactSheets";
import { ViewAdSubmissionOverlays } from "./page/ViewAdSubmissionOverlays";
import { ViewAdPageContent } from "./page/ViewAdPageContent";

export function ViewAdPage() {
  const navigation = useViewAdNavigation();
  const { adId, isPreview, handleBack, requireAuthorization } = navigation;
  const query = useViewAdQuery(adId, isPreview);
  const { ad, error, isError, isLoading, refetch } = query;
  const { isPersonalPreview, useAgencyAllocationPreview, showAgencyOwnerContact } = query;
  const { toast, showToast, dismissToast } = useViewAdToast();
  const submissions = useViewAdSubmissions({ ...navigation, showToast });
  const bookmark = useViewAdBookmark({ ...navigation, ad, showToast });
  const chat = useViewAdChat({ ...navigation, showToast });
  const contact = useViewAdContact({ ad, adId, isPreview, isLoading, isError });
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [albumInitialIndex, setAlbumInitialIndex] = useState(0);

  if (adId == null) return <NotFoundState onBack={handleBack} />;
  if (isLoading) return <LoadingState onBack={handleBack} />;
  if (isError) {
    return (
      <ViewAdErrorState
        error={error}
        message={getApiErrorMessage(error, "دریافت آگهی با خطا مواجه شد.")}
        onRetry={() => void refetch()}
      />
    );
  }
  if (!ad) return <LoadingState />;

  const presentation = buildViewAdPresentation(ad, isPreview, isPersonalPreview);
  const { details, publisherContact, mediaItems } = presentation;
  const handleRowAction = createViewAdRowAction({
    ...navigation,
    resolvedAd: ad,
    details,
    showToast,
    submissions,
  });
  const handleTopBarAction = async (icon: IconName) => {
    if (icon === "note") {
      if (!requireAuthorization("ثبت یادداشت")) return;
      submissions.note.setIsOpen(true);
      return;
    }
    if (icon === "share") {
      await shareAdvertisement(adId, isPreview, details, showToast);
      return;
    }
    if (icon === "bookmark") bookmark.toggle();
  };
  const openAdvertiseChat = () =>
    chat.open(
      useAgencyAllocationPreview ? "شروع گفتگو با کاربر" : publisherContact.chatActionLabel,
    );

  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <Toast onDismiss={dismissToast} toast={toast} />
      <ViewAdPageContent
        ad={ad}
        adId={adId}
        isPreview={isPreview}
        presentation={presentation}
        bookmarked={bookmark.isBookmarked}
        onAction={handleTopBarAction}
        onBack={handleBack}
        onRowAction={handleRowAction}
        onOpenAlbum={(initialIndex = 0) => {
          setAlbumInitialIndex(initialIndex);
          setIsAlbumOpen(true);
        }}
      />
      <ViewAdContactActions
        isPreview={isPreview}
        isPersonalPreview={isPersonalPreview}
        useAgencyAllocationPreview={useAgencyAllocationPreview}
        showAgencyOwnerContact={showAgencyOwnerContact}
        usesPublicAdPresentation={presentation.usesPublicAdPresentation}
        contactInfo={presentation.contactInfo}
        publisherContact={publisherContact}
        hasContactSheetData={presentation.hasContactSheetData}
        hasChatContact={presentation.hasChatContact}
        contactActionCount={presentation.contactActionCount}
        contactActionsGridClassName={presentation.contactActionsGridClassName}
        isChatPending={chat.isPending}
        onOpenContactInfo={contact.open}
        onOpenChat={openAdvertiseChat}
      />
      <ViewAdContactSheets
        ad={ad}
        adId={adId}
        isPreview={isPreview}
        useAgencyAllocationPreview={useAgencyAllocationPreview}
        showAgencyOwnerContact={showAgencyOwnerContact}
        agencyUserContact={presentation.agencyUserContact}
        contactInfo={presentation.contactInfo}
        refetch={refetch}
        contact={contact}
      />
      <ViewAdSubmissionOverlays {...submissions} />
      {isAlbumOpen ? (
        <ViewAdAlbumPage
          initialIndex={albumInitialIndex}
          mediaItems={mediaItems}
          onClose={() => setIsAlbumOpen(false)}
        />
      ) : null}
    </PageFrame>
  );
}
