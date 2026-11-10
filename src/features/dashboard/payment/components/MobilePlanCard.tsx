import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import LinearTooman from "../../../../shared/icons/LinearTooman";
import type { MobileCreditPlan } from "../types";
import { toFaNumber } from "../paymentPlanHelpers";
import {
  MobileCheckSealIcon,
  MobileDiscountBadge,
  MobileGiftIcon,
} from "./PaymentFeedbackComponents";

export function MobilePrice({ plan }: { plan: MobileCreditPlan }) {
  return (
    <>
      <div className="flex h-6 items-center">
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-primary m-0 [direction:rtl]"
        >
          {plan.title}
        </Typography>
      </div>
      <div className="mt-8 flex items-end gap-x-6">
        <div className="text-right">
          <Typography
            as="p"
            variant="body"
            size="large"
            weight="medium"
            className="text-outline m-0 text-base leading-6 font-semibold line-through"
          >
            {toFaNumber(plan.originalPrice)}
          </Typography>
          <div className="mt-0.5 flex items-center justify-end gap-1 [direction:rtl]">
            <strong className="text-on-surface text-[22px] leading-7 font-semibold">
              {toFaNumber(plan.currentPrice)}
            </strong>
            <LinearTooman className="text-on-surface-var h-6 w-6" />
          </div>
        </div>
        <MobileDiscountBadge discount={plan.discount} />
      </div>
    </>
  );
}

export function MobilePackageContent({ plan }: { plan: MobileCreditPlan }) {
  return (
    <div>
      <div>
        <MobilePrice plan={plan} />
      </div>
      <div className="border-outline-var my-4 h-px border-t border-dashed" />
      <ul className="space-y-4">
        {(plan.benefits ?? []).map((benefit) => (
          <li className="flex h-6 items-center gap-2 text-base leading-6 font-medium" key={benefit}>
            <MobileCheckSealIcon className="text-tertiary h-5 w-5 shrink-0" />
            <Typography as="span" variant="body" size="medium" weight="regular">
              {benefit}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MobileGiftBenefits({ benefits }: { benefits: string[] }) {
  return (
    <div className="border-tertiary bg-tertiary-container/20 text-tertiary h-16 rounded-lg border px-4 py-2">
      <div className="text-tertiary flex h-5 items-center justify-end gap-1 text-sm leading-5 font-medium">
        <MobileGiftIcon className="h-5 w-5" />
        <Typography as="span" variant="body" size="medium" weight="regular">
          بسته هدیه
        </Typography>
      </div>
      <div className="mt-2 flex h-5 items-center justify-between text-sm leading-5 font-medium">
        {benefits.map((benefit, index) => (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className={index < benefits.length - 1 ? "border-tertiary/20 border-l pl-4" : ""}
            key={benefit}
          >
            {benefit}
          </Typography>
        ))}
      </div>
    </div>
  );
}

export function MobilePanelContent({
  plan,
  showGift,
}: {
  plan: MobileCreditPlan;
  showGift: boolean;
}) {
  const hasGiftBenefits = showGift && Boolean(plan.giftBenefits?.length);

  return (
    <div>
      <div>
        <MobilePrice plan={plan} />
      </div>
      {hasGiftBenefits ? <MobileGiftBenefits benefits={plan.giftBenefits ?? []} /> : null}
    </div>
  );
}

export function MobilePlanCard({
  isPackage,
  onPay,
  paymentPending,
  plan,
  showGift,
}: {
  isPackage: boolean;
  onPay: () => void;
  paymentPending: boolean;
  plan: MobileCreditPlan;
  showGift: boolean;
}) {
  return (
    <article
      className={`from-surface-container-lowest to-surface-container-low rounded-2xl border bg-gradient-to-b p-4 ${
        plan.selected ? "border-primary" : "border-outline-var"
      }`}
    >
      {isPackage ? (
        <MobilePackageContent plan={plan} />
      ) : (
        <MobilePanelContent plan={plan} showGift={showGift} />
      )}

      <Button
        className="bg-primary text-on-primary mt-8 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={paymentPending}
        onClick={onPay}
        size="x-medium"
        radius="medium"
        fullWidth
        type="button"
      >
        پرداخت
      </Button>
    </article>
  );
}

export function MobilePlansSkeleton({ showGift = false }: { showGift?: boolean }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className={`${showGift ? "h-[284px]" : "h-[204px]"} border-outline-var bg-surface-container-low animate-pulse rounded-2xl border p-4`}
          key={index}
        >
          <div className="bg-surface-container-high mr-auto h-5 w-16 rounded" />
          <div className="bg-surface-container-high mt-7 mr-auto h-6 w-28 rounded" />
          <div className="bg-surface-container-high mt-9 h-10 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
