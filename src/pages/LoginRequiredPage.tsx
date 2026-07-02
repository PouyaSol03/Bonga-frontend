import { useEffect } from "react";

import { PageFrame } from "../app/PageFrame";
import { TopBar } from "../components/TopBar";
import {
  getStoredAuthSession,
  storeLoginRedirectPath,
} from "../auth/auth-storage";

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
          className="relative max-h-full max-w-full"
        >
          <img src="./vectors/LockIcon.svg" alt="" />
          <h2 className="font-semibold">دسترسی محدود!</h2>
          <p className="font-normal text-sm">
            این قابلیت فقط برای کاربران ثبت‌نام‌شده
            در دسترس است.
          </p>
        </section>
      </main>
    </PageFrame>
  );
}
