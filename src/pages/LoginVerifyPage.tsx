import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { PageFrame } from "../app/PageFrame";
import { Snackbar, type SnackbarVariant } from "../components/Snackbar";
import { TopBar } from "../components/TopBar";
import { RouteLink } from "../routes/RouteLink";
import LoginOTPbackground from "../assets/images/LoginOTPBackground.svg";
import { useResendOtpMutation, useVerifyOtpMutation } from "../hooks/auth.hooks";
import {
  getAuthErrorMessage,
  normalizeDigits,
  normalizeMobile,
} from "../services/auth.service";
import {
  consumeLoginRedirectPath,
  getOtpResendSecondsRemaining,
  getPendingOtpMobile,
} from "../auth/auth-storage";

export function LoginVerifyPage() {
  const [verificationCodeSlots, setVerificationCodeSlots] = useState(["", "", "", ""]);
  const [notice, setNotice] = useState<{
    message: string;
    title: string;
    variant: SnackbarVariant;
  } | null>(null);
  const [resendSeconds, setResendSeconds] = useState(getOtpResendSecondsRemaining);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
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
      const redirectPath = consumeLoginRedirectPath() || "/login";
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
      <form className="contents" noValidate onSubmit={handleSubmit}>
        <TopBar backTo="/login" title="ورود به حساب کاربری" />
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
            className="flex min-h-[168px] flex-1 basis-0 items-center justify-center overflow-hidden rounded-br-3xl bg-white p-3 min-[390px]:min-h-60 min-[390px]:p-4"
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
            className="flex min-h-0 flex-1 basis-0 flex-col items-center gap-7 overflow-hidden px-4 pb-4 min-[390px]:gap-12 min-[390px]:px-6 min-[390px]:pb-6"
            aria-labelledby="login-verify-title"
          >
            <div className="flex w-full flex-col gap-4">
              <h2
                className="m-0 text-right text-sm font-semibold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6"
                id="login-verify-title"
              >
                ورود کد ارسالی
              </h2>
              <p className="m-0 flex w-full flex-wrap items-center justify-start gap-1.5 text-right text-xs font-normal leading-5 text-[#4d4d4d] min-[390px]:gap-2 min-[390px]:text-sm">
                <span>کد ارسال شده به </span>
                <RouteLink
                  dir="ltr"
                  className="font-medium text-[#0048c4] underline underline-offset-3"
                  to="/login/phone"
                >
                  {phoneNumber}
                </RouteLink>
                <img
                  className="block h-4 w-4 object-contain"
                  src="/figma/otp/edit.svg"
                  alt=""
                  aria-hidden="true"
                />
                <span> را وارد نمایید.</span>
              </p>
            </div>

            <div
              className="grid w-full grid-cols-4 gap-2.5"
              dir="ltr"
              aria-label="کد تایید"
            >
              {verificationCodeSlots.map((slot, index) => (
                <label className="block min-w-0" key={index}>
                  <input
                    aria-invalid={notice?.variant === "error" ? "true" : undefined}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    className="h-12 w-full rounded-xl border border-[#cccccc] bg-white px-3 py-1 text-center text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a] focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)] min-[390px]:h-14"
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
                className="flex h-9 items-center justify-center gap-2 rounded-2xl bg-[#f5f5f5] px-6 text-sm font-medium leading-5 text-[#1a1a1a]"
                aria-live="polite"
              >
                <img
                  className="block h-5 w-5 object-contain"
                  src="/figma/otp/timer.svg"
                  alt=""
                  aria-hidden="true"
                />
                <span dir="ltr">{formatCountdownSeconds(resendSeconds)}</span>
              </div>
            ) : (
              <button
                className="flex h-9 cursor-pointer flex-row-reverse items-center justify-center gap-2 rounded-2xl bg-[#f5f5f5] px-6 text-sm font-medium leading-5 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isResending || isSubmitting}
                onClick={handleResend}
                type="button"
              >
                <span>{isResending ? "در حال ارسال..." : "دریافت مجدد کد"}</span>
                <img
                  className="block h-5 w-5 object-contain"
                  src="/figma/otp/resend-arrow.svg"
                  alt=""
                  aria-hidden="true"
                />
              </button>
            )}
          </section>
        </main>

        <footer className="shrink-0 bg-white px-4 py-3.5 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
          <button
            className="inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#0048c4] px-4 py-2.5 text-sm font-medium leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting || isResending}
            type="submit"
          >
            {isSubmitting ? "در حال تایید..." : "تایید"}
          </button>
        </footer>
      </form>
    </PageFrame>
  );
}

function formatCountdownSeconds(seconds: number) {
  return String(seconds).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}
