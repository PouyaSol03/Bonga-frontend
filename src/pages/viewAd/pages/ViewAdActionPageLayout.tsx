import { TopBar } from "../../../shared/components/TopBar";
import { Button } from "../../../shared/ui/Button";

export function ViewAdActionPageTopBar({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return <TopBar onBack={onBack} title={title} />;
}

export function ViewAdPageActionBar({
  primaryLabel,
  primaryLoadingLabel,
  secondaryLabel = "انصراف",
  isPrimaryDisabled = false,
  isPrimaryLoading = false,
  onPrimary,
  onSecondary,
}: {
  primaryLabel: string;
  primaryLoadingLabel?: string;
  secondaryLabel?: string;
  isPrimaryDisabled?: boolean;
  isPrimaryLoading?: boolean;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <div className="shrink-0 rounded-b-2xl bg-white px-4 py-3.5 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
      <div className="grid grid-cols-2 gap-4 [direction:ltr]">
        <Button unstyled
          className="h-10 rounded-[10px] bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          disabled={isPrimaryDisabled || isPrimaryLoading}
          onClick={onPrimary}
          type="button"
        >
          {isPrimaryLoading ? primaryLoadingLabel ?? "در حال ارسال..." : primaryLabel}
        </Button>
        <Button unstyled
          className="h-10 rounded-[10px] border border-[#0048c4] bg-white px-4 text-sm font-medium leading-5 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          onClick={onSecondary}
          type="button"
        >
          {secondaryLabel}
        </Button>
      </div>
    </div>
  );
}
