import { useEffect } from "react";

import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import {
  getStoredAuthSession,
  storeLoginRedirectPath,
} from "../../shared/auth/auth-storage";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

const defaultReturnPath = "/home";

function navigateTo(path: string, replace = false) {
  if (replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }

  window.dispatchEvent(new PopStateEvent("popstate"));
}

function getSafeReturnPath() {
  const params = new URLSearchParams(window.location.search);
  const returnTo = params.get("returnTo") || "";

  if (
    returnTo.startsWith("/") &&
    !returnTo.startsWith("/login") &&
    !returnTo.startsWith("/login-required")
  ) {
    return returnTo;
  }

  return defaultReturnPath;
}

function goBackOrNavigate(fallbackPath: string) {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  navigateTo(fallbackPath);
}

export function LoginRequiredPage() {
  const returnTo = getSafeReturnPath();

  useEffect(() => {
    if (getStoredAuthSession()) {
      navigateTo(returnTo, true);
    }
  }, [returnTo]);

  const handleLogin = () => {
    storeLoginRedirectPath(returnTo);
    navigateTo("/login/phone");
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={returnTo}
        onBack={() => goBackOrNavigate(returnTo)}
        title=""
      />

      <main className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-white px-4">
        <section
          aria-labelledby="login-required-title"
          className="relative max-h-full max-w-full flex flex-col items-center gap-y-4"
        >
          <img src="./vectors/LockIcon.svg" alt=""/>
          <div className="flex flex-col gap-y-2 items-center">

          <Typography as="h2" variant="headline" size="large" className="font-semibold ">دسترسی محدود!</Typography>
          <Typography as="p" variant="body" size="medium" weight="regular" className="font-normal text-sm text-[#4D4D4D] text-center">
            این قابلیت فقط برای کاربران ثبت‌نام‌شده <br/>
            در دسترس است.
          </Typography>
          </div>
          <Button unstyled
            className="text-sm font-medium text-white bg-[#0048C4] py-2.5 px-4 rounded-xl"
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
