import { useEffect, useMemo, useState } from "react";

import { getApiErrorMessage } from "../api/api";
import { PageFrame } from "../app/PageFrame";
import { useVerifyPaymentCallbackMutation } from "../hooks/account.hooks";
import { replaceRoute } from "../routes/navigation";

type VerifyState = "checking" | "failed" | "success";

function readCallbackParameters() {
  const params = new URLSearchParams(window.location.search);

  return {
    authority: (params.get("Authority") ?? params.get("authority") ?? "").trim(),
    status: (params.get("Status") ?? params.get("status") ?? "").trim(),
  };
}

export function PaymentVerifyPage() {
  const callback = useVerifyPaymentCallbackMutation();
  const parameters = useMemo(readCallbackParameters, []);
  const [detail, setDetail] = useState("");
  const [verifyState, setVerifyState] = useState<VerifyState>("checking");

  useEffect(() => {
    if (!parameters.authority || !parameters.status) {
      setDetail("اطلاعات بازگشت از درگاه کامل نیست.");
      setVerifyState("failed");
      return;
    }

    callback.mutate(
      {
        Authority: parameters.authority,
        Status: parameters.status,
      },
      {
        onError: (error) => {
          setDetail(
            getApiErrorMessage(
              error,
              "بررسی نتیجه پرداخت با خطا مواجه شد. دوباره به کیف پول برگردید.",
            ),
          );
          setVerifyState("failed");
        },
        onSuccess: ({ success }) => {
          if (success) {
            setDetail("مبلغ پرداخت‌شده با موفقیت به اعتبار کیف پول شما اضافه شد.");
            setVerifyState("success");
            return;
          }

          setDetail("پرداخت تکمیل نشد و مبلغی به کیف پول شما اضافه نشده است.");
          setVerifyState("failed");
        },
      },
    );
  }, [parameters.authority, parameters.status]);

  const isChecking = verifyState === "checking";
  const isSuccess = verifyState === "success";

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f6f8fc] px-5 text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-8 text-center">
        <div
          className={`grid h-24 w-24 place-items-center rounded-full ${
            isChecking
              ? "bg-[#e8efff] text-[#0048c4]"
              : isSuccess
                ? "bg-[#eaf8f2] text-[#11a366]"
                : "bg-[#fff1ef] text-[#e13b2d]"
          }`}
        >
          {isChecking ? <LoadingIcon /> : isSuccess ? <SuccessIcon /> : <FailedIcon />}
        </div>

        <h1 className="m-0 mt-6 text-xl font-bold leading-8">
          {isChecking ? "در حال بررسی پرداخت" : isSuccess ? "پرداخت موفق" : "پرداخت ناموفق"}
        </h1>

        <p className="m-0 mt-3 max-w-[330px] text-sm font-normal leading-7 text-[#666666]">
          {isChecking
            ? "لطفاً این صفحه را نبندید؛ نتیجه پرداخت در حال ثبت و بررسی است."
            : detail}
        </p>

        {!isChecking ? (
          <button
            className="mt-8 h-11 w-full max-w-[340px] rounded-xl bg-[#0048c4] px-5 text-sm font-semibold leading-5 text-white"
            onClick={() =>
              replaceRoute("/account/wallet", undefined, { rememberCurrent: false })
            }
            type="button"
          >
            بازگشت به کیف پول
          </button>
        ) : null}
      </main>
    </PageFrame>
  );
}

function LoadingIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-12 w-12 animate-spin"
      fill="none"
      viewBox="0 0 48 48"
    >
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" />
      <path d="M42 24A18 18 0 0 0 24 6" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg aria-hidden="true" className="h-13 w-13" fill="none" viewBox="0 0 52 52">
      <path d="m15 27 7 7 15-17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  );
}

function FailedIcon() {
  return (
    <svg aria-hidden="true" className="h-13 w-13" fill="none" viewBox="0 0 52 52">
      <path d="m18 18 16 16m0-16L18 34" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}
