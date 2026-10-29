import { BottomSheet } from "../../../../shared/components/BottomSheet";
import { Button } from "../../../../shared/ui/Button";

export function RequestEditBottomSheet({
  isOpen,
  onClose,
  onConfirm,
  onValueChange,
  value,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onValueChange: (value: string) => void;
  value: string;
}) {
  return (
    <BottomSheet
      ariaLabel="ویرایش درخواست"
      contentClassName="px-4 pb-4"
      heightClassName="h-auto pb-[max(0.25rem,env(safe-area-inset-bottom,0px))]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-4"
      showHandle={false}
      showHeader={false}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm();
        }}
      >
        <input
          aria-label="نام درخواست"
          autoFocus
          className="border-primary bg-surface-container-lowest text-on-surface placeholder:text-outline focus:ring-primary/20 h-14 w-full rounded-xl border-2 px-3 text-right text-base leading-6 font-normal transition outline-none focus:ring-3"
          onChange={(event) => onValueChange(event.target.value)}
          placeholder="نام درخواست"
          type="text"
          value={value}
        />

        <div className="grid grid-cols-2 gap-4">
          <Button
            unstyled
            className="border-primary bg-surface-container-lowest text-primary focus-visible:outline-primary/40 active:bg-surface-container h-10 rounded-xl border text-sm leading-5 font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
            onClick={onClose}
            type="button"
          >
            انصراف
          </Button>
          <Button
            unstyled
            className="bg-primary text-on-primary focus-visible:outline-primary/40 h-10 rounded-xl text-sm leading-5 font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-2 active:opacity-80"
            type="submit"
          >
            تایید
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
}
