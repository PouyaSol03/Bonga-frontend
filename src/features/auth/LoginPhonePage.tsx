import { useState, type FormEvent } from "react";
import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { RouteLink } from "../../shared/navigation/RouteLink";
import LoginPhoneBackground from "../../shared/assets/images/LoginPhoneBackground.svg";
import { useRequestOtpMutation } from "./api/auth.hooks";
import { getAuthErrorMessage, normalizeMobile } from "./api/auth.service";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

function goBackOrNavigate(fallbackPath: string) {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.history.pushState({}, "", fallbackPath);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function LoginPhonePage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notice, setNotice] = useState<{
    message: string;
    title: string;
    variant: "error" | "success" | "info" | "warning";
  } | null>(null);
  const requestOtpMutation = useRequestOtpMutation();
  const isSubmitting = requestOtpMutation.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const mobile = normalizeMobile(phoneNumber);

    if (!/^09\d{9}$/.test(mobile)) {
      setNotice({
        message: "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.",
        title: "شماره نامعتبر!",
        variant: "error",
      });
      return;
    }

    setNotice(null);

    try {
      await requestOtpMutation.mutateAsync({ mobile });
      window.history.pushState({}, "", "/login/verify");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (error) {
      setNotice({
        message: getAuthErrorMessage(error, "ارسال کد تایید انجام نشد."),
        title: "ارسال کد ناموفق!",
        variant: "error",
      });
    }
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <form className="contents" noValidate onSubmit={handleSubmit}>
        <TopBar
          backTo="/account"
          onBack={() => goBackOrNavigate("/account")}
          title="ورود به حساب کاربری"
        />

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white pt-4">
          <section
            className="flex min-h-[168px] flex-1 basis-0 items-center justify-center overflow-hidden min-[390px]:min-h-60"
            aria-hidden="true"
          >
            <img
              src={LoginPhoneBackground}
              alt=""
              className="h-auto w-full object-contain"
              aria-hidden="true"
            />
          </section>

          <section
            className="flex min-h-0 flex-1 basis-0 flex-col items-start gap-4 overflow-hidden px-4 pb-3 min-[390px]:gap-4 min-[390px]:px-6 min-[390px]:pb-4"
            aria-labelledby="login-phone-title"
          >
            <Typography as="h2" variant="title" size="medium" weight="semibold"
              className="m-0 text-right font-semibold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6"
              id="login-phone-title"
            >
              شماره موبایل خود را وارد کنید
            </Typography>
            <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 w-full text-right text-sm font-normal leading-5 text-[#4d4d4d] min-[390px]:text-sm">
              برای استفاده از تمام امکانات وارد حساب کاربری خود شوید.
            </Typography>

            <label className="block w-full" htmlFor="mobileNumber">
              <input
                aria-invalid={notice?.variant === "error" ? "true" : undefined}
                className="w-full rounded-xl border border-[#cccccc] bg-white px-3 py-4.5 text-right text-sm font-normal h-14 text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a] caret-[#0048c4] focus:border-[#0048c4] focus:border-2 [:-webkit-autofill]:[box-shadow:0_0_0_1000px_white_inset] [:-webkit-autofill]:[-webkit-text-fill-color:#1a1a1a]"
                autoComplete="tel-national"
                dir="ltr"
                id="mobileNumber"
                inputMode="tel"
                maxLength={11}
                pattern="09[0-9]{9}"
                placeholder="شماره همراه"
                type="tel"
                value={phoneNumber}
                onChange={(event) => {
                  setPhoneNumber(normalizeMobile(event.target.value));
                  setNotice(null);
                }}
              />
            </label>

            <Typography as="p" variant="body" size="medium" weight="regular" className="flex max-w-full flex-wrap items-center justify-start py-1 text-sm font-normal leading-5 min-[390px]:text-xs">
              <Typography as="span" variant="body" size="medium" weight="regular" className="ml-0.5">با ثبت‌نام،</Typography>
              <RouteLink
                className="text-[#0048c4] underline underline-offset-6"
                to="/"
              >
                قوانین ایران شناسا
              </RouteLink>
              <Typography as="span" variant="body" size="medium" weight="regular" className="mr-0.5"> را می‌پذیرم!</Typography>
            </Typography>
          </section>
        </main>

        <footer className="shrink-0 bg-white px-4 py-3.5 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
          <Button unstyled
            className="inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#0048c4] px-4 py-2.5 text-sm font-medium leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "در حال ارسال..." : "تایید"}
          </Button>
        </footer>
      </form>
    </PageFrame>
  );
}
