import { useEffect, useState } from "react";

import type { AdvertiseReportReason } from "../../../core/services/advertisement.service";
import { ViewAdActionPageTopBar, ViewAdPageActionBar } from "./ViewAdActionPageLayout";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

export type ViolationReportSubmitPayload = {
  description: string;
  reportReasonId: string;
};

function ReportRadio({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex h-11 cursor-pointer items-center justify-between gap-4 text-right [direction:rtl]">
      <Typography as="span" variant="body" size="large" weight="regular" className={`text-base font-normal leading-6 ${checked ? "text-[#0048c4]" : "text-[#1a1a1a]"}`}>
        {label}
      </Typography>
      <input checked={checked} className="sr-only" onChange={onChange} type="radio" value={label} />
      <Typography as="span" variant="body" size="medium" weight="regular"
        aria-hidden="true"
        className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border ${checked ? "border-[#0048c4] bg-[#0048c4]" : "border-[#808080] bg-white"}`}
      >
        {checked ? <Typography as="span" variant="body" size="medium" weight="regular" className="h-2 w-2 rounded-full bg-white" /> : null}
      </Typography>
    </label>
  );
}

function ReportSkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`rounded-lg bg-[#e8e8e8] ${className}`} />;
}

export function ViewAdViolationReportPage({
  errorMessage,
  isLoading,
  isSubmitting,
  onClose,
  onRetry,
  onSubmit,
  reasons,
}: {
  errorMessage?: string;
  isLoading: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onRetry: () => void;
  onSubmit: (payload: ViolationReportSubmitPayload) => void;
  reasons: AdvertiseReportReason[];
}) {
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [description, setDescription] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (selectedReasonId || reasons.length === 0) return;
    setSelectedReasonId(reasons[0].id);
  }, [reasons, selectedReasonId]);

  const selectedReason = reasons.find((reason) => reason.id === selectedReasonId) ?? null;
  const shouldShowDescription = selectedReason?.name === "سایر";

  const handleSubmit = () => {
    if (!selectedReason) {
      setValidationMessage("لطفا یک دلیل برای گزارش انتخاب کنید.");
      return;
    }

    const cleanDescription = description.trim();

    if (shouldShowDescription && cleanDescription.length === 0) {
      setValidationMessage("لطفا توضیح گزارش را وارد کنید.");
      return;
    }

    setValidationMessage("");
    onSubmit({ description: cleanDescription, reportReasonId: selectedReason.id });
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-white text-[#1a1a1a] [direction:rtl]">
      <ViewAdActionPageTopBar onBack={onClose} title="گزارش تخلف آگهی" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-5 pb-4 pt-5 overscroll-contain">
        {isLoading ? (
          <div className="space-y-4 pt-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <ReportSkeletonBlock className="h-8 w-full" key={index} />
            ))}
          </div>
        ) : errorMessage ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-center">
            <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm font-medium leading-6 text-[#4d4d4d]">{errorMessage}</Typography>
            <Button unstyled
              className="h-10 rounded-[10px] border border-[#0048c4] bg-white px-5 text-sm font-medium leading-5 text-[#0048c4]"
              onClick={onRetry}
              type="button"
            >
              تلاش دوباره
            </Button>
          </div>
        ) : reasons.length === 0 ? (
          <div className="flex min-h-[240px] items-center justify-center text-center">
            <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm font-medium leading-6 text-[#4d4d4d]">
              دلیلی برای گزارش تخلف دریافت نشد.
            </Typography>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <ReportRadio
                  checked={selectedReasonId === reason.id}
                  key={reason.id}
                  label={reason.name}
                  onChange={() => {
                    setSelectedReasonId(reason.id);
                    setValidationMessage("");
                  }}
                />
              ))}
            </div>

            {shouldShowDescription ? (
              <textarea
                aria-label="توضیح گزارش"
                className="mt-4 h-[104px] w-full resize-none rounded-lg border border-[#d9d9d9] bg-white px-3 py-3 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] focus:border-[#0048c4]"
                onChange={(event) => {
                  setDescription(event.target.value);
                  setValidationMessage("");
                }}
                placeholder="لطفا دلیل گزارش را توضیح دهید... *"
                value={description}
              />
            ) : null}

            {validationMessage ? (
              <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-3 text-right text-xs font-medium leading-5 text-[#ff4d4f]">
                {validationMessage}
              </Typography>
            ) : null}
          </>
        )}
      </main>

      <ViewAdPageActionBar
        isPrimaryDisabled={Boolean(errorMessage) || isLoading || reasons.length === 0}
        isPrimaryLoading={isSubmitting}
        onPrimary={handleSubmit}
        onSecondary={onClose}
        primaryLabel="ارسال گزارش"
        primaryLoadingLabel="در حال ارسال..."
      />
    </div>
  );
}
