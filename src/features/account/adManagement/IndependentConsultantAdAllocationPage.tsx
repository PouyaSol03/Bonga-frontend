import "../../advertisements/components/AdCard.css";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import { AllocationIcon } from "./AdManagementIcons";
import { adManagementPaths, getAdEditPath, getAdPaymentPath, getAdPreviewPath, getSelectedConsultantAd } from "./adManagementData";
import { Typography } from "../../../shared/ui/Typography";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";

export function IndependentConsultantAdAllocationPage() {
  const ad = getSelectedConsultantAd();

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ tab: "status" }}
        backTo={adManagementPaths.root}
        className="[&_a]:text-on-surface"
        title="انتشار آگهی"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container-lowest pt-6">
        <div className="px-4">
          <div className="flex justify-start">
            <Typography as="span" variant="label" size="medium" weight="medium" className="inline-flex h-9 items-center rounded-lg bg-warning-container/30 px-2 text-sm font-medium leading-5 text-warning">
              در انتظار پرداخت
            </Typography>
          </div>

          <section className="mt-4 flex h-[68px] items-center justify-between gap-2 [direction:ltr]" aria-label={ad.title}>
            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <Typography as="h2" variant="title" size="medium" weight="medium" className="m-0 truncate text-base font-medium leading-6 text-on-surface">
                {ad.title}
              </Typography>
              <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-1 text-xs font-medium leading-4 text-outline">
                {ad.timeAndLocation}
              </Typography>
            </div>
            <div
              aria-hidden="true"
              className={`ad-card__image ${ad.imageClassName} h-[68px] w-[102px] shrink-0 rounded-xl bg-cover`}
            />
          </section>

          <div className="mt-4 h-px bg-outline-var" aria-hidden="true" />
          <AllocationAction icon="preview" label="پیش نمایش" to={getAdPreviewPath(ad.id)} />
          <div className="h-px bg-outline-var" aria-hidden="true" />
          <AllocationAction icon="edit" label="ویرایش" state={{ ad, card: ad, editReturnTo: adManagementPaths.allocation, isEditMode: true }} to={getAdEditPath(ad.id)} />
        </div>
      </main>

      <footer className="shrink-0 bg-surface-container-lowest px-4 pb-3 pt-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <RouteLink
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium leading-5 text-on-primary no-underline"
          state={{ ad }}
          to={getAdPaymentPath(ad.id)}
        >
          تکمیل پرداخت
        </RouteLink>
      </footer>
    </PageFrame>
  );
}

function AllocationAction({
  icon,
  label,
  state,
  to,
}: {
  icon: "edit" | "preview";
  label: string;
  state?: unknown;
  to: string;
}) {
  return (
    <RouteLink
      className="flex h-[60px] w-full items-center justify-between text-on-surface [direction:ltr]"
      state={state}
      to={to}
    >
      <LinearArrowLeft1 className="h-5 w-5 text-on-surface-var" />
      <Typography as="span" variant="label" size="large" weight="medium" className="inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
        <AllocationIcon className="h-6 w-6 text-on-surface-var" icon={icon} />
        {label}
      </Typography>
    </RouteLink>
  );
}
