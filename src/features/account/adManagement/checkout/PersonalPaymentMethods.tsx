import { Typography } from "../../../../shared/ui/Typography";
import { PaymentMethodOption } from "../../../payments/components/PaymentMethodOption";
import { formatTariffToman } from ".././AdTariffOptionsView";
import { ApiWalletDeficitBox } from "./ApiWalletDeficitBox";
import type { ApiPaymentCheckoutProps } from "./paymentCheckoutTypes";
export function PersonalPaymentMethods({
  method,
  onMethodChange,
  walletSupported,
  walletBalance,
  walletDeficit,
  gatewayAvailable,
  is100PercentDiscount,
}: Pick<ApiPaymentCheckoutProps, "method" | "onMethodChange"> & {
  walletSupported: boolean;
  walletBalance: number;
  walletDeficit: number;
  gatewayAvailable: boolean;
  is100PercentDiscount: boolean;
}) {
  return (
    <section className="bg-surface-container-lowest px-4 pt-6 pb-4" aria-label="روش پرداخت">
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 mb-4 text-right text-base leading-6 font-semibold"
      >
        روش پرداخت
      </Typography>
      <PaymentMethodOption
        active={method === "wallet"}
        disabled={!walletSupported}
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
        <div className="mt-2.5 mb-2">
          <ApiWalletDeficitBox deficit={walletDeficit} />
        </div>
      ) : null}

      <div className="border-outline-var mt-2 border-t pt-2">
        <PaymentMethodOption
          active={method === "online"}
          disabled={!gatewayAvailable}
          icon="online"
          label="پرداخت آنلاین"
          onClick={() => onMethodChange("online")}
          subLabel={
            is100PercentDiscount
              ? "درگاه پرداخت برای تخفیف ۱۰۰٪ غیرفعال است"
              : gatewayAvailable
                ? "بانک ملت"
                : "درگاه پرداخت در دسترس نیست"
          }
        />
      </div>
    </section>
  );
}
