import { useManagerAdDeletion } from "./useManagerAdDeletion";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { TopBar } from "../../../shared/components/TopBar";
import { INDEPENDENT_CONSULTANT } from "../../../shared/constants/roles.constants";
import { PageFrame } from "../../../shared/layout/PageFrame";

import type { AdCardData } from "../../advertisements/components/AdCard";
import "../../advertisements/components/AdCard.css";
import { ViewAdPerformanceSection } from "../../advertisements/view/components/performance/ViewAdPerformanceSection";
import {
  ViewAdBusinessTabs,
  type ViewAdBusinessTabKey,
} from "../../advertisements/view/components/ViewAdBusinessTabs";
import { ViewAdLeadsSection } from "../../advertisements/view/components/ViewAdLeadsSection";
import { ActionDivider } from "../ad-state/ActionDivider";
import { getManagerActions } from "../ad-state/managerActions";

import { ManagerPublisherPickerPage } from "../ad-state/ManagerPublisherPickerPage";

import { StateAdAction } from "../ad-state/StateAdAction";
import { getMyAdStatusInfo } from "../myAdsStatus";
import { ManagerAdStatusSection } from "./ManagerAdStatusSection";
import { ManagerDeleteSheet } from "./ManagerDeleteSheet";
import { ManagerPublisherSection } from "./ManagerPublisherSection";

import { useManagerPublisher } from "./useManagerPublisher";

export function RealEstateManagerAdStatePage({
  activeBusinessTab,
  ad,
  adId,
  backState,
  backTo,
  card,
  role,
  statusInfo,
}: {
  activeBusinessTab?: ViewAdBusinessTabKey;
  ad?: Record<string, unknown>;
  adId: string;
  backState?: unknown;
  backTo: string;
  card: AdCardData;
  role?: string | null;
  statusInfo: ReturnType<typeof getMyAdStatusInfo>;
}) {
  const navigate = useNavigate();
  const currentRole = role ?? getActiveAuthRole(getStoredAuthSession());
  const isIndependentConsultant =
    currentRole === INDEPENDENT_CONSULTANT || currentRole === "independent-consultant";

  const handleBack = () => {
    navigate("/account/manage-ads", { replace: true });
  };

  const { publisherOptions, setPublisherId, publisher, changeConsultantMutation } =
    useManagerPublisher(ad, isIndependentConsultant);

  const [businessTab, setBusinessTab] = useState<ViewAdBusinessTabKey>(() => {
    const queryTab =
      new URLSearchParams(window.location.search).get("businessTab") ||
      new URLSearchParams(window.location.search).get("tab");
    if (queryTab === "performance" || queryTab === "lead" || queryTab === "management") {
      return queryTab;
    }
    return activeBusinessTab ?? "management";
  });
  const [isPublisherPickerOpen, setIsPublisherPickerOpen] = useState(false);
  const { isDeleteDialogOpen, setIsDeleteDialogOpen, isDeleting, handleDeleteAd } =
    useManagerAdDeletion(adId, backTo, backState);

  const isAdDeleted =
    statusInfo.key === "deleted" ||
    statusInfo.key === "incomplete_deleted" ||
    statusInfo.label === "حذف شده";

  const managerActions = getManagerActions(
    statusInfo.key,
    adId,
    () => setIsDeleteDialogOpen(true),
    isAdDeleted,
    backTo,
    (ad ?? card) as never,
  );

  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={backState}
        backTo={backTo}
        className="[&_a]:text-on-surface"
        onBack={handleBack}
        title="مدیریت آگهی"
      />

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <ManagerAdStatusSection ad={ad} card={card} statusInfo={statusInfo} />

        <div className="bg-surface-container h-2" aria-hidden="true" />

        <ViewAdBusinessTabs activeTab={businessTab} adId={adId} onTabChange={setBusinessTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={businessTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {businessTab === "lead" ? (
              <ViewAdLeadsSection adId={adId} />
            ) : businessTab === "performance" ? (
              <ViewAdPerformanceSection adId={adId} ad={ad as Record<string, unknown>} />
            ) : (
              <>
                {!isIndependentConsultant ? (
                  <>
                    <ManagerPublisherSection
                      publisher={publisher}
                      onOpen={() => setIsPublisherPickerOpen(true)}
                    />

                    <div className="bg-surface-container h-2" aria-hidden="true" />
                  </>
                ) : null}

                <section
                  className="bg-surface-container-lowest min-h-[244px]"
                  aria-label="عملیات آگهی"
                >
                  {managerActions.map((action, index) => (
                    <div key={action.label}>
                      <StateAdAction
                        action={action}
                        ad={ad}
                        card={card}
                        deleteCompleteTo={backTo}
                        returnTo={backTo}
                        backTo={backTo}
                      />
                      {index < managerActions.length - 1 ? <ActionDivider /> : null}
                    </div>
                  ))}
                </section>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {isPublisherPickerOpen && !isIndependentConsultant ? (
        <ManagerPublisherPickerPage
          onClose={() => setIsPublisherPickerOpen(false)}
          onConfirm={async (nextPublisher) => {
            const nextConsultantId =
              nextPublisher.type === "consultant"
                ? Number(nextPublisher.id.replace("consultant:", ""))
                : null;
            try {
              await changeConsultantMutation.mutateAsync({
                advertiseId: adId,
                consultantId: nextConsultantId,
              });
              setPublisherId(nextPublisher.id);
              setIsPublisherPickerOpen(false);
            } catch {
              return;
            }
          }}
          options={publisherOptions}
          selectedPublisher={publisher}
        />
      ) : null}

      <ManagerDeleteSheet
        isDeleteDialogOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDeleteAd={handleDeleteAd}
      />
    </PageFrame>
  );
}
