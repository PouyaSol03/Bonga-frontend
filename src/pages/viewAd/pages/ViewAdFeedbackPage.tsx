import { useState } from "react";

import type { AdvertiseFeedbackPayload } from "../../../services/advertisement.service";
import { ViewAdActionPageTopBar, ViewAdPageActionBar } from "./ViewAdActionPageLayout";
import { Typography } from "../../../components/ui/Typography";

type FeedbackValue = "positive" | "negative";

type FeedbackOption = {
  key: keyof AdvertiseFeedbackPayload;
  label: string;
};

type FeedbackState = Record<keyof AdvertiseFeedbackPayload, FeedbackValue | null>;

const feedbackOptions: FeedbackOption[] = [
  { key: "response_speed", label: "سرعت پاسخگویی" },
  { key: "area_knowledge", label: "میزان آشنایی به منطقه" },
  { key: "honesty", label: "صداقت در معرفی ملک" },
  { key: "effective_followup", label: "پیگیری موثر" },
  { key: "ads_are_updated", label: "به روز بودن آگهی‌ها" },
];

function FeedbackThumbIcon({
  className = "",
  direction,
}: {
  className?: string;
  direction: FeedbackValue;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <g transform={direction === "negative" ? "rotate(180 12 12)" : undefined}>
        <path d="M7.5 10.5v9" />
        <path d="M4.5 11.5v6.5c0 .8.7 1.5 1.5 1.5h1.5v-9H6c-.8 0-1.5.7-1.5 1.5Z" />
        <path d="M7.5 11.5 11.8 4c.4-.7 1.4-.7 1.8 0 .4.7.5 1.5.2 2.2l-1 2.6h4.6c1.4 0 2.4 1.3 2.1 2.7l-1.1 5.4c-.3 1.5-1.7 2.6-3.2 2.6H7.5" />
      </g>
    </svg>
  );
}

function FeedbackIconButton({
  active,
  type,
  onClick,
}: {
  active: boolean;
  type: FeedbackValue;
  onClick: () => void;
}) {
  const activeClassName =
    type === "positive"
      ? "bg-[#0FAF731A] text-[#0FAF73]"
      : "bg-[#FF4D4F1A] text-[#FF4D4F]";

  return (
    <button
      aria-label={type === "positive" ? "بازخورد مثبت" : "بازخورد منفی"}
      className={`grid h-9 w-9 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${active ? activeClassName : "bg-transparent text-[#cccccc]"}`}
      onClick={onClick}
      type="button"
    >
      <FeedbackThumbIcon className="h-5 w-5" direction={type} />
    </button>
  );
}

export function ViewAdFeedbackPage({
  isSubmitting,
  onClose,
  onSubmit,
}: {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: AdvertiseFeedbackPayload) => void;
}) {
  const [feedback, setFeedback] = useState<FeedbackState>(() =>
    feedbackOptions.reduce<FeedbackState>((result, option) => {
      result[option.key] = null;
      return result;
    }, {} as FeedbackState),
  );

  const setOptionFeedback = (key: keyof AdvertiseFeedbackPayload, value: FeedbackValue) => {
    setFeedback((current) => ({
      ...current,
      [key]: current[key] === value ? null : value,
    }));
  };

  const handleSubmit = () => {
    const payload = feedbackOptions.reduce<AdvertiseFeedbackPayload>(
      (result, option) => ({
        ...result,
        [option.key]: feedback[option.key] === "positive",
      }),
      {
        ads_are_updated: false,
        area_knowledge: false,
        effective_followup: false,
        honesty: false,
        response_speed: false,
      },
    );

    onSubmit(payload);
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-white text-[#1a1a1a] [direction:rtl]">
      <ViewAdActionPageTopBar onBack={onClose} title="ثبت بازخورد" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pt-2">
        <div className="divide-y divide-[#e0e0e0]">
          {feedbackOptions.map((option) => (
            <div
              className="flex min-h-[73px] items-center justify-between gap-4 text-right [direction:rtl]"
              key={option.key}
            >
              <Typography as="span" variant="body" size="large" weight="regular" className="text-base font-normal leading-6 text-[#1a1a1a]">
                {option.label}
              </Typography>

              <div className="flex shrink-0 items-center gap-4 [direction:ltr]">
                <FeedbackIconButton
                  active={feedback[option.key] === "negative"}
                  onClick={() => setOptionFeedback(option.key, "negative")}
                  type="negative"
                />
                <FeedbackIconButton
                  active={feedback[option.key] === "positive"}
                  onClick={() => setOptionFeedback(option.key, "positive")}
                  type="positive"
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      <ViewAdPageActionBar
        isPrimaryLoading={isSubmitting}
        onPrimary={handleSubmit}
        onSecondary={onClose}
        primaryLabel="ثبت"
        primaryLoadingLabel="در حال ثبت..."
      />
    </div>
  );
}
