import LinearRefresh from "../../../../shared/icons/LinearRefresh";
import LinearStairs from "../../../../shared/icons/LinearStairs";
import LinearStartup from "../../../../shared/icons/LinearStartup";
import type { UpgradeOptionId } from "./checkoutUpgrades";
export function UpgradeCreditBalance({
  enabled,
  optionId,
  creditBalances,
}: {
  enabled: boolean;
  optionId: UpgradeOptionId;
  creditBalances?: { ad_credit: number; special_credit: number; renew_credit: number };
}) {
  return (
    <>
      {enabled && optionId === "refresh" ? (
        <div className="bg-tertiary-container/30 text-tertiary mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-xs font-medium">
          <LinearStairs className="h-4 w-4 shrink-0" />
          <span>
            اعتبار باقیمانده:{" "}
            {new Intl.NumberFormat("fa-IR").format(creditBalances?.ad_credit ?? 0)}
          </span>
        </div>
      ) : enabled && optionId === "special" ? (
        <div className="bg-warning-container/30 text-warning mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-xs font-medium">
          <LinearStartup className="h-4 w-4 shrink-0" />
          <span>
            اعتبار باقیمانده:{" "}
            {new Intl.NumberFormat("fa-IR").format(creditBalances?.special_credit ?? 0)}
          </span>
        </div>
      ) : enabled && optionId === "renew" ? (
        <div className="bg-tertiary-container/30 text-tertiary mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-xs font-medium">
          <LinearRefresh className="h-4 w-4 shrink-0" />
          <span>
            اعتبار باقیمانده:{" "}
            {new Intl.NumberFormat("fa-IR").format(creditBalances?.renew_credit ?? 0)}
          </span>
        </div>
      ) : null}
    </>
  );
}
