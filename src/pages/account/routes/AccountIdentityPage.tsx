import { useState, useEffect } from "react";
import { useDemoNotice } from "../../../hooks/useDemoNotice";
import { useAuthorizeMeMutation, useMyProfileQuery } from "../../../hooks/account.hooks";
import { getStoredAuthSession } from "../../../auth/auth-storage";
import { isUserIdentityVerified } from "../../../services/account.service";
import { getApiErrorMessage } from "../../../api/api";
import { BottomSheet } from "../../../components/BottomSheet";
import { DemoNotice } from "../../../components/DemoNotice";
import { AccountPageShell, IdentityPendingState, IdentityVerifiedState, SimCardOwnershipChangeState, WarningTriangleIcon } from "../accountPageViews";
import type { IdentityPageStep } from "../accountPageViews";

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
        contentClassName="px-4 pb-4 pt-4"
        heightClassName="h-[220px]"
        isOpen={isOwnershipWarningOpen}
        onClose={() => setIsOwnershipWarningOpen(false)}
        panelPaddingClassName="pt-4"
        showHeader={false}
      >
        <div className="flex items-center justify-start gap-2 text-[#1a1a1a]">
          <WarningTriangleIcon className="h-5 w-5 shrink-0" />
          <h2 className="m-0 text-sm font-semibold leading-6">هشدار</h2>
        </div>

        <p className="m-0 mt-3 text-right text-xs font-normal leading-6 text-[#4d4d4d]">
          با اعلام تغییر مالکیت سیم‌کارت، همه آگهی‌های این حساب کاربری
          {" "}
          <span dir="ltr" className="font-medium text-[#1a1a1a]">
            ({mobile})
          </span>
          {" "}
          غیرفعال می‌شوند.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 [direction:ltr]">
          <button
            className="h-10 rounded-lg bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white"
            onClick={() => {
              setIsOwnershipWarningOpen(false);
              setStep("verified");
              showNotice("درخواست تغییر مالکیت سیم‌کارت ثبت شد");
            }}
            type="button"
          >
            تایید
          </button>
          <button
            className="h-10 rounded-lg border border-[#0048c4] bg-white px-4 text-sm font-medium leading-5 text-[#0048c4]"
            onClick={() => setIsOwnershipWarningOpen(false)}
            type="button"
          >
            انصراف
          </button>
        </div>
      </BottomSheet>

      <DemoNotice message={message} className="bottom-20" />
    </AccountPageShell>
  );
}
