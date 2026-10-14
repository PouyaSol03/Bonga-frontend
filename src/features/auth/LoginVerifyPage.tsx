import { useEffect, useMemo, useRef, useState, type ClipboardEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import LoginOTPbackground from "../../shared/assets/images/LoginOTPBackground.svg";
import { useResendOtpMutation, useVerifyOtpMutation } from "./api/auth.hooks";
import { getAuthErrorMessage, normalizeDigits, normalizeMobile } from "./api/auth.service";
import { getMyProfile } from "../account/api/account.service";
import { useProfileStore } from "../account/stores/useProfileStore";
import { searchCities } from "../cities/api/city.service";
import { useToast } from "../../shared/hooks/useToast";
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
  const hasStoredCity = Boolean(window.localStorage.getItem(selectedCityStorageKeys.name)?.trim());

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
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const { showToast } = useToast();
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
          const rawMatch = normalizeDigits(code).match(/\d{4,6}/);
          const digits = (rawMatch ? rawMatch[0] : normalizeDigits(code).replace(/\D/g, "")).slice(
            0,
            4,
          );
          if (digits.length === 4) {
            handleCodeChange(digits);
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
      showToast("ابتدا شماره موبایل خود را وارد کنید.", "شماره همراه یافت نشد!", "error");
      setNotice({
        message: "ابتدا شماره موبایل خود را وارد کنید.",
        title: "شماره همراه یافت نشد!",
        variant: "error",
      });
      return;
    }

    if (!/^\d{4}$/.test(code)) {
      showToast("کد تایید چهار رقمی را وارد کنید.", "کد نامعتبر!", "error");
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
        const userProfile = await getMyProfile();
        useProfileStore.getState().setProfile(userProfile);
      } catch (profileError) {
        const msg = getAuthErrorMessage(profileError, "دریافت وضعیت احراز هویت با خطا مواجه شد.");
        showToast(msg, "بررسی حساب ناموفق بود!", "error");
        setNotice({
          message: msg,
          title: "بررسی حساب ناموفق بود!",
          variant: "error",
        });
        return;
      }

      await ensureSelectedCityAfterLogin();
      showToast("ورود به حساب کاربری با موفقیت انجام شد.", "خوش آمدید", "success");

      // Replace the OTP entry after a successful login so Back does not
      // return to the verification screen. The router also guards all auth
      // pages while a valid session exists.
      navigate(redirectPath, { replace: true, state: { state: "new" } });
    } catch (error) {
      const msg = getAuthErrorMessage(error, "تایید کد انجام نشد.");
      showToast(msg, "کد نامعتبر!", "error");
      setNotice({
        message: msg,
        title: "کد نامعتبر!",
        variant: "error",
      });
    }
  }

  async function handleResend() {
    const mobile = normalizeMobile(phoneNumber);

    if (!mobile) {
      showToast("ابتدا شماره موبایل خود را وارد کنید.", "شماره همراه یافت نشد!", "error");
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
      showToast("کد تایید مجددا به شماره همراه شما ارسال شد.", "کد ارسال شد.", "success");
      setNotice({
        message: "کد تایید مجددا به شماره همراه شما ارسال شد.",
        title: "کد ارسال شد.",
        variant: "success",
      });
    } catch (error) {
      const msg = getAuthErrorMessage(error, "ارسال مجدد کد انجام نشد.");
      showToast(msg, "ارسال کد ناموفق!", "error");
      setNotice({
        message: msg,
        title: "ارسال کد ناموفق!",
        variant: "error",
      });
    }
  }

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden"
      variant="flush"
    >
      <form className="contents" noValidate onSubmit={handleSubmit} ref={formRef}>
        <TopBar
          backTo="/account"
          onBack={() => {
            if (window.history.state?.idx > 0) navigate(-1);
            else navigate("/login/phone", { replace: true });
          }}
          title="ورود به حساب کاربری"
        />

        <main className="bg-surface-container-lowest flex min-h-0 flex-1 flex-col overflow-y-auto pt-4">
          <section
            className="bg-surface-container-lowest flex min-h-[168px] flex-1 basis-0 items-center justify-center overflow-hidden rounded-br-3xl"
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
              <Typography
                as="h2"
                variant="title"
                size="medium"
                weight="semibold"
                className="text-on-surface m-0 text-right leading-5 font-semibold min-[390px]:text-base min-[390px]:leading-6"
                id="login-verify-title"
              >
                ورود کد ارسالی
              </Typography>
              <Typography
                as="p"
                variant="body"
                size="medium"
                weight="regular"
                className="text-on-surface-var m-0 flex w-full flex-wrap items-center justify-start gap-1.5 text-right text-sm leading-5 font-normal min-[390px]:gap-2 min-[390px]:text-sm"
              >
                <Typography as="span" variant="body" size="medium" weight="regular">
                  کد ارسال شده به{" "}
                </Typography>
                <Link
                  dir="ltr"
                  className="text-primary font-medium underline underline-offset-3"
                  to="/login/phone"
                >
                  {phoneNumber}
                </Link>
                <img
                  className="block h-3 w-3 object-contain"
                  src="/figma/otp/edit.svg"
                  alt=""
                  aria-hidden="true"
                />
                <Typography as="span" variant="body" size="medium" weight="regular">
                  {" "}
                  را وارد نمایید.
                </Typography>
              </Typography>
            </div>

            <div className="relative mt-6 w-full" dir="ltr">
              <input
                ref={inputRef}
                aria-invalid={notice?.variant === "error" ? "true" : undefined}
                aria-label="کد تایید چهار رقمی"
                autoComplete="one-time-code"
                autoFocus
                className="absolute inset-0 z-10 h-full w-full cursor-pointer text-transparent caret-transparent opacity-0"
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
                className="pointer-events-none grid w-full grid-cols-4 gap-2.5"
              >
                {verificationCodeSlots.map((slot, index) => {
                  const isActive =
                    isFocused &&
                    (index === verificationCode.length ||
                      (index === 3 && verificationCode.length === 4));

                  return (
                    <div
                      key={index}
                      className={`bg-surface-container-lowest text-on-surface flex h-14 w-full items-center justify-center rounded-xl border px-3 py-1 text-center !text-[22px] leading-none font-medium transition-colors min-[390px]:h-14 ${
                        notice?.variant === "error"
                          ? "border-error"
                          : isActive
                            ? "border-primary shadow-[0_0_0_3px_var(--color-primary-container)]"
                            : "border-outline-var"
                      }`}
                    >
                      {slot || <span className="text-outline text-sm font-normal">-</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {resendSeconds > 0 ? (
              <div
                className="bg-surface-container text-on-surface mt-12 flex items-center justify-center gap-2 rounded-2xl px-6 py-2 text-sm leading-5 font-medium"
                aria-live="polite"
              >
                <Typography as="span" variant="body" size="medium" weight="regular" dir="ltr">
                  {formatCountdownSeconds(resendSeconds)}
                </Typography>
                <img
                  className="block h-4 w-4 object-contain"
                  src="/figma/otp/timer.svg"
                  alt=""
                  aria-hidden="true"
                />
              </div>
            ) : (
              <Button
                unstyled
                className="bg-surface-container text-on-surface focus-visible:outline-primary/40 mt-12 flex cursor-pointer flex-row-reverse items-center justify-center gap-2 rounded-2xl px-6 py-2 text-sm leading-5 font-medium focus-visible:outline-3 focus-visible:outline-offset-[-3px] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isResending || isSubmitting}
                onClick={handleResend}
                type="button"
              >
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="medium"
                  className="text-sm font-medium"
                >
                  {isResending ? "در حال ارسال..." : "دریافت مجدد کد"}
                </Typography>
                <LinearArrowRight2 className="text-on-surface-var h-5 w-5" />
              </Button>
            )}
          </section>
        </main>

        <footer className="bg-surface-container-lowest shrink-0 px-4 py-3.5 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
          <Button
            unstyled
            className="bg-primary text-on-primary focus-visible:outline-primary/40 inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center rounded-[10px] px-4 py-2.5 text-sm leading-5 font-medium focus-visible:outline-3 focus-visible:outline-offset-[-3px] disabled:cursor-not-allowed disabled:opacity-60"
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
