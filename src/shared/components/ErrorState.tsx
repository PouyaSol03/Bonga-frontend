import { useState, type ComponentType, type ReactNode } from "react";

import { ApiError } from "../../core/api/api";
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
            className={`flex h-full min-h-0 w-full items-center justify-center bg-white px-6 ${className}`}
        >
            <div className="flex w-full max-w-[320px] -translate-y-10 flex-col items-center text-center">
                <img
                    src={icon}
                    alt=""
                    className={`mb-4 object-contain ${iconClassName}`}
                />

                <Typography as="h2" variant="title" size="medium" weight="semibold" className="mb-2 text-[#1A1A1A]">
                    {title}
                </Typography>

                <Typography as="p" variant="body" size="medium" weight="regular" className="mb-6 text-[#4D4D4D]">
                    {description}
                </Typography>

                {onRetry ? <Button unstyled
                    type="button"
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="
            inline-flex h-10 min-w-[124px] items-center justify-center gap-2 rounded-[10px]
            bg-[#0048C4] px-5 text-[14px] font-medium text-white
            transition hover:bg-[#003FAE]
            disabled:cursor-not-allowed disabled:opacity-60
          "
                >
                    {!isRetrying && (
                        <img
                            src={RefreshIcon}
                            alt=""
                            className="h-5 w-5 object-contain"
                        />
                    )}

                    <Typography as="span" variant="body" size="medium" weight="regular">{isRetrying ? "در حال تلاش..." : retryLabel}</Typography>
                </Button> : null}
            </div>
        </div>
    );
}

type ErrorStateProps = {
    onRetry?: RetryHandler;
    className?: string;
};

export function isNoConnectionError(error: unknown) {
    if (error instanceof ApiError) return false;

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
        return true;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
        return true;
    }

    if (error instanceof Error) {
        const name = error.name.toLowerCase();
        const message = error.message.toLowerCase();

        return (
            name.includes("abort") ||
            name.includes("cancel") ||
            message.includes("abort") ||
            message.includes("cancel") ||
            message.includes("failed to fetch") ||
            message.includes("network")
        );
    }

    return true;
}

export function getRequestErrorState(
    error: unknown,
): ComponentType<ErrorStateProps> {
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
                fill="#E5E7EC"
            />
            <path
                d="M25.5 29.5v-4.2a7.5 7.5 0 0 1 15 0v4.2"
                stroke="white"
                strokeLinecap="round"
                strokeWidth="3"
            />
            <rect x="21" y="28" width="24" height="17" rx="3" fill="white" />
        </svg>
    );
}

export function AccessDeniedState({ onBack }: { onBack: () => void }) {
    return (
        <div
            className="flex h-full min-h-0 w-full items-center justify-center bg-white px-6"
            dir="rtl"
        >
            <div className="flex w-full max-w-[320px] -translate-y-8 flex-col items-center text-center">
                <div className="mb-6">
                    <AccessDeniedIcon />
                </div>

                <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">
                    دسترسی به این بخش امکان‌پذیر نیست
                </Typography>

                <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-sm leading-6 text-[#4d4d4d]">
                    شما مجوز استفاده از این بخش را ندارید.
                    <br />
                    در صورت نیاز، با حساب کاربری دارای دسترسی مناسب وارد شوید یا از مدیر سامانه درخواست دسترسی کنید.
                </Typography>

                <Button unstyled
                    className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#0048c4] px-4 text-sm font-medium text-white transition hover:bg-[#003fae]"
                    onClick={onBack}
                    type="button"
                >
                    <LinearArrowRight1 className="h-5 w-5" />
                    <Typography as="span" variant="body" size="medium" weight="regular">بازگشت</Typography>
                </Button>
            </div>
        </div>
    );
}
