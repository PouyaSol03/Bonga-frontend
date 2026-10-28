import { normalizeSocialUrl } from "../../../../shared/utils/social-url";
import { BottomSheet } from "../../../../shared/components/BottomSheet";
import LinearCall from "../../../../shared/icons/LinearCall";
import LinearComment from "../../../../shared/icons/LinearComment";
import LinearLocation from "../../../../shared/icons/LinearLocation";
import LinearUserSolid from "../../../../shared/icons/LinearUserSolid";
import TonalInstagram from "../../../../shared/icons/TonalInstagram";
import TonalTelegram from "../../../../shared/icons/TonalTelegram";
import TonalWhatsapp from "../../../../shared/icons/TonalWhatsapp";
import {
  toEnglishDigits,
  toPersianNumber as toPersianDigits,
} from "../../../../shared/lib/numberUtils";
import { Typography } from "../../../../shared/ui/Typography";

export type AgencyUserContactData = {
  name?: string;
  phone?: string;
  smsPhone?: string;
  address?: string;
  social?: {
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
  };
};

export function AgencyUserContactBottomSheet({
  contact,
  isOpen,
  onClose,
}: {
  contact?: AgencyUserContactData;
  isOpen: boolean;
  onClose: () => void;
}) {
  const name = contact?.name?.trim();
  const phone = contact?.phone?.trim();
  const smsPhone = contact?.smsPhone?.trim() || phone;
  const address = contact?.address?.trim();

  const phoneHref = phone ? toEnglishDigits(phone).replace(/[^\d+]/g, "") : "";
  const phoneDisplay = phone ? toPersianDigits(phone) : "";

  const smsHref = smsPhone ? toEnglishDigits(smsPhone).replace(/[^\d+]/g, "") : "";
  const smsDisplay = smsPhone ? toPersianDigits(smsPhone) : "";

  const socialLinks = [
    {
      ariaLabel: "اینستاگرام",
      icon: <TonalInstagram className="h-9 w-9" />,
      type: "instagram" as const,
      url: contact?.social?.instagram
        ? normalizeSocialUrl("instagram", contact.social.instagram)
        : "",
    },
    {
      ariaLabel: "تلگرام",
      icon: <TonalTelegram className="h-9 w-9" />,
      type: "telegram" as const,
      url: contact?.social?.telegram ? normalizeSocialUrl("telegram", contact.social.telegram) : "",
    },
    {
      ariaLabel: "واتساپ",
      icon: <TonalWhatsapp className="h-9 w-9" />,
      type: "whatsapp" as const,
      url: contact?.social?.whatsapp ? normalizeSocialUrl("whatsapp", contact.social.whatsapp) : "",
    },
  ].filter((item) => Boolean(item.url));

  const hasName = Boolean(name);
  const hasPhone = Boolean(phoneHref);
  const hasSms = Boolean(smsHref);
  const hasAddress = Boolean(address);
  const hasSocial = socialLinks.length > 0;

  return (
    <BottomSheet
      ariaLabel="تماس با کاربر"
      contentClassName="mx-4 mt-2 pb-6"
      heightClassName="h-auto max-h-[calc(100dvh-88px)]"
      isOpen={isOpen}
      onClose={onClose}
      title="تماس با کاربر"
    >
      <div className="flex flex-col">
        {!hasName && !hasPhone && !hasSms && !hasAddress && !hasSocial ? (
          <div className="text-on-surface-var py-8 text-center text-sm font-medium">
            اطلاعات تماس مستقیمی برای این کاربر ثبت نشده است.
          </div>
        ) : null}

        {hasName ? (
          <>
            <div className="flex h-14 items-center justify-between [direction:ltr]">
              <Typography
                as="span"
                variant="label"
                size="large"
                weight="medium"
                className="text-on-surface text-left text-base leading-6 font-semibold"
              >
                {name}
              </Typography>
              <div className="text-on-surface-var flex items-center gap-2 text-base leading-6 font-medium [direction:rtl]">
                <LinearUserSolid className="text-on-surface-var h-6 w-6" />
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="text-on-surface-var"
                >
                  نام کاربر
                </Typography>
              </div>
            </div>
            {hasPhone || hasSms || hasAddress || hasSocial ? (
              <div className="bg-outline-var h-px" />
            ) : null}
          </>
        ) : null}

        {hasPhone ? (
          <>
            <div className="flex h-14 items-center justify-between [direction:ltr]">
              <a
                className="text-on-surface text-left text-base leading-6 font-semibold no-underline [direction:ltr]"
                href={`tel:${phoneHref}`}
                tabIndex={isOpen ? 0 : -1}
              >
                {phoneDisplay}
              </a>
              <a
                className="text-on-surface-var flex items-center gap-2 text-base leading-6 font-medium no-underline [direction:rtl]"
                href={`tel:${phoneHref}`}
                tabIndex={isOpen ? 0 : -1}
              >
                <LinearCall className="text-on-surface-var h-6 w-6" />
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="text-on-surface-var"
                >
                  شماره همراه
                </Typography>
              </a>
            </div>
            {hasSms || hasAddress || hasSocial ? <div className="bg-outline-var h-px" /> : null}
          </>
        ) : null}

        {hasSms ? (
          <>
            <div className="flex h-14 items-center justify-between [direction:ltr]">
              <a
                className="text-on-surface text-left text-base leading-6 font-semibold no-underline [direction:ltr]"
                href={`sms:${smsHref}`}
                tabIndex={isOpen ? 0 : -1}
              >
                {smsDisplay}
              </a>
              <a
                className="text-on-surface-var flex items-center gap-2 text-base leading-6 font-medium no-underline [direction:rtl]"
                href={`sms:${smsHref}`}
                tabIndex={isOpen ? 0 : -1}
              >
                <LinearComment className="text-on-surface-var h-6 w-6" />
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="text-on-surface-var"
                >
                  پیامک
                </Typography>
              </a>
            </div>
            {hasAddress || hasSocial ? <div className="bg-outline-var h-px" /> : null}
          </>
        ) : null}

        {hasAddress ? (
          <div className="py-4 text-right [direction:rtl]">
            <div className="text-on-surface-var flex items-center gap-2 text-base leading-6 font-medium">
              <LinearLocation className="text-on-surface-var h-6 w-6" />
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="text-on-surface-var"
              >
                نشانی ملک
              </Typography>
            </div>
            <Typography
              as="p"
              variant="body"
              size="large"
              weight="medium"
              className="text-on-surface mt-3 text-right text-base leading-6 font-semibold"
            >
              {address}
            </Typography>
          </div>
        ) : null}

        {hasSocial ? (
          <div className="mt-4 pt-1 text-right [direction:rtl]">
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="text-on-surface-var mb-4 block text-sm font-medium"
            >
              شبکه‌های اجتماعی
            </Typography>
            <div className="flex items-center justify-end gap-4 [direction:ltr]">
              {socialLinks.map((item) => (
                <a
                  aria-label={item.ariaLabel}
                  className="transition-transform active:scale-95"
                  href={item.url}
                  key={item.type}
                  rel="noreferrer"
                  tabIndex={isOpen ? 0 : -1}
                  target="_blank"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </BottomSheet>
  );
}
