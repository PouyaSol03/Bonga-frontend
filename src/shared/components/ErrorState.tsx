import { useState, type ComponentType, type ReactNode } from "react";

import { ApiError } from "../api/api";
import NoConnectionIcon from "../assets/icons/NoConnection.svg";
import ServerErrorIcon from "../assets/icons/ServerError.svg";
import RefreshIcon from "../assets/icons/RefreshIcon.svg";
import NotFoundIcon from "../assets/icons/404Error.svg";
import LinearArrowRight1 from "../icons/LinearArrowRight1";
import { Typography } from "../ui/Typography";
import { Button } from "../ui/Button";

type RetryHandler = () => void | Promise<void>;

type BaseErrorStateProps = {
  icon: string;
  title: string;
  description: ReactNode;
  retryLabel?: string;
  onRetry?: RetryHandler;
  className?: string;
  iconClassName?: string;
};

function BaseErrorState({
  icon,
  title,
  description,
  retryLabel = "تلاش مجدد",
  onRetry,
  className = "",
  iconClassName = "h-[66px] w-[66px]",
}: BaseErrorStateProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;

    try {
      setIsRetrying(true);
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div
      dir="rtl"
      className={`bg-surface-container-lowest mx-auto flex h-full min-h-0 w-full items-center justify-center px-6 ${className}`}
    >
      <div className="mx-auto flex w-full max-w-[320px] flex-col items-center text-center">
        <img src={icon} alt="" className={`mb-4 object-contain ${iconClassName}`} />

        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface mb-2"
        >
          {title}
        </Typography>

        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var mb-6"
        >
          {description}
        </Typography>

        {onRetry ? (
          <Button
            unstyled
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-primary text-on-primary inline-flex h-10 min-w-[124px] items-center justify-center gap-2 rounded-[10px] px-5 text-[14px] font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {!isRetrying && <img src={RefreshIcon} alt="" className="h-5 w-5 object-contain" />}

            <Typography as="span" variant="body" size="medium" weight="regular">
              {isRetrying ? "در حال تلاش..." : retryLabel}
            </Typography>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

type ErrorStateProps = {
  onRetry?: RetryHandler;
  className?: string;
};

/**
 * Only a device that is actually offline counts as "no connection". Server
 * errors, cancelled or aborted requests, timeouts, unreachable servers and
 * unknown failures all mean the server could not answer, so they show the
 * server error state instead.
 */
export function isNoConnectionError(error: unknown) {
  if (error instanceof ApiError) return false;

  return typeof navigator !== "undefined" && navigator.onLine === false;
}

export function RequestErrorState({
  error,
  onRetry,
  className,
}: ErrorStateProps & { error?: unknown }) {
  const isNoConnection = isNoConnectionError(error);
  if (isNoConnection) {
    return <NoConnectionState onRetry={onRetry} className={className} />;
  }
  return <ServerErrorState onRetry={onRetry} className={className} />;
}

export function getRequestErrorState(error: unknown): ComponentType<ErrorStateProps> {
  return isNoConnectionError(error) ? NoConnectionState : ServerErrorState;
}

export function NoConnectionState({ onRetry, className }: ErrorStateProps) {
  return (
    <BaseErrorState
      icon={NoConnectionIcon}
      title="اتصال برقرار نیست!"
      description="برای ادامه، اینترنت خود را بررسی کنید."
      onRetry={onRetry}
      className={className}
    />
  );
}

export function ServerErrorState({ onRetry, className }: ErrorStateProps) {
  return (
    <BaseErrorState
      icon={ServerErrorIcon}
      title="مشکلی پیش آمده است!"
      description="لطفاً چند لحظه دیگر دوباره تلاش کنید."
      onRetry={onRetry}
      className={className}
    />
  );
}

export function NotFoundErrorState({ onRetry, className }: ErrorStateProps) {
  return (
    <BaseErrorState
      icon={NotFoundIcon}
      title="صفحه پیدا نشد!"
      description={
        <>
          محتوایی که به دنبال آن هستید
          <br />
          در دسترس نیست.
        </>
      }
      onRetry={onRetry}
      className={className}
      iconClassName="h-[101px] w-[151.5px]"
    />
  );
}

function AccessDeniedIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[66px] w-[66px]"
      fill="none"
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M33 4.5 54 12v16.2c0 14.5-8.8 25.2-21 32.1C20.8 53.4 12 42.7 12 28.2V12l21-7.5Z"
        fill="currentColor"
        className="text-secondary-container"
      />
      <path
        d="M25.5 29.5v-4.2a7.5 7.5 0 0 1 15 0v4.2"
        stroke="var(--color-surface-container-lowest)"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <rect
        x="21"
        y="28"
        width="24"
        height="17"
        rx="3"
        fill="var(--color-surface-container-lowest)"
      />
    </svg>
  );
}

export function AccessDeniedState({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="bg-surface-container-lowest mx-auto flex h-full min-h-0 w-full items-center justify-center px-6"
      dir="rtl"
    >
      <div className="mx-auto flex w-full max-w-[320px] flex-col items-center text-center">
        <div className="mb-6">
          <AccessDeniedIcon />
        </div>

        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface m-0 text-base leading-6 font-semibold"
        >
          دسترسی به این بخش امکان‌پذیر نیست
        </Typography>

        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var m-0 mt-2 text-sm leading-6"
        >
          شما مجوز استفاده از این بخش را ندارید.
          <br />
          در صورت نیاز، با حساب کاربری دارای دسترسی مناسب وارد شوید یا از مدیر سامانه درخواست دسترسی
          کنید.
        </Typography>

        <Button
          unstyled
          className="bg-primary text-on-primary mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-medium transition"
          onClick={onBack}
          type="button"
        >
          <LinearArrowRight1 className="h-5 w-5" />
          <Typography as="span" variant="body" size="medium" weight="regular">
            بازگشت
          </Typography>
        </Button>
      </div>
    </div>
  );
}
