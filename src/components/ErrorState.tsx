import { useState } from "react";

import NoConnectionIcon from "../assets/icons/NoConnection.svg";
import ServerErrorIcon from "../assets/icons/ServerError.svg";
import RefreshIcon from "../assets/icons/RefreshIcon.svg";
import NotFoundIcon from "../assets/icons/404Error.svg";

type RetryHandler = () => void | Promise<void>;

type BaseErrorStateProps = {
    icon: string;
    title: string;
    description: React.ReactNode;
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
                    className={`mb-6 object-contain ${iconClassName}`}
                />

                <h2 className="mb-2 font-semibold text-[#1A1A1A]">
                    {title}
                </h2>

                <p className="mb-6 text-sm leading-6 text-[#4D4D4D]">
                    {description}
                </p>

                {onRetry ? <button
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

                    <span>{isRetrying ? "در حال تلاش..." : retryLabel}</span>
                </button> : null}
            </div>
        </div>
    );
}

type ErrorStateProps = {
    onRetry?: RetryHandler;
    className?: string;
};

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
