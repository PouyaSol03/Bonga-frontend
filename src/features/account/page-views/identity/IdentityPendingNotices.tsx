import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import LinearUserAccount from "../../../../shared/icons/LinearUserAccount";

export function IdentityPendingNotices({
  initialNationalnumber,
  isAuthenticated,
  isPending,
  isRejected,
  isVerifying,
  mobile,
}: {
  initialNationalnumber: string;
  isAuthenticated: boolean;
  isPending: boolean;
  isRejected: boolean;
  isVerifying: boolean;
  mobile: string;
}) {
  return (
    <>
      {!isAuthenticated ? (
        <section className="px-4 pt-3">
          <div className="border-primary bg-primary-container rounded-xl border p-4 text-right">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="medium"
              className="text-primary m-0 text-sm font-semibold"
            >
              برای تایید هویت، ابتدا وارد شوید
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-on-surface-var m-0 mt-1 text-xs leading-5"
            >
              برای ثبت و اعتبارسنجی کد ملی، لازم است ابتدا با شماره همراه خود وارد حساب کاربری شوید.
            </Typography>
            <div className="mt-3">
              <Button
                onClick={() => {
                  window.location.assign(
                    `/login/phone?returnTo=${encodeURIComponent("/account/identity")}`,
                  );
                }}
                size="sm"
                type="button"
                variant="primary"
              >
                ورود با شماره همراه
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {isRejected && !isPending ? (
        <section className="px-4 pt-3">
          <div className="border-error bg-error-container rounded-xl border p-4 text-right">
            <div className="text-error flex items-center gap-2">
              <LinearInfoCircle className="h-5 w-5 shrink-0" />
              <Typography
                as="p"
                variant="body"
                size="medium"
                weight="medium"
                className="m-0 text-sm font-semibold"
              >
                احراز هویت شما تایید نشد
              </Typography>
            </div>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-on-error-container m-0 mt-1.5 text-xs leading-5"
            >
              اطلاعات احراز هویت قبلی شما تایید نشد. لطفاً کد ملی صحیح متعلق به مالک این شماره همراه
              را وارد و مجدداً ارسال فرمایید.
            </Typography>
          </div>
        </section>
      ) : null}

      {isVerifying && !isRejected && !isPending ? (
        <section className="px-4 pt-3">
          <div className="border-warning bg-warning-container rounded-xl border p-4 text-right">
            <div className="text-on-warning-container flex items-center gap-2">
              <LinearInfoCircle className="h-5 w-5 shrink-0" />
              <Typography
                as="p"
                variant="body"
                size="medium"
                weight="medium"
                className="m-0 text-sm font-semibold"
              >
                در انتظار تایید ادمین
              </Typography>
            </div>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-on-surface-var m-0 mt-1.5 text-xs leading-5"
            >
              کد ملی شما ({initialNationalnumber}) با موفقیت ثبت شده و در انتظار بررسی و تایید توسط
              ادمین است.
            </Typography>
          </div>
        </section>
      ) : null}

      {isPending ? (
        <section className="px-4 pt-3">
          <div className="border-primary bg-primary-container text-primary flex items-center gap-2.5 rounded-xl border p-4">
            <div className="border-primary h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-t-transparent" />
            <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm">
              در حال اعتبارسنجی شما هستیم...
            </Typography>
          </div>
        </section>
      ) : null}

      <section className="p-4 pb-0">
        <div className="border-primary bg-primary-container rounded-xl border p-6">
          <div className="text-primary flex items-center justify-start gap-2.5">
            <LinearUserAccount className="h-6 w-6" />
            <Typography as="p" variant="body" size="large" className="m-0 font-medium">
              ملاحظات در تایید هویت
            </Typography>
          </div>

          <Typography
            as="p"
            variant="body"
            size="large"
            weight="regular"
            className="text-on-surface m-0 mt-4"
          >
            برای افزایش امنیت حساب و جلوگیری از سوءاستفاده، هویت شما با کد ملی و مالکیت شماره همراه
            بررسی می‌شود.
          </Typography>

          <Typography
            as="p"
            variant="body"
            size="large"
            weight="regular"
            className="text-on-surface m-0 mt-4"
          >
            شماره همراه فعال:{" "}
            <Typography
              as="span"
              variant="body"
              size="large"
              weight="medium"
              dir="ltr"
              className="text-tertiary"
            >
              {mobile}
            </Typography>
          </Typography>
        </div>
      </section>
    </>
  );
}
