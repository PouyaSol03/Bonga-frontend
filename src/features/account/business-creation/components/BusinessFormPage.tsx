import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { setStoredActiveRole } from "../../../../shared/auth/auth-storage";
import { USER } from "../../../../shared/constants/roles.constants";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";
import LinearInformation from "../../../../shared/icons/LinearInformation";
import LinearTick from "../../../../shared/icons/LinearTick";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { getMyProfile } from "../../api/account.service";
import type { BusinessToast, BusinessType } from "../types";
import { ActivationNotice } from "./ActivationNotice";
import { BusinessCreationShell } from "./BusinessCreationShell";
import { BusinessHero } from "./BusinessHero";

export function BusinessFormPage({
  businessType,
  disabledSubmit = false,
  fields,
  isSubmitting = false,
  lockedMessage,
  onSubmit,
}: {
  businessType: BusinessType;
  disabledSubmit?: boolean;
  fields: ReactNode;
  isSubmitting?: boolean;
  lockedMessage?: string;
  onDismissToast?: () => void;
  onSubmit?: () => boolean | Promise<boolean>;
  toast?: BusinessToast | null;
}) {
  const navigate = useNavigate();
  const [isNoticeVisible, setIsNoticeVisible] = useState(true);

  const handleSubmit = async () => {
    if (isSubmitting || disabledSubmit) return;

    const canContinue = onSubmit ? await onSubmit() : true;

    if (!canContinue) return;

    await getMyProfile();
    setStoredActiveRole(USER);
    navigate("/account?businessSuccess=1", {
      replace: true,
      state: { businessSuccess: true, businessType },
    });
  };

  return (
    <BusinessCreationShell
      bottomBar={
        <div className="grid grid-cols-2 gap-4 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          <Button
            unstyled
            className="border-primary bg-surface-container-lowest text-primary inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border px-4 text-sm leading-5 font-semibold"
            onClick={() => navigate("/account/business/create")}
            type="button"
          >
            <LinearArrowRight1 className="h-5 w-5" />
            <Typography as="span" variant="body" size="medium" weight="regular">
              مرحله قبل
            </Typography>
          </Button>
          <Button
            unstyled
            className="bg-primary text-on-primary inline-flex h-10 items-center justify-center gap-2 rounded-[10px] px-4 text-sm leading-5 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting || disabledSubmit}
            onClick={handleSubmit}
            type="button"
          >
            <LinearTick className="h-5 w-5" />
            <Typography as="span" variant="body" size="medium" weight="regular">
              {isSubmitting ? "در حال ثبت..." : "ثبت نام"}
            </Typography>
          </Button>
        </div>
      }
    >
      <form className="flex min-h-full flex-col" onSubmit={(event) => event.preventDefault()}>
        <BusinessHero infoType={businessType} showInfoButton />

        <div className="mt-4 space-y-6 px-4 pb-32">
          {lockedMessage ? (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-right">
              <LinearInformation className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
              <div className="min-w-0 flex-1">
                <Typography
                  as="p"
                  variant="title"
                  size="small"
                  weight="semibold"
                  className="m-0 text-sm font-semibold text-amber-800"
                >
                  {lockedMessage}
                </Typography>
                <Typography
                  as="p"
                  variant="body"
                  size="small"
                  weight="regular"
                  className="m-0 mt-1 text-xs leading-5 text-amber-700"
                >
                  درخواست قبلی شما برای ثبت کسب‌وکار در انتظار تایید ادمین است. تا زمان تایید، امکان
                  ارسال فرم جدید وجود ندارد.
                </Typography>
              </div>
            </div>
          ) : null}
          {isNoticeVisible ? (
            <ActivationNotice
              businessType={businessType}
              onClose={() => setIsNoticeVisible(false)}
            />
          ) : null}

          {fields}

          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface-var m-0 text-sm leading-6 font-normal"
          >
            با ثبت‌نام در کسب‌وکار ایران شناسا{" "}
            <Link className="text-primary font-semibold underline" to="/account/about">
              قوانین و مقررات
            </Link>{" "}
            سایت را قبول کرده‌اید.
          </Typography>
        </div>
      </form>
    </BusinessCreationShell>
  );
}
