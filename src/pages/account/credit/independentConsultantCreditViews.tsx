import { PageFrame } from "../../../app/PageFrame";
import { DemoNotice } from "../../../components/DemoNotice";
import { TopBar } from "../../../components/TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import { useDemoNotice } from "../../../hooks/useDemoNotice";
import { creditPackages, panelCreditBonusPlans, panelCreditPlans, type CreditPlan } from "./creditData";


type CreditView = "packages" | "panel" | "panel-bonus";

export function IndependentConsultantCreditPage({ view }: { view: CreditView }) {
  const { message, showNotice } = useDemoNotice();
  const isPackages = view === "packages";
  const hasGiftBenefits = view === "panel-bonus";
  const plans = isPackages
    ? creditPackages
    : hasGiftBenefits
      ? panelCreditBonusPlans
      : panelCreditPlans;

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <CreditTopBar />
      <CreditTabs activeTab={isPackages ? "packages" : "panel"} />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pb-4">
        <div className="space-y-4">
          {plans.map((plan) => (
            <CreditPlanCard
              hasGiftBenefits={hasGiftBenefits}
              isPackage={isPackages}
              key={plan.name}
              onPay={() => showNotice(`پرداخت ${plan.name} در نسخه نمایشی ثبت شد`)}
              plan={plan}
            />
          ))}
        </div>
      </main>
      <DemoNotice message={message} />
    </PageFrame>
  );
}

function CreditTopBar() {
  return (
    <TopBar
      backTo="/account"
      startSlot={
        <RouteLink
          className="inline-flex h-12 items-center px-3 text-sm font-medium leading-5 text-[#0048c4] no-underline"
          to="/account/credit/history"
        >
          تاریخچه پرداخت
        </RouteLink>
      }
      title="افزایش اعتبار"
    />
  );
}

function CreditTabs({ activeTab }: { activeTab: "packages" | "panel" }) {
  return (
    <nav className="shrink-0 bg-white px-4 py-4" aria-label="نوع افزایش اعتبار">
      <div className="flex h-11 overflow-hidden rounded-xl border border-[#0048c4] [direction:ltr]">
        <RouteLink
          className={`flex flex-1 items-center justify-center text-base font-medium leading-6 no-underline [direction:rtl] ${
            activeTab === "panel" ? "bg-[#0048c41f] text-[#002099]" : "bg-white text-[#4d4d4d]"
          }`}
          to="/account/credit/panel"
        >
          اعتبار پنل
        </RouteLink>
        <RouteLink
          className={`flex flex-1 items-center justify-center border-l border-[#0048c4] text-base font-medium leading-6 no-underline [direction:rtl] ${
            activeTab === "packages" ? "bg-[#0048c41f] text-[#002099]" : "bg-white text-[#4d4d4d]"
          }`}
          to="/account/credit/packages"
        >
          بسته‌ها
        </RouteLink>
      </div>
    </nav>
  );
}

function CreditPlanCard({
  hasGiftBenefits,
  isPackage,
  plan,
  onPay,
}: {
  hasGiftBenefits: boolean;
  isPackage: boolean;
  plan: CreditPlan;
  onPay: () => void;
}) {
  return (
    <article
      className={`rounded-2xl border bg-gradient-to-b from-white to-[#edf1fa] p-4 ${
        plan.selected ? "border-[#0048c4]" : "border-[#cccccc]"
      }`}
    >
      {isPackage ? (
        <PackageCardContent plan={plan} />
      ) : hasGiftBenefits ? (
        <PanelBonusCardContent plan={plan} />
      ) : (
        <PanelCardContent plan={plan} />
      )}

      <button
        className="mt-4 h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
        onClick={onPay}
        type="button"
      >
        پرداخت
      </button>
    </article>
  );
}

function PanelCardContent({ plan }: { plan: CreditPlan }) {
  return (
    <div className="h-[124px]">
      <CreditPrice plan={plan} />
    </div>
  );
}

function PanelBonusCardContent({ plan }: { plan: CreditPlan }) {
  return (
    <div className="h-[204px]">
      <div className="h-[124px]">
        <CreditPrice plan={plan} />
      </div>
      <GiftBenefits benefits={plan.giftBenefits ?? []} />
    </div>
  );
}

function PackageCardContent({ plan }: { plan: CreditPlan }) {
  return (
    <div className="h-[261px]">
      <div className="h-[108px]">
        <CreditPrice plan={plan} />
      </div>
      <div className="my-4 h-px border-t border-dashed border-[#cccccc]" />
      <ul className="space-y-4">
        {(plan.benefits ?? []).map((benefit) => (
          <li className="flex h-6 items-center gap-2 text-base font-medium leading-6" key={benefit}>
            <CheckSealIcon className="h-5 w-5 shrink-0 text-[#11a366]" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CreditPrice({ plan }: { plan: CreditPlan }) {
  return (
    <>
      <div className="flex h-6 items-center justify-end">
        <h2 className="m-0 text-base font-semibold leading-6 text-[#0048c4] [direction:rtl]">{plan.name}</h2>
      </div>
      <div className="mt-4 flex h-[68px] items-end justify-between [direction:ltr]">
        <span className="mb-1 rounded-lg border border-[#ee3623] bg-white px-2 py-1 text-xs font-normal leading-4 text-[#ee3623]">
          ۱۰٪ تخفیف
        </span>
        <div className="text-right [direction:rtl]">
          <p className="m-0 text-base font-semibold leading-6 text-[#a6a6a6] line-through">{plan.originalPrice}</p>
          <div className="mt-0.5 flex items-center justify-end gap-1 [direction:rtl]">
            <strong className="text-[22px] font-semibold leading-7 text-[#1a1a1a]">{plan.currentPrice}</strong>
            <span className="text-xs font-medium leading-4 text-[#1a1a1a]">تومان</span>
          </div>
        </div>
      </div>
    </>
  );
}

function GiftBenefits({ benefits }: { benefits: string[] }) {
  return (
    <div className="h-16 rounded-lg border border-[#11a366] bg-[#11a36614] px-4 py-2 text-[#006038]">
      <div className="flex h-5 items-center justify-end gap-1 text-sm font-medium leading-5 text-[#11a366]">
        <GiftIcon className="h-5 w-5" />
        <span>بسته هدیه</span>
      </div>
      <div className="mt-2 flex h-5 items-center justify-between text-sm font-medium leading-5">
        {benefits.map((benefit, index) => (
          <span
            className={`${index < benefits.length - 1 ? "border-l border-[#00603829] pl-4" : ""}`}
            key={benefit}
          >
            {benefit}
          </span>
        ))}
      </div>
    </div>
  );
}

function CheckSealIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 1.4 12.4 3l2.9-.1.8 2.8 2 2-1.3 2.6.4 2.9-2.8 1-1.8 2.2-2.6-1.2-2.6 1.2-1.8-2.2-2.8-1 .4-2.9-1.3-2.6 2-2 .8-2.8 2.9.1L10 1.4Z" />
      <path d="m6.2 10 2.4 2.3 5.1-5.2" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

function GiftIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 20 20">
      <path d="M3 8h14v3H3V8ZM4.5 11h11v6h-11v-6ZM10 8v9" />
      <path d="M10 8H7.2a2.1 2.1 0 1 1 0-4.2C9.1 3.8 10 8 10 8Zm0 0h2.8a2.1 2.1 0 1 0 0-4.2C10.9 3.8 10 8 10 8Z" />
    </svg>
  );
}
