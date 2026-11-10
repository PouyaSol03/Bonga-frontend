import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { ViewAdIcon } from "../ViewAdIcon";
import type { getPublisherContactActions } from "../details/adContactActions";
import type { readContactInfo } from "./contactInfo";

type Props = {
  isPreview: boolean;
  isPersonalPreview: boolean;
  useAgencyAllocationPreview: boolean;
  showAgencyOwnerContact: boolean;
  usesPublicAdPresentation: boolean;
  contactInfo: ReturnType<typeof readContactInfo>;
  publisherContact: ReturnType<typeof getPublisherContactActions>;
  hasContactSheetData: boolean;
  hasChatContact: boolean;
  contactActionCount: number;
  contactActionsGridClassName: string;
  isChatPending: boolean;
  onOpenContactInfo: (type: "contact" | "agency" | "owner") => void;
  onOpenChat: () => void;
};

export function ViewAdContactActions({
  isPreview,
  isPersonalPreview,
  useAgencyAllocationPreview,
  showAgencyOwnerContact,
  usesPublicAdPresentation,
  contactInfo,
  publisherContact,
  hasContactSheetData,
  hasChatContact,
  contactActionCount,
  contactActionsGridClassName,
  isChatPending,
  onOpenContactInfo,
  onOpenChat,
}: Props) {
  return (
    <>
      {isPreview && !isPersonalPreview ? (
        useAgencyAllocationPreview ? (
          <div className="bg-surface-container-lowest shrink-0 px-4 py-3 shadow-[0_-4px_8px_rgba(0,0,0,0.08)]">
            <div className="flex gap-4 [direction:ltr]">
              <Button
                unstyled
                className="bg-primary text-on-primary focus-visible:outline-primary/40 flex-1 rounded-[10px] py-2.5 text-sm! font-medium! focus-visible:outline-3 focus-visible:outline-offset-2"
                onClick={() => onOpenContactInfo("agency")}
                type="button"
              >
                تماس با کاربر
              </Button>
              <Button
                unstyled
                className="border-primary bg-surface-container-lowest text-primary focus-visible:outline-primary/40 flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 text-sm font-medium focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60"
                disabled={isChatPending}
                onClick={onOpenChat}
                type="button"
              >
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="medium"
                  className="text-sm font-medium!"
                >
                  {isChatPending ? "در حال باز کردن چت..." : "چت با کاربر"}
                </Typography>
                <ViewAdIcon className="h-5! w-5!" name="chat" />
              </Button>
            </div>
          </div>
        ) : showAgencyOwnerContact ? (
          <div className="bg-surface-container-lowest shrink-0 px-4 py-3 shadow-[0_-4px_8px_rgba(0,0,0,0.08)]">
            <Button
              unstyled
              className="bg-primary text-on-primary focus-visible:outline-primary/40 h-10 w-full rounded-[12px] text-sm! font-medium! focus-visible:outline-3 focus-visible:outline-offset-2"
              onClick={() => onOpenContactInfo("owner")}
              type="button"
            >
              تماس با مالک
            </Button>
          </div>
        ) : null
      ) : (
        <div className="bg-surface-container-lowest shrink-0 px-4 py-3 shadow-[0_-4px_8px_rgba(0,0,0,0.08)]">
          {contactActionCount > 0 ? (
            <div className={`grid ${contactActionsGridClassName} gap-4 [direction:ltr]`}>
              {hasContactSheetData ? (
                <Button
                  unstyled
                  className="bg-primary text-on-primary focus-visible:outline-primary/40 flex-1 rounded-[10px] py-2.5 text-sm! font-medium! focus-visible:outline-3 focus-visible:outline-offset-2"
                  onClick={() => onOpenContactInfo("contact")}
                  type="button"
                >
                  {contactInfo.phone ? publisherContact.callLabel : "راه‌های تماس"}
                </Button>
              ) : null}
              {hasChatContact ? (
                <Button
                  unstyled
                  className="border-primary bg-surface-container-lowest text-primary focus-visible:outline-primary/40 flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 text-sm font-medium focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60"
                  disabled={isChatPending}
                  onClick={onOpenChat}
                  type="button"
                >
                  <Typography
                    as="span"
                    variant="label"
                    size="medium"
                    weight="medium"
                    className="text-sm font-medium! [direction:rtl]"
                  >
                    {isChatPending ? "در حال باز کردن چت..." : publisherContact.chatLabel}
                  </Typography>
                  <ViewAdIcon className="h-5! w-5!" name="chat" />
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="bg-surface-container text-outline rounded-[10px] px-4 py-3 text-center text-sm leading-5 font-medium">
              {usesPublicAdPresentation
                ? "راه ارتباطی برای این آگهی ثبت نشده است."
                : "این آگهی برای شماست"}
            </div>
          )}
        </div>
      )}
    </>
  );
}
