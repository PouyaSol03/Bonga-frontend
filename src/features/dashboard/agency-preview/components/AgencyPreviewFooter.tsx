import LinearChat from "../../../../shared/icons/LinearChat";
import { Button } from "../../../../shared/ui/Button";

interface AgencyPreviewFooterProps {
  entityLabel?: string;
  isChatLoading?: boolean;
  onChatClick?: () => void;
  onContactClick: () => void;
}

export function AgencyPreviewFooter({
  entityLabel = "آژانس",
  isChatLoading = false,
  onChatClick,
  onContactClick,
}: AgencyPreviewFooterProps) {
  return (
    <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 z-20 px-4 pt-3 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
      <div className="grid h-10 grid-cols-2 gap-4 [direction:ltr]">
        <Button
          unstyled
          className="bg-primary text-on-primary cursor-pointer rounded-lg text-sm leading-5 font-semibold"
          onClick={onContactClick}
          type="button"
        >
          تماس با {entityLabel}
        </Button>
        <Button
          unstyled
          disabled={isChatLoading}
          className="border-primary bg-surface-container-lowest text-primary inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border text-sm leading-5 font-semibold disabled:opacity-60"
          onClick={onChatClick}
          type="button"
        >
          {isChatLoading ? "در حال اتصال..." : `چت با ${entityLabel}`}
          <LinearChat className="h-5 w-5" />
        </Button>
      </div>
    </footer>
  );
}
