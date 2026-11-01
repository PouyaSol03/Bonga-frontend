import { BottomSheet } from "../../../../shared/components/BottomSheet";
import TonalInstagram from "../../../../shared/icons/TonalInstagram";
import TonalTelegram from "../../../../shared/icons/TonalTelegram";
import TonalWhatsapp from "../../../../shared/icons/TonalWhatsapp";
import { toEnglishDigits } from "../../../../shared/lib/numberUtils";
import { Typography } from "../../../../shared/ui/Typography";
import { normalizeSocialUrl } from "../../../../shared/utils/social-url";
import type { AgencyPreviewContactInfo } from "../types";
import { AgencyMiniMap, ContactRow } from "./AgencyContactComponents";

interface AgencyContactBottomSheetProps {
  contactInfo: AgencyPreviewContactInfo;
  isOpen: boolean;
  onClose: () => void;
}

export function AgencyContactBottomSheet({
  contactInfo,
  isOpen,
  onClose,
}: AgencyContactBottomSheetProps) {
  const phoneHref = toEnglishDigits(contactInfo.phone).replace(/[^\d+]/g, "");
  const secondPhoneHref = toEnglishDigits(contactInfo.secondPhone).replace(/[^\d+]/g, "");
  const messagePhoneHref = toEnglishDigits(contactInfo.landline).replace(/[^\d+]/g, "");
  const socialLinks = [
    {
      label: "واتساپ",
      href: normalizeSocialUrl("whatsapp", contactInfo.whatsapp),
      icon: <TonalWhatsapp className="h-6 w-6" />,
    },
    {
      label: "تلگرام",
      href: normalizeSocialUrl("telegram", contactInfo.telegram),
      icon: <TonalTelegram className="h-6 w-6" />,
    },
    {
      label: "اینستاگرام",
      href: normalizeSocialUrl("instagram", contactInfo.instagram),
      icon: <TonalInstagram className="h-6 w-6" />,
    },
  ].filter((item) => item.href);
  const hasMap = contactInfo.lat !== undefined && contactInfo.lng !== undefined;
  const contactRowCount = [contactInfo.phone, contactInfo.secondPhone, contactInfo.landline].filter(
    Boolean,
  ).length;
  const hasAnyContactInfo = contactRowCount > 0 || hasMap || socialLinks.length > 0;
  const hasRichContactInfo = contactRowCount === 3 && hasMap && socialLinks.length > 0;

  return (
    <BottomSheet
      ariaLabel="اطلاعات تماس"
      contentClassName="mx-4 mt-2 pb-5"
      heightClassName={
        hasRichContactInfo ? "h-[min(571px,calc(100dvh-56px))]" : "h-auto max-h-[calc(100dvh-56px)]"
      }
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-2"
      title="اطلاعات تماس"
    >
      <div>
        {contactInfo.phone ? (
          <ContactRow href={`tel:${phoneHref}`} label="شماره اصلی" value={contactInfo.phone} />
        ) : null}
        {contactInfo.secondPhone ? (
          <ContactRow
            href={`tel:${secondPhoneHref}`}
            label="شماره دوم"
            value={contactInfo.secondPhone}
          />
        ) : null}
        {contactInfo.landline ? (
          <ContactRow
            href={`sms:${messagePhoneHref}`}
            icon="message"
            label="پیامک"
            value={contactInfo.landline}
          />
        ) : null}
      </div>

      {hasMap ? (
        <div
          className={`${contactRowCount ? "mt-4" : "mt-2"} bg-surface-container-low overflow-hidden rounded-2xl`}
        >
          <AgencyMiniMap lat={contactInfo.lat as number} lng={contactInfo.lng as number} />
        </div>
      ) : null}

      {socialLinks.length ? (
        <div className="mt-4 pb-1">
          <Typography
            as="p"
            variant="label"
            size="medium"
            weight="medium"
            className="text-on-surface-var m-0 text-right text-sm leading-5 font-medium"
          >
            شبکه‌های اجتماعی
          </Typography>
          <div className="mt-3 flex items-center justify-end gap-10 [direction:ltr]">
            {socialLinks.map((item) => (
              <a
                aria-label={item.label}
                className="grid h-6 w-6 shrink-0 place-items-center no-underline"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {!hasAnyContactInfo ? (
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-outline m-0 py-6 text-center text-sm"
        >
          اطلاعات تماسی ثبت نشده است.
        </Typography>
      ) : null}
    </BottomSheet>
  );
}
