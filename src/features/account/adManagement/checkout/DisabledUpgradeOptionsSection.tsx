import LinearChartUp from "../../../../shared/icons/LinearChartUp";
import { Typography } from "../../../../shared/ui/Typography";
import type { AdvertisementCheckoutItem } from "../../../advertisements/api/advertisement.service";
import { disabledUpgradeOptions, unavailableAfterPublishWarning } from "./checkoutUpgrades";
import { UpgradeOption } from "./UpgradeOption";
export function DisabledUpgradeOptionsSection({
  creditBalances,
  disabledWarning = unavailableAfterPublishWarning,
  enabled = false,
  isCreditMethod = false,
  onToggle,
  selectedProducts = [],
  showCombinedOption = false,
  upgradeItems = [],
}: {
  creditBalances?: { ad_credit: number; special_credit: number; renew_credit: number };
  disabledWarning?: string;
  enabled?: boolean;
  isCreditMethod?: boolean;
  onToggle?: (product: string) => void;
  selectedProducts?: string[];
  showCombinedOption?: boolean;
  upgradeItems?: AdvertisementCheckoutItem[];
}) {
  const visibleOptions = showCombinedOption
    ? disabledUpgradeOptions
    : disabledUpgradeOptions.filter(
        (option) =>
          option.id !== "refresh-special" || selectedProducts.includes("advertise_update_special"),
      );

  return (
    <section className="bg-surface-container-lowest" aria-label="امکانات ارتقای آگهی">
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 flex items-center gap-2 px-4 pt-5 pb-2 text-right text-base leading-6 font-semibold"
      >
        <LinearChartUp className="h-5 w-5" />
        امکانات ارتقای آگهی
      </Typography>

      <div className="divide-outline-var/40 divide-y px-4">
        {visibleOptions.map((option) => (
          <UpgradeOption
            key={option.id}
            option={option}
            upgradeItems={upgradeItems}
            enabled={enabled}
            selectedProducts={selectedProducts}
            isCreditMethod={isCreditMethod}
            disabledWarning={disabledWarning}
            onToggle={onToggle}
            creditBalances={creditBalances}
          />
        ))}
      </div>
    </section>
  );
}
