import { Typography } from "../../../../shared/ui/Typography";
import { PaymentMethodOption } from "../../../payments/components/PaymentMethodOption";
import { formatTariffToman } from ".././AdTariffOptionsView";
import type { AgencyCombinedCheckoutProps } from "./agencyCheckoutTypes";
import { ApiCreditDeficitBox } from "./ApiCreditDeficitBox";
import { ApiWalletDeficitBox } from "./ApiWalletDeficitBox";
import { useAgencyUpgradeSelection } from "./useAgencyUpgradeSelection";
export function AgencyPaymentMethods({
  method,
  onMethodChange,
  showByConsultant,
  onlyShowByConsultant,
  creditMethod,
  byConsultantAvailable,
  creditSelectable,
  creditBalanceLabel,
  selectedCreditShortage,
  selectedCreditAvailable,
  walletSelectable,
  walletSupported,
  walletBalance,
  walletDeficit,
  gatewayAvailable,
}: Pick<
  AgencyCombinedCheckoutProps,
  "method" | "onMethodChange" | "showByConsultant" | "onlyShowByConsultant" | "creditMethod"
> &
  Pick<
    ReturnType<typeof useAgencyUpgradeSelection>,
    | "byConsultantAvailable"
    | "creditSelectable"
    | "creditBalanceLabel"
    | "selectedCreditShortage"
    | "selectedCreditAvailable"
    | "walletSelectable"
    | "walletSupported"
    | "walletBalance"
    | "walletDeficit"
    | "gatewayAvailable"
  >) {
  return (
    <div className="pt-5 pb-2" aria-label="روش پرداخت">
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 mb-2 px-4 text-right text-base leading-6 font-semibold"
      >
        روش پرداخت
      </Typography>

      {showByConsultant ? (
        <>
          <PaymentMethodOption
            active={method === "by_consultant"}
            disabled={!byConsultantAvailable}
            icon="consultant"
            label="ارسال به مشاور"
            onClick={() => onMethodChange("by_consultant")}
            subLabel={
              byConsultantAvailable ? "ارسال آگهی برای انتشار توسط مشاور" : "این روش در دسترس نیست"
            }
          />
          {!onlyShowByConsultant ? <div className="border-outline-var/40 mx-4 border-t" /> : null}
        </>
      ) : null}

      {!onlyShowByConsultant && creditMethod ? (
        <>
          <PaymentMethodOption
            active={method === creditMethod}
            disabled={!creditSelectable}
            icon="credit"
            label="اعتبار آگهی"
            onClick={() => onMethodChange(creditMethod)}
            subLabel={creditBalanceLabel}
            subLabelClassName={
              selectedCreditShortage > 0 || !selectedCreditAvailable
                ? "text-error"
                : "text-tertiary font-medium"
            }
          />

          {selectedCreditShortage > 0 ? (
            <div className="px-4 pb-2">
              <ApiCreditDeficitBox deficit={selectedCreditShortage} />
            </div>
          ) : null}

          <div className="border-outline-var/40 mx-4 border-t" />
        </>
      ) : null}

      {!onlyShowByConsultant ? (
        <>
          <PaymentMethodOption
            active={method === "wallet"}
            disabled={!walletSelectable}
            icon="wallet"
            label="کیف پول"
            onClick={() => onMethodChange("wallet")}
            subLabel={
              walletSupported
                ? `مانده: ${formatTariffToman(walletBalance)} تومان`
                : "این روش پرداخت در دسترس نیست"
            }
            subLabelClassName={
              walletDeficit > 0 ? "text-error font-medium" : "text-tertiary font-medium"
            }
          />

          {walletSupported && walletDeficit > 0 ? (
            <div className="px-4 pt-1 pb-2">
              <ApiWalletDeficitBox deficit={walletDeficit} />
            </div>
          ) : null}

          <div className="border-outline-var/40 mx-4 border-t" />

          <PaymentMethodOption
            active={method === "gateway"}
            disabled={!gatewayAvailable}
            icon="online"
            label="پرداخت آنلاین"
            onClick={() => onMethodChange("gateway")}
            subLabel={gatewayAvailable ? "بانک ملت" : "درگاه پرداخت در دسترس نیست"}
          />
        </>
      ) : null}
    </div>
  );
}
