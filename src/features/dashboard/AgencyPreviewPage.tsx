import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getApiErrorMessage } from "../../shared/api/api";
import { getStoredAuthSession } from "../../shared/auth/auth-storage";
import { SEO } from "../../shared/components/SEO";
import { TopBar } from "../../shared/components/TopBar";
import LinearQrCode from "../../shared/icons/LinearQrCode";
import LinearShare from "../../shared/icons/LinearShare";
import type { BadgeDetailItem } from "./components/BadgeDetailBottomSheet";
import { AgencyAdsTab } from "./agency-preview/components/AgencyAdsTab";
import { AgencyConsultantsTab } from "./agency-preview/components/AgencyConsultantsTab";
import { AgencyHero } from "./agency-preview/components/AgencyHero";
import { AgencyInfoTab } from "./agency-preview/components/AgencyInfoTab";
import { AgencyPreviewFooter } from "./agency-preview/components/AgencyPreviewFooter";
import { AgencyPreviewOverlays } from "./agency-preview/components/AgencyPreviewOverlays";
import { AgencySegmentedTabs } from "./agency-preview/components/AgencySegmentedTabs";
import {
  PublicPreviewErrorState,
  PublicPreviewLoadingState,
} from "./agency-preview/components/PublicPreviewStates";
import { agencyEditPath, agencyPreviewPath, agencyTabs, type AgencyPreviewTab } from "./agency-preview/types";
import { getInitialAgencyTab } from "./agency-preview/urlHelpers";
import { useAgencyPreviewActions } from "./agency-preview/useAgencyPreviewActions";
import { useAgencyPreviewData } from "./agency-preview/useAgencyPreviewData";
import { useAgencyPreviewStats } from "./agency-preview/useAgencyPreviewStats";

export { AgencyQrCodePage } from "./agency-preview/AgencyQrCodePage";

