import { TopBar } from "../../../../shared/components/TopBar";
import { Button } from "../../../../shared/ui/Button";

export function ViewAdActionPageTopBar({ title, onBack }: { title: string; onBack: () => void }) {
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
    <div className="bg-surface-container-lowest shrink-0 rounded-b-2xl px-4 py-3.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-2 gap-4 [direction:ltr]">
        <Button
          unstyled
          className="bg-primary text-on-primary focus-visible:outline-primary/40 h-10 rounded-[10px] px-4 text-sm leading-5 font-medium focus-visible:outline-3 focus-visible:outline-offset-2 disabled:opacity-50"
          disabled={isPrimaryDisabled || isPrimaryLoading}
          onClick={onPrimary}
          type="button"
        >
          {isPrimaryLoading ? (primaryLoadingLabel ?? "در حال ارسال...") : primaryLabel}
        </Button>
        <Button
          unstyled
          className="border-primary bg-surface-container-lowest text-primary focus-visible:outline-primary/40 h-10 rounded-[10px] border px-4 text-sm leading-5 font-medium focus-visible:outline-3 focus-visible:outline-offset-2"
          onClick={onSecondary}
          type="button"
        >
          {secondaryLabel}
        </Button>
      </div>
    </div>
  );
}
