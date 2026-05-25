import { useState } from "react";
import { PageFrame } from "../app/PageFrame";
import { TopBar } from "../components/TopBar";
import { RouteLink } from "../routes/RouteLink";
import LoginPhoneBackground from "../assets/images/LoginPhoneBackground.svg";

export function LoginPhonePage() {
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <TopBar backTo="/login" title="ورود به حساب کاربری" />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white pt-4">
        <section
          className="flex min-h-[168px] flex-1 basis-0 items-center justify-center overflow-hidden p-3 min-[390px]:min-h-60 min-[390px]:p-4"
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
          className="flex min-h-0 flex-1 basis-0 flex-col items-start gap-3 overflow-hidden px-4 pb-3 min-[390px]:gap-4 min-[390px]:px-6 min-[390px]:pb-4"
          aria-labelledby="login-phone-title"
        >
          <h2
            className="m-0 text-right text-sm font-semibold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6"
            id="login-phone-title"
          >
            شماره موبایل خود را وارد کنید
          </h2>
          <p className="m-0 w-full text-right text-xs font-normal leading-5 text-[#4d4d4d] min-[390px]:text-sm">
            برای استفاده از تمام امکانات وارد حساب کاربری خود شوید.
          </p>

          <label className="block w-full" htmlFor="mobileNumber">
            <input
              className="h-12 w-full rounded-xl border border-[#cccccc] bg-white px-3 py-1 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a] focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)] min-[390px]:h-14"
              id="mobileNumber"
              inputMode="tel"
              placeholder="شماره همراه"
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </label>

          <p className="flex max-w-full flex-wrap items-center justify-start py-1 text-[11px] font-normal leading-5 min-[390px]:text-xs">
            <span>با ثبت‌نام، </span>
            <RouteLink
              className="text-[#0048c4] underline underline-offset-3"
              to="/"
            >
              قوانین ایران شناسا
            </RouteLink>
            <span> را می‌پذیرم!</span>
          </p>
        </section>
      </main>

      <footer className="shrink-0 bg-white px-4 py-3.5 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <RouteLink
          className="inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#0048c4] px-4 py-2.5 text-sm font-medium leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
          onClick={() => {
            window.sessionStorage.setItem(
              "bonga-phone-number",
              phoneNumber.trim() || "09155214062",
            );
          }}
          to="/login/verify"
        >
          تایید
        </RouteLink>
      </footer>
    </PageFrame>
  );
}
