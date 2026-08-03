import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { PageFrame } from "../../app/layout/PageFrame";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { Snackbar, type SnackbarVariant } from "../../shared/components/Snackbar";
import { TopBar } from "../../shared/components/TopBar";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { setStoredActiveRole } from "../../core/auth/auth-storage";
import { USER } from "../../shared/constants/roles.constants";
import { getMyProfile } from "../../core/services/account.service";
import { useNeighborhoodListQuery } from "../../core/hooks/neighborhood.hooks";
import { readStoredSelectedCity } from "../../shared/lib/selectedCityStorage";
import { RouteLink } from "../../app/router/RouteLink";
import type { NeighborhoodDto } from "../../core/services/neighborhood.service";
import LinearCancelSmall from "../../shared/icons/LinearCancelSmall";
import LinearBuilding from "../../shared/icons/LinearBuilding";
import LinearUserSolid from "../../shared/icons/LinearUserSolid";
import { ChoiceIndicator } from "../../shared/ui/Choice";

import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

export type BusinessType = "agency" | "independent-consultant";

export type BusinessToast = {
  message: string;
  title: string;
  variant: SnackbarVariant;
};

type InfoCard = {
  bullets: string[];
  description: string;
  icon: "grid" | "building" | "shield" | "request" | "people" | "wallet" | "ranking";
  subtitle: string;
  title: string;
};



