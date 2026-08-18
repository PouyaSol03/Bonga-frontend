import { useState, type ComponentType, type Dispatch, type ReactNode, type SetStateAction, type SVGProps } from "react";
import { PageFrame } from "../../app/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { setStoredActiveRole } from "../../core/auth/auth-storage";
import { USER } from "../../shared/constants/roles.constants";
import { getMyProfile } from "../../core/services/account.service";
import { RouteLink } from "../../app/router/RouteLink";
import type { NeighborhoodDto } from "../../core/services/neighborhood.service";
import LinearCancelSmall from "../../shared/icons/LinearCancelSmall";
import { ChoiceIndicator } from "../../shared/ui/Choice";

import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import LinearWalletAdd from "../../shared/icons/LinearWalletAdd";
import LinearTag from "../../shared/icons/LinearTag";
import Dashboard from "../../shared/icons/Dashboard";
import LinearRequest from "../../shared/icons/LinearRequest";
import LinearRanking from "../../shared/icons/LinearRanking";
import LinearEditUser from "../../shared/icons/LinearEditUser";
import LinearCity from "../../shared/icons/LinearCity";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import LinearTick from "../../shared/icons/LinearTick";
import LinearArrowRight1 from "../../shared/icons/LinearArrowRight1";

export type BusinessType = "agency" | "independent-consultant";

export type BusinessToast = {
  message: string;
  title: string;
  variant: "error" | "success" | "info" | "warning";
};

type InfoCardSection = {
  afterBullets?: string;
  bullets?: string[];
  description?: string;
  title?: string;
};

type InfoCard = {
  bullets?: string[];
  description?: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  sections?: InfoCardSection[];
  subtitle: string;
  title: string;
};



