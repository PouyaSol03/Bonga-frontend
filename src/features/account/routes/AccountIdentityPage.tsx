import { useState, useEffect } from "react";
import { useToast } from "../../../shared/hooks/useToast";
import {
  useAuthorizeMeMutation,
  useMyProfileQuery,
  useTransferSimOwnershipMutation,
} from "../api/account.hooks";
import { getStoredAuthSession, clearStoredAuthSession } from "../../../shared/auth/auth-storage";
import { isUserIdentityVerified } from "../api/account.service";
import { getApiErrorMessage } from "../../../shared/api/api";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { TopBar } from "../../../shared/components/TopBar";
import { Button } from "../../../shared/ui/Button";
import {
  IdentityPendingState,
  IdentityVerifiedState,
  SimCardOwnershipChangeState,
  WarningTriangleIcon, type IdentityPageStep 
} from "../accountPageViews";

import { Typography } from "../../../shared/ui/Typography";

export function AccountIdentityPage() {
  const [step, setStep] = useState<IdentityPageStep>("pending");
  const [isOwnershipWarningOpen, setIsOwnershipWarningOpen] = useState(false);
  const { showToast } = useToast();
  const authorize = useAuthorizeMeMutation();
  const transferOwnership = useTransferSimOwnershipMutation();
  const { data: profile } = useMyProfileQuery();
  const isAuthRequired = new URLSearchParams(window.location.search).get("required") === "1";
  const authSession = getStoredAuthSession();
  const isAuthenticated = Boolean(authSession);
  const mobile = authSession?.mobile ?? "-";
  const isRejected = Number(profile?.authorized) === 2;
  const isPendingReview = Boolean(
    profile?.nationalnumber && !isUserIdentityVerified(profile) && !isRejected,
  );

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
    <div className="bg-surface-container text-on-surface relative flex h-full min-h-0 flex-col overflow-hidden [direction:rtl]">
      <TopBar
        backTo="/account"
        onBack={
          step === "ownership"
            ? () => {
                setIsOwnershipWarningOpen(false);
                setStep("verified");
              }
            : undefined
        }
        title={title}
      />
      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-24">
        {step === "pending" ? (
          <IdentityPendingState
            initialNationalnumber={profile?.nationalnumber ?? ""}
            isAuthenticated={isAuthenticated}
            isPending={authorize.isPending}
            isVerifying={isPendingReview}
            isRejected={isRejected}
            showRequiredNotice={isAuthRequired}
            onVerify={(nationalnumber) => {
              authorize.mutate(
                { nationalnumber },
                {
                  onError: (error) => {
                    showToast(
                      getApiErrorMessage(error, "تایید کد ملی با خطا مواجه شد"),
                      undefined,
                      "error",
                    );
                  },
                  onSuccess: () => {
                    showToast(
                      "کد ملی با موفقیت ثبت شد و در انتظار تایید ادمین است",
                      undefined,
                      "success",
                    );
                  },
                },
              );
            }}
          />
        ) : null}

        {step === "verified" ? (
          <IdentityVerifiedState
            authorizeDate={profile?.authorize_date}
            onChangeOwner={() => setStep("ownership")}
          />
        ) : null}

        {step === "ownership" ? (
          <SimCardOwnershipChangeState onSubmit={() => setIsOwnershipWarningOpen(true)} />
        ) : null}
      </main>

      <BottomSheet
        ariaLabel="هشدار تغییر مالکیت سیم‌کارت"
        className="flex flex-col !rounded-t-[16px]"
        contentClassName="flex min-h-0 flex-1 flex-col"
        handleClassName="h-1 w-[60px] rounded-full bg-outline-var"
        isOpen={isOwnershipWarningOpen}
        onClose={() => !transferOwnership.isPending && setIsOwnershipWarningOpen(false)}
        panelPaddingClassName="pt-1.5"
        showHeader={false}
        variant="confirm"
      >
        <div className="min-h-0 flex-1 px-4 pt-4">
          <div className="text-on-surface flex items-center justify-start gap-2">
            <WarningTriangleIcon className="h-6 w-6 shrink-0" />
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="m-0 text-base leading-6 font-semibold"
            >
              هشدار
            </Typography>
          </div>

          <Typography
            as="p"
            variant="body"
            size="large"
            weight="regular"
            className="text-on-surface m-0 mt-4 text-right text-base leading-8 font-normal"
          >
            با اعلام «تغییر مالکیت سیم‌کارت»، همهٔ آگهی‌های این حساب کاربری{" "}
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              dir="ltr"
              className="text-on-surface whitespace-nowrap"
            >
              ({mobile})
            </Typography>{" "}
            غیرفعال می‌شود.
          </Typography>
        </div>

        <div className="bg-surface-container-lowest shrink-0 px-4 py-3 shadow-[0_-4px_16px_rgba(77,77,77,0.08)]">
          <Button
            className="h-10"
            disabled={transferOwnership.isPending}
            fullWidth
            onClick={() => {
              transferOwnership.mutate(
                {
                  reason: "sim_ownership_changed",
                  description: "تغییر مالکیت سیم‌کارت و حذف حساب کاربری",
                },
                {
                  onSuccess: (data) => {
                    setIsOwnershipWarningOpen(false);
                    clearStoredAuthSession();
                    showToast(
                      data?.message || "تغییر مالکیت سیم‌کارت با موفقیت ثبت شد",
                      undefined,
                      "success",
                    );
                    setTimeout(() => {
                      window.location.assign("/");
                    }, 1200);
                  },
                  onError: (error) => {
                    showToast(
                      getApiErrorMessage(error, "خطایی در ثبت تغییر مالکیت سیم‌کارت رخ داد"),
                      undefined,
                      "error",
                    );
                  },
                },
              );
            }}
            size="sm"
          >
            {transferOwnership.isPending ? "در حال ثبت..." : "ثبت"}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
