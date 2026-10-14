import "../../advertisements/components/AdCard.css";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { Link } from "react-router";
import { AllocationIcon } from "./AdManagementIcons";
import {
  adManagementPaths,
  getAdEditPath,
  getAdPaymentPath,
  getAdPreviewPath,
  getSelectedConsultantAd,
} from "./adManagementData";
import { Typography } from "../../../shared/ui/Typography";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";

export function IndependentConsultantAdAllocationPage() {
  const ad = getSelectedConsultantAd();

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ tab: "status" }}
        backTo={adManagementPaths.root}
        className="[&_a]:text-on-surface"
        title="انتشار آگهی"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pt-6">
        <div className="px-4">
          <div className="flex justify-start">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="bg-warning-container/30 text-warning inline-flex h-9 items-center rounded-lg px-2 text-sm leading-5 font-medium"
            >
              در انتظار پرداخت
            </Typography>
          </div>

          <section
            className="mt-4 flex h-[68px] items-center justify-between gap-2 [direction:ltr]"
            aria-label={ad.title}
          >
            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <Typography
                as="h2"
                variant="title"
                size="medium"
                weight="medium"
                className="text-on-surface m-0 truncate text-base leading-6 font-medium"
              >
                {ad.title}
              </Typography>
              <Typography
                as="p"
                variant="body"
                size="small"
                weight="medium"
                className="text-outline m-0 mt-1 text-xs leading-4 font-medium"
              >
                {ad.timeAndLocation}
              </Typography>
            </div>
            <div
              aria-hidden="true"
              className={`ad-card__image ${ad.imageClassName} h-[68px] w-[102px] shrink-0 rounded-xl bg-cover`}
            />
          </section>

          <div className="bg-outline-var mt-4 h-px" aria-hidden="true" />
          <AllocationAction
            icon="preview"
            label="پیش نمایش"
            state={{
              ad,
              previewFlow: "agency-allocation",
              userContact: {
                name:
                  (ad as Record<string, unknown>)?.owner_name ??
                  (ad as Record<string, unknown>)?.user_name ??
                  undefined,
                phone:
                  (ad as Record<string, unknown>)?.phone ??
                  (ad as Record<string, unknown>)?.user_phone ??
                  undefined,
                address:
                  (ad as Record<string, unknown>)?.address ??
                  (ad as Record<string, unknown>)?.location_address ??
                  undefined,
              },
            }}
            to={getAdPreviewPath(ad.id)}
          />
          <div className="bg-outline-var h-px" aria-hidden="true" />
          <AllocationAction
            icon="edit"
            label="ویرایش"
            state={{ ad, card: ad, editReturnTo: adManagementPaths.allocation, isEditMode: true }}
            to={getAdEditPath(ad.id, adManagementPaths.allocation)}
          />
        </div>
      </main>

      <footer className="bg-surface-container-lowest shrink-0 px-4 pt-4 pb-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Link
          className="bg-primary text-on-primary inline-flex h-10 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium no-underline"
          state={{ ad }}
          to={getAdPaymentPath(ad.id)}
        >
          تکمیل پرداخت
        </Link>
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
    <Link
      className="text-on-surface flex h-[60px] w-full items-center justify-between [direction:ltr]"
      state={state}
      to={to}
    >
      <LinearArrowLeft1 className="text-on-surface-var h-5 w-5" />
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className="inline-flex items-center gap-2 text-base leading-6 font-medium [direction:rtl]"
      >
        <AllocationIcon className="text-on-surface-var h-6 w-6" icon={icon} />
        {label}
      </Typography>
    </Link>
  );
}
