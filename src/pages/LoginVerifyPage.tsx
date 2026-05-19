import { PageFrame } from "../app/PageFrame";
import ArrowRight from "../assets/icons/ArrowRight";
import { RouteLink } from "../routes/RouteLink";
import LoginOTPbackground from "../assets/images/LoginOTPBackground.svg";

const verificationCodeSlots = ["-", "-", "-", "-"];
const canResendOtp = true;

export function LoginVerifyPage() {
  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <header className="sticky top-0 z-10 shrink-0 bg-[#f0f0f0]">
        <div className="w-full flex justify-start items-center">
          <RouteLink
            className="col-start-1 grid h-10 w-10 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] min-[390px]:h-12 min-[390px]:w-12"
            to="/login"
            aria-label="بازگشت"
          >
            <ArrowRight />
          </RouteLink>
          <h1 className="col-start-2 m-0 justify-self-center whitespace-nowrap text-center text-sm font-semibold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6">
            ورود به حساب کاربری
          </h1>
        </div>
      </header>

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
              <a
                dir="ltr"
                className="font-medium text-[#0048c4] underline underline-offset-3"
                href="#edit-phone"
              >
                0915 521 4062
              </a>
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
                  placeholder={slot}
                  type="text"
                />
              </label>
            ))}
          </div>

          {canResendOtp ? (
            <button
              className="flex cursor-pointer flex-row-reverse items-center justify-center gap-2 rounded-2xl bg-[#f5f5f5] px-4 py-2 text-xs font-medium leading-5 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] min-[390px]:px-6 min-[390px]:text-sm"
              type="button"
            >
              <span>دریافت مجدد کد</span>
              <ArrowRight />
            </button>
          ) : (
            <div
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#f5f5f5] px-4 py-2 text-xs font-medium leading-5 text-[#1a1a1a] min-[390px]:px-6 min-[390px]:text-sm"
              aria-label="زمان باقی مانده"
            >
              <img
                className="block h-5 w-5"
                src="/figma/otp/timer.svg"
                alt=""
                aria-hidden="true"
              />
              <span>54</span>
            </div>
          )}
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
