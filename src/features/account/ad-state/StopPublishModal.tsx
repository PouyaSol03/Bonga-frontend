import { useState } from "react";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";

export const STOP_PUBLISH_REASONS = [
  { id: "deal_done", label: "معامله انجام شده است" },
  { id: "no_longer_want_publish", label: "دیگر تمایلی به انتشار آگهی ندارم" },
  { id: "other", label: "سایر دلایل" },
] as const;

export function StopPublishModal({
  isPending,
  onClose,
  onConfirm,
}: {
  isPending: boolean;
  onClose: () => void;
  onConfirm: (reason: string, description?: string) => void;
}) {
  const [selectedReason, setSelectedReason] = useState<string>(STOP_PUBLISH_REASONS[0].id);
  const [customReason, setCustomReason] = useState("");

  const handleSubmit = () => {
    const description =
      selectedReason === "other" && customReason.trim() ? customReason.trim() : undefined;
    onConfirm(selectedReason, description);
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/50 p-0 [direction:rtl] sm:items-center sm:p-4"
      role="dialog"
    >
      <div className="bg-surface w-full max-w-sm rounded-t-2xl p-5 text-right shadow-xl sm:rounded-2xl">
        <Typography
          as="h3"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface m-0 text-base"
        >
          درخواست توقف انتشار
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var m-0 mt-2 text-xs leading-5"
        >
          لطفا دلیل درخواست توقف انتشار را انتخاب کنید:
        </Typography>

        <div className="mt-4 space-y-2">
          {STOP_PUBLISH_REASONS.map((option) => (
            <label
              key={option.id}
              className="border-outline-var flex cursor-pointer items-center justify-between rounded-xl border p-3"
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="stopReason"
                  value={option.id}
                  checked={selectedReason === option.id}
                  onChange={() => setSelectedReason(option.id)}
                  className="accent-primary h-4 w-4"
                />
                <span className="text-on-surface text-xs font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>

        {selectedReason === "other" ? (
          <textarea
            className="border-outline-var bg-surface text-on-surface focus:outline-primary mt-3 w-full rounded-xl border p-3 text-xs"
            placeholder="توضیح کوتاه دلیل توقف..."
            rows={2}
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        ) : null}

        <div className="mt-5 flex gap-2">
          <Button
            unstyled
            className="bg-primary text-on-primary inline-flex h-10 flex-1 items-center justify-center rounded-lg text-xs font-medium active:opacity-90 disabled:opacity-50"
            disabled={isPending}
            onClick={handleSubmit}
            type="button"
          >
            {isPending ? "در حال ثبت..." : "ثبت درخواست"}
          </Button>
          <Button
            unstyled
            className="border-outline-var bg-surface text-on-surface active:bg-surface-container inline-flex h-10 flex-1 items-center justify-center rounded-lg border text-xs font-medium"
            disabled={isPending}
            onClick={onClose}
            type="button"
          >
            انصراف
          </Button>
        </div>
      </div>
    </div>
  );
}
