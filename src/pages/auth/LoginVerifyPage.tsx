import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { PageFrame } from "../../app/layout/PageFrame";
import { Snackbar, type SnackbarVariant } from "../../shared/components/Snackbar";
import { TopBar } from "../../shared/components/TopBar";
import { RouteLink } from "../../app/router/RouteLink";
import LoginOTPbackground from "../../shared/assets/images/LoginOTPBackground.svg";
import { useResendOtpMutation, useVerifyOtpMutation } from "../../core/hooks/auth.hooks";
import {
  getAuthErrorMessage,
  normalizeDigits,
  normalizeMobile,
} from "../../core/services/auth.service";
import { getMyProfile } from "../../core/services/account.service";
import { searchCities } from "../../core/services/city.service";
import {
  consumeLoginRedirectPath,
  getOtpResendSecondsRemaining,
  getPendingOtpMobile,
} from "../../core/auth/auth-storage";
import LinearArrowRight2 from "../../shared/icons/LinearArrowRight2";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import { saveSelectedCity, selectedCityStorageKeys } from "../../shared/lib/selectedCityStorage";


async function ensureSelectedCityAfterLogin() {
  const hasStoredCity = Boolean(
    window.localStorage.getItem(selectedCityStorageKeys.name)?.trim(),
  );

  if (hasStoredCity) return;

  try {
    const cities = await searchCities("");
    const firstCity = cities.find((city) => city.name?.trim());

    if (!firstCity) return;

    saveSelectedCity({
      id: String(firstCity.id ?? firstCity._id ?? "") || undefined,
      latitude: firstCity.lat,
      longitude: firstCity.lng,
      name: firstCity.name.trim(),
    });
  } catch {
    // Keep the existing router fallback: without a stored city, the user is sent to city selection.
  }
}

