import { normalizeSocialUrl } from "../../../../shared/utils/social-url";
import { BottomSheet } from "../../../../shared/components/BottomSheet";
import { toEnglishDigits, toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import { Typography } from "../../../../shared/ui/Typography";
import { type SingleAdContactInfo } from "./contactInfo";
import { PhoneIcon, MessageIcon, SocialIcon } from "./contactIcons";

export function ContactInfoBottomSheet({
  contactInfo,
  isOpen,
  onClose,
}: {
  contactInfo: SingleAdContactInfo;
  isOpen: boolean;
  onClose: () => void;
}) {
  const phoneHref = toEnglishDigits(contactInfo.phone).replace(/[^\d+]/g, "");
  const phoneDisplay = contactInfo.phone ? toPersianDigits(contactInfo.phone) : "";
  const socialLinks = [
    {
      ariaLabel: "واتساپ",
      type: "whatsapp" as const,
      url: normalizeSocialUrl("whatsapp", contactInfo.whatsapp),
    },
    {
      ariaLabel: "تلگرام",
      type: "telegram" as const,
      url: normalizeSocialUrl("telegram", contactInfo.telegram),
    },
    {
      ariaLabel: "اینستاگرام",
      type: "instagram" as const,
      url: normalizeSocialUrl("instagram", contactInfo.instagram),
    },
  ].filter((item) => Boolean(item.url));
  const hasAnyVisibleContact = Boolean(phoneHref) || socialLinks.length > 0;

  return (
    <BottomSheet
      ariaLabel="اطلاعات تماس"
      contentClassName="mx-4 mt-5 pb-5"
      heightClassName="h-auto max-h-[calc(100dvh-88px)]"
      isOpen={isOpen}
      onClose={onClose}
      title="اطلاعات تماس"
    >
      {phoneHref ? (
        <>
          <div className="flex h-14 items-center justify-between [direction:ltr]">
            <Typography
              as="span"
              variant="label"
              size="large"
              weight="medium"
              className="text-on-surface text-left text-base leading-6 font-medium"
            >
              {phoneDisplay}
            </Typography>
            <a
              className="text-on-surface-var flex items-center gap-2 text-base leading-6 font-medium no-underline [direction:rtl]"
              href={`tel:${phoneHref}`}
              tabIndex={isOpen ? 0 : -1}
            >
              <PhoneIcon className="h-6 w-6" />
              <Typography as="span" variant="body" size="medium" weight="regular">
                تماس با
              </Typography>
            </a>
          </div>
          <div className="bg-outline-var h-px" />
          <div className="flex h-14 items-center justify-between [direction:ltr]">
            <Typography
              as="span"
              variant="label"
              size="large"
              weight="medium"
              className="text-on-surface text-left text-base leading-6 font-medium"
            >
              {phoneDisplay}
            </Typography>
            <a
              className="text-on-surface-var flex items-center gap-2 text-base leading-6 font-medium no-underline [direction:rtl]"
              href={`sms:${phoneHref}`}
              tabIndex={isOpen ? 0 : -1}
            >
              <MessageIcon className="h-6 w-6" />
              <Typography as="span" variant="body" size="medium" weight="regular">
                ارسال پیامک
              </Typography>
            </a>
          </div>
          {socialLinks.length ? <div className="bg-outline-var h-px" /> : null}
        </>
      ) : null}

      {socialLinks.length ? (
        <div className="flex h-16 items-center justify-between [direction:ltr]">
          <div className="flex gap-4">
            {socialLinks.map((item) => (
              <a
                aria-label={item.ariaLabel}
                className="grid h-14 w-14 place-items-center rounded-full"
                href={item.url}
                key={item.type}
                tabIndex={isOpen ? 0 : -1}
                target="_blank"
                rel="noreferrer"
              >
                <SocialIcon type={item.type} />
              </a>
            ))}
          </div>
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-on-surface-var text-right text-sm leading-5 font-medium"
          >
            شبکه‌های اجتماعی
          </Typography>
        </div>
      ) : null}

      {!hasAnyVisibleContact ? (
        <div className="bg-surface-container text-on-surface-var rounded-xl px-4 py-5 text-center text-sm leading-6 font-medium">
          شماره تماس یا شبکه اجتماعی برای این آگهی ثبت نشده است.
        </div>
      ) : null}
    </BottomSheet>
  );
}
