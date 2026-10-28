import LinearChat from "../../../shared/icons/LinearChat";
import { Button } from "../../../shared/ui/Button";
import "../../advertisements/components/AdCard.css";

export function AgencyActionsFooter({
  onSendMessage,
  onCallAgency,
}: {
  onSendMessage: () => void;
  onCallAgency: () => void;
}) {
  return (
    <footer className="border-surface-container bg-surface-container-lowest shrink-0 border-t px-4 py-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)] [direction:rtl]">
      <div className="flex items-center gap-3">
        <Button
          unstyled
          className="border-primary text-primary active:bg-primary/10 flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] border bg-transparent text-sm font-medium transition-colors"
          onClick={onSendMessage}
          type="button"
        >
          <LinearChat className="text-primary h-5 w-5 shrink-0" />
          <span>ارسال پیام</span>
        </Button>

        <Button
          unstyled
          className="bg-primary text-on-primary active:bg-primary-600 flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] text-sm font-medium transition-colors"
          onClick={onCallAgency}
          type="button"
        >
          <span>تماس با آژانس</span>
        </Button>
      </div>
    </footer>
  );
}
