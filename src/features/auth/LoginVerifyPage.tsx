import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
} from "react";
import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { RouteLink } from "../../shared/navigation/RouteLink";
import { goBackOrNavigate } from "../../shared/navigation/navigation";
import LoginOTPbackground from "../../shared/assets/images/LoginOTPBackground.svg";
import { useResendOtpMutation, useVerifyOtpMutation } from "./api/auth.hooks";
import {
  getAuthErrorMessage,
  normalizeDigits,
  normalizeMobile,
} from "./api/auth.service";
import { getMyProfile } from "../account/api/account.service";
import { searchCities } from "../cities/api/city.service";
import {
  consumeLoginRedirectPath,
  getOtpResendSecondsRemaining,
  getPendingOtpMobile,
} from "../../shared/auth/auth-storage";
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

export function LoginVerifyPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isFocused, setIsFocused] = useState(true);
  const [notice, setNotice] = useState<{
    message: string;
    title: string;
    variant: "error" | "success" | "info" | "warning";
  } | null>(null);
  const [resendSeconds, setResendSeconds] = useState(getOtpResendSecondsRemaining);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const lastAutoSubmittedCodeRef = useRef("");
  const phoneNumber = getPendingOtpMobile();
  const verifyOtpMutation = useVerifyOtpMutation();
  const resendOtpMutation = useResendOtpMutation();
  const isSubmitting = verifyOtpMutation.isPending;
  const isResending = resendOtpMutation.isPending;

  const verificationCodeSlots = useMemo(
    () => [
      verificationCode[0] ?? "",
      verificationCode[1] ?? "",
      verificationCode[2] ?? "",
      verificationCode[3] ?? "",
    ],
    [verificationCode],
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (resendSeconds <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setResendSeconds(getOtpResendSecondsRemaining());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [resendSeconds]);

  // WebOTP API: Auto-read verification code from incoming SMS
  useEffect(() => {
    if (typeof window === "undefined" || !("OTPCredential" in window) || !navigator.credentials) {
      return;
    }

    const abortController = new AbortController();

    navigator.credentials
      .get({
        otp: { transport: ["sms"] },
        signal: abortController.signal,
      } as unknown as CredentialRequestOptions)
      .then((content: unknown) => {
        const code = (content as { code?: string })?.code;
        if (code) {
          const digits = normalizeDigits(code).replace(/\D/g, "").slice(0, 4);
          if (digits.length === 4) {
            setVerificationCode(digits);
          }
        }
      })
      .catch(() => {
        // Ignored when aborted or user dismisses
      });

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (verificationCode.length !== 4 || isSubmitting || isResending) return;
    if (lastAutoSubmittedCodeRef.current === verificationCode) return;

    lastAutoSubmittedCodeRef.current = verificationCode;
    const timerId = window.setTimeout(() => formRef.current?.requestSubmit(), 0);

    return () => window.clearTimeout(timerId);
  }, [isResending, isSubmitting, verificationCode]);

  function handleCodeChange(rawValue: string) {
    const digits = normalizeDigits(rawValue).replace(/\D/g, "").slice(0, 4);
    setNotice(null);
    setVerificationCode(digits);
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const digits = normalizeDigits(event.clipboardData.getData("text"))
      .replace(/\D/g, "")
      .slice(0, 4);

    if (digits) {
      event.preventDefault();
      handleCodeChange(digits);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const mobile = normalizeMobile(phoneNumber);
    const code = verificationCode;

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

      // Replace the OTP entry after a successful login so Back does not
      // return to the verification screen. The router also guards all auth
      // pages while a valid session exists.
      window.history.replaceState({ state: "new" }, "", redirectPath);
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
      setVerificationCode("");
      lastAutoSubmittedCodeRef.current = "";
      setResendSeconds(getOtpResendSecondsRemaining());
      inputRef.current?.focus();
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
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface"
      variant="flush"
    >
      <form className="contents" noValidate onSubmit={handleSubmit} ref={formRef}>
        <TopBar
          backTo="/account"
          onBack={() => goBackOrNavigate("/login/phone")}
          title="ورود به حساب کاربری"
        />

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-surface-container-lowest pt-4">
          <section
            className="flex min-h-[168px] flex-1 basis-0 items-center justify-center overflow-hidden rounded-br-3xl bg-surface-container-lowest"
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
                className="m-0 text-right font-semibold leading-5 text-on-surface min-[390px]:text-base min-[390px]:leading-6"
                id="login-verify-title"
              >
                ورود کد ارسالی
              </Typography>
              <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 flex w-full flex-wrap items-center justify-start gap-1.5 text-right text-sm font-normal leading-5 text-on-surface-var min-[390px]:gap-2 min-[390px]:text-sm">
                <Typography as="span" variant="body" size="medium" weight="regular">کد ارسال شده به </Typography>
                <RouteLink
                  dir="ltr"
                  className="font-medium text-primary underline underline-offset-3"
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
              className="relative mt-6 w-full"
              dir="ltr"
            >
              <input
                ref={inputRef}
                aria-invalid={notice?.variant === "error" ? "true" : undefined}
                aria-label="کد تایید چهار رقمی"
                autoComplete="one-time-code"
                autoFocus
                className="absolute inset-0 z-10 h-full w-full opacity-0 cursor-pointer text-transparent caret-transparent"
                inputMode="numeric"
                maxLength={4}
                name="one-time-code"
                onBlur={() => setIsFocused(false)}
                onChange={(event) => handleCodeChange(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onPaste={handlePaste}
                pattern="[0-9]*"
                type="text"
                value={verificationCode}
              />

              <div
                aria-hidden="true"
                className="grid w-full grid-cols-4 gap-2.5 pointer-events-none"
              >
                {verificationCodeSlots.map((slot, index) => {
                  const isActive =
                    isFocused &&
                    (index === verificationCode.length ||
                      (index === 3 && verificationCode.length === 4));

                  return (
                    <div
                      key={index}
                      className={`flex h-14 w-full items-center justify-center rounded-xl border bg-surface-container-lowest px-3 py-1 text-center !text-[22px] font-medium leading-none text-on-surface transition-colors min-[390px]:h-14 ${
                        notice?.variant === "error"
                          ? "border-error"
                          : isActive
                            ? "border-primary shadow-[0_0_0_3px_var(--color-primary-container)]"
                            : "border-outline-var"
                      }`}
                    >
                      {slot || (
                        <span className="text-sm font-normal text-outline">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {resendSeconds > 0 ? (
              <div
                className="flex py-2 px-6 items-center justify-center gap-2 mt-12 rounded-2xl bg-surface-container text-sm font-medium leading-5 text-on-surface"
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
                className="flex py-2 px-6 cursor-pointer flex-row-reverse items-center mt-12 justify-center gap-2 rounded-2xl bg-surface-container px-6 text-sm font-medium leading-5 text-on-surface focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isResending || isSubmitting}
                onClick={handleResend}
                type="button"
              >
                <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium">{isResending ? "در حال ارسال..." : "دریافت مجدد کد"}</Typography>
                <LinearArrowRight2 className="w-5 h-5 text-on-surface-var" />
              </Button>
            )}
          </section>
        </main>

        <footer className="shrink-0 bg-surface-container-lowest px-4 py-3.5 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
          <Button unstyled
            className="inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center rounded-[10px] bg-primary px-4 py-2.5 text-sm font-medium leading-5 text-on-primary focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
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
