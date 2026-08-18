import { useState } from "react";

import type { AdvertiseFeedbackPayload } from "../../api/advertisement.service";
import { ViewAdActionPageTopBar, ViewAdPageActionBar } from "./ViewAdActionPageLayout";
import { Typography } from "../../../../shared/ui/Typography";
import LinearLike from "../../../../shared/icons/LinearLike";
import LinearDislike from "../../../../shared/icons/LinearDislike";
import { Button } from "../../../../shared/ui/Button";

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
  if (direction == "positive") return <LinearLike className={className} />
  return <LinearDislike className={className} />
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
      ? "bg-[#11A36629] text-[#11A366]"
      : "bg-[#DD2B1E29] text-[#EE3623]";

  return (
    <Button unstyled
      aria-label={type === "positive" ? "بازخورد مثبت" : "بازخورد منفی"}
      className={`grid h-10 w-10 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${active ? activeClassName : "bg-transparent text-[#cccccc]"}`}
      onClick={onClick}
      type="button"
    >
      <FeedbackThumbIcon className="h-6 w-6" direction={type} />
    </Button>
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
              className="flex min-h-[60px] items-center justify-between gap-4 text-right [direction:rtl]"
              key={option.key}
            >
              <Typography as="span" variant="body" size="large" weight="regular" className="text-[#1a1a1a]">
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
