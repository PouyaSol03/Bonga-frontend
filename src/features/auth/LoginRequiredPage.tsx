import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import {
  getStoredAuthSession,
  storeLoginRedirectPath,
} from "../../shared/auth/auth-storage";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

const defaultReturnPath = "/home";

export function LoginRequiredPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rawReturnTo = searchParams.get("returnTo") || "";
  const returnTo =
    rawReturnTo.startsWith("/") &&
    !rawReturnTo.startsWith("/login") &&
    !rawReturnTo.startsWith("/login-required")
      ? rawReturnTo
      : defaultReturnPath;

  useEffect(() => {
    if (getStoredAuthSession()) {
      navigate(returnTo, { replace: true });
    }
  }, [navigate, returnTo]);

  const handleLogin = () => {
    storeLoginRedirectPath(returnTo);
    navigate("/login/phone");
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={returnTo}
        onBack={() => {
          if (window.history.state?.idx > 0) {
            navigate(-1);
          } else {
            navigate(returnTo, { replace: true });
          }
        }}
        title=""
      />

      <main className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-surface-container-lowest px-4">
        <section
          aria-labelledby="login-required-title"
          className="relative max-h-full max-w-full flex flex-col items-center gap-y-4"
        >
          <img src="./vectors/LockIcon.svg" alt=""/>
          <div className="flex flex-col gap-y-2 items-center">

          <Typography as="h2" variant="title" size="medium" weight="semibold">دسترسی محدود!</Typography>
          <Typography as="p" variant="body" size="medium" weight="regular" className="font-normal text-sm text-on-surface-var text-center">
            این قابلیت فقط برای کاربران ثبت‌نام‌شده <br/>
            در دسترس است.
          </Typography>
          </div>
          <Button unstyled
            className="text-sm font-medium text-on-primary bg-primary py-2.5 px-4 rounded-xl"
            onClick={handleLogin}
            type="button"
          >
            ثبت نام
          </Button>
        </section>
      </main>
    </PageFrame>
  );
}
