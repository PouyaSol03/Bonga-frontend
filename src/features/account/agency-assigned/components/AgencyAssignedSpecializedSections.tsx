import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import LinearRefresh from "../../../../shared/icons/LinearRefresh";
import { formatExpireDuration } from "../dateHelpers";

type ExpirableStatus = {
  expire?: { hours?: number; minutes?: number; total_minutes?: number };
  expires_at?: string | null;
  reason?: string;
  agency?: { name?: string };
};

type SpecializedSectionsProps = {
  agencyName: string;
  archiveStatus?: ExpirableStatus;
  isRestoringArchived: boolean;
  onNavigateToDealResult: () => void;
  onOpenRepostChoice: () => void;
  onRestoreArchived: () => void;
  reRegisterStatus?: ExpirableStatus;
  showArchiveSection: boolean;
  showRepostSection: boolean;
  showSubmitResultSection: boolean;
  submitResultStatus?: ExpirableStatus;
};

export function AgencyAssignedSpecializedSections({
  agencyName,
  archiveStatus,
  isRestoringArchived,
  onNavigateToDealResult,
  onOpenRepostChoice,
  onRestoreArchived,
  reRegisterStatus,
  showArchiveSection,
  showRepostSection,
  showSubmitResultSection,
  submitResultStatus,
}: SpecializedSectionsProps) {
  return (
    <>
      {/* Specialized Action Area: Wait for Repost */}
      {showRepostSection && (
        <div className="m-0 mb-6 text-right">
          <Typography
            as="h3"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface m-0"
          >
            فرصت ثبت مجدد آگهی
          </Typography>
          <div className="border-tertiary bg-surface-container-lowest mt-3 rounded-lg border p-2 text-right">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-tertiary"
            >
              {formatExpireDuration(
                reRegisterStatus?.expire,
                reRegisterStatus?.expires_at,
                reRegisterStatus?.reason ||
                  "تا ۶ روز و ۱۲ ساعت دیگر می‌توانید این آگهی را مجدداً فعال کنید.",
              )}
            </Typography>
          </div>
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-on-surface-var m-0 mt-2"
          >
            پس از پایان این مهلت، وضعیت آگهی به بایگانی شده تغییر خواهد کرد.
          </Typography>

          <Button
            variant="primary"
            size="x-medium"
            fullWidth
            onClick={onOpenRepostChoice}
            className="mt-4 !justify-between"
          >
            <span className="flex items-center gap-2">
              <LinearRefresh className="h-6 w-6" />
              <span>ثبت مجدد آگهی</span>
            </span>
            <LinearArrowLeft1 className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Specialized Action Area: Archived */}
      {showArchiveSection && (
        <div className="m-0 mb-6 text-right">
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface m-0 text-sm leading-6"
          >
            مهلت ثبت مجدد این آگهی به پایان رسیده و آگهی به حالت بایگانی شده منتقل شده است.
          </Typography>
          <div className="border-tertiary bg-surface-container-lowest mt-3 rounded-lg border p-2 text-right">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-tertiary"
            >
              {formatExpireDuration(
                archiveStatus?.expire,
                archiveStatus?.expires_at,
                archiveStatus?.reason ||
                  "تا ۲۳ روز و ۸ ساعت دیگر می‌توانید این آگهی را بازیابی کنید.",
              )}
            </Typography>
          </div>

          <div className="mt-4 flex justify-start [direction:ltr]">
            <Button
              variant="primary"
              size="x-medium"
              loading={isRestoringArchived}
              disabled={isRestoringArchived}
              onClick={onRestoreArchived}
              className="gap-2 [direction:rtl]"
              leadingIcon={
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 10h10a5 5 0 0 1 5 5v2" />
                  <path d="M7 6 3 10l4 4" />
                </svg>
              }
            >
              بازیابی آگهی
            </Button>
          </div>
        </div>
      )}

      {/* Specialized Action Area: Deleted Variant 1 */}
      {showSubmitResultSection && (
        <div className="m-0 text-right">
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface m-0 text-sm leading-6"
          >
            {submitResultStatus?.agency?.name ?? agencyName} این درخواست را بسته است.
            لطفاً نتیجه نهایی این درخواست را ثبت کنید.
          </Typography>
          <div className="border-tertiary bg-surface-container-lowest mt-3 rounded-lg border p-2 text-right">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-tertiary"
            >
              {formatExpireDuration(
                submitResultStatus?.expire,
                submitResultStatus?.expires_at,
                submitResultStatus?.reason ||
                  "تا پایان مهلت پاسخگویی ۶ روز و ۱۲ ساعت فرصت دارید.",
              )}
            </Typography>
          </div>

          <Button
            variant="primary"
            size="x-medium"
            fullWidth
            onClick={onNavigateToDealResult}
            className="mt-4 !justify-between"
          >
            <span className="flex items-center gap-2">
              <LinearCalendar className="h-6 w-6" />
              <span>ثبت نتیجه درخواست</span>
            </span>
            <LinearArrowLeft1 className="h-5 w-5" />
          </Button>

          <div className="border-outline-var/20 mt-4 border-b" />
        </div>
      )}
    </>
  );
}