export function AgencyPreviewPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AgencyPreviewTab>(getInitialAgencyTab);
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeDetailItem | null>(null);

  const data = useAgencyPreviewData(activeTab);
  const entityLabel = data.isAgentPreview ? "مشاور" : "آژانس";
  const pageTitle = `صفحه ${entityLabel}`;
  const seoTitle = `${data.entityName} | ${entityLabel} املاک | نشونو`;
  const seoDescription =
    data.entityAbout?.trim() ||
    `${data.entityName}، ${entityLabel} املاک${data.entityLocation ? ` در ${data.entityLocation}` : ""}. مشاهده اطلاعات، آگهی‌های فعال و راه‌های ارتباطی در نشونو.`;

  const { entityLevel, entityStats, workingHours } = useAgencyPreviewStats({
    dashboard: data.dashboard,
    isAgentPreview: data.isAgentPreview,
    isPublicPreview: data.isPublicPreview,
    profile: data.profile,
    publicActiveAds: data.publicActiveAds,
    publicAgency: data.publicAgency,
    publicAgent: data.publicAgent,
    publicRank: data.publicRank,
    publicScore: data.publicScore,
  });

  const actions = useAgencyPreviewActions({
    entityId: data.entityId,
    entityLabel,
    isAgentPreview: data.isAgentPreview,
    previewPath: data.previewPath,
    publicAgencyQuery: data.publicAgencyQuery,
    publicAgentQuery: data.publicAgentQuery,
    setActiveTab,
    shareText: `${pageTitle} ${data.entityName}`,
    shareTitle: data.entityName,
    shareUrl: data.shareUrl,
  });

  const availableTabs = data.isAgentPreview
    ? agencyTabs.filter((tab) => tab.id !== "consultants")
    : agencyTabs;
  const hasPublicPreviewData = data.isAgentPreview ? Boolean(data.publicAgent) : Boolean(data.publicAgency);

  useEffect(() => {
    if (data.isAgentPreview && activeTab === "consultants") {
      setActiveTab("info");
    }
  }, [activeTab, data.isAgentPreview]);

  const handleFeedbackClick = () => {
    const authSession = getStoredAuthSession();
    if (!authSession) {
      const redirectPath = `${window.location.pathname}${window.location.search}`;
      const params = new URLSearchParams({ action: "ثبت بازخورد", returnTo: redirectPath });
      navigate(`/login-required?${params.toString()}`);
      return;
    }
    setIsFeedbackModalOpen(true);
  };

  const handleQrClick = () => {
    const targetPath = data.isPublicPreview
      ? `${window.location.pathname.replace(/\/+$/, "")}/qr-code${window.location.search}`
      : `${agencyPreviewPath}/qr-code`;
    navigate(targetPath);
  };

  const structuredData = data.isPublicPreview
    ? {
        "@context": "https://schema.org",
        "@type": data.isAgentPreview ? "Person" : "Organization",
        name: data.entityName,
        description: seoDescription,
        ...(data.entityLogo ? { image: data.entityLogo } : {}),
        ...(data.entityLocation ? { address: data.entityLocation } : {}),
      }
    : undefined;

  return (
    <div className="bg-surface-container-low text-on-surface relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden [direction:rtl]">
      <SEO
        title={seoTitle}
        description={seoDescription}
        ogImage={data.entityLogo || undefined}
        ogType={data.isAgentPreview ? "profile" : "website"}
        twitterCard={data.entityLogo ? "summary_large_image" : "summary"}
        structuredData={structuredData}
      />
      <h1 className="sr-only">{seoTitle}</h1>
      <TopBar
        actions={[
          { id: "share", label: "اشتراک‌گذاری", icon: <LinearShare className="h-6 w-6" />, onClick: () => void actions.handleShareClick() },
          { id: "qr-code", label: "کد QR", icon: <LinearQrCode className="h-6 w-6" />, onClick: handleQrClick },
        ]}
        backTo={data.isPublicPreview ? (data.isAgentPreview ? "/consultants?type=consultant" : "/consultants") : agencyEditPath}
        className="bg-surface-container-lowest"
        contentClassName="px-2"
        title={pageTitle}
      />
      <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-15">
        {data.isPublicPreview && data.publicPreviewLoading ? (
          <PublicPreviewLoadingState />
        ) : data.isPublicPreview && (!hasPublicPreviewData || data.publicPreviewError) ? (
          <PublicPreviewErrorState
            message={
              data.publicPreviewError instanceof Error
                ? data.publicPreviewError.message
                : getApiErrorMessage(data.publicPreviewError, `دریافت اطلاعات ${entityLabel} ناموفق بود.`)
            }
            onRetry={actions.retryPublicPreview}
          />
        ) : (
          <>
            <AgencyHero
              agencyLocation={data.entityLocation}
              agencyLogo={data.entityLogo}
              agencyName={data.entityName}
              agencyStats={entityStats}
              isAgent={data.isAgentPreview}
              levelSlug={entityLevel}
            />
            <AgencySegmentedTabs activeTab={activeTab} onChange={actions.changeTab} tabs={availableTabs} />
            {activeTab === "ads" ? (
              <AgencyAdsTab ads={data.previewAds} previewPath={data.previewPath} showFilter={!data.isPublicPreview} />
            ) : activeTab === "consultants" && !data.isAgentPreview ? (
              <AgencyConsultantsTab consultants={data.consultants} />
            ) : (
              <AgencyInfoTab
                aboutUs={data.entityAbout}
                activityAreas={data.activityAreas}
                agencyId={data.entityId}
                agencyName={data.entityName}
                agentAgency={data.isAgentPreview ? data.publicAgent?.agency : undefined}
                entityLabel={entityLabel}
                isAgent={data.isAgentPreview}
                onFeedbackClick={handleFeedbackClick}
                badges={data.isAgentPreview ? data.publicAgent?.badges : data.publicAgency?.badges}
                onBadgeClick={(badge) => setSelectedBadge(badge)}
                workingHours={workingHours}
              />
            )}
          </>
        )}
      </main>
      {!data.isPublicPreview || hasPublicPreviewData ? (
        <AgencyPreviewFooter
          entityLabel={entityLabel}
          isChatLoading={actions.createAgencyChatMutation.isPending}
          onChatClick={actions.handleChatClick}
          onContactClick={() => setIsContactSheetOpen(true)}
        />
      ) : null}
      <AgencyPreviewOverlays
        contactInfo={data.contactInfo}
        entityId={data.entityId}
        entityName={data.entityName}
        isAgentPreview={data.isAgentPreview}
        isContactSheetOpen={isContactSheetOpen}
        isFeedbackModalOpen={isFeedbackModalOpen}
        onCloseContactSheet={() => setIsContactSheetOpen(false)}
        onCloseFeedbackModal={() => setIsFeedbackModalOpen(false)}
        onCloseSelectedBadge={() => setSelectedBadge(null)}
        selectedBadge={selectedBadge}
      />
    </div>
  );
}
