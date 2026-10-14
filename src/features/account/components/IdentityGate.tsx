import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

import { isUserIdentityVerified } from "../api/account.service";
import { useProfileStore } from "../stores/useProfileStore";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import LinearUserAccount from "../../../shared/icons/LinearUserAccount";

function IdentityRequiredIcon() {
  return (
    <div className="relative mb-6 grid h-16.5 w-16.5 place-items-center">
      <img src="/vectors/NotAuthorize.svg" alt="" />
    </div>
  );
}

function IdentityRequiredPage({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account" title={title} />
      <main className="bg-surface-container-lowest flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
        <IdentityRequiredIcon />
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface m-0 text-base leading-6 font-bold"
        >
          احراز هویت مورد نیاز است!
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var m-0 mt-2 max-w-[310px] text-sm leading-6 font-normal"
        >
          برای دسترسی به این بخش، ابتدا باید احراز هویت خود را تکمیل کنید. احراز هویت به افزایش
          امنیت حساب کاربری و فعال‌سازی امکانات سامانه کمک می‌کند.
        </Typography>
        <Button
          unstyled
          className="bg-primary text-on-primary mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm leading-5 font-semibold"
          onClick={() => navigate("/account/identity?required=1")}
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
  loadingFallback?: ReactNode;
  title: string;
};

export function IdentityGate({ children, loadingFallback, title }: IdentityGateProps) {
  const profile = useProfileStore((state) => state.profile);
  const isInitialized = useProfileStore((state) => state.isInitialized);
  const isLoading = useProfileStore((state) => state.isLoading);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      void fetchProfile();
    }
  }, [isInitialized, isLoading, fetchProfile]);

  if (!isInitialized)
    return loadingFallback ?? <div className="bg-surface-container min-h-0 flex-1" />;
  if (!isUserIdentityVerified(profile)) return <IdentityRequiredPage title={title} />;

  return children;
}