export const businessInfoCards: Record<BusinessType, InfoCard[]> = {
  agency: [
    {
      bullets: [
        "وضعیت و عملکرد آگهی‌ها را بررسی کنید.",
        "عملکرد مشاورها را به‌صورت منظم تحلیل کنید.",
        "موجودی اعتبار و فعالیت‌های پرداختی را مدیریت کنید.",
      ],
      description:
        "داشبورد، نقطه شروع مدیریت هوشمند است. این بخش اطلاعات جامع و قابل پیگیری از وضعیت کسب‌وکار در اختیار مدیر آژانس قرار می‌دهد.",
      icon: "grid",
      subtitle: "مدیریت کاربران و امکانات و ابزارهای تبلیغی",
      title: "مدیریت سیستم",
    },
    {
      bullets: [
        "معرفی کامل آژانس و خدمات قابل ارائه",
        "معرفی مشاورها و اطلاعات تماس",
        "نمایش آگهی‌های فعال و منتخب",
        "ایجاد اعتماد و شفافیت برای کاربران",
      ],
      description:
        "هر آژانس دارای یک صفحه اختصاصی است تا کاربران بتوانند اطلاعات، مشاوران و آگهی‌های فعال آژانس را یک‌جا مشاهده کنند.",
      icon: "building",
      subtitle: "پنل اختصاصی آژانس",
      title: "صفحه آژانس",
    },
    {
      bullets: [
        "مشاهده و مدیریت آگهی‌های فعال",
        "ثبت آگهی جدید",
        "ویرایش، بروزرسانی و نوسازی آگهی‌ها",
        "تحلیل عملکرد هر آگهی از طریق نمودارها",
      ],
      description:
        "در پنل مشاور، مدیریت آگهی‌ها کاملاً شفاف و بدون پیچیدگی انجام می‌شود و مدیر می‌تواند روی کیفیت آگهی‌ها کنترل داشته باشد.",
      icon: "shield",
      subtitle: "مدیریت کامل آگهی‌ها",
      title: "مدیریت آگهی‌ها",
    },
    {
      bullets: [
        "درخواست‌های ثبت‌شده کاربران را مدیریت کنید.",
        "وضعیت هر درخواست را پیگیری نمایید.",
        "فرآیند پاسخ‌گویی را برای مشاورها ساده‌تر کنید.",
      ],
      description:
        "در این بخش می‌توانید درخواست‌های ثبت‌شده توسط کاربران را بررسی و به مشاور مناسب ارجاع دهید.",
      icon: "request",
      subtitle: "مدیریت کامل درخواست‌ها",
      title: "مدیریت درخواست‌ها",
    },
    {
      bullets: [
        "دعوت و اضافه‌کردن مشاور به مجموعه",
        "مشاهده فعالیت هر مشاور",
        "مدیریت دسترسی‌ها و سطح فعالیت مشاوران",
        "حذف یا غیرفعال‌کردن مشاور در صورت نیاز",
      ],
      description:
        "مدیریت مشاورها به مدیر آژانس کمک می‌کند تیم فروش و فعالیت‌های روزانه را یکپارچه و دقیق کنترل کند.",
      icon: "people",
      subtitle: "مدیریت تیم فروش و مشاوران",
      title: "مدیریت مشاورها",
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
      icon: "wallet",
      subtitle: "افزایش اعتبار آژانس",
      title: "افزایش اعتبار",
    },
    {
      bullets: [
        "کیفیت آگهی‌ها و میزان پاسخ‌گویی",
        "فعالیت و عملکرد مشاورها",
        "میزان بازدید و تعامل کاربران",
        "روند فعالیت مجموعه در بازه‌های زمانی مختلف",
      ],
      description:
        "اعتبار و رتبه آژانس براساس شاخص‌های مشخص محاسبه می‌شود و به کاربران کمک می‌کند با اطمینان بیشتری انتخاب کنند.",
      icon: "ranking",
      subtitle: "اعتبار، اعتماد و رقابت",
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
        "داشبورد، مرکز کنترل فعالیت شماست. در این بخش می‌توانید به‌صورت لحظه‌ای وضعیت کارتان را بررسی کنید.",
      icon: "grid",
      subtitle: "مدیریت عمومی کاربران و ابزارهای تبلیغی",
      title: "مدیریت سیستم",
    },
    {
      bullets: [
        "معرفی مشاور و اطلاعات تماس",
        "آگهی‌های فعال و منتشرشده",
        "رتبه، امتیاز و نشان‌های دریافتی",
        "اعتمادسازی برای کاربران",
      ],
      description:
        "هر مشاور یک صفحه اختصاصی عمومی دارد تا کاربران بتوانند با سوابق، تخصص و آگهی‌های فعال او آشنا شوند.",
      icon: "building",
      subtitle: "پنل شخصی شما",
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
      icon: "shield",
      subtitle: "مدیریت کامل آگهی‌ها",
      title: "مدیریت آگهی‌ها",
    },
    {
      bullets: [
        "درخواست‌های ثبت‌شده کاربران را مدیریت کنید.",
        "وضعیت و تاریخ هر درخواست را پیگیری نمایید.",
      ],
      description:
        "در این بخش می‌توانید درخواست‌هایی را که خریداران ثبت کرده‌اند، مدیریت و پیگیری کنید.",
      icon: "request",
      subtitle: "مدیریت درخواست‌های دریافتی",
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
      icon: "wallet",
      subtitle: "اعتبار، کنترل و توسعه",
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
      icon: "ranking",
      subtitle: "اعتبار، اعتماد و رقابت",
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
  onDismissToast,
  onSubmit,
  toast,
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
            <ArrowRightIcon />
            <Typography as="span" variant="body" size="medium" weight="regular">مرحله قبل</Typography>
          </Button>
          <Button unstyled
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#0048c4] px-4 text-sm font-semibold leading-5 text-white disabled:bg-[#b3c8ef]"
            disabled={isSubmitting}
            onClick={handleSubmit}
            type="button"
          >
            <CheckIcon />
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

      {toast && onDismissToast ? (
        <Snackbar
          className="top-[72px]"
          message={toast.message}
          onDismiss={onDismissToast}
          title={toast.title}
          variant={toast.variant}
        />
      ) : null}
    </BusinessCreationShell>
  );
}

export function AgencyFields({
  agencyName,
  agencyNameError,
  neighborhoodsError,
  selectedNeighborhoods,
  setAgencyName,
  setSelectedNeighborhoods,
}: {
  agencyName: string;
  agencyNameError?: string | null;
  neighborhoodsError?: string | null;
  selectedNeighborhoods: NeighborhoodDto[];
  setAgencyName: (value: string) => void;
  setSelectedNeighborhoods: Dispatch<SetStateAction<NeighborhoodDto[]>>;
}) {
  const [isNeighborhoodSheetOpen, setIsNeighborhoodSheetOpen] = useState(false);
  const [neighborhoodQuery, setNeighborhoodQuery] = useState("");

  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";
  const selectedNeighborhoodIds = useMemo(
    () => new Set(selectedNeighborhoods.map(getNeighborhoodId)),
    [selectedNeighborhoods],
  );
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isNeighborhoodSheetOpen && Boolean(cityId),
    page: 1,
    perPage: 100,
    q: neighborhoodQuery,
  });
  const neighborhoodsFromApi = neighborhoodsQuery.data ?? [];
  const neighborhoods = cityId ? neighborhoodsFromApi : [];

  const toggleNeighborhood = (neighborhood: NeighborhoodDto) => {
    const neighborhoodId = getNeighborhoodId(neighborhood);

    setSelectedNeighborhoods((current) => {
      if (current.some((item) => getNeighborhoodId(item) === neighborhoodId)) {
        return current.filter((item) => getNeighborhoodId(item) !== neighborhoodId);
      }

      return [...current, neighborhood];
    });
  };

  const removeNeighborhood = (neighborhoodId: string) => {
    setSelectedNeighborhoods((current) =>
      current.filter((item) => getNeighborhoodId(item) !== neighborhoodId),
    );
  };

  const clearNeighborhoods = () => setSelectedNeighborhoods([]);


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
            onClick={() => setIsNeighborhoodSheetOpen(true)}
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

      <BottomSheet
        ariaLabel="محدوده فعالیت"
        className="rounded-t-[20px]"
        contentClassName="flex min-h-0 flex-1 flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3"
        heightClassName="h-[min(82dvh,560px)]"
        isOpen={isNeighborhoodSheetOpen}
        onClose={() => setIsNeighborhoodSheetOpen(false)}
        panelPaddingClassName="flex flex-col pt-4"
        showHeaderDivider={false}
        title="محدوده فعالیت"
        zIndexClassName="z-[80]"
      >
        <label
          className="flex h-12 shrink-0 items-center gap-2 rounded-xl border border-[#808080] bg-white px-3 text-[#4d4d4d] focus-within:border-[#0048c4]"
          dir="rtl"
        >
          <SearchIcon />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
            onChange={(event) => setNeighborhoodQuery(event.target.value)}
            placeholder="جستجوی محله"
            type="search"
            value={neighborhoodQuery}
          />
          {neighborhoodQuery ? (
            <Button unstyled
              aria-label="پاک کردن جستجو"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#4d4d4d] active:bg-[#1a1a1a0a]"
              onClick={() => setNeighborhoodQuery("")}
              type="button"
            >
              <LinearCancelSmall className="h-5 w-5" />
            </Button>
          ) : null}
        </label>

        {selectedNeighborhoods.length > 0 ? (
          <Button unstyled
            className="mt-3 h-10 shrink-0 self-start rounded-lg px-2 text-sm font-medium leading-5 text-[#0048c4] active:bg-[#0048c40a]"
            onClick={clearNeighborhoods}
            type="button"
          >
            پاک کردن انتخاب
          </Button>
        ) : null}

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain" dir="rtl">
          {cityId && neighborhoodsQuery.isLoading ? (
            <div className="space-y-2">
              <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
              <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
              <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
            </div>
          ) : neighborhoods.length > 0 ? (
            <div className="space-y-1">
              {neighborhoods.map((neighborhood) => {
                const neighborhoodId = getNeighborhoodId(neighborhood);
                const isSelected = selectedNeighborhoodIds.has(neighborhoodId);

                return (
                  <Button unstyled
                    aria-pressed={isSelected}
                    className={`flex h-14 w-full items-center justify-between gap-3 rounded-[10px] px-1 text-right text-base font-normal leading-6 transition-colors active:bg-[#0048c40a] ${isSelected ? "text-[#0048c4]" : "text-[#1a1a1a]"
                      }`}
                    key={neighborhoodId}
                    onClick={() => toggleNeighborhood(neighborhood)}
                    type="button"
                  >
                    <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1 truncate">{neighborhood.name}</Typography>
                    <ChoiceIndicator checked={isSelected} />
                  </Button>
                );
              })}
            </div>
          ) : neighborhoodQuery.trim() ? (
            <SearchEmptyState compact />
          ) : (
            <Typography as="p" variant="body" size="medium" weight="regular" className="mx-auto m-0 w-full px-2 py-3 text-center text-sm font-normal leading-6 text-[#808080]">
              محله‌ای برای این شهر ثبت نشده است.
            </Typography>
          )}
        </div>
      </BottomSheet>
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
        <ChevronDownIcon />
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
          <ArrowLeftIcon />
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
  icon: "agency" | "consultant";
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
        <BusinessSmallIcon type={icon} />
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
              <GridIcon />
              <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 text-[#00a66a]">
                پنل شما آماده فعال‌سازی است!
              </Typography>
            </div>

            <Button unstyled
              aria-label="بستن پیام"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[#4d4d4d] active:bg-[#1a1a1a0a]"
              onClick={onClose}
              type="button"
            >
              <LinearCancelSmall className="w-5 h-5" />
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

  return (
    <article className="bg-white px-4 pb-5 pt-4 text-right">
      <div className="flex items-start gap-2">
        <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#0048c4] text-white">
          <InfoCardIcon name={card.icon} />
        </Typography>
        <div className="min-w-0">
          <Typography as="h2" variant="headline" size="large" className="m-0 font-semibold leading-5 text-[#0048c4]">
            {card.title}
          </Typography>
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-0.5 text-xs font-normal leading-4 text-[#4d4d4d]">
            {card.subtitle}
          </Typography>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl bg-[#f8f8f8]">
        <img
          alt=""
          className="h-[250px] w-full object-cover object-center"
          draggable={false}
          src={imageSrc}
        />
      </div>

      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-3 font-normal leading-6 text-[#1a1a1a]">
        {card.description}
      </Typography>
      <ul className="m-0 mt-2 space-y-1 pr-4 font-normal leading-6 text-[#1a1a1a] marker:text-[#11A366]">
        {card.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
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

function BusinessSmallIcon({ type }: { type: "agency" | "consultant" }) {
  if (type === "consultant") {
    return <LinearUserSolid aria-hidden="true" className="h-6 w-6 shrink-0" />;
  }

  return <LinearBuilding aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function InfoCardIcon({ name }: { name: InfoCard["icon"] }) {
  if (name === "building") return <BusinessSmallIcon type="agency" />;
  if (name === "people") return <PeopleIcon />;
  if (name === "wallet") return <WalletAddIcon />;
  if (name === "ranking") return <RankingIcon />;
  if (name === "request") return <RequestIcon />;
  if (name === "shield") return <ShieldIcon />;
  return <GridIcon />;
}

function GridIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24">
      <rect height="6" rx="1" stroke="currentColor" strokeWidth="1.5" width="6" x="4" y="4" />
      <rect height="6" rx="1" stroke="currentColor" strokeWidth="1.5" width="6" x="14" y="4" />
      <rect height="6" rx="1" stroke="currentColor" strokeWidth="1.5" width="6" x="4" y="14" />
      <rect height="6" rx="1" stroke="currentColor" strokeWidth="1.5" width="6" x="14" y="14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="M10.8 18.2a7.4 7.4 0 1 0 0-14.8 7.4 7.4 0 0 0 0 14.8ZM16.1 16.1 21 21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="M8.8 11.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2ZM15.8 10.8a3 3 0 1 0 0-6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      <path d="M3.5 20a5.3 5.3 0 0 1 10.6 0M14.5 19.5a4.3 4.3 0 0 1 6-3.7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="M12 3.5 19 6v5.4c0 4.1-2.6 7.8-7 9.1-4.4-1.3-7-5-7-9.1V6l7-2.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
      <path d="m8.8 12 2.1 2.1 4.4-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function RequestIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="M5 5.5h14v13H5z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
      <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function RankingIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.3 6.8 19l1-5.8-4.2-4.1 5.8-.8L12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function WalletAddIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="M3 6.5h14v9H3z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M3 6.5 13.2 3.8c1-.3 1.8.4 1.8 1.4v1.3M13 11h4M15 9v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}



function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="M16 10H4M9 5l-5 5 5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="m4.5 10.4 3.3 3.3 7.7-8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
