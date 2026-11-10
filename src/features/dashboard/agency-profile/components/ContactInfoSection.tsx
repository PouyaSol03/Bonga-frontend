import TonalInstagram from "../../../../shared/icons/TonalInstagram";
import TonalTelegram from "../../../../shared/icons/TonalTelegram";
import TonalWhatsapp from "../../../../shared/icons/TonalWhatsapp";
import { Typography } from "../../../../shared/ui/Typography";
import { Section, Field, Separator } from "./AgencyProfileFields";

export function ContactInfoSection({
  address,
  onAddressChange,
  onPhone1Change,
  onPhone2Change,
  onPhone3Change,
  onTelegramChange,
  onWhatsappChange,
  onInstagramChange,
  phone1,
  phone2,
  phone3,
  telegram,
  whatsapp,
  instagram,
}: {
  address: string;
  onAddressChange: (value: string) => void;
  onPhone1Change: (value: string) => void;
  onPhone2Change: (value: string) => void;
  onPhone3Change: (value: string) => void;
  onTelegramChange: (value: string) => void;
  onWhatsappChange: (value: string) => void;
  onInstagramChange: (value: string) => void;
  phone1: string;
  phone2: string;
  phone3: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
}) {
  return (
    <Section title="اطلاعات تماس">
      <div className="grid gap-3">
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="medium"
          className="text-on-surface mt-4 text-right leading-5 font-medium"
        >
          شماره تماس
        </Typography>
        <Field onChange={onPhone1Change} placeholder="شماره تماس اول" value={phone1} />
        <Field onChange={onPhone2Change} placeholder="شماره تماس دوم" value={phone2} />
        <Field onChange={onPhone3Change} placeholder="شماره همراه" value={phone3} />
      </div>

      <Separator />

      <div className="grid gap-3">
        <Typography
          as="h3"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-right text-base leading-6 font-semibold"
        >
          شبکه‌های اجتماعی
        </Typography>
        <Field
          icon={<TonalTelegram className="h-6 w-6" />}
          onChange={onTelegramChange}
          placeholder="آیدی تلگرام بدون @"
          value={telegram}
        />
        <Field
          icon={<TonalWhatsapp className="h-6 w-6" />}
          onChange={onWhatsappChange}
          placeholder="شماره واتساپ بدون صفر"
          value={whatsapp}
        />
        <Field
          icon={<TonalInstagram className="h-6 w-6" />}
          onChange={onInstagramChange}
          placeholder="آیدی اینستاگرام بدون @"
          value={instagram}
        />
      </div>

      <Separator />

      <div className="grid gap-3">
        <Typography
          as="h3"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-right text-base leading-6 font-semibold"
        >
          نشانی
        </Typography>
        <Field
          className="h-[122px] items-start py-3"
          multiline
          onChange={onAddressChange}
          placeholder="نشانی آژانس را وارد کنید"
          value={address}
        />
      </div>
    </Section>
  );
}
