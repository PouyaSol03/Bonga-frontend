import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { PackagePaymentType } from "../api/package.service";
import LinearPayment from "../../../shared/icons/LinearPayment";
import LinearWallet2 from "../../../shared/icons/LinearWallet2";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { ChoiceIndicator } from "../../../shared/ui/Choice";

type PackagePaymentMethodSheetProps = {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (paymentType: PackagePaymentType) => void;
  packagePrice: number;
  packageTitle: string;
  walletCredit?: number | string;
  walletError?: string | null;
  walletLoading?: boolean;
};

function toAmount(value: number | string | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("fa-IR").format(Math.max(0, value));
}

export function PackagePaymentMethodSheet({
  isOpen,
  isPending,
  onClose,
  onSubmit,
  packagePrice,
  packageTitle,
  walletCredit,
  walletError,
  walletLoading = false,
}: PackagePaymentMethodSheetProps) {
  const [paymentType, setPaymentType] = useState<PackagePaymentType>(0);

  useEffect(() => {
    if (isOpen) setPaymentType(0);
  }, [isOpen, packageTitle]);

  const normalizedWalletCredit = toAmount(walletCredit);
  const walletShortage = useMemo(
    () => Math.max(packagePrice - normalizedWalletCredit, 0),
    [normalizedWalletCredit, packagePrice],
  );
  const walletReady = !walletLoading && !walletError;
  const canPayWithWallet = walletReady && walletShortage <= 0;
  const canSubmit = paymentType === 0 || canPayWithWallet;

  return (
    <BottomSheet
      ariaLabel="انتخاب روش پرداخت بسته"
      isOpen={isOpen}
      onClose={onClose}
      showBackButton={false}
      title="روش پرداخت"
      variant="form"
    >
      <div className="px-4 pb-4 pt-4">
        <div className="rounded-xl bg-[#f7f8fb] px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="min-w-0 flex-1 truncate text-right text-[#4d4d4d]"
            >
              {packageTitle}
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="semibold"
              className="shrink-0 text-[#1a1a1a]"
            >
              {formatMoney(packagePrice)} تومان
            </Typography>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-[#e6e6e6] bg-white">
          <PaymentMethodRow
            active={paymentType === 1}
            description={
              walletLoading
                ? "در حال دریافت موجودی کیف پول..."
                : walletError
                  ? "دریافت موجودی کیف پول با خطا مواجه شد."
                  : `موجودی: ${formatMoney(normalizedWalletCredit)} تومان`
            }
            icon={<LinearWallet2 className="h-6 w-6" />}
            label="کیف پول"
            onClick={() => setPaymentType(1)}
          />

          <div className="mx-4 h-px bg-[#f0f0f0]" />

          <PaymentMethodRow
            active={paymentType === 0}
            description="درگاه بانکی زرین‌پال"
            icon={<LinearPayment className="h-6 w-6" />}
            label="پرداخت آنلاین"
            onClick={() => setPaymentType(0)}
          />
        </div>

        {paymentType === 1 && walletReady && walletShortage > 0 ? (
          <div className="mt-3 rounded-xl border border-[#f3c5bf] bg-[#fff5f3] px-4 py-3 text-right">
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="m-0 text-[#c11004]"
            >
              موجودی کیف پول برای این خرید {formatMoney(walletShortage)} تومان کم است.
            </Typography>
            <RouteLink
              className="mt-2 inline-flex text-sm font-medium text-[#0048c4] no-underline"
              to="/account/wallet"
            >
              شارژ کیف پول
            </RouteLink>
          </div>
        ) : null}

        <Button
          className="mt-5"
          disabled={!canSubmit || isPending}
          fullWidth
          loading={isPending}
          onClick={() => onSubmit(paymentType)}
          radius="small"
          size="x-medium"
          type="button"
          variant="primary"
        >
          {isPending
            ? paymentType === 0
              ? "در حال اتصال به درگاه..."
              : "در حال پرداخت..."
            : "پرداخت"}
        </Button>
      </div>
    </BottomSheet>
  );
}

function PaymentMethodRow({
  active,
  description,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  description: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      unstyled
      aria-pressed={active}
      className="flex min-h-[72px] w-full items-center justify-between gap-3 px-4 py-3 text-right [direction:ltr]"
      onClick={onClick}
      type="button"
    >
      <ChoiceIndicator checked={active} type="radio" />

      <span className="inline-flex min-w-0 flex-1 items-center justify-end gap-3 [direction:rtl]">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f2f5fb] text-[#4d4d4d]">
          {icon}
        </span>

        <span className="min-w-0 flex-1">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="medium"
            className="block text-[#1a1a1a]"
          >
            {label}
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className="mt-1 block text-[#808080]"
          >
            {description}
          </Typography>
        </span>
      </span>
    </Button>
  );
}
