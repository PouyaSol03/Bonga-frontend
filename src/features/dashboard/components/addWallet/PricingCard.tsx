import { AdCardTomanIcon } from "../../../advertisements/components/AdCardIcons";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";

type PricingCardItem = {
  value: string | number;
  label: string;
};

type PricingCardProps = {
  title: string;
  price: string | number;
  discount?: string | number;
  priceAfterDiscount: string | number;
  items?: PricingCardItem[];
  onPay?: () => void;
};

function formatPrice(value: string | number) {
  if (typeof value === "number") {
    return value.toLocaleString("fa-IR");
  }

  return value;
}

function DiscountBadge({ value }: { value?: string | number }) {
  if (!value) return null;

  return (
    <Typography as="span" variant="label" size="small" weight="medium" className="rounded-md border border-[#FF4B4B] bg-white px-2 py-1 text-[10px] font-medium text-[#FF4B4B]">
      {value}٪ تخفیف
    </Typography>
  );
}

function GreenBadgeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
      <path d="M7.70453 0.558591C8.62277 -0.186895 9.93778 -0.186895 10.856 0.558592L11.8024 1.32696C12.1793 1.63294 12.6371 1.82257 13.12 1.87271L14.3325 1.99861C15.509 2.12076 16.4388 3.05062 16.561 4.22704L16.6869 5.43959C16.737 5.92244 16.9266 6.38025 17.2326 6.75713L18.001 7.70356C18.7465 8.62179 18.7465 9.9368 18.001 10.855L17.2326 11.8015C16.9266 12.1783 16.737 12.6362 16.6869 13.119L16.561 14.3315C16.4388 15.508 15.509 16.4378 14.3325 16.56L13.12 16.6859C12.6371 16.736 12.1793 16.9257 11.8024 17.2316L10.856 18C9.93778 18.7455 8.62277 18.7455 7.70453 18L6.75811 17.2316C6.38123 16.9257 5.92342 16.736 5.44056 16.6859L4.22802 16.56C3.05159 16.4378 2.12174 15.508 1.99959 14.3315L1.87368 13.119C1.82355 12.6362 1.63391 12.1783 1.32794 11.8015L0.559568 10.855C-0.185918 9.9368 -0.185918 8.62179 0.559568 7.70355L1.32794 6.75713C1.63392 6.38025 1.82355 5.92244 1.87368 5.43959L1.99959 4.22704C2.12174 3.05062 3.05159 2.12076 4.22802 1.99861L5.44056 1.87271C5.92342 1.82257 6.38123 1.63294 6.75811 1.32696L7.70453 0.558591Z" fill="#11A366" />

      <path d="M5.2 9.4L8.2 12.4L13.8 6.8"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
  );
}

export default function PricingCard({
  title,
  price,
  discount,
  priceAfterDiscount,
  items,
  onPay,
}: PricingCardProps) {
  const hasItems = Boolean(items?.length);

  return (
    <div
      dir="rtl"
      className="
        group flex w-full flex-col rounded-xl border border-[#0048C4]
        bg-white px-5 py-6 transition-all duration-200
        hover:bg-linear-to-t hover:to-[#0048C400] hover:from-[#0048C414]
      "
    >
      <Typography as="h3" variant="title" size="medium" weight="semibold" className="mb-6 text-right text-lg font-bold text-[#0048C4]">
        {title}
      </Typography>

      <div className="mb-8 flex items-end justify-between gap-3">
        <div className="flex flex-col items-start gap-2">
          <Typography as="span" variant="label" size="small" weight="semibold" className="text-xs font-semibold text-[#C5C5C5] line-through">
            {formatPrice(price)}
          </Typography>

          <div className="flex items-center gap-1">
            <Typography as="span" variant="headline" size="small" className="text-2xl font-semibold text-[#1F2937]">
              {formatPrice(priceAfterDiscount)}
            </Typography>
            <Typography as="span" variant="label" size="small" weight="medium" className="text-[11px] font-medium text-[#1F2937]">
              <AdCardTomanIcon className="h-5 w-5 shrink-0 text-[#4D4D4D]" />
            </Typography>
          </div>
        </div>

        <DiscountBadge value={discount} />
      </div>

      {hasItems && (
        <>
          <div className="mb-7 border-t border-dashed border-[#D9DDE7]" />

          <div className="mb-10 flex flex-col gap-4">
            {items?.map((item) => (
              <div
                key={`${item.value}-${item.label}`}
                className="flex items-center justify-start gap-2 font-medium text-[#1F2937]"
              >
                <GreenBadgeIcon />
                <Typography as="span" variant="body" size="medium" weight="regular">
                  {item.value} اعتبار {item.label}
                </Typography>
              </div>
            ))}
          </div>
        </>
      )}

      <Button unstyled
        type="button"
        onClick={onPay}
        className="
          mt-auto h-11 w-full rounded-lg border border-[#0048C4]
          bg-white text-sm font-semibold text-[#0048C4]
          transition-all duration-200
          group-hover:bg-[#0048C4] group-hover:text-white
        "
      >
        پرداخت
      </Button>
    </div>
  );
}