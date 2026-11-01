import LinearTooman from "../../../../shared/icons/LinearTooman";
import { Button } from "../../../../shared/ui/Button";
import { ChoiceIndicator } from "../../../../shared/ui/Choice";
import { Typography } from "../../../../shared/ui/Typography";
import type { AdvertisementCheckoutItem } from "../../../advertisements/api/advertisement.service";
import {
  formatAvailableInNotice,
  formatTariffToman,
  resolveAvailableIn,
  TariffNotice,
} from ".././AdTariffOptionsView";
import { toSafeNumber } from "./checkoutNumbers";
import {
  disabledUpgradeOptions,
  getUpgradeDescription,
  resolveUpgradeCheckoutItem,
} from "./checkoutUpgrades";
import { UpgradeCreditBalance } from "./UpgradeCreditBalance";
export function UpgradeOption({
  option,
  upgradeItems,
  enabled,
  selectedProducts,
  isCreditMethod,
  disabledWarning,
  onToggle,
  creditBalances,
}: {
  option: (typeof disabledUpgradeOptions)[number];
  upgradeItems: AdvertisementCheckoutItem[];
  enabled: boolean;
  selectedProducts: string[];
  isCreditMethod: boolean;
  disabledWarning: string;
  onToggle?: (product: string) => void;
  creditBalances?: { ad_credit: number; special_credit: number; renew_credit: number };
}) {
  const checkoutItem = resolveUpgradeCheckoutItem(option.id, upgradeItems);
  const itemExists = Boolean(checkoutItem);
  const isAvailable = checkoutItem?.available !== false;
  const optionEnabled = Boolean(enabled && itemExists && isAvailable);
  const checked = Boolean(checkoutItem && selectedProducts.includes(checkoutItem.product));
  const itemPrice = checkoutItem?.price !== undefined ? toSafeNumber(checkoutItem.price) : 30000;
  const itemCredit = checkoutItem?.credit_requirements?.[0]?.amount ?? 1;
  const unavailableWarning = !itemExists
    ? "این قابلیت در حال حاضر در دسترس نیست."
    : !isAvailable
      ? formatAvailableInNotice(resolveAvailableIn(checkoutItem))
      : disabledWarning;

  return (
    <Button
      unstyled
      aria-disabled={!optionEnabled}
      aria-pressed={checked}
      disabled={!optionEnabled}
      className={`bg-surface-container-lowest block w-full border-0 py-4 text-inherit ${
        optionEnabled ? "cursor-pointer" : "cursor-not-allowed"
      }`}
      key={option.id}
      onClick={() => {
        if (optionEnabled && checkoutItem && onToggle) {
          onToggle(checkoutItem.product);
        }
      }}
      type="button"
    >
      <div className="flex flex-col gap-3 [direction:rtl]">
        <div className="flex items-center justify-between gap-4">
          <Typography
            as="p"
            variant="title"
            size="medium"
            weight="semibold"
            className={`m-0 flex items-center justify-start gap-2 ${
              optionEnabled || isCreditMethod ? "text-on-surface" : "text-outline"
            }`}
          >
            <ChoiceIndicator
              checked={checked}
              className="h-5 w-5 rounded-[4px]"
              disabled={!optionEnabled}
            />
            {option.title}
          </Typography>

          <Typography
            as="p"
            variant="label"
            size="large"
            weight="semibold"
            className={`m-0 flex shrink-0 items-center gap-1 ${
              optionEnabled || isCreditMethod ? "text-on-surface" : "text-outline"
            }`}
          >
            {isCreditMethod ? (
              `${new Intl.NumberFormat("fa-IR").format(itemCredit)} اعتبار`
            ) : itemPrice !== undefined ? (
              <>
                {formatTariffToman(itemPrice)}
                <LinearTooman className="h-5 w-5" />
              </>
            ) : (
              "—"
            )}
          </Typography>
        </div>

        <Typography
          as="p"
          variant="body"
          size="large"
          weight="regular"
          className={`m-0 text-right ${
            optionEnabled || isCreditMethod ? "text-on-surface-var" : "text-outline"
          }`}
        >
          {getUpgradeDescription(option.id, checkoutItem)}
        </Typography>
      </div>

      <UpgradeCreditBalance
        enabled={enabled}
        optionId={option.id}
        creditBalances={creditBalances}
      />

      {!optionEnabled && (!isCreditMethod || !isAvailable) ? (
        <div className="mt-3">
          <TariffNotice>{unavailableWarning}</TariffNotice>
        </div>
      ) : null}
    </Button>
  );
}
