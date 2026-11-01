import { useNavigate } from "react-router";
import LinearAdd from "../../../../shared/icons/LinearAdd";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
export function ApiCreditDeficitBox({ deficit }: { deficit: number }) {
  const navigate = useNavigate();

  function openCreditPackages() {
    try {
      sessionStorage.setItem("bonga:paymentReturnTo", window.location.pathname);
    } catch {
      void 0;
    }
    navigate("/account/dashboard/payments", {
      state: {
        initialPaymentTab: "packages",
        returnTo: window.location.pathname,
      },
    });
  }

  return (
    <div className="border-warning/20 bg-warning-container/20 flex h-[60px] items-center justify-between rounded-lg border px-4 [direction:ltr]">
      <Button
        unstyled
        className="bg-tertiary text-on-primary flex shrink-0 items-center justify-center gap-1 rounded-lg px-4 py-1.5 text-xs leading-5 font-semibold"
        onClick={openCreditPackages}
        type="button"
      >
        <Typography variant="label" size="small" weight="medium">
          افزایش اعتبار
        </Typography>
        <LinearAdd className="h-4 w-4" />
      </Button>

      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface text-right [direction:rtl]"
      >
        کسری:{" "}
        <Typography as="span" variant="body" size="medium">
          {new Intl.NumberFormat("fa-IR").format(deficit)} اعتبار
        </Typography>
      </Typography>
    </div>
  );
}
