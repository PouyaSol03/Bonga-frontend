import { useState, useEffect } from "react";
import { useDemoNotice } from "../../../hooks/useDemoNotice";
import { useAuthorizeMeMutation, useMyProfileQuery } from "../../../hooks/account.hooks";
import { getStoredAuthSession } from "../../../auth/auth-storage";
import { isUserIdentityVerified } from "../../../services/account.service";
import { getApiErrorMessage } from "../../../api/api";
import { BottomSheet } from "../../../components/BottomSheet";
import { DemoNotice } from "../../../components/DemoNotice";
import { Button } from "../../../components/ui/Button";
import { AccountPageShell, IdentityPendingState, IdentityVerifiedState, SimCardOwnershipChangeState, WarningTriangleIcon } from "../accountPageViews";
import type { IdentityPageStep } from "../accountPageViews";
import { Typography } from "../../../components/ui/Typography";

export function AccountIdentityPage() {
  const [step, setStep] = useState<IdentityPageStep>("pending");
  const [isOwnershipWarningOpen, setIsOwnershipWarningOpen] = useState(false);
  const { message, showNotice } = useDemoNotice();
  const authorize = useAuthorizeMeMutation();
  const { data: profile } = useMyProfileQuery();
  const isAuthRequired = new URLSearchParams(window.location.search).get("required") === "1";
  const mobile = getStoredAuthSession()?.mobile ?? "-";

  useEffect(() => {
    if (isUserIdentityVerified(profile) && step === "pending") {
      setStep("verified");
    }
  }, [profile, step]);

  const title =
    step === "pending"
      ? "تایید هویت"
      : step === "verified"
        ? "مالکیت سیم‌کارت"
        : "ثبت تغییر مالکیت سیم‌کارت";

  return (
    <AccountPageShell
      onBack={
        step === "ownership"
          ? () => {
              setIsOwnershipWarningOpen(false);
              setStep("verified");
            }
          : undefined
      }
      title={title}
    >
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-24">
        {step === "pending" ? (
          <IdentityPendingState
            isPending={authorize.isPending}
            showRequiredNotice={isAuthRequired}
            onVerify={(nationalnumber) => {
              authorize.mutate(
                { nationalnumber },
                {
                  onError: (error) => {
                    showNotice(getApiErrorMessage(error, "تایید کد ملی با خطا مواجه شد"));
                  },
                  onSuccess: () => {
                    setStep("verified");
                    showNotice("کد ملی با موفقیت تایید شد");
                  },
                },
              );
            }}
          />
        ) : null}

        {step === "verified" ? (
          <IdentityVerifiedState onChangeOwner={() => setStep("ownership")} />
        ) : null}

        {step === "ownership" ? (
          <SimCardOwnershipChangeState
            onSubmit={() => setIsOwnershipWarningOpen(true)}
          />
        ) : null}
      </main>

      <BottomSheet
        ariaLabel="هشدار تغییر مالکیت سیم‌کارت"
        className="!rounded-t-[16px] flex flex-col"
        contentClassName="flex min-h-0 flex-1 flex-col"
        handleClassName="h-1 w-[60px] rounded-full bg-[#808080]"
        isOpen={isOwnershipWarningOpen}
        onClose={() => setIsOwnershipWarningOpen(false)}
        panelPaddingClassName="pt-1.5"
        showHeader={false}
        variant="confirm"
      >
        <div className="min-h-0 flex-1 px-4 pt-4">
          <div className="flex items-center justify-start gap-2 text-[#1a1a1a]">
            <WarningTriangleIcon className="h-6 w-6 shrink-0" />
            <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6">هشدار</Typography>
          </div>

          <Typography as="p" variant="body" size="large" weight="regular" className="m-0 mt-4 text-right text-base font-normal leading-8 text-[#1a1a1a]">
            با اعلام «تغییر مالکیت سیم‌کارت»، همهٔ آگهی‌های این حساب کاربری
            {" "}
            <Typography as="span" variant="body" size="medium" weight="regular" dir="ltr" className="whitespace-nowrap text-[#1a1a1a]">
              ({mobile})
            </Typography>
            {" "}
            غیرفعال می‌شود.
          </Typography>
        </div>

        <div className="shrink-0 bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(77,77,77,0.08)]">
          <Button
            className="h-10"
            fullWidth
            onClick={() => {
              setIsOwnershipWarningOpen(false);
              setStep("verified");
              showNotice("درخواست تغییر مالکیت سیم‌کارت ثبت شد");
            }}
            size="sm"
          >
            ثبت
          </Button>
        </div>
      </BottomSheet>

      <DemoNotice message={message} className="bottom-20" />
    </AccountPageShell>
  );
}
