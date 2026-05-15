import { PageFrame } from "../app/PageFrame";
import { RouteLink } from "../routes/RouteLink";
import LoginPhoneBackground from "../assets/images/LoginPhoneBackground.svg";
import ArrowRight from "../assets/icons/ArrowRight";

export function LoginPhonePage() {
  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <header className="sticky top-0 z-10 shrink-0 bg-[#f0f0f0]">
        <div className="w-full flex justify-start items-center">
          <RouteLink
            className="col-start-1 grid h-12 w-12 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
            to="/login"
            aria-label="بازگشت"
          >
            <ArrowRight />
          </RouteLink>
          <h1 className="col-start-2 m-0 justify-self-center whitespace-nowrap text-center text-base font-semibold leading-6 text-[#1a1a1a]">
            ورود به حساب کاربری
          </h1>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white pt-4">
        <section
          className="flex min-h-60 flex-1 basis-0 items-center justify-center overflow-hidden p-4"
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
          className="flex min-h-0 flex-1 basis-0 flex-col items-start gap-4 overflow-hidden px-6 pb-4"
          aria-labelledby="login-phone-title"
        >
          <h2
            className="m-0 text-right text-base font-semibold leading-6 text-[#1a1a1a]"
            id="login-phone-title"
          >
            شماره موبایل خود را وارد کنید
          </h2>
          <p className="m-0 w-full text-right text-sm font-normal leading-5 text-[#4d4d4d]">
            برای استفاده از تمام امکانات وارد حساب کاربری خود شوید.
          </p>

          <label className="block w-full" htmlFor="mobileNumber">
            <input
              className="h-14 w-full rounded-xl border border-[#cccccc] bg-white px-3 py-1 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a] focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)]"
              id="mobileNumber"
              inputMode="tel"
              placeholder="شماره همراه"
              type="tel"
            />
          </label>

          <p className="flex max-w-full items-center justify-start whitespace-nowrap py-1 text-sm font-normal leading-5">
            <span>با ثبت‌نام، </span>
            <a
              className="text-[#0048c4] underline underline-offset-3"
              href="#terms"
            >
              قوانین ایران شناسا
            </a>
            <span> را می‌پذیرم!</span>
          </p>
        </section>
      </main>

      <footer className="shrink-0 bg-white px-4 py-3.5 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <RouteLink
          className="inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#0048c4] px-4 py-2.5 text-sm font-medium leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
          to="/login/verify"
        >
          تایید
        </RouteLink>
      </footer>
    </PageFrame>
  );
}
