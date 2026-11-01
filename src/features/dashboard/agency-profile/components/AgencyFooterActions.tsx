import { Link } from "react-router";
import LinearPreview from "../../../../shared/icons/LinearPreview";
import { Button } from "../../../../shared/ui/Button";

export function AgencyFooterActions({
  isSaving,
  onSave,
}: {
  isSaving: boolean;
  onSave: () => void;
}) {
  return (
    <footer className="border-outline-var bg-surface-container-lowest absolute inset-x-0 bottom-0 z-[600] border-t px-4 pt-3 pb-[max(8px,env(safe-area-inset-bottom))]">
      <div className="grid h-10 grid-cols-2 gap-3 [direction:ltr]">
        <Button
          unstyled
          className="bg-primary text-on-primary rounded-lg text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSaving}
          onClick={onSave}
          type="button"
        >
          {isSaving ? "در حال ذخیره..." : "ذخیره اطلاعات"}
        </Button>
        <Link
          className="border-primary bg-surface-container-lowest text-primary inline-flex items-center justify-center gap-2 rounded-lg border text-xs leading-5 font-semibold no-underline"
          to="/account/dashboard/agency/preview"
        >
          پیش نمایش
          <LinearPreview className="h-5 w-5" />
        </Link>
      </div>
    </footer>
  );
}
