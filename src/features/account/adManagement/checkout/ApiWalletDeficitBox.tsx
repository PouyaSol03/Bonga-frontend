import { getApiErrorMessage } from "../../../../shared/api/api";
import { useToast } from "../../../../shared/hooks/useToast";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { storePaymentReturnTarget } from "../../../../shared/utils/payment-return";
import { useChargeWalletMutation } from "../../api/account.hooks";
import { formatTariffToman } from ".././AdTariffOptionsView";
export function ApiWalletDeficitBox({ deficit }: { deficit: number }) {
  const chargeWalletMutation = useChargeWalletMutation();
  const { showToast } = useToast();
  const showError = (message: string) => showToast(message, "خطا", "error");

  function chargeWallet() {
    if (chargeWalletMutation.isPending || deficit <= 0) return;

    chargeWalletMutation.mutate(
      { price: Math.ceil(deficit) },
      {
        onError: (error: unknown) => {
          showError(getApiErrorMessage(error, "شارژ کیف پول با خطا مواجه شد."));
        },
        onSuccess: ({ paymentUrl }) => {
          storePaymentReturnTarget({
            label: "بازگشت به پرداخت آگهی",
            path: window.location.pathname,
          });
          window.location.assign(paymentUrl);
        },
      },
    );
  }

  return (
    <div>
      <div className="flex h-[56px] items-center justify-between rounded-xl border border-[#FFE8CC] bg-[#FFF8EE] px-4 [direction:ltr]">
        <Button
          unstyled
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#00966D] px-3.5 py-2 text-xs leading-5 font-semibold text-white shadow-xs transition-colors disabled:opacity-60"
          disabled={chargeWalletMutation.isPending}
          onClick={chargeWallet}
          type="button"
        >
          <span className="text-sm leading-none font-bold select-none">+</span>
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="semibold"
            className="text-white"
          >
            {chargeWalletMutation.isPending ? "در حال اتصال..." : "افزایش موجودی"}
          </Typography>
        </Button>

        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="text-on-surface text-right text-sm leading-5 font-medium [direction:rtl]"
        >
          کسری: {formatTariffToman(deficit)} تومان
        </Typography>
      </div>
    </div>
  );
}
