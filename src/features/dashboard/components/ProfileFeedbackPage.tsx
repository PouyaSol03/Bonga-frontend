import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import LinearLike from "../../../shared/icons/LinearLike";
import LinearDislike from "../../../shared/icons/LinearDislike";
import { useToast } from "../../../shared/hooks/useToast";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  ViewAdActionPageTopBar,
  ViewAdPageActionBar,
} from "../../advertisements/view/pages/ViewAdActionPageLayout";
import {
  getPublicProfileFeedbackItems,
  submitProfileFeedback,
  type ProfileFeedbackItem,
  type ProfileFeedbackTargetType,
} from "../api/v2/profile-feedback.service";

type FeedbackValue = "positive" | "negative";

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
      ? "bg-tertiary-container text-tertiary"
      : "bg-error-container text-error";

  return (
    <Button unstyled
      aria-label={type === "positive" ? "بازخورد مثبت" : "بازخورد منفی"}
      className={`grid h-10 w-10 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40 ${
        active ? activeClassName : "bg-transparent text-outline-var"
      }`}
      onClick={onClick}
      type="button"
    >
      {type === "positive" ? (
        <LinearLike className="h-6 w-6" />
      ) : (
        <LinearDislike className="h-6 w-6" />
      )}
    </Button>
  );
}

export function ProfileFeedbackPage({
  onClose,
  targetType,
  targetId,
  targetName: _targetName,
}: {
  onClose: () => void;
  targetType: ProfileFeedbackTargetType;
  targetId: number | string;
  targetName?: string;
}) {
  const { showToast } = useToast();
  const [ratings, setRatings] = useState<Record<number, boolean | null>>({});

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["publicProfileFeedbackItems"],
    queryFn: getPublicProfileFeedbackItems,
    staleTime: 5 * 60 * 1000,
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      const activeRatings: Array<{ item_id: number; value: boolean }> = [];
      for (const [idStr, val] of Object.entries(ratings)) {
        if (val !== null && val !== undefined) {
          activeRatings.push({
            item_id: Number(idStr),
            value: val,
          });
        }
      }
      return submitProfileFeedback(targetType, targetId, {
        ratings: activeRatings,
      });
    },
    onSuccess: () => {
      showToast("بازخورد شما با موفقیت ثبت شد.", "موفق", "success");
      setRatings({});
      onClose();
    },
    onError: (err) => {
      showToast(
        getApiErrorMessage(err, "ثبت بازخورد با خطا مواجه شد."),
        "خطا",
        "error"
      );
    },
  });

  const setOptionFeedback = (itemId: number, type: FeedbackValue) => {
    const val = type === "positive";
    setRatings((current) => ({
      ...current,
      [itemId]: current[itemId] === val ? null : val,
    }));
  };

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  const answeredCount = Object.values(ratings).filter((v) => v !== null).length;
  const isSubmitting = submitMutation.isPending;

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-surface-container-lowest text-on-surface [direction:rtl]">
      <ViewAdActionPageTopBar onBack={onClose} title="ثبت بازخورد" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container-lowest px-4 pt-2">
        {isLoading ? (
          <div className="flex flex-col gap-3 py-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex h-14 w-full animate-pulse items-center rounded-xl bg-surface-container-high"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-sm text-error">
            خطا در دریافت معیارهای بازخورد. لطفاً بعداً تلاش کنید.
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-sm text-on-surface-var">
            معیاری برای ثبت بازخورد یافت نشد.
          </div>
        ) : (
          <div className="divide-y divide-outline-var">
            {items
              .filter((item) => item.is_active)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item: ProfileFeedbackItem) => {
                const currentVal = ratings[item.id];
                return (
                  <div
                    className="flex min-h-[60px] items-center justify-between gap-4 text-right [direction:rtl]"
                    key={item.id}
                  >
                    <Typography
                      as="span"
                      variant="body"
                      size="large"
                      weight="regular"
                      className="text-on-surface"
                    >
                      {item.title}
                    </Typography>

                    <div className="flex shrink-0 items-center gap-4 [direction:ltr]">
                      <FeedbackIconButton
                        active={currentVal === false}
                        onClick={() => setOptionFeedback(item.id, "negative")}
                        type="negative"
                      />
                      <FeedbackIconButton
                        active={currentVal === true}
                        onClick={() => setOptionFeedback(item.id, "positive")}
                        type="positive"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </main>

      <ViewAdPageActionBar
        isPrimaryDisabled={answeredCount === 0 || isSubmitting}
        isPrimaryLoading={isSubmitting}
        onPrimary={handleSubmit}
        onSecondary={onClose}
        primaryLabel="ثبت"
        primaryLoadingLabel="در حال ثبت..."
      />
    </div>
  );
}