export const businessInfoCards: Record<BusinessType, InfoCard[]> = {
  agency: [
    {
      bullets: [
        "وضعیت و عملکرد آگهی‌ها را ببینید",
        "فعالیت مشاورین را رصد کنید",
        "اعتبار را مدیریت کنید",
        "تصویر شفافی از وضعیت آژانس داشته باشید",
      ],
      description:
        "داشبورد، نقطه شروع مدیریت هوشمند است. اینجا می‌توانید در چند ثانیه:",
      Icon: Dashboard,
      subtitle: "تصمیم‌گیری سریع، بر پایه داده‌های واقعی",
      title: "مدیریت سیستم",
    },
    {
      bullets: [
        "معرفی آژانس و اطلاعات تماس",
        "درباره برند شما",
        "لیست مشاورین فعال",
        "آگهی‌های منتشرشده",
      ],
      description:
        "هر آژانس دارای یک صفحه اختصاصی مشابه یک وب‌سایت حرفه‌ای است که شامل:",
      Icon: LinearCity,
      subtitle: "ویترین دیجیتال شما",
      title: "صفحه آژانس",
    },
    {
      Icon: LinearTag,
      sections: [
        {
          description:
            "تمام آگهی‌های منتشرشده و فعال شما به‌صورت متمرکز قابل مدیریت هستند.",
          title: "آگهی‌های فعال",
        },
        {
          bullets: [
            "آگهی را به مشاور دلخواه اختصاص دهد",
            "یا مستقیماً آگهی را توسط آژانس منتشر کند",
          ],
          description:
            "کاربرانی که آگهی خود را به آژانس می‌سپارند، در این بخش قرار می‌گیرند. مدیر آژانس می‌تواند:",
          title: "آگهی‌های تخصیصی",
        },
        {
          bullets: [
            "استفاده از اعتبار پنل",
            "پرداخت از کیف پول",
            "پرداخت آنلاین",
          ],
          description: "پرداخت هزینه آگهی کاملاً ساده و منعطف است:",
          title: "پرداخت منعطف",
        },
      ],
      subtitle: "تصمیم‌گیری سریع، بر پایه داده‌های واقعی",
      title: "مدیریت آگهی‌ها",
    },
    {
      Icon: LinearRequest,
      sections: [
        {
          description:
            "درخواست‌های ثبت‌شده کاربران شامل نیازهای ملکی آن‌هاست. این داده‌ها به آژانس کمک می‌کند دقیق‌تر آگهی منتشر کند و پس از انتشار، اعلان آن را به کاربر ارسال نماید.",
          title: "دریافتی کاربران",
        },
        {
          description:
            "درخواست‌هایی که توسط خود آژانس ثبت می‌شود، در این بخش مدیریت می‌گردد.",
          title: "درخواست‌های آژانس",
        },
        {
          description:
            "تمام نتایج درخواست‌های ثبت‌شده آژانس به‌صورت شفاف در دسترس است.",
          title: "نتایج درخواست‌ها",
        },
      ],
      subtitle: "اتصال هوشمند به نیاز بازار",
      title: "مدیریت درخواست‌ها",
    },
    {
      Icon: LinearEditUser,
      sections: [
        {
          description:
            "با جستجوی شماره تلفن مشاوران ثبت‌نام‌شده در سامانه، تنها با یک درخواست آن‌ها را به آژانس خود دعوت کنید.",
          title: "افزودن سریع مشاور",
        },
        {
          bullets: [
            "مشاور عادی",
            "مشاور مدیر با دسترسی به مدیریت آگهی‌ها، مشاورین، درخواست‌ها، اعتبار و پشتیبانی",
          ],
          description: "دو سطح دسترسی تعریف شده است:",
          title: "سطوح دسترسی هوشمند",
        },
        {
          afterBullets: "استفاده کند.",
          bullets: [
            "ثبت آگهی",
            "بروزرسانی آگهی",
            "ویژه‌سازی آگهی‌ها",
          ],
          description: "به هر مشاور اعتبار اختصاص دهید تا از آن برای:",
          title: "تخصیص اعتبار به مشاورین",
        },
        {
          description:
            "در صورت حذف مشاور، آگهی‌های او به‌راحتی به مشاور دیگر یا خود آژانس منتقل می‌شوند؛ بدون از دست رفتن اطلاعات.",
          title: "کنترل کامل حتی هنگام حذف مشاور",
        },
        {
          description:
            "برای هر مشاور یک داشبورد اختصاصی وجود دارد تا عملکرد و آمار فعالیت او به صورت شفاف قابل بررسی باشد.",
          title: "داشبورد اختصاصی مشاور",
        },
      ],
      subtitle: "تصمیم‌گیری سریع، بر پایه داده‌های واقعی",
      title: "مدیریت مشاورین",
    },
    {
      bullets: [
        "مدیریت اعتبار و بسته‌های فعال",
        "استفاده از اعتبار پنل",
        "پرداخت از کیف پول",
        "پرداخت آنلاین",
      ],
      description:
        "با انتخاب بسته‌های متنوع اعتباری می‌توانید خدمات، آگهی‌ها و ابزارهای آژانس را فعال و تمدید کنید.",
      Icon: LinearWalletAdd,
      subtitle: "هزینه کمتر، بازدهی بیشتر",
      title: "افزایش اعتبار",
    },
    {
      Icon: LinearRanking,
      sections: [
        {
          afterBullets:
            "به آژانس شما امتیاز داده می‌شود و رتبه آن در سیستم مشخص خواهد شد.",
          bullets: [
            "کیفیت و تعداد آگهی‌ها",
            "میزان فعالیت و عملکرد مشاورین",
            "تعامل با کاربران و پاسخ‌گویی",
          ],
          description: "بر اساس شاخص‌هایی مثل:",
          title: "امتیاز و رتبه آژانس",
        },
        {
          description:
            "با بهبود عملکرد، آژانس می‌تواند نشان‌های مختلفی کسب کند؛ نشان‌هایی که اعتبار برند شما را افزایش می‌دهند و اعتماد کاربران را جلب می‌کنند.",
          title: "نشان‌های عملکردی",
        },
      ],
      subtitle: "اعتبار، شفاف و رقابتی",
      title: "نشان‌ها و رتبه‌بندی",
    },
  ],
  "independent-consultant": [
    {
      bullets: [
        "وضعیت آگهی‌های فعال خود را ببینید.",
        "میزان اعتبار مصرف‌شده و باقی‌مانده را بررسی کنید.",
        "نمودارهای عملکرد آگهی‌ها را تحلیل کنید.",
        "روند فعالیت و بازدهی خود را در بازه‌های زمانی مختلف ببینید.",
      ],
      description:
        "داشبورد، مرکز کنترل فعالیت شماست. در این بخش می‌توانید به‌صورت لحظه‌ای:",
      Icon: Dashboard,
      subtitle: "تصمیم‌گیری سریع، بر پایه داده‌های واقعی",
      title: "مدیریت سیستم",
    },
    {
      bullets: [
        "معرفی مشاور و اطلاعات تماس",
        "آگهی‌های فعال و منتشرشده",
        "رتبه، امتیاز و نشان‌های دریافتی",
        "سابقه و میزان فعالیت",
      ],
      description:
        "هر مشاور یک صفحه اختصاصی عمومی دارد؛ مثل یک پروفایل حرفه‌ای آنلاین:",
      Icon: LinearCity,
      subtitle: "برند شخصی شما",
      title: "صفحه مشاور",
    },
    {
      bullets: [
        "مشاهده آگهی‌های فعال و در صف بررسی",
        "ثبت آگهی جدید",
        "ویرایش، بروزرسانی و نوسازی آگهی‌ها",
        "تحلیل عملکرد هر آگهی از طریق نمودارها",
      ],
      description:
        "در پنل مشاور، مدیریت آگهی‌ها کاملاً شفاف و بدون پیچیدگی انجام می‌شود.",
      Icon: LinearTag,
      subtitle: "ساده و متمرکز",
      title: "مدیریت آگهی‌ها",
    },
    {
      bullets: [
        "درخواست‌های ثبت‌شده کاربران را مدیریت کنید.",
        "وضعیت و تاریخ هر درخواست را پیگیری نمایید.",
      ],
      description:
        "در این بخش می‌توانید درخواست‌هایی را که خریداران ثبت کرده‌اند، مدیریت و پیگیری کنید.",
      Icon: LinearRequest,
      subtitle: "هدفمند و کاربردی",
      title: "مدیریت درخواست‌ها",
    },
    {
      bullets: [
        "بسته‌های متنوع اعتبار",
        "بروزرسانی و نوسازی آگهی‌ها",
        "نمایش بهتر",
        "دسترسی به ابزارهای ویژه",
      ],
      description:
        "با انتخاب بسته‌های متنوع اعتباری می‌توانید فعالیت خود را گسترش دهید و آگهی‌ها را تقویت کنید.",
      Icon: LinearWalletAdd,
      subtitle: "کنترل کامل هزینه‌ها",
      title: "افزایش اعتبار",
    },
    {
      bullets: [
        "میزان فعالیت",
        "تجربه و تعامل کاربران",
        "سرعت پاسخ‌گویی",
        "بازدید حضور",
      ],
      description:
        "عملکرد شما به‌صورت کاملاً سیستمی و شفاف ارزیابی می‌شود و امتیاز و رتبه مشاور براساس شاخص‌های مشخص محاسبه می‌شود.",
      Icon: LinearRanking,
      subtitle: "اعتبار، شفاف و رقابتی",
      title: "نشان‌ها و رتبه‌بندی",
    },
  ],
};

