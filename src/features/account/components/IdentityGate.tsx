import type { ReactNode } from "react";

import { isUserIdentityVerified } from "../api/account.service";
import { useMyProfileQuery } from "../api/account.hooks";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import LinearUserAccount from "../../../shared/icons/LinearUserAccount";

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function IdentityRequiredIcon() {
  return (
    <div className="relative mb-6 grid h-16.5 w-16.5 place-items-center">
      <img src="/vectors/NotAuthorize.svg" alt="" />
    </div>
  );
}

function IdentityRequiredPage({ title }: { title: string }) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account" title={title} />
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center bg-white px-6 pb-20 text-center">
        <IdentityRequiredIcon />
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-bold leading-6 text-[#1a1a1a]">
          احراز هویت مورد نیاز است!
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 max-w-[310px] text-sm font-normal leading-6 text-[#4d4d4d]">
          برای دسترسی به این بخش، ابتدا باید احراز هویت خود را تکمیل کنید. احراز هویت به افزایش امنیت حساب کاربری و فعال‌سازی امکانات سامانه کمک می‌کند.
        </Typography>
        <Button
          unstyled
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0048c4] px-4 text-sm font-semibold leading-5 text-white"
          onClick={() => navigateTo("/account/identity?required=1")}
          type="button"
        >
          <LinearUserAccount className="h-5 w-5" />
          <Typography as="span" variant="body" size="medium" weight="regular">
            تکمیل احراز هویت
          </Typography>
        </Button>
      </main>
    </PageFrame>
  );
}

type IdentityGateProps = {
  children: ReactNode;
  loadingFallback: ReactNode;
  title: string;
};

export function IdentityGate({ children, loadingFallback, title }: IdentityGateProps) {
  const { data: profile, isLoading: isProfileLoading } = useMyProfileQuery({
    enabled: true,
  });

  if (isProfileLoading) return loadingFallback;
  if (!isUserIdentityVerified(profile)) return <IdentityRequiredPage title={title} />;

  return children;
}
