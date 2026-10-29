import { Button } from "../../../../shared/ui/Button";
import type { EditTarget } from "../types";

export function CrmLocationMapFloatingControls({
  editTarget,
  isFullscreen,
  isPending,
  isSavePending,
  lastSnapNotice,
  onCancel,
  onRemoveDraftPoint,
  onSave,
  onToggleFullscreen,
  selectedDraftPointIndex,
}: {
  editTarget: EditTarget | null;
  isFullscreen: boolean;
  isPending: boolean;
  isSavePending: boolean;
  lastSnapNotice: boolean;
  onCancel: () => void;
  onRemoveDraftPoint: (index: number) => void;
  onSave: () => void;
  onToggleFullscreen: () => void;
  selectedDraftPointIndex: number | null;
}) {
  return (
    <>
      {editTarget ? (
        <div className="absolute top-4 left-1/2 z-[700] -translate-x-1/2" dir="rtl">
          <div className="flex items-center gap-2 rounded-xl border border-[#e1e4e8] bg-white p-2 shadow-[0_8px_28px_rgba(26,26,26,0.14)]">
            <Button
              disabled={isPending}
              loading={isSavePending}
              onClick={onSave}
              size="x-medium"
              variant="primary"
            >
              ثبت تغییرات
            </Button>
            <Button
              disabled={isPending}
              onClick={onCancel}
              size="x-medium"
              variant="neutral-outline"
            >
              انصراف
            </Button>
            {selectedDraftPointIndex !== null ? (
              <Button
                disabled={isPending}
                onClick={() => onRemoveDraftPoint(selectedDraftPointIndex)}
                size="x-medium"
                variant="danger"
              >
                حذف نقطه
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="absolute bottom-4 left-4 z-[650]" dir="rtl">
        <Button onClick={onToggleFullscreen} size="x-medium" variant="neutral-outline">
          {isFullscreen ? "خروج از تمام صفحه" : "تمام صفحه"}
        </Button>
      </div>

      {lastSnapNotice ? (
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-[700] -translate-x-1/2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white shadow-lg">
          نقطه به نزدیک‌ترین مرز یا موقعیت مجاز منتقل شد
        </div>
      ) : null}
    </>
  );
}
