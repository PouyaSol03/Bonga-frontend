import type { ReactNode } from "react";
import { Typography } from "../../../../shared/ui/Typography";
import type { CrmRecord } from "../../api/crm.service";
import {
  readPaymentBankCode,
  readPaymentBankMessage,
  readPaymentCardHash,
  readPaymentCardPan,
  readPaymentFee,
  readPaymentFeeType,
  readPaymentOrderId,
  readPaymentReference,
  readPaymentShaparakFee,
  readPaymentWages,
  readText,
} from "../paymentBankHelpers";
import {
  readPaymentAmount,
  readPaymentDate,
  readPaymentId,
  readPaymentMethodLabel,
  readPaymentMobile,
  readPaymentPurposeLabel,
  readPaymentStatusLabel,
  readPaymentUpdatedDate,
  readPaymentUserName,
} from "../paymentHelpers";

export function DetailsSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-xl border border-[#edf0f5] bg-[#fbfcfe] p-4">
      <Typography
        as="h3"
        variant="title"
        size="small"
        weight="semibold"
        className="m-0 mb-3 text-sm font-black text-[#344054]"
      >
        {title}
      </Typography>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function DetailItem({
  label,
  ltr = false,
  value,
  wide = false,
}: {
  label: string;
  ltr?: boolean;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-lg bg-white px-3 py-2.5 ${wide ? "sm:col-span-2" : ""}`}>
      <Typography
        as="span"
        variant="label"
        size="small"
        weight="semibold"
        className="block text-xs font-semibold text-[#8a94a3]"
      >
        {label}
      </Typography>
      <strong
        className={`mt-1 block text-sm font-bold break-words text-[#303846] ${ltr ? "text-left [direction:ltr]" : ""}`}
      >
        {value}
      </strong>
    </div>
  );
}

export function TransactionInfoSection({ payment }: { payment: CrmRecord }) {
  return (
    <DetailsSection title="اطلاعات تراکنش">
      <DetailItem label="شناسه پرداخت" value={readPaymentId(payment)} ltr />
      <DetailItem label="کد مرجع بانکی" value={readPaymentReference(payment)} ltr />
      <DetailItem label="شناسه سفارش" value={readPaymentOrderId(payment)} ltr />
      <DetailItem label="مبلغ" value={readPaymentAmount(payment)} />
      <DetailItem label="وضعیت" value={readPaymentStatusLabel(payment)} />
      <DetailItem label="کد پاسخ بانک" value={readPaymentBankCode(payment)} ltr />
      <DetailItem label="پیام بانک" value={readPaymentBankMessage(payment)} ltr />
      <DetailItem label="روش پرداخت" value={readPaymentMethodLabel(payment)} />
      <DetailItem label="بابت پرداخت" value={readPaymentPurposeLabel(payment)} />
      <DetailItem label="زمان ثبت" value={readPaymentDate(payment)} />
      <DetailItem label="آخرین به‌روزرسانی" value={readPaymentUpdatedDate(payment)} />
    </DetailsSection>
  );
}

export function BankInfoSection({ payment }: { payment: CrmRecord }) {
  return (
    <DetailsSection title="اطلاعات بانکی">
      <DetailItem label="شماره کارت" value={readPaymentCardPan(payment)} ltr />
      <DetailItem label="هش کارت" value={readPaymentCardHash(payment)} ltr wide />
      <DetailItem label="کارمزد درگاه" value={readPaymentFee(payment)} />
      <DetailItem label="نوع پرداخت کارمزد" value={readPaymentFeeType(payment)} ltr />
      <DetailItem label="کارمزد شاپرک" value={readPaymentShaparakFee(payment)} />
      <DetailItem label="دستمزدها" value={readPaymentWages(payment)} />
    </DetailsSection>
  );
}

export function UserInfoSection({
  payment,
  user,
}: {
  payment: CrmRecord;
  user: CrmRecord;
}) {
  return (
    <DetailsSection title="کاربر پرداخت‌کننده">
      <DetailItem label="نام و نام خانوادگی" value={readPaymentUserName(payment)} />
      <DetailItem label="شماره موبایل" value={readPaymentMobile(payment)} ltr />
      <DetailItem
        label="شناسه کاربر"
        value={readText(payment, ["user_id"], readText(user, ["id", "_id"], "-"))}
        ltr
      />
    </DetailsSection>
  );
}

export function RelatedInfoSection({
  advertise,
  agency,
  linkedPackage,
  payment,
}: {
  advertise: CrmRecord;
  agency: CrmRecord;
  linkedPackage: CrmRecord;
  payment: CrmRecord;
}) {
  return (
    <DetailsSection title="اطلاعات مرتبط">
      <DetailItem label="آژانس" value={readText(agency, ["name", "title"], "-")} />
      <DetailItem
        label="شناسه آژانس"
        value={readText(payment, ["agency_id"], readText(agency, ["id", "_id"], "-"))}
        ltr
      />
      <DetailItem label="عنوان آگهی" value={readText(advertise, ["title"], "-")} />
      <DetailItem
        label="شناسه آگهی"
        value={readText(payment, ["advertise_id"], readText(advertise, ["id", "_id"], "-"))}
        ltr
      />
      <DetailItem label="کد پیگیری آگهی" value={readText(advertise, ["track_code"], "-")} ltr />
      <DetailItem label="عنوان بسته" value={readText(linkedPackage, ["title"], "-")} />
      <DetailItem
        label="شناسه بسته"
        value={readText(payment, ["package_id"], readText(linkedPackage, ["id", "slug"], "-"))}
        ltr
      />
    </DetailsSection>
  );
}
