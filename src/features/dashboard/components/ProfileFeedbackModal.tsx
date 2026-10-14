import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import LinearLike from "../../../shared/icons/LinearLike";
import LinearDislike from "../../../shared/icons/LinearDislike";
import { useToast } from "../../../shared/hooks/useToast";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  getProfileFeedbackItems,
  submitProfileFeedback,
  type ProfileFeedbackItem,
  type ProfileFeedbackTargetType,
} from "../api/v2/profile-feedback.service";

type ProfileFeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  targetType: ProfileFeedbackTargetType;
  targetId: number | string;
  targetName?: string;
};

export function ProfileFeedbackModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
}: ProfileFeedbackModalProps) {
  const { showToast } = useToast();
  const [ratings, setRatings] = useState<Record<number, boolean | null>>({});

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profileFeedbackItems"],
    queryFn: getProfileFeedbackItems,
    enabled: isOpen,
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
      showToast(getApiErrorMessage(err, "ثبت بازخورد با خطا مواجه شد."), "خطا", "error");
    },
  });

  const handleVote = (itemId: number, value: boolean) => {
    setRatings((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === value ? null : value,
    }));
  };

  const answeredCount = Object.values(ratings).filter((v) => v !== null).length;
  const canSubmit = answeredCount > 0 && !submitMutation.isPending;

  return (
    <BottomSheet
      ariaLabel="فرم ثبت بازخورد"
      isOpen={isOpen}
      onClose={() => {
        if (!submitMutation.isPending) onClose();
      }}
      title={`ثبت بازخورد برای ${targetName || (targetType === "agency" ? "آژانس" : "مشاور")}`}
      variant="form"
    >
      <div className="flex flex-col gap-4 p-4 [direction:rtl]">
        {isLoading ? (
          <div className="flex flex-col gap-3 py-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-skeleton bg-surface-container flex h-12 w-full items-center rounded-xl"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-error py-6 text-center text-sm">
            خطا در دریافت معیارهای بازخورد. لطفاً بعداً تلاش کنید.
          </div>
        ) : items.length === 0 ? (
          <div className="text-on-surface-var py-6 text-center text-sm">
            معیاری برای ثبت بازخورد یافت نشد.
          </div>
        ) : (
          <div className="divide-outline-variant/30 flex flex-col divide-y">
            {items
              .filter((item) => item.is_active)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item: ProfileFeedbackItem) => {
                const currentVal = ratings[item.id];
                return (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <Typography
                      as="span"
                      variant="body"
                      size="medium"
                      weight="medium"
                      className="text-on-surface text-sm"
                    >
                      {item.title}
                    </Typography>

                    <div className="flex items-center gap-2 [direction:ltr]">
                      {/* Positive Vote */}
                      <Button
                        unstyled
                        aria-label="بازخورد مثبت"
                        className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${
                          currentVal === true
                            ? "bg-tertiary-container text-tertiary"
                            : "bg-surface-container-high text-outline-var hover:text-on-surface"
                        }`}
                        onClick={() => handleVote(item.id, true)}
                        type="button"
                      >
                        <LinearLike className="h-5 w-5" />
                      </Button>

                      {/* Negative Vote */}
                      <Button
                        unstyled
                        aria-label="بازخورد منفی"
                        className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${
                          currentVal === false
                            ? "bg-error-container text-error"
                            : "bg-surface-container-high text-outline-var hover:text-on-surface"
                        }`}
                        onClick={() => handleVote(item.id, false)}
                        type="button"
                      >
                        <LinearDislike className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        <div className="mt-4 flex gap-3 pt-2">
          <Button
            className="flex-1"
            disabled={!canSubmit}
            loading={submitMutation.isPending}
            onClick={() => submitMutation.mutate()}
            size="medium"
            variant="primary"
          >
            ثبت بازخورد
          </Button>
          <Button
            className="flex-1"
            disabled={submitMutation.isPending}
            onClick={onClose}
            size="medium"
            variant="neutral-outline"
          >
            انصراف
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