function goBackOrNavigate(fallbackPath: string) {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.history.pushState({}, "", fallbackPath);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function LoginVerifyPage() {
  const [verificationCodeSlots, setVerificationCodeSlots] = useState(["", "", "", ""]);
  const [notice, setNotice] = useState<{
    message: string;
    title: string;
    variant: SnackbarVariant;
  } | null>(null);
  const [resendSeconds, setResendSeconds] = useState(getOtpResendSecondsRemaining);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const formRef = useRef<HTMLFormElement | null>(null);
  const lastAutoSubmittedCodeRef = useRef("");
  const phoneNumber = getPendingOtpMobile();
  const verifyOtpMutation = useVerifyOtpMutation();
  const resendOtpMutation = useResendOtpMutation();
  const isSubmitting = verifyOtpMutation.isPending;
  const isResending = resendOtpMutation.isPending;

  useEffect(() => {
    if (resendSeconds <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setResendSeconds(getOtpResendSecondsRemaining());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [resendSeconds]);


  useEffect(() => {
    const code = verificationCodeSlots.join("");

    if (!/^\d{4}$/.test(code) || isSubmitting || isResending) return;
    if (lastAutoSubmittedCodeRef.current === code) return;

    lastAutoSubmittedCodeRef.current = code;
    const timerId = window.setTimeout(() => formRef.current?.requestSubmit(), 0);

    return () => window.clearTimeout(timerId);
  }, [isResending, isSubmitting, verificationCodeSlots]);

  function handleCodeChange(index: number, rawValue: string) {
    const digits = normalizeDigits(rawValue)
      .replace(/\D/g, "")
      .slice(0, verificationCodeSlots.length - index);

    setNotice(null);

    if (!digits) {
      setVerificationCodeSlots((current) =>
        current.map((value, currentIndex) => (currentIndex === index ? "" : value)),
      );
      return;
    }

    setVerificationCodeSlots((current) =>
      current.map((value, currentIndex) => {
        const replacement = digits[currentIndex - index];
        return replacement ?? value;
      }),
    );

    const nextIndex = Math.min(index + digits.length, verificationCodeSlots.length - 1);
    otpInputRefs.current[nextIndex]?.focus();
  }

  function handleCodePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const digits = normalizeDigits(event.clipboardData.getData("text"))
      .replace(/\D/g, "")
      .slice(0, verificationCodeSlots.length - index);

    if (!digits) {
      return;
    }

    event.preventDefault();
    handleCodeChange(index, digits);
  }

  function handleCodeKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (
      event.key === "Backspace" &&
      verificationCodeSlots[index] === "" &&
      index > 0
    ) {
      otpInputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const mobile = normalizeMobile(phoneNumber);
    const code = verificationCodeSlots.join("");

    if (!mobile) {
      setNotice({
        message: "ابتدا شماره موبایل خود را وارد کنید.",
        title: "شماره همراه یافت نشد!",
        variant: "error",
      });
      return;
    }

    if (!/^\d{4}$/.test(code)) {
      setNotice({
        message: "کد تایید چهار رقمی را وارد کنید.",
        title: "کد نامعتبر!",
        variant: "error",
      });
      return;
    }

    setNotice(null);

    try {
      await verifyOtpMutation.mutateAsync({ code, mobile });
      const redirectPath = consumeLoginRedirectPath() || "/account";

      try {
        await getMyProfile();
      } catch (profileError) {
        setNotice({
          message: getAuthErrorMessage(profileError, "دریافت وضعیت احراز هویت با خطا مواجه شد."),
          title: "بررسی حساب ناموفق بود!",
          variant: "error",
        });
        return;
      }

      await ensureSelectedCityAfterLogin();

      window.history.pushState({ state: "new" }, "", redirectPath);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (error) {
      setNotice({
        message: getAuthErrorMessage(error, "تایید کد انجام نشد."),
        title: "کد نامعتبر!",
        variant: "error",
      });
    }
  }

  async function handleResend() {
    const mobile = normalizeMobile(phoneNumber);

    if (!mobile) {
      setNotice({
        message: "ابتدا شماره موبایل خود را وارد کنید.",
        title: "شماره همراه یافت نشد!",
        variant: "error",
      });
      return;
    }

    setNotice(null);

    try {
      await resendOtpMutation.mutateAsync({ mobile });
      setVerificationCodeSlots(["", "", "", ""]);
      lastAutoSubmittedCodeRef.current = "";
      setResendSeconds(getOtpResendSecondsRemaining());
      otpInputRefs.current[0]?.focus();
      setNotice({
        message: "کد تایید مجددا به شماره همراه شما ارسال شد.",
        title: "کد ارسال شد.",
        variant: "success",
      });
    } catch (error) {
      setNotice({
        message: getAuthErrorMessage(error, "ارسال مجدد کد انجام نشد."),
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
      <form className="contents" noValidate onSubmit={handleSubmit} ref={formRef}>
        <TopBar
          backTo="/account"
          onBack={() => goBackOrNavigate("/login/phone")}
          title="ورود به حساب کاربری"
        />
        {notice ? (
          <Snackbar
            message={notice.message}
            onDismiss={() => setNotice(null)}
            title={notice.title}
            variant={notice.variant}
          />
        ) : null}

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white pt-4">
          <section
            className="flex min-h-[168px] flex-1 basis-0 items-center justify-center overflow-hidden rounded-br-3xl bg-white"
            aria-hidden="true"
          >
            <img
              src={LoginOTPbackground}
              alt=""
              className="h-auto w-full object-contain"
              aria-hidden="true"
            />
          </section>

          <section
            className="flex min-h-0 flex-1 basis-0 flex-col items-center overflow-hidden px-4 pb-4 min-[390px]:gap-12 min-[390px]:px-6 min-[390px]:pb-6"
            aria-labelledby="login-verify-title"
          >
            <div className="flex w-full flex-col gap-4">
              <Typography as="h2" variant="title" size="medium" weight="semibold"
                className="m-0 text-right font-semibold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6"
                id="login-verify-title"
              >
                ورود کد ارسالی
              </Typography>
              <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 flex w-full flex-wrap items-center justify-start gap-1.5 text-right text-sm font-normal leading-5 text-[#4d4d4d] min-[390px]:gap-2 min-[390px]:text-sm">
                <Typography as="span" variant="body" size="medium" weight="regular">کد ارسال شده به </Typography>
                <RouteLink
                  dir="ltr"
                  className="font-medium text-[#0048c4] underline underline-offset-3"
                  to="/login/phone"
                >
                  {phoneNumber}
                </RouteLink>
                <img
                  className="block h-3 w-3 object-contain"
                  src="/figma/otp/edit.svg"
                  alt=""
                  aria-hidden="true"
                />
                <Typography as="span" variant="body" size="medium" weight="regular"> را وارد نمایید.</Typography>
              </Typography>
            </div>

            <div
              className="grid w-full mt-6 grid-cols-4 gap-2.5"
              dir="ltr"
              aria-label="کد تایید"
            >
              {verificationCodeSlots.map((slot, index) => (
                <label className="block min-w-0" key={index}>
                  <input
                    aria-invalid={notice?.variant === "error" ? "true" : undefined}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    className="h-14 w-full rounded-xl border border-[#cccccc] bg-white px-3 py-1 text-center !text-[22px] font-medium leading-none text-[#1a1a1a] outline-none caret-[#0048c4] placeholder:!text-sm placeholder:text-[#1a1a1a] focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)] [:-webkit-autofill]:[box-shadow:0_0_0_1000px_white_inset] [:-webkit-autofill]:[-webkit-text-fill-color:#1a1a1a] min-[390px]:h-14"
                    aria-label={`رقم ${index + 1}`}
                    inputMode="numeric"
                    maxLength={1}
                    name={`otp-${index}`}
                    onKeyDown={(event) => handleCodeKeyDown(index, event)}
                    onPaste={(event) => handleCodePaste(index, event)}
                    placeholder="-"
                    ref={(input) => {
                      otpInputRefs.current[index] = input;
                    }}
                    type="text"
                    value={slot}
                    onChange={(event) => handleCodeChange(index, event.target.value)}
                  />
                </label>
              ))}
            </div>

            {resendSeconds > 0 ? (
              <div
                className="flex py-2 px-6 items-center justify-center gap-2 mt-12 rounded-2xl bg-[#f5f5f5] text-sm font-medium leading-5 text-[#1a1a1a]"
                aria-live="polite"
              >
                <Typography as="span" variant="body" size="medium" weight="regular" dir="ltr">{formatCountdownSeconds(resendSeconds)}</Typography>
                <img
                  className="block h-4 w-4 object-contain"
                  src="/figma/otp/timer.svg"
                  alt=""
                  aria-hidden="true"
                />
              </div>
            ) : (
              <Button unstyled
                className="flex py-2 px-6 cursor-pointer flex-row-reverse items-center mt-12 justify-center gap-2 rounded-2xl bg-[#f5f5f5] px-6 text-sm font-medium leading-5 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isResending || isSubmitting}
                onClick={handleResend}
                type="button"
              >
                <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium">{isResending ? "در حال ارسال..." : "دریافت مجدد کد"}</Typography>
                <LinearArrowRight2 className="w-5 h-5 text-[#4d4d4d]" />
              </Button>
            )}
          </section>
        </main>

        <footer className="shrink-0 bg-white px-4 py-3.5 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
          <Button unstyled
            className="inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#0048c4] px-4 py-2.5 text-sm font-medium leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting || isResending}
            type="submit"
          >
            {isSubmitting ? "در حال تایید..." : "تایید"}
          </Button>
        </footer>
      </form>
    </PageFrame>
  );
}

function formatCountdownSeconds(seconds: number) {
  return String(seconds).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}