export function getNeighborhoodId(neighborhood: NeighborhoodDto) {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

export function normalizePhoneDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/\s+/g, "")
    .trim();
}

export function getBusinessTypePath(type: BusinessType) {
  return type === "agency"
    ? "/account/business/create/agency"
    : "/account/business/create/consultant";
}

function getBusinessInfoPath(type: BusinessType) {
  return `/account/business/create/info?type=${type}`;
}

export function getBusinessTypeFromSearch(): BusinessType {
  const type = new URLSearchParams(window.location.search).get("type");

  return type === "independent-consultant" ? "independent-consultant" : "agency";
}

export function navigateTo(path: string, state?: unknown) {
  window.history.pushState(state ?? {}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function BusinessFormPage({
  businessType,
  fields,
  isSubmitting = false,
  onSubmit,
}: {
  businessType: BusinessType;
  fields: ReactNode;
  isSubmitting?: boolean;
  onDismissToast?: () => void;
  onSubmit?: () => boolean | Promise<boolean>;
  toast?: BusinessToast | null;
}) {
  const [isNoticeVisible, setIsNoticeVisible] = useState(true);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const canContinue = onSubmit ? await onSubmit() : true;

    if (!canContinue) return;

    await getMyProfile();
    setStoredActiveRole(USER);
    navigateTo("/account?businessSuccess=1", { businessSuccess: true, businessType });
  };

  return (
    <BusinessCreationShell
      bottomBar={
        <div className="grid grid-cols-2 gap-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3">
          <Button unstyled
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#0048c4] bg-white px-4 text-sm font-semibold leading-5 text-[#0048c4]"
            onClick={() => navigateTo("/account/business/create")}
            type="button"
          >
            <LinearArrowRight1 className="h-5 w-5" />
            <Typography as="span" variant="body" size="medium" weight="regular">مرحله قبل</Typography>
          </Button>
          <Button unstyled
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#0048c4] px-4 text-sm font-semibold leading-5 text-white disabled:bg-[#b3c8ef]"
            disabled={isSubmitting}
            onClick={handleSubmit}
            type="button"
          >
            <LinearTick className="h-5 w-5" />
            <Typography as="span" variant="body" size="medium" weight="regular">{isSubmitting ? "در حال ثبت..." : "ثبت نام"}</Typography>
          </Button>
        </div>
      }
    >
      <form
        className="flex min-h-full flex-col"
        onSubmit={(event) => event.preventDefault()}
      >
        <BusinessHero
          infoType={businessType}
          showInfoButton
        />

        <div className="mt-4 space-y-6 px-4 pb-32">
          {isNoticeVisible ? (
            <ActivationNotice
              businessType={businessType}
              onClose={() => setIsNoticeVisible(false)}
            />
          ) : null}

          {fields}

          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-sm font-normal leading-6 text-[#4d4d4d]">
            با ثبت‌نام در کسب‌وکار ایران شناسا <RouteLink className="font-semibold text-[#0048c4] underline" to="/account/about">قوانین و مقررات</RouteLink> سایت را قبول کرده‌اید.
          </Typography>
        </div>
      </form>

    </BusinessCreationShell>
  );
}

export function AgencyFields({
  agencyName,
  agencyNameError,
  neighborhoodsError,
  onOpenNeighborhoods,
  selectedNeighborhoods,
  setAgencyName,
  setSelectedNeighborhoods,
}: {
  agencyName: string;
  agencyNameError?: string | null;
  neighborhoodsError?: string | null;
  onOpenNeighborhoods: () => void;
  selectedNeighborhoods: NeighborhoodDto[];
  setAgencyName: (value: string) => void;
  setSelectedNeighborhoods: Dispatch<SetStateAction<NeighborhoodDto[]>>;
}) {
  const removeNeighborhood = (neighborhoodId: string) => {
    setSelectedNeighborhoods((current) =>
      current.filter((item) => getNeighborhoodId(item) !== neighborhoodId),
    );
  };

  return (
    <>
      <div>
        <RequiredLabel>نام آژانس املاک</RequiredLabel>
        <input
          aria-invalid={Boolean(agencyNameError)}
          className={`mt-2 h-14 w-full rounded-xl border bg-white px-4 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4] ${agencyNameError ? "border-[#c11004]" : "border-[#cccccc]"}`}
          onChange={(event) => setAgencyName(event.target.value)}
          placeholder="مثال: املاک نوروزیان"
          value={agencyName}
        />
        {agencyNameError ? (
          <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-2 text-right text-xs font-medium leading-5 text-[#c11004]">
            {agencyNameError}
          </Typography>
        ) : null}
      </div>

      <div>
        <RequiredLabel>محدوده فعالیت</RequiredLabel>
        <div className="mt-2">
          <ActivityAreaSelect
            error={neighborhoodsError}
            onClick={onOpenNeighborhoods}
            onRemove={removeNeighborhood}
            placeholder="محدوده فعالیت خود را انتخاب کن"
            selectedNeighborhoods={selectedNeighborhoods}
          />
        </div>
        {neighborhoodsError ? (
          <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-2 text-right text-xs font-medium leading-5 text-[#c11004]">
            {neighborhoodsError}
          </Typography>
        ) : null}
      </div>

    </>
  );
}

function ActivityAreaSelect({
  error,
  onClick,
  onRemove,
  placeholder,
  selectedNeighborhoods,
}: {
  error?: string | null;
  onClick: () => void;
  onRemove: (neighborhoodId: string) => void;
  placeholder: string;
  selectedNeighborhoods: NeighborhoodDto[];
}) {
  const hasValue = selectedNeighborhoods.length > 0;
  const visibleNeighborhoods = selectedNeighborhoods.slice(0, 2);

  return (
    <div
      aria-invalid={Boolean(error)}
      className={`flex min-h-14 w-full cursor-pointer items-center gap-2 rounded-[16px] border bg-white py-3 pl-3 pr-4 text-base font-normal leading-6 transition focus-within:border-[#0048c4] focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-[#0048c440] ${error ? "border-[#c11004]" : "border-[#808080]"
        }`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        onClick();
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden [direction:rtl]">
        {hasValue ? (
          visibleNeighborhoods.map((neighborhood) => {
            const neighborhoodId = getNeighborhoodId(neighborhood);

            return (
              <Button unstyled
                aria-label={`حذف ${neighborhood.name}`}
                className="inline-flex h-9 max-w-[132px] shrink-0 items-center gap-2 rounded-[8px] bg-[#f2f4fa] px-3 text-sm font-semibold leading-5 text-[#0048c4] active:bg-[#e8edf8]"
                key={neighborhoodId}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRemove(neighborhoodId);
                }}
                type="button"
              >
                <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 truncate">{neighborhood.name}</Typography>
                <LinearCancelSmall className="w-5 h-5 text-[#4D4D4D]" />
              </Button>
            );
          })
        ) : (
          <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1 truncate text-right text-[#a6a6a6]">
            {placeholder}
          </Typography>
        )}
      </div>

      {hasValue ? (
        <Typography as="span" variant="label" size="large" weight="semibold" className="grid w-8 h-8 shrink-0 place-items-center rounded-[8px] bg-[#0048c4] text-base font-semibold leading-6 text-white">
          {selectedNeighborhoods.length}
        </Typography>
      ) : null}

      <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-8 w-8 shrink-0 place-items-center text-[#4d4d4d]">
        <LinearArrowLeft1 className="h-5 w-5" />
      </Typography>
    </div>
  );
}

export function BusinessCreationShell({
  bottomBar,
  children,
}: {
  bottomBar: ReactNode;
  children: ReactNode;
}) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account" title="ایجاد کسب و کار" />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-4 pt-4 [-webkit-overflow-scrolling:touch]">
        {children}
      </main>
      <div className="relative z-20 shrink-0 bg-white shadow-[0_-8px_26px_rgba(26,26,26,0.08)]">
        {bottomBar}
      </div>
    </PageFrame>
  );
}

export function BusinessHero({
  infoType,
  showInfoButton = false,
}: {
  infoType?: BusinessType;
  showInfoButton?: boolean;
}) {
  return (
    <section className="mx-4 rounded-[24px] bg-white px-6 pb-6 pt-7 shadow-[0_14px_35px_rgba(26,26,26,0.06)]">
      <div className="relative overflow-hidden pb-1 text-right">
        <div
          aria-hidden="true"
          className="absolute bottom-2 left-1 h-8 w-44 opacity-80 [background-image:radial-gradient(#cccccc_1.4px,transparent_1.4px)] [background-size:8px_8px]"
        />
        <Typography
          as="p"
          variant="headline"
          size="large"
          className="relative m-0 flex items-baseline justify-start gap-2 text-[32px] font-black tracking-[-0.04em] text-[#0048c4]"
        >
          <Typography
            as="span"
            variant="headline"
            size="large"
            className="rounded-sm bg-[#e6fff1] px-1 text-[32px] font-black text-[#11a366]"
          >
            کسب و کار
          </Typography>
          <Typography
            as="span"
            variant="headline"
            size="large"
            className="text-[32px] font-black text-[#0048c4]"
          >
            خودتو
          </Typography>
        </Typography>
        <Typography
          as="p"
          variant="headline"
          size="large"
          className="relative m-0 mt-1 text-[32px] font-black tracking-[-0.04em] text-[#0048c4]"
        >
          راه بنداز!
        </Typography>
      </div>

      {showInfoButton && infoType ? (
        <Button unstyled
          className="mt-4 flex h-10 w-full items-center justify-center gap-3 rounded-lg border border-[#0048c4] bg-white px-3 text-[#0048c4]"
          onClick={() => navigateTo(getBusinessInfoPath(infoType))}
          type="button"
        >
          <Typography as="span" variant="label" size="medium" weight="medium">
            اطلاعات بیشتر درباره کسب و کار
          </Typography>
          <LinearArrowLeft1 className="h-5 w-5" />
        </Button>
      ) : null}
    </section>
  );
}

export function BusinessTypeCard({
  badge,
  icon,
  isSelected,
  label,
  onClick,
}: {
  badge?: string;
  icon: ReactNode;
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button unstyled
      aria-pressed={isSelected}
      className={`flex h-[76px] w-full items-center rounded-2xl border px-4 text-right transition-colors ${isSelected
        ? "border-[#0048c4] bg-[#eef3ff] text-[#0048c4]"
        : "border-[#cccccc] bg-white text-[#4d4d4d]"
        }`}
      onClick={onClick}
      type="button"
    >
      <ChoiceIndicator checked={isSelected} className="h-[18px] w-[18px]" type="radio" />
      <span
        aria-hidden="true"
        className={`mx-4 h-10 w-px shrink-0 ${isSelected ? "bg-[#b7c9ec]" : "bg-[#dedede]"}`}
      />
      <span className="flex min-w-0 flex-1 items-center gap-2">
        {icon}
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="medium"
          className={`min-w-0 truncate ${isSelected ? "text-[#0048c4]" : "text-[#1a1a1a]"}`}
        >
          {label}
        </Typography>
        {badge ? (
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="shrink-0 rounded-md border border-[#11a366] bg-[#eafff3] px-2 py-1 text-[#11a366]"
          >
            {badge}
          </Typography>
        ) : null}
      </span>
    </Button>
  );
}

function ActivationNotice({
  businessType,
  onClose,
}: {
  businessType: BusinessType;
  onClose: () => void;
}) {
  const isAgency = businessType === "agency";

  return (
    <section className="rounded-2xl border border-[#11a366] bg-[#effff7] p-4 text-right text-[#008a57]">
      <div className="flex items-start gap-3 [direction:ltr]">
        <div className="min-w-0 flex-1 [direction:rtl]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2.5">
              <Dashboard className="w-6 h-6"/>
              <Typography as="h2" variant="body" size="large" weight="medium" className="m-0 text-[#00a66a]">
                پنل شما آماده فعال‌سازی است!
              </Typography>
            </div>

            <Button unstyled
              aria-label="بستن پیام"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[#4d4d4d] active:bg-[#1a1a1a0a]"
              onClick={onClose}
              type="button"
            >
              <LinearCancelSmall className="w-6 h-6" />
            </Button>
          </div>

          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-3 text-sm font-normal leading-6 text-[#00784e]">
            {isAgency
              ? "پس از ورود به پنل آژانس، پرداخت اشتراک پنل آژانس خود را به مدت ۱ سال فعال کنید و از بسته‌های پیش‌فرض حرفه‌ای بهره‌مند شوید."
              : "با ایجاد کسب‌وکار مشاور، پروفایل حرفه‌ای خود را فعال کنید و به ابزارهای تخصصی مدیریت فایل‌ها، مشتریان و فعالیت‌های روزانه دسترسی داشته باشید."}
          </Typography>
          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-4 text-sm font-normal leading-6 text-[#00784e]">
            {isAgency
              ? "همین حالا ثبت‌نام را انجام دهید و وارد دنیای حرفه‌ای املاک شوید!"
              : "همین حالا کسب‌وکار خود را ایجاد کنید و فعالیت حرفه‌ای خود را در بازار املاک آغاز کنید!"}
          </Typography>
        </div>
      </div>
    </section>
  );
}


export function BusinessInfoCard({
  businessType,
  card,
  index,
}: {
  businessType: BusinessType;
  card: InfoCard;
  index: number;
}) {
  const imagePrefix = businessType === "agency" ? "agency" : "consultant";
  const imageSrc = `/figma/business-info/${imagePrefix}-${index + 1}.png`;
  const Icon = card.Icon;

  return (
    <article className="bg-white px-4 pb-5 pt-6 text-right">
      <div className="flex items-start gap-2.5">
        <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#0048c4] text-white">
          <Icon aria-hidden="true" className="h-6 w-6" />
        </Typography>
        <div className="min-w-0">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-[#0048c4]">
            {card.title}
          </Typography>
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-[#4d4d4d]">
            {card.subtitle}
          </Typography>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-[#f5f5f5]">
        <img
          alt=""
          className="h-[250px] w-full object-cover object-center"
          draggable={false}
          src={imageSrc}
        />
      </div>

      {card.sections ? (
        <div className="mt-4 space-y-4">
          {card.sections.map((section, sectionIndex) => (
            <div key={`${card.title}-section-${sectionIndex}`}>
              {section.title ? (
                <Typography
                  as="h3"
                  variant="label"
                  size="large"
                  weight="semibold"
                  className="m-0 text-[#1a1a1a]"
                >
                  {section.title}
                </Typography>
              ) : null}

              {section.description ? (
                <Typography
                  as="p"
                  variant="body"
                  size="large"
                  weight="regular"
                  className={`m-0 text-[#1a1a1a] ${section.title ? "mt-1" : ""}`}
                >
                  {section.description}
                </Typography>
              ) : null}

              {section.bullets?.length ? (
                <ul className="m-0 mt-2 list-disc space-y-1.5 pr-6 text-base font-normal leading-7 text-[#1a1a1a] marker:text-[#11A366]">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="pr-1">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.afterBullets ? (
                <Typography
                  as="p"
                  variant="body"
                  size="large"
                  weight="regular"
                  className="m-0 mt-1 text-[#1a1a1a]"
                >
                  {section.afterBullets}
                </Typography>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <>
          {card.description ? (
            <Typography as="p" variant="body" size="large" weight="regular" className="m-0 mt-4 text-[#1a1a1a]">
              {card.description}
            </Typography>
          ) : null}

          {card.bullets?.length ? (
            <ul className="m-0 mt-2 list-disc space-y-1.5 pr-6 text-base font-normal leading-7 text-[#1a1a1a] marker:text-[#11A366]">
              {card.bullets.map((bullet) => (
                <li key={bullet} className="pr-1">
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </article>
  );
}

export function RequiredLabel({ children }: { children: ReactNode }) {
  return (
    <label className="block text-right text-base font-semibold leading-6 text-[#1a1a1a]">
      {children}
      <Typography as="span" variant="body" size="medium" weight="regular" className="mr-1 text-[#c11004]">*</Typography>
    </label>
  );
}
