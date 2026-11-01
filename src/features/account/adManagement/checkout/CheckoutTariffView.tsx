import { type ReactNode } from "react";

import { TopBar } from "../../../../shared/components/TopBar";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { Button } from "../../../../shared/ui/Button";
import { ChoiceIndicator } from "../../../../shared/ui/Choice";
import { Typography } from "../../../../shared/ui/Typography";
import type { AdvertisementCheckoutItem } from "../../../advertisements/api/advertisement.service";
import { formatTariffToman } from ".././AdTariffOptionsView";
import { DisabledUpgradeOptionsSection } from "./DisabledUpgradeOptionsSection";
import {
  unavailableAfterPaidPublishWarning,
  unavailableAfterPublishWarning,
} from "./checkoutUpgrades";
export function CheckoutTariffView({
  backTo,
  children,
  freeQuotaRemaining,
  hasFreeQuota,
  onComplete,
  onToggleUpgrade,
  pending,
  price,
  selectedUpgradeProducts = [],
  upgradeItems,
}: {
  backTo: string;
  children?: ReactNode;
  freeQuotaRemaining: number;
  hasFreeQuota: boolean;
  onComplete: () => void;
  onToggleUpgrade?: (product: string) => void;
  pending: boolean;
  price: number;
  selectedUpgradeProducts?: string[];
  upgradeItems: AdvertisementCheckoutItem[];
}) {
  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo={backTo} className="bg-surface-container" title="هزینه ثبت آگهی" />

      {children}

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-[76px]">
        <section className="px-4 pt-5 pb-5" aria-label="هزینه ثبت آگهی">
          <div className="flex items-start justify-between gap-5 [direction:ltr]">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface shrink-0 pt-1 text-sm leading-5 font-medium [direction:rtl]"
            >
              {hasFreeQuota ? "رایگان" : `${formatTariffToman(price)} تومان`}
            </Typography>

            <Typography
              as="span"
              variant="label"
              size="large"
              weight="semibold"
              className="flex min-w-0 flex-1 items-center justify-start gap-2 text-right text-base leading-6 font-semibold [direction:rtl]"
            >
              <ChoiceIndicator checked className="h-5 w-5 rounded-[4px]" disabled />
              هزینه ثبت آگهی
            </Typography>
          </div>

          {hasFreeQuota ? (
            <div className="bg-primary-container text-primary mt-4 flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-right [direction:rtl]">
              <LinearInfoCircle className="h-5 w-5 shrink-0" />
              <Typography
                as="span"
                variant="body"
                size="small"
                weight="medium"
                className="text-xs leading-5"
              >
                {new Intl.NumberFormat("fa-IR").format(freeQuotaRemaining)} تعرفه رایگان باقی مانده
                است
              </Typography>
            </div>
          ) : (
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-on-surface-var m-0 mt-4 text-right text-sm leading-6"
            >
              تعرفه رایگان شما به پایان رسیده است. برای ثبت آگهی، هزینه انتشار را پرداخت کنید.
            </Typography>
          )}
        </section>

        <div className="bg-surface-container h-2" aria-hidden="true" />

        <DisabledUpgradeOptionsSection
          disabledWarning={
            hasFreeQuota ? unavailableAfterPublishWarning : unavailableAfterPaidPublishWarning
          }
          enabled
          onToggle={onToggleUpgrade}
          selectedProducts={selectedUpgradeProducts}
          showCombinedOption
          upgradeItems={upgradeItems}
        />
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-3 pb-3 shadow-sm">
        <Button
          unstyled
          className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          onClick={onComplete}
          type="button"
        >
          {pending ? "در حال پردازش..." : "تکمیل خرید"}
        </Button>
      </footer>
    </PageFrame>
  );
}
