import { useState } from "react";
import { getStoredAuthSession } from "../../../../shared/auth/auth-storage";
import { Typography } from "../../../../shared/ui/Typography";
import { TextField } from "../../../../shared/ui/TextField";
import { Button } from "../../../../shared/ui/Button";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import { normalizeNumericInput } from "./identityHelpers";
import { IdentityPendingNotices } from "./IdentityPendingNotices";

export function IdentityPendingState({
  initialNationalnumber = "",
  isPending,
  isAuthenticated = true,
  isVerifying = false,
  isRejected = false,
  onVerify,
}: {
  initialNationalnumber?: string;
  isPending: boolean;
  isAuthenticated?: boolean;
  isVerifying?: boolean;
  isRejected?: boolean;
  showRequiredNotice?: boolean;
  onVerify: (nationalnumber: string) => void;
}) {
  const mobile = getStoredAuthSession()?.mobile ?? "-";
  const [nationalnumber, setNationalnumber] = useState(initialNationalnumber);
  const [prevInitial, setPrevInitial] = useState(initialNationalnumber);

  if (initialNationalnumber !== prevInitial) {
    setPrevInitial(initialNationalnumber);
    if (!nationalnumber) {
      setNationalnumber(initialNationalnumber);
    }
  }

  const normalizedNationalnumber = nationalnumber.trim();
  const isNationalnumberComplete = normalizedNationalnumber.length === 10;

  return (
    <>
      <IdentityPendingNotices
        initialNationalnumber={initialNationalnumber}
        isAuthenticated={isAuthenticated}
        isPending={isPending}
        isRejected={isRejected}
        isVerifying={isVerifying}
        mobile={mobile}
      />

      <section className="p-4">
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="medium"
          className="text-on-surface m-0"
        >
          تایید با کد ملی
        </Typography>

        <div className="text-outline mt-2 flex gap-1">
          <LinearInfoCircle className="h-4.5 w-4.5 shrink-0" />
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-xs">
            کد ملی باید متعلق به مالک همین شماره همراه باشد.
          </Typography>
        </div>

        <TextField
          className="text-on-surface text-sm"
          containerClassName="mt-4"
          disabled={isPending}
          inputMode="numeric"
          label="کد ملی مالک شماره همراه"
          maxLength={10}
          placeholder="کد ملی مالک شماره همراه"
          value={nationalnumber}
          onChange={(event) =>
            setNationalnumber(normalizeNumericInput(event.target.value).slice(0, 10))
          }
        />
      </section>

      <div className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button
          disabled={!isAuthenticated || !isNationalnumberComplete || isPending}
          fullWidth
          loading={isPending}
          onClick={() => onVerify(normalizedNationalnumber)}
          radius="small"
          size="x-medium"
          type="button"
          variant="primary"
        >
          {isPending
            ? "در حال اعتبارسنجی شما هستیم..."
            : isRejected
              ? "ثبت مجدد کد ملی"
              : isVerifying
                ? "ویرایش و ثبت مجدد کد ملی"
                : "بررسی و تایید هویت"}
        </Button>
      </div>
    </>
  );
}
