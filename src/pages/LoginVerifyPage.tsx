import { useState } from "react";
import { PageFrame } from "../app/PageFrame";
import ArrowRight from "../assets/icons/ArrowRight";
import { TopBar } from "../components/TopBar";
import { RouteLink } from "../routes/RouteLink";
import LoginOTPbackground from "../assets/images/LoginOTPBackground.svg";

export function LoginVerifyPage() {
  const [verificationCodeSlots, setVerificationCodeSlots] = useState(["", "", "", ""]);
  const phoneNumber = window.sessionStorage.getItem("bonga-phone-number") ?? "09155214062";

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <TopBar backTo="/login" title="ورود به حساب کاربری" />

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
              <label className="block min-w-0" key={`${slot}-${index}`}>
                <input
                  className="h-12 w-full rounded-xl border border-[#cccccc] bg-white px-3 py-1 text-center text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a] focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)] min-[390px]:h-14"
                  aria-label={`رقم ${index + 1}`}
                  inputMode="numeric"
                  maxLength={1}
                  placeholder="-"
                  type="text"
                  value={slot}
                  onChange={(event) => {
                    const nextValue = event.target.value.replace(/\D/g, "").slice(-1);
                    setVerificationCodeSlots((current) =>
                      current.map((value, currentIndex) =>
                        currentIndex === index ? nextValue : value,
                      ),
                    );
                  }}
                />
              </label>
            ))}
          </div>

          <button
            className="flex cursor-pointer flex-row-reverse items-center justify-center gap-2 rounded-2xl bg-[#f5f5f5] px-4 py-2 text-xs font-medium leading-5 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] min-[390px]:px-6 min-[390px]:text-sm"
            onClick={() => setVerificationCodeSlots(["1", "2", "3", "4"])}
            type="button"
          >
            <span>دریافت مجدد کد</span>
            <ArrowRight />
          </button>
        </section>
      </main>

      <footer className="shrink-0 bg-white px-4 py-3.5 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <RouteLink
          className="inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#0048c4] px-4 py-2.5 text-sm font-medium leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
          onClick={() => {
            window.sessionStorage.setItem("bonga-account-state", "logged-in-unverified");
          }}
          state={{ state: "new" }}
          to="/login"
        >
          تایید
        </RouteLink>
      </footer>
    </PageFrame>
  );
}
