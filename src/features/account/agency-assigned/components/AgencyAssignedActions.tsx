import { Typography } from "../../../../shared/ui/Typography";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearCancel from "../../../../shared/icons/LinearCancel";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import LinearPreview from "../../../../shared/icons/LinearPreview";

export function AgencyAssignedActions({
  isDeleted,
  isPublished,
  isWaitForAgency,
  onCancelAssignment,
  onEdit,
  onPreview,
  onStopPublish,
}: {
  isDeleted: boolean;
  isPublished: boolean;
  isWaitForAgency: boolean;
  onCancelAssignment: () => void;
  onEdit: () => void;
  onPreview: () => void;
  onStopPublish: () => void;
}) {
  return (
    <section className="bg-surface-container-lowest px-4">
      <div className="divide-outline-var/20 divide-y">
        {/* Action 1: پیش‌نمایش */}
        <button
          type="button"
          onClick={onPreview}
          className="active:bg-surface-container-low flex h-14 w-full items-center justify-between text-right transition-colors [direction:rtl]"
        >
          <div className="flex items-center gap-3">
            <LinearPreview className="text-on-surface-var h-6 w-6" />
            <Typography variant="label" size="large" weight="medium" className="text-on-surface">
              پیش‌نمایش
            </Typography>
          </div>
          <LinearArrowLeft1 className="text-outline h-6 w-6" />
        </button>

        {/* Action: ویرایش */}
        {!isDeleted && (
          <button
            type="button"
            onClick={onEdit}
            className="active:bg-surface-container-low flex h-14 w-full items-center justify-between text-right transition-colors [direction:rtl]"
          >
            <div className="flex items-center gap-3">
              <LinearEdit2 className="text-on-surface-var h-6 w-6" />
              <Typography
                variant="label"
                size="large"
                weight="medium"
                className="text-on-surface"
              >
                ویرایش
              </Typography>
            </div>
            <LinearArrowLeft1 className="text-outline h-6 w-6" />
          </button>
        )}

        {/* Action 2 for Published: درخواست توقف انتشار */}
        {isPublished && (
          <button
            type="button"
            onClick={onStopPublish}
            className="active:bg-surface-container-low flex h-14 w-full items-center justify-between text-right transition-colors [direction:rtl]"
          >
            <div className="flex items-center gap-3">
              <LinearCancel className="text-on-surface-var h-6 w-6" />
              <Typography
                variant="label"
                size="large"
                weight="medium"
                className="text-on-surface"
              >
                درخواست توقف انتشار
              </Typography>
            </div>
            <LinearArrowLeft1 className="text-outline h-6 w-6" />
          </button>
        )}

        {/* Action 2 for Wait For Agency: لغو واگذاری آگهی به آژانس */}
        {isWaitForAgency && (
          <button
            type="button"
            onClick={onCancelAssignment}
            className="active:bg-surface-container-low flex h-14 w-full items-center justify-between text-right transition-colors [direction:rtl]"
          >
            <div className="flex items-center gap-3">
              <LinearCancel className="text-on-surface-var h-6 w-6" />
              <Typography
                variant="label"
                size="large"
                weight="medium"
                className="text-on-surface"
              >
                لغو واگذاری آگهی به آژانس
              </Typography>
            </div>
            <LinearArrowLeft1 className="text-outline h-6 w-6" />
          </button>
        )}
      </div>
    </section>
  );
}
