import "../../advertisements/components/AdCard.css";
import { PageFrame } from "../../../shared/layout/PageFrame";
import LinearEdit2 from "../../../shared/icons/LinearEdit2";
import LinearPreview from "../../../shared/icons/LinearPreview";
import { TopBar } from "../../../shared/components/TopBar";
import {
  adManagementPaths,
  getAdEditPath,
  getAdManagementRouteState,
  getAdPreviewPath,
  getSelectedConsultantAd,
} from "./adManagementData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

import { publisherOptions } from "./allocation/types";
import type { IndependentConsultantAdAllocationReviewPageProps } from "./allocation/types";
import {
  getAllocationRejectPathForCurrentAd,
  getAllocationReviewPathForCurrentAd,
} from "./allocation/allocationHelpers";
import { ActionDivider, CompactAdSummary } from "./allocation/components/CompactAdSummary";
import { RejectAction, ReviewAction } from "./allocation/components/AllocationActions";
import { PublisherOptionCard } from "./allocation/components/PublisherOptionCard";
import { ConsultantPickerPage } from "./allocation/components/ConsultantPickerPage";
import { useAdAllocationState } from "./allocation/useAdAllocationState";

export function IndependentConsultantAdAllocationReviewPage(
  props?: IndependentConsultantAdAllocationReviewPageProps,
) {
  const routeState = getAdManagementRouteState();
  const assignment = props?.assignment ?? routeState.assignment;
  const ad = props?.ad ?? getSelectedConsultantAd();

  const state = useAdAllocationState(props, ad, assignment);

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ tab: "status" }}
        backTo={adManagementPaths.root}
        className="bg-surface-container"
        title="تخصیص و انتشار"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-4">
        <section className="px-4 pt-4 pb-4" aria-label="خلاصه آگهی">
          <div className="flex justify-start">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="bg-warning-container/30 text-warning inline-flex h-9 items-center rounded-lg px-3 text-sm leading-5 font-medium"
            >
              در انتظار پرداخت
            </Typography>
          </div>

          <CompactAdSummary ad={ad} />
        </section>

        <div className="bg-surface-container h-2" aria-hidden="true" />

        <section className="px-4" aria-label="عملیات آگهی">
          <ReviewAction
            icon={<LinearPreview className="h-6 w-6" />}
            label="پیش نمایش"
            state={{
              ad,
              assignment,
              previewFlow: "agency-allocation",
              userContact: {
                name:
                  (ad as Record<string, unknown>)?.owner_name ??
                  (ad as Record<string, unknown>)?.user_name ??
                  (assignment as Record<string, unknown>)?.advertiserName ??
                  undefined,
                phone: state.advertiserPhone || undefined,
                smsPhone: state.advertiserPhone || undefined,
                address:
                  (ad as Record<string, unknown>)?.address ??
                  (ad as Record<string, unknown>)?.location_address ??
                  undefined,
                social:
                  (ad as Record<string, unknown>)?.social ??
                  (ad as Record<string, unknown>)?.contacts ??
                  undefined,
              },
            }}
            to={getAdPreviewPath(ad.id)}
          />
          <ActionDivider />
          <ReviewAction
            icon={<LinearEdit2 className="h-6 w-6" />}
            label="ویرایش"
            state={{
              ad,
              assignment,
              assignmentId: assignment?.id,
              card: ad,
              editReturnTo: getAllocationReviewPathForCurrentAd(ad.id),
              isEditMode: true,
              tab: "status",
            }}
            to={getAdEditPath(ad.id, getAllocationReviewPathForCurrentAd(ad.id), ad)}
          />
          <ActionDivider />
          <RejectAction
            state={{
              ad,
              assignment,
              assignmentId: state.assignmentId,
              tab: "status",
            }}
            to={getAllocationRejectPathForCurrentAd(ad.id)}
          />
        </section>

        <div className="bg-surface-container h-2" aria-hidden="true" />

        <section className="px-4 pt-5 pb-6" aria-label="تعیین مسئول آگهی">
          <Typography
            as="h2"
            variant="label"
            size="large"
            weight="medium"
            className="text-on-surface m-0 mb-4"
          >
            تعیین مسئول آگهی (منتشرکننده: آژانس){" "}
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="text-error text-sm"
            >
              *
            </Typography>
          </Typography>

          <div className="space-y-3" role="radiogroup" aria-label="انتخاب مسئول آگهی">
            {publisherOptions.map((option) => (
              <PublisherOptionCard
                assignedConsultant={state.assignedConsultant}
                key={option.value}
                onAssignConsultant={() => state.setIsConsultantPickerOpen(true)}
                onSelect={() => {
                  state.setPublisher(option.value);
                  if (option.value === "agency") state.setAssignedConsultant(null);
                }}
                option={option}
                selected={state.publisher === option.value}
              />
            ))}
          </div>
        </section>
      </main>

      {state.isConsultantPickerOpen ? (
        <ConsultantPickerPage
          consultants={state.selectableConsultants}
          isError={state.consultantsQuery.isError}
          isLoading={state.consultantsQuery.isLoading}
          onClose={() => state.setIsConsultantPickerOpen(false)}
          onConfirm={(consultant) => {
            state.setAssignedConsultant(consultant);
            state.setPublisher("consultant");
            state.setIsConsultantPickerOpen(false);
            state.navigateToPayment(consultant);
          }}
          onRetry={() => void state.consultantsQuery.refetch()}
          selectedConsultant={state.assignedConsultant}
        />
      ) : null}

      <footer className="bg-surface-container-lowest shrink-0 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Button
          unstyled
          className="bg-primary text-on-primary inline-flex h-10 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium transition-colors active:opacity-80"
          onClick={state.handlePrimaryAction}
          type="button"
        >
          {state.primaryActionLabel}
        </Button>
      </footer>
    </PageFrame>
  );
}
