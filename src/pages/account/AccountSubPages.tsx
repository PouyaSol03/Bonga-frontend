import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageFrame } from "../../app/layout/PageFrame";
import { getApiAssetUrl, getApiErrorMessage } from "../../core/api/api";
import { getStoredAuthSession } from "../../core/auth/auth-storage";
import { storePaymentReturnTarget } from "../../shared/utils/payment-return";
import {
  useAdvertiseBadgesQuery,
  useAuthorizeMeMutation,
  useChargeWalletMutation,
  useDeleteAdvertiseBadgeMutation,
  useDeleteAdvertiseNoteMutation,
  useMyAdsInfiniteQuery,
  useMyNotesQuery,
  useMyProfileQuery,
  useSaveAdvertiseNoteMutation,
  useUpdateMyProfileMutation,
  useWalletQuery,
  useWalletPaymentsQuery,
} from "../../core/hooks/account.hooks";
import {
  mapAdvertisementToAdCard,
  type AdvertisementItem,
} from "../../core/services/advertisement.service";
import {
  isUserIdentityVerified,
  type BadgeItem,
  type MyAdsType,
  type NoteItem,
  type WalletPayment,
} from "../../core/services/account.service";
import { AdCard } from "../../shared/components/AdCard";
import type { AdCardData } from "../../shared/components/AdCard";
import { AdCardSkeleton } from "../../shared/components/AdCardSkeleton";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { DemoNotice } from "../../shared/components/DemoNotice";
import { Button } from "../../shared/ui/Button";
import { Chip } from "../../shared/ui/Chip";
import { getRequestErrorState } from "../../shared/components/ErrorState";
import { useDemoNotice } from "../../core/hooks/useDemoNotice";
import { TopBar } from "../../shared/components/TopBar";
import { RouteLink } from "../../app/router/RouteLink";
import { AdCardTomanIcon } from "../../shared/components/AdCardIcons";
import { formatBigNumber, formatPrice } from "../../shared/lib/MoneyHandler";
import { getMyAdStatusInfo } from "./myAdsStatus";
import { RequestManagementView } from "../requests/RequestManagementView";
import { getRecentViews } from "../../core/services/recent-views.service";
import { Typography } from "../../shared/ui/Typography";
import { TextField } from "../../shared/ui/TextField";
import LinearDelete from "../../shared/icons/LinearDelete";
import LinearEdit from "../../shared/icons/LinearEdit";

type TopBarProps = {
  action?: React.ReactNode;
  onBack?: () => void;
  title: string;
};

type IdentityPageStep = "pending" | "verified" | "ownership";

type SimCardOwnershipReason =
  | "selling"
  | "transferred"
  | "purchased";

const simCardOwnershipReasons: Array<{
  id: SimCardOwnershipReason;
  label: string;
}> = [
  { id: "selling", label: "می‌خواهم سیم‌کارتم را بفروشم" },
  { id: "transferred", label: "سیم‌کارتم را واگذار کرده‌ام" },
  { id: "purchased", label: "سیم‌کارتم را تازه خریده‌ام" },
];

const adFilters: Array<{ label: string; type: MyAdsType }> = [
  { label: "همه", type: "all" },
  { label: "فعال", type: "active" },
  { label: "در انتظار", type: "pending" },
  { label: "نیمه کاره", type: "pending" },
  { label: "غیر فعال", type: "deactive" },
];

export function AccountProfilePage() {
  const [toast, setToast] = useState<AccountToast | null>(null);
  const { data: profile, error, isError, isLoading, refetch } = useMyProfileQuery();
  const updateProfile = useUpdateMyProfileMutation();
  const mobile = getStoredAuthSession()?.mobile ?? "-";
  const profileFormKey = [
    profile?.id,
    profile?.mobile,
    profile?.email,
    profile?.family,
    profile?.name,
    profile?.nationalnumber,
  ].join("|");

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (
    message: string,
    title = "موفقیت",
    variant: "error" | "success" | "info" | "warning" = "success",
  ) => setToast({ message, title, variant });

  return (
    <AccountPageShell title="مشخصات من">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-24">
        {isLoading ? <AccountProfileSkeleton /> : null}
        {isError ? (
          <AccountRetryState
            error={error}
            message={getApiErrorMessage(error, "دریافت مشخصات با خطا مواجه شد.")}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError ? (
          <AccountProfileForm
            isSubmitting={updateProfile.isPending}
            key={profileFormKey}
            mobile={mobile}
            profile={profile}
            onSubmit={(form) => {
              updateProfile.mutate(form, {
                onError: (submitError) => {
                  showToast(
                    getApiErrorMessage(submitError, "ذخیره اطلاعات با خطا مواجه شد"),
                    "خطا",
                    "error",
                  );
                },
                onSuccess: () => {
                  window.history.pushState({}, "", "/account/profile");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                  showToast("اطلاعات حساب ذخیره شد");
                },
              });
            }}
          />
        ) : null}
      </main>

    </AccountPageShell>
  );
}

function AccountProfileForm({
  isSubmitting,
  mobile,
  onSubmit,
  profile,
}: {
  isSubmitting: boolean;
  mobile: string;
  onSubmit: (form: {
    avatar: File | null;
    email: string | null;
    family: string | null;
    name: string | null;
  }) => void;
  profile?: {
    avatar?: string | null;
    email?: string | null;
    family?: string | null;
    mobile?: string;
    name?: string | null;
    nationalnumber?: string | null;
    phone?: string;
  };
}) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [form, setForm] = useState({
    email: profile?.email ?? "",
    family: profile?.family ?? "",
    name: profile?.name ?? "",
    nationalnumber: profile?.nationalnumber ?? "",
  });

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  const avatarSrc = avatarPreview || (profile?.avatar ? getApiAssetUrl(profile.avatar) : "");

  return (
    <>
      <section className="flex flex-col items-center px-4 pt-4">
        <div className="relative grid h-[100px] w-[100px] place-items-center overflow-visible text-[#808080]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-[#e0e0e0]">
            {avatarSrc ? (
              <img alt="تصویر پروفایل" className="h-full w-full object-cover" src={avatarSrc} />
            ) : (
              <UserIcon className="h-10 w-10" />
            )}
          </Typography>

          <label
            aria-label="ویرایش تصویر"
            className="absolute -bottom-1 -left-1 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-4 border-white bg-[#0048c4] text-white"
            htmlFor="profile-avatar-upload"
          >
            <EditIcon className="h-4 w-4" />
          </label>

          <input
            accept="image/*"
            className="hidden"
            id="profile-avatar-upload"
            type="file"
            onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
          />
        </div>
      </section>

      <section className="mt-4 space-y-6 px-4">
        <ReadonlyField label="شماره همراه" value={profile?.mobile ?? profile?.phone ?? mobile} />
        <ReadonlyField label="کد ملی" value={form.nationalnumber || "-"} />
      </section>

      <div className="mt-4 h-4 bg-[#f0f0f0]" />

      <section className="space-y-6 px-4 pt-4">
        <TextField
          className="text-sm text-[#808080] placeholder:text-[#808080]"
          placeholder="نام خود را وارد کنید"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
        <TextField
          className="text-sm text-[#808080] placeholder:text-[#808080]"
          placeholder="نام خانوادگی خود را وارد کنید"
          value={form.family}
          onChange={(event) => setForm((current) => ({ ...current, family: event.target.value }))}
        />
        <TextField
          className="text-sm text-[#808080] placeholder:text-[#808080]"
          placeholder="پست الکترونیکی"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-4 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button unstyled
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white disabled:opacity-50"
          disabled={isSubmitting}
          type="button"
          onClick={() => {
            const emptyToNull = (value: string) => {
              const trimmedValue = value.trim();
              return trimmedValue.length > 0 ? trimmedValue : null;
            };

            onSubmit({
              avatar: avatarFile,
              email: emptyToNull(form.email),
              family: emptyToNull(form.family),
              name: emptyToNull(form.name),
            });
          }}
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت"}
        </Button>
      </div>
    </>
  );
}

export function AccountMyAdsPage() {
  return (
    <AccountPageShell
      action={
        <RouteLink className="grid h-12 w-12 place-items-center text-[#1a1a1a]" to="/search">
        </RouteLink>
      }
      title="آگهی‌های من"
    >
      <AccountMyAdsContent emptyMode="compact" />
    </AccountPageShell>
  );
}

export function AccountMyAdsEmptyPage() {
  return (
    <AccountPageShell
      action={
        <RouteLink className="grid h-12 w-12 place-items-center text-[#1a1a1a]" to="/search">
        </RouteLink>
      }
      title="آگهی‌های من"
    >
      <AccountMyAdsContent emptyMode="full" />
    </AccountPageShell>
  );
}


function AccountMyAdsEmptyState({
  filterLabel,
  mode,
}: {
  filterLabel: string;
  mode: "compact" | "full";
}) {
  const isAllFilter = filterLabel === "همه";
  const title = isAllFilter
    ? "هیچ آگهی‌ای برای نمایش وجود ندارد!"
    : `هیچ آگهی‌ای در وضعیت ${filterLabel} وجود ندارد!`;
  const description = isAllFilter
    ? "می‌توانید همین حالا آگهی جدید ثبت کنید و وضعیت آن را از این بخش پیگیری نمایید."
    : "وقتی آگهی‌ای در این وضعیت داشته باشید، همین‌جا نمایش داده می‌شود.";
  const heightClass = mode === "full" ? "h-full min-h-0 flex-1" : "h-full min-h-0 flex-1";

  return (
    <section className={`mx-auto flex ${heightClass} w-full flex-col items-center justify-center px-10 text-center`}>
      <img
        alt=""
        aria-hidden="true"
        className="mb-4 h-[66px] w-[66px] object-contain"
        src="/vectors/NoAdd.svg"
      />
      <Typography as="h2" variant="headline" size="large" className="m-0 font-semibold text-[#1a1a1a]">
        {title}
      </Typography>
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-sm font-normal text-[#4d4d4d]">
        {description}
      </Typography>
      {isAllFilter ? (
        <RouteLink
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white"
          to="/new-ad/category"
        >
          <PlusIcon className="h-5 w-5" />
          ثبت آگهی
        </RouteLink>
      ) : null}
    </section>
  );
}

function AccountMyAdsContent({ emptyMode }: { emptyMode: "compact" | "full" }) {
  const [activeFilter, setActiveFilter] = useState(adFilters[0]);
  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null);
  const {
    data: adsPages,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useMyAdsInfiniteQuery({
    type: activeFilter.type,
  });
  const ads = useMemo(
    () =>
      adsPages?.pages.flatMap((page, pageIndex) =>
        page.data.map((ad, adIndex) => ({
          ad,
          card: mapAdvertisementToAdCard(ad, pageIndex * page.perPage + adIndex),
        })),
      ) ?? [],
    [adsPages],
  );
  const loadMoreTriggerIndex = Math.max(ads.length - 3, 0);
  const loadMoreSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      loadMoreObserverRef.current?.disconnect();
      loadMoreObserverRef.current = null;

      if (!node || !hasNextPage || isFetchingNextPage) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        },
        { root: null, rootMargin: "240px 0px", threshold: 0 },
      );

      observer.observe(node);
      loadMoreObserverRef.current = observer;
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );
  const hasAds = ads.length > 0;
  const showEmptyState = !isLoading && !isError && !hasAds;

  return (
    <main className={`flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden ${showEmptyState ? "bg-white" : "bg-[#f0f0f0]"}`}>
      <AdFilterTabs activeFilter={activeFilter} onSelect={setActiveFilter} />
      <div className={`${showEmptyState ? "flex min-h-0 flex-1 flex-col bg-white" : "space-y-2 bg-[#f0f0f0]"}`}>
        {isLoading ? <MyAdsAdCardsSkeleton /> : null}
        {isError ? (
          <AccountRetryState
            error={error}
            message={getApiErrorMessage(error, "دریافت آگهی‌ها با خطا مواجه شد.")}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && ads.map(({ ad, card }, index) => {
          const shouldAttachLoadMoreRef =
            index === loadMoreTriggerIndex &&
            hasNextPage &&
            !isFetchingNextPage;
          const statusInfo = getMyAdStatusInfo(ad);
          const adId = String(ad.id ?? ad._id ?? card.id);
          const cardWithStatus: AdCardData = {
            ...card,
            status: statusInfo.label,
          };

          return (
            <div
              key={adId}
              ref={shouldAttachLoadMoreRef ? loadMoreSentinelRef : undefined}
            >
              <AdCard
                ad={cardWithStatus}
                showStatusBadge
                state={{ ad, card: cardWithStatus, status: statusInfo.key }}
                to={`/account/my-ads/${encodeURIComponent(adId)}/state-ad`}
              />
            </div>
          );
        })}
        {isFetchingNextPage ? <MyAdsAdCardsSkeleton count={2} /> : null}
        {showEmptyState ? (
          <AccountMyAdsEmptyState filterLabel={activeFilter.label} mode={emptyMode} />
        ) : null}
      </div>
    </main>
  );
}

function normalizeWalletAmount(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[^0-9]/g, "")
    .replace(/^0+(?=\d)/, "");
}

export function AccountWalletPage() {
  const [amount, setAmount] = useState("");
  const [, setChargeError] = useState<string | null>(null);
  const chargeWalletMutation = useChargeWalletMutation();
  const { data: wallet, error, isError, isLoading, refetch } = useWalletQuery();
  const numericAmount = Number(amount);
  const canCharge = Number.isSafeInteger(numericAmount) && numericAmount > 0;

  const suggestedAmounts = [
    { label: "۱۰۰ هزار تومان", value: "100000" },
    { label: "۲۰۰ هزار تومان", value: "200000" },
    { label: "۳۰۰ هزار تومان", value: "300000" },
    { label: "۵۰۰ هزار تومان", value: "500000" },
    { label: "۱ میلیون تومان", value: "1000000" },
    { label: "۲ میلیون تومان", value: "2000000" },
  ];

  return (
    <AccountPageShell title="کیف پول">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-24">
        {isLoading ? <AccountLoadingState text="در حال دریافت اعتبار..." /> : null}

        {isError ? (
          <AccountRetryState
            error={error}
            message={getApiErrorMessage(error, "دریافت اطلاعات کیف پول با خطا مواجه شد.")}
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError ? (
          <section className="px-3 pt-4 text-right">
            <div className="flex items-center justify-between rounded-xl border border-[#d6e1ff] bg-[#0048c414] p-4 [direction:rtl]">
              <div>
                <Typography as="p" variant="body" size="small" weight="medium" className="m-0 text-xs font-medium leading-5 text-[#4D4D4D]">
                  اعتبار قابل استفاده:
                </Typography>

                <div className="mt-2 flex items-end gap-1 text-[#0048c4]">
                  <strong className="text-2xl font-bold leading-7">
                    {formatMoney(wallet?.credit ?? 0)}
                  </strong>
                  <AdCardTomanIcon className="h-5 w-5 shrink-0 text-[#0048c4]" />
                </div>
              </div>

              <div className="grid p-4 shrink-0 place-items-center rounded-full bg-[#dbe6ff] text-[#002099]">
                <img src="/icons/walletPlus.svg" alt="" />
              </div>
            </div>

            <div className="mt-5 pt-5 flex items-center gap-2 text-[#1a1a1a]">
              <PlusIcon className="h-5 w-5" />
              <Typography as="h2" variant="title" size="medium" weight="medium" className="m-0 text-base font-medium leading-6">
                افزایش اعتبار
              </Typography>
            </div>

            <label className="mt-4 flex py-3 items-center rounded-xl border border-[#cccccc] bg-white px-4 [direction:ltr]">
              <Typography as="span" variant="body" size="small" weight="regular" className="text-xs font-normal leading-4 text-[#808080]">
                تومان
              </Typography>

              <input
                className="min-w-0 flex-1 border-0 bg-transparent text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] placeholder:text-sm [direction:rtl]"
                inputMode="numeric"
                placeholder="مبلغ اعتبار دلخواه"
                value={amount && amount !== "0" ? formatPrice(Number(amount.replace(/,/g, ""))) : ""}
                onChange={(event) => {
                  setAmount(normalizeWalletAmount(event.target.value));
                }}
              />
            </label>
            {Number(amount) > 0 && (
              <Typography as="p" variant="body" size="small" weight="regular" className="px-4 pt-1 text-xs text-[#808080]">
                {formatBigNumber(Number(amount))} تومان
              </Typography>
            )}

            <Typography as="h3" variant="title" size="small" weight="medium" className="m-0 mt-6 text-sm font-medium leading-5 text-[#1a1a1a]">
              مبالغ پیشنهادی
            </Typography>

            <div className="mt-3 grid grid-cols-3 gap-3 [direction:rtl]">
              {suggestedAmounts.map((amountOption) => {
                const isActive = amount === amountOption.value;

                return (
                  <Button unstyled
                    className={`rounded-xl border py-1.5 !text-xs !font-medium leading-4 ${isActive
                      ? "border-[#0048c4] bg-[#0048c414] text-[#0048c4]"
                      : "border-[#cccccc] bg-white text-[#1a1a1a]"
                      }`}
                    key={amountOption.value}
                    onClick={() => setAmount(amountOption.value)}
                    type="button"
                  >
                    {amountOption.label}
                  </Button>
                );
              })}
            </div>

            <RouteLink
              className="relative mt-8 flex gap-2 p-4 w-full items-center justify-center rounded-xl border border-[#cccccc] bg-white px-4 text-sm font-medium leading-5 text-[#1a1a1a] no-underline"
              to="/account/wallet/history"
            >
              <img src="/icons/walletHistory.svg" alt="" />
              <Typography as="span" variant="body" size="large" weight="regular" className="text-base flex-1">تاریخچه پرداخت</Typography>
              <ChevronLeftIcon className="h-4 w-4 text-[#4d4d4d]" />
            </RouteLink>
          </section>
        ) : null}
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-white px-3 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button unstyled
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white disabled:opacity-50"
          disabled={!canCharge || chargeWalletMutation.isPending}
          onClick={() => {
            if (!canCharge) return;

            setChargeError(null);
            chargeWalletMutation.mutate(
              { price: numericAmount },
              {
                onError: (chargeRequestError) => {
                  setChargeError(
                    getApiErrorMessage(
                      chargeRequestError,
                      "اتصال به درگاه پرداخت با خطا مواجه شد.",
                    ),
                  );
                },
                onSuccess: ({ paymentUrl }) => {
                  storePaymentReturnTarget({
                    label: "بازگشت به کیف پول",
                    path: "/account/wallet",
                  });
                  window.location.assign(paymentUrl);
                },
              },
            );
          }}
          type="button"
        >
          {chargeWalletMutation.isPending ? "در حال اتصال به درگاه..." : "شارژ کیف پول"}
        </Button>
      </div>

    </AccountPageShell>
  );
}

export function AccountWalletHistoryPage() {
  const { data: wallet, error, isError, isLoading, refetch } = useWalletPaymentsQuery();
  const payments = wallet?.payments ?? [];

  return (
    <AccountPageShell title="تاریخچه پرداخت کیف پول">
      <main className="min-h-0 flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden bg-[#F0F0F0]">
        {isLoading ? <AccountLoadingState text="در حال دریافت تاریخچه پرداخت..." /> : null}

        {isError ? (
          <AccountRetryState
            error={error}
            message={getApiErrorMessage(error, "دریافت تاریخچه پرداخت با خطا مواجه شد.")}
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError && payments.map((payment, index) => (
          <PaymentHistoryCard
            key={String(payment.id ?? index)}
            payment={payment}
          />
        ))}

        {!isLoading && !isError && payments.length === 0 ? (
          <EmptyMessage text="تاریخچه پرداختی وجود ندارد" />
        ) : null}
      </main>
    </AccountPageShell>
  );
}

type AccountToast = {
  message: string;
  title: string;
  variant: "error" | "success" | "info" | "warning";
};

export function AccountNotesPage() {
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [isConfirmDeleteAllOpen, setIsConfirmDeleteAllOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [toast, setToast] = useState<AccountToast | null>(null);
  const { data: notes = [], error, isError, isLoading, refetch } = useMyNotesQuery();
  const deleteNote = useDeleteAdvertiseNoteMutation();
  const saveNote = useSaveAdvertiseNoteMutation();

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (
    message: string,
    title = "انجام شد",
    variant: "error" | "success" | "info" | "warning" = "success",
  ) => setToast({ message, title, variant });

  const openEditNote = (note: NoteItem) => {
    setEditingNote(note);
    setNoteDraft(readNoteText(note));
  };

  const deleteSingleNote = (noteId: string) => {
    if (!noteId || deleteNote.isPending) return;

    deleteNote.mutate(noteId, {
      onError: (deleteError) => {
        showToast(getApiErrorMessage(deleteError, "حذف یادداشت با خطا مواجه شد."), "خطا", "error");
      },
      onSuccess: () => {
        showToast("یادداشت حذف شد");
      },
    });
  };

  const deleteAllNotes = () => {
    deleteNote.mutate("all", {
      onError: (deleteError) => {
        showToast(getApiErrorMessage(deleteError, "حذف یادداشت‌ها با خطا مواجه شد."), "خطا", "error");
      },
      onSuccess: () => {
        setIsConfirmDeleteAllOpen(false);
        showToast("همه یادداشت‌ها حذف شدند");
      },
    });
  };

  const updateEditingNote = () => {
    const advertiseId = editingNote ? getNoteAdvertiseId(editingNote) : "";
    const cleanNote = noteDraft.trim();

    if (!advertiseId || !cleanNote || saveNote.isPending) return;

    saveNote.mutate(
      { advertiseId, note: cleanNote },
      {
        onError: (saveError) => {
          showToast(getApiErrorMessage(saveError, "ذخیره یادداشت با خطا مواجه شد."), "خطا", "error");
        },
        onSuccess: () => {
          setEditingNote(null);
          setNoteDraft("");
          showToast("یادداشت شما ثبت شد");
        },
      },
    );
  };

  return (
    <AccountPageShell
      action={
        <Button unstyled
          aria-label="حذف همه یادداشت‌ها"
          className="grid h-12 w-12 place-items-center text-[#1a1a1a] disabled:opacity-40"
          disabled={notes.length === 0 || deleteNote.isPending}
          onClick={() => setIsConfirmDeleteAllOpen(true)}
          type="button"
        >
          <img alt="" aria-hidden="true" className="h-6 w-6" src="/icons/trash.svg" />
        </Button>
      }
      title="یادداشت ها"
    >

      <main className={`flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden ${!isLoading && !isError && notes.length === 0 ? "bg-white" : "bg-[#f0f0f0]"}`}>
        <div className={`${!isLoading && !isError && notes.length === 0 ? "flex min-h-0 flex-1 flex-col bg-white" : "space-y-0 bg-white"}`}>
          {isLoading ? <AccountNotesSkeleton count={6} /> : null}
          {isError ? (
            <AccountRetryState
              error={error}
              message={getApiErrorMessage(error, "دریافت یادداشت‌ها با خطا مواجه شد.")}
              onRetry={() => void refetch()}
            />
          ) : null}
          {!isLoading && !isError && notes.map((note, index) => (
            <NoteCard
              disabled={deleteNote.isPending}
              key={getNoteId(note) || index}
              note={note}
              onDelete={deleteSingleNote}
              onEdit={openEditNote}
            />
          ))}
          {!isLoading && !isError && notes.length === 0 ? (
            <EmptyAccountState
              description="با ثبت یادداشت برای آگهی‌ها، آن‌ها در این بخش نمایش داده خواهند شد."
              iconSrc="/vectors/NoNotes.svg"
              title="هیچ یادداشتی برای نمایش وجود ندارد!"
            />
          ) : null}
        </div>
      </main>

      <BottomSheet
        ariaLabel="حذف همه یادداشت‌ها"
        contentClassName="px-4 pt-7"
        isOpen={isConfirmDeleteAllOpen}
        onClose={() => setIsConfirmDeleteAllOpen(false)}
        showHeader={false}
        variant="confirm"
      >
        <Typography as="p" variant="body" size="large" weight="medium" className="m-0 text-center text-base font-semibold leading-7 text-[#1a1a1a]">
          آیا از حذف همه یادداشت‌ها مطمئن هستید؟
        </Typography>
        <div className="mt-7 grid grid-cols-2 gap-4 [direction:ltr]">
          <Button
            className="h-10"
            disabled={deleteNote.isPending}
            onClick={deleteAllNotes}
            size="sm"
            variant="secondary"
          >
            بله
          </Button>
          <Button
            className="h-10"
            onClick={() => setIsConfirmDeleteAllOpen(false)}
            size="sm"
            variant="secondary"
          >
            خیر
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet
        ariaLabel="ویرایش یادداشت"
        contentClassName="px-4 pt-4"
        isOpen={Boolean(editingNote)}
        onClose={() => setEditingNote(null)}
        title="ویرایش یادداشت"
        variant="form"
      >
        <textarea
          aria-label="متن یادداشت"
          className="h-40 w-full resize-none rounded-xl border border-[#cccccc] bg-white px-4 py-3 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)]"
          onChange={(event) => setNoteDraft(event.target.value)}
          placeholder="یادداشت شما"
          value={noteDraft}
        />
        <div className="mt-5 grid grid-cols-2 gap-4 [direction:ltr]">
          <Button
            className="h-10"
            disabled={!noteDraft.trim() || !editingNote || !getNoteAdvertiseId(editingNote) || saveNote.isPending}
            loading={saveNote.isPending}
            onClick={updateEditingNote}
            size="sm"
          >
            ذخیره
          </Button>
          <Button
            className="h-10"
            onClick={() => setEditingNote(null)}
            size="sm"
            variant="secondary"
          >
            انصراف
          </Button>
        </div>
      </BottomSheet>
    </AccountPageShell>
  );
}

export function AccountBookmarksPage() {
  const [isConfirmDeleteAllOpen, setIsConfirmDeleteAllOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useAdvertiseBadgesQuery({ perPage: 10 });
  const deleteBadge = useDeleteAdvertiseBadgeMutation();
  const bookmarks = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );
  const prefetchIndex = Math.max(bookmarks.length - 6, 0);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [bookmarks.length, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const deleteBookmark = (advertiseId: string) => {
    deleteBadge.mutate(advertiseId);
  };

  const deleteAllBookmarks = () => {
    deleteBadge.mutate("all", {
      onSuccess: () => {
        setIsConfirmDeleteAllOpen(false);
      },
    });
  };

  return (
    <AccountPageShell
      action={
        <Button unstyled
          aria-label="حذف همه نشان‌ها"
          className="grid h-12 w-12 place-items-center text-[#1a1a1a] disabled:opacity-40"
          disabled={bookmarks.length === 0 || deleteBadge.isPending}
          onClick={() => setIsConfirmDeleteAllOpen(true)}
          type="button"
        >
          <img alt="" aria-hidden="true" className="h-6 w-6" src="/icons/trash.svg" />
        </Button>
      }
      title="نشان‌ها"
    >
      <main className={`flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden ${!isLoading && !isError && bookmarks.length === 0 ? "bg-white" : "bg-[#f0f0f0]"}`}>
        <div className={`${!isLoading && !isError && bookmarks.length === 0 ? "flex min-h-0 flex-1 flex-col bg-white" : "space-y-2 bg-[#f0f0f0] pt-2"}`}>
          {isLoading ? <AccountAdCardsSkeleton /> : null}
          {isError ? (
            <AccountRetryState
              error={error}
              message={getApiErrorMessage(error, "دریافت نشان‌ها با خطا مواجه شد.")}
              onRetry={() => void refetch()}
            />
          ) : null}
          {!isLoading && !isError && bookmarks.map((bookmark, index) => (
            <div
              key={getBadgeAdvertiseId(bookmark) || index}
              ref={hasNextPage && index === prefetchIndex ? loadMoreRef : undefined}
            >
              <BookmarkAdCard
                badge={bookmark}
                disabled={deleteBadge.isPending}
                onDelete={deleteBookmark}
              />
            </div>
          ))}
          {isFetchingNextPage ? <AccountAdCardsSkeleton count={1} /> : null}
          {!isLoading && !isError && bookmarks.length === 0 ? (
            <EmptyAccountState
              description="آگهی‌های موردعلاقه خود را نشان کنید تا در این بخش نمایش داده شوند."
              iconSrc="/vectors/NoBadges.svg"
              title="هیچ آگهی نشان‌شده‌ای وجود ندارد!"
            />
          ) : null}
        </div>
      </main>

      <BottomSheet
        ariaLabel="حذف همه نشان‌ها"
        contentClassName="px-4 pt-7"
        isOpen={isConfirmDeleteAllOpen}
        onClose={() => setIsConfirmDeleteAllOpen(false)}
        showHeader={false}
        variant="confirm"
      >
        <Typography as="p" variant="body" size="large" weight="medium" className="m-0 text-center text-base font-semibold leading-7 text-[#1a1a1a]">
          آیا از حذف همه نشان‌ها مطمئن هستید؟
        </Typography>
        <div className="mt-7 grid grid-cols-2 gap-4 [direction:ltr]">
          <Button
            className="h-10"
            disabled={deleteBadge.isPending}
            onClick={deleteAllBookmarks}
            size="sm"
            variant="secondary"
          >
            بله
          </Button>
          <Button
            className="h-10"
            onClick={() => setIsConfirmDeleteAllOpen(false)}
            size="sm"
            variant="secondary"
          >
            خیر
          </Button>
        </div>
      </BottomSheet>
    </AccountPageShell>
  );
}

export function AccountRecentViewsPage() {
  const recentViewsQuery = useQuery({
    queryFn: () => getRecentViews({ includeMissing: false, page: 1, perPage: 100 }),
    queryKey: ["account", "recent-views"],
  });
  const recentAdvertises = useMemo(() => {
    if (!recentViewsQuery.data) return [];
    if (recentViewsQuery.data.advertises.length > 0) {
      return recentViewsQuery.data.advertises as AdvertisementItem[];
    }

    return recentViewsQuery.data.data.flatMap((view) =>
      view.advertise ? [view.advertise as AdvertisementItem] : [],
    );
  }, [recentViewsQuery.data]);

  return (
    <AccountPageShell
      action={
        <RouteLink className="grid h-12 w-12 place-items-center text-[#1a1a1a]" to="/search">
        </RouteLink>
      }
      title="بازدیدهای اخیر"
    >
      <main className={`flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden ${!recentViewsQuery.isLoading && !recentViewsQuery.isError && recentAdvertises.length === 0 ? "bg-white" : "bg-[#f0f0f0]"}`}>
        {recentViewsQuery.isLoading ? <AccountAdCardsSkeleton /> : null}
        {recentViewsQuery.isError ? (
          <AccountRetryState
            error={recentViewsQuery.error}
            message={getApiErrorMessage(recentViewsQuery.error, "دریافت بازدیدهای اخیر با خطا مواجه شد.")}
            onRetry={() => void recentViewsQuery.refetch()}
          />
        ) : null}
        {!recentViewsQuery.isLoading && !recentViewsQuery.isError ? (
          <div className={`min-h-0 flex-1 ${recentAdvertises.length === 0 ? "flex flex-col bg-white" : "space-y-2 bg-[#f0f0f0] pt-2"}`}>
            {recentAdvertises.map((advertise, index) => {
              const ad = mapAdvertisementToAdCard(advertise, index);

              return <AdCard ad={ad} key={ad.id || index} />;
            })}
            {recentAdvertises.length === 0 ? (
              <EmptyAccountState
                description="پس از اولین بازدید، آگهی‌های مشاهده‌شده در این بخش نمایش داده خواهند شد."
                iconSrc="/vectors/NoViews.svg"
                title="هیچ بازدید اخیری برای نمایش وجود ندارد!"
              />
            ) : null}
          </div>
        ) : null}
      </main>
    </AccountPageShell>
  );
}

export function AccountIdentityPage() {
  const [step, setStep] = useState<IdentityPageStep>("pending");
  const [isOwnershipWarningOpen, setIsOwnershipWarningOpen] = useState(false);
  const { message, showNotice } = useDemoNotice();
  const authorize = useAuthorizeMeMutation();
  const { data: profile } = useMyProfileQuery();
  const isAuthRequired = new URLSearchParams(window.location.search).get("required") === "1";
  const mobile = getStoredAuthSession()?.mobile ?? "-";

  useEffect(() => {
    if (isUserIdentityVerified(profile) && step === "pending") {
      setStep("verified");
    }
  }, [profile, step]);

  const title =
    step === "pending"
      ? "تایید هویت"
      : step === "verified"
        ? "مالکیت سیم‌کارت"
        : "ثبت تغییر مالکیت سیم‌کارت";

  return (
    <AccountPageShell
      onBack={
        step === "ownership"
          ? () => {
              setIsOwnershipWarningOpen(false);
              setStep("verified");
            }
          : undefined
      }
      title={title}
    >
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-24">
        {step === "pending" ? (
          <IdentityPendingState
            isPending={authorize.isPending}
            showRequiredNotice={isAuthRequired}
            onVerify={(nationalnumber) => {
              authorize.mutate(
                { nationalnumber },
                {
                  onError: (error) => {
                    showNotice(getApiErrorMessage(error, "تایید کد ملی با خطا مواجه شد"));
                  },
                  onSuccess: () => {
                    setStep("verified");
                    showNotice("کد ملی با موفقیت تایید شد");
                  },
                },
              );
            }}
          />
        ) : null}

        {step === "verified" ? (
          <IdentityVerifiedState onChangeOwner={() => setStep("ownership")} />
        ) : null}

        {step === "ownership" ? (
          <SimCardOwnershipChangeState
            onSubmit={() => setIsOwnershipWarningOpen(true)}
          />
        ) : null}
      </main>

      <BottomSheet
        ariaLabel="هشدار تغییر مالکیت سیم‌کارت"
        contentClassName="px-4 pb-4 pt-4"
        isOpen={isOwnershipWarningOpen}
        onClose={() => setIsOwnershipWarningOpen(false)}
        panelPaddingClassName="pt-4"
        showHeader={false}
        variant="confirm"
      >
        <div className="flex items-center justify-start gap-2 text-[#1a1a1a]">
          <WarningTriangleIcon className="h-5 w-5 shrink-0" />
          <Typography as="h2" variant="title" size="small" weight="semibold" className="m-0 text-sm font-semibold leading-6">هشدار</Typography>
        </div>

        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-3 text-right text-xs font-normal leading-6 text-[#4d4d4d]">
          با اعلام تغییر مالکیت سیم‌کارت، همه آگهی‌های این حساب کاربری
          {" "}
          <Typography as="span" variant="label" size="medium" weight="medium" dir="ltr" className="font-medium text-[#1a1a1a]">
            ({mobile})
          </Typography>
          {" "}
          غیرفعال می‌شوند.
        </Typography>

        <div className="mt-5 grid grid-cols-2 gap-3 [direction:ltr]">
          <Button
            className="h-10"
            onClick={() => {
              setIsOwnershipWarningOpen(false);
              setStep("verified");
              showNotice("درخواست تغییر مالکیت سیم‌کارت ثبت شد");
            }}
            size="sm"
          >
            تایید
          </Button>
          <Button
            className="h-10"
            onClick={() => setIsOwnershipWarningOpen(false)}
            size="sm"
            variant="secondary"
          >
            انصراف
          </Button>
        </div>
      </BottomSheet>

      <DemoNotice message={message} className="bottom-20" />
    </AccountPageShell>
  );
}

export function AccountRequestsPage() {
  return <RequestManagementView backTo="/account" variant="account" />;
}

export function AccountAboutPage() {
  return (
    <AccountPageShell title="درباره ما">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pb-8 pt-4">
        <section className="rounded-2xl bg-[#0048c414] px-4 pb-4 pt-2 text-right">
          <div className="flex min-h-[142px] items-center justify-between gap-4">
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-[#0048c414] text-[#0048c4]">
              <BuildingClusterIcon className="h-14 w-14" />
            </div>
            <div className="min-w-0 flex-1">
              <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 text-[#0048c4]">
                درباره ما
              </Typography>
            </div>
          </div>

          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-3 text-right text-sm font-normal leading-7 text-[#4d4d4d]">
            ما بیش از ۱۰ سال است که در دنیای املاک همراه خریداران، فروشندگان و آژانس‌های املاک هستیم. در این سال‌ها هدف ما همیشه یک چیز بوده: ساده‌تر کردن مسیر معامله ملک و ایجاد بستری مطمئن برای همه کسانی که در بازار املاک فعالیت دارند.
          </Typography>
        </section>

        <AboutSection
          title="ثبت آگهی سریع و ساده برای کاربران"
          text={`اگر مالک یا مستأجر هستید و می‌خواهید ملک خود را معرفی کنید، کافیست با چند کلیک آگهی‌تان را ثبت کنید.
آپلود تصاویر باکیفیت
نمایش موقعیت روی نقشه
دسته‌بندی دقیق بر اساس نوع ملک و منطقه
جستجوی هوشمند برای دیده‌شدن بیشتر
ما کاری می‌کنیم که آگهی شما در کوتاه‌ترین زمان در معرض دید هزاران کاربر قرار بگیرد.`}
        />

        <AboutSection
          title="CRM اختصاصی برای آژانس‌های املاک"
          text={`آژانس‌های املاک همیشه با حجم بالای آگهی‌ها و مشتریان روبه‌رو هستند. سیستم CRM ما دقیقا برای حل این چالش ساخته شده است.
مدیریت کامل آگهی‌ها
ثبت و پیگیری مشتریان بالقوه
گزارش‌های دقیق برای تحلیل عملکرد
دسترسی سریع و آنلاین از هر جا
با این CRM، آژانس‌ها می‌توانند وقت کمتری صرف کارهای اداری کرده و تمرکز خود را روی معامله‌های موفق بگذارند.`}
        />

        <AboutSection
          title="مدیریت حرفه‌ای مشاورین"
          text={`موفقیت یک آژانس به تیم مشاورین آن بستگی دارد. به همین دلیل ما ابزارهایی فراهم کرده‌ایم که مدیران آژانس بتوانند به بهترین شکل فعالیت مشاورین را مدیریت کنند:
اختصاص آگهی به مشاورین
بررسی عملکرد فردی و گروهی
گزارش‌های مدیریتی برای تصمیم‌گیری بهتر
تعیین سطح دسترسی برای هر مشاور
این امکانات باعث می‌شود نظم کاری افزایش پیدا کند و مشتریان تجربه‌ای حرفه‌ای‌تر از همکاری با آژانس داشته باشند.`}
        />

        <AboutSection
          isLast
          title="چرا ما؟"
          text={`بیش از یک دهه تجربه‌ی موفق در بازار املاک
همکاری با صدها آژانس و هزاران کاربر
پشتیبانی مداوم و به‌روزرسانی‌های منظم
استفاده از جدیدترین فناوری‌ها برای ساده‌تر کردن معاملات
ما اینجاییم تا خرید، فروش و اجاره ملک دیگر کار پیچیده‌ای نباشد.`}
        />
      </main>
    </AccountPageShell>
  );
}

function AccountPageShell({ action, children, onBack, title }: React.PropsWithChildren<TopBarProps>) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account"
        onBack={onBack}
        startSlot={
          <div className="flex h-12 w-12 shrink-0 items-center justify-center">
            {action}
          </div>
        }
        title={title}
      />
      <div className="min-h-0 flex flex-1 flex-col">
        {children}
      </div>
    </PageFrame>
  );
}

function AdFilterTabs({
  activeFilter,
  onSelect,
}: {
  activeFilter: { label: string; type: MyAdsType };
  onSelect: (filter: { label: string; type: MyAdsType }) => void;
}) {
  return (
    <section className="h-[52px] overflow-hidden bg-[#f0f0f0] px-4 py-2">
      <div className="flex h-9 gap-2 overflow-x-auto [direction:rtl] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {adFilters.map((filter) => (
          <Chip
            key={filter.label}
            onClick={() => onSelect(filter)}
            selected={activeFilter.label === filter.label}
          >
            {filter.label}
          </Chip>
        ))}
      </div>
    </section>
  );
}

function EmptyAccountState({
  description,
  iconSrc,
  title,
}: {
  description: string;
  iconSrc: string;
  title: string;
}) {
  return (
    <section className="mx-auto flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center px-9 text-center">
      <img alt="" aria-hidden="true" className="mb-5 h-[66px] w-[66px]" src={iconSrc} />
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-bold leading-6 text-[#1a1a1a]">
        {title}
      </Typography>
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 max-w-[290px] text-sm font-normal leading-6 text-[#4d4d4d]">
        {description}
      </Typography>
    </section>
  );
}

function getBadgeAdvertiseSource(badge: BadgeItem): AdvertisementItem {
  return (
    badge.ad ??
    badge.advertise ??
    badge.advertisement ??
    (badge as AdvertisementItem)
  );
}

function getBadgeAdvertiseId(badge: BadgeItem) {
  const ad = getBadgeAdvertiseSource(badge);
  const id =
    badge.advertiseId ??
    badge.advertise_id ??
    ad.id ??
    ad._id ??
    badge.id ??
    badge._id;

  return id === undefined || id === null ? "" : String(id);
}

function BookmarkAdCard({
  badge,
  disabled,
  onDelete,
}: {
  badge: BadgeItem;
  disabled: boolean;
  onDelete: (advertiseId: string) => void;
}) {
  const advertiseId = getBadgeAdvertiseId(badge);
  const mappedAd = mapAdvertisementToAdCard(getBadgeAdvertiseSource(badge), 0);
  const card = {
    ...mappedAd,
    id: advertiseId || mappedAd.id,
  } satisfies AdCardData;

  return (
    <div className="relative bg-white">
      <AdCard ad={card} />

      <Button unstyled
        aria-label="حذف نشان"
        className="absolute left-6 top-6 z-10 grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-[#1a1a1a] shadow-[0_2px_8px_rgba(26,26,26,0.16)] disabled:opacity-50"
        disabled={disabled || !advertiseId}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (advertiseId) {
            onDelete(advertiseId);
          }
        }}
        type="button"
      >
        <img alt="" aria-hidden="true" className="h-6 w-6" src="/icons/trash.svg" />
      </Button>
    </div>
  );
}

function getNoteAdvertiseSource(note: NoteItem): AdvertisementItem {
  return (
    note.ad ??
    note.advertise ??
    note.advertisement ??
    (note as AdvertisementItem)
  );
}

function getNoteId(note: NoteItem) {
  const id = note.id ?? note._id ?? note.noteId;

  return id === undefined || id === null ? "" : String(id);
}

function getNoteAdvertiseId(note: NoteItem) {
  const ad = getNoteAdvertiseSource(note);
  const id = note.advertiseId ?? note.advertise_id ?? ad.id ?? ad._id;

  return id === undefined || id === null ? "" : String(id);
}

function readNoteText(note: NoteItem) {
  if (typeof note.note === "string") return note.note;
  if (typeof note.text === "string") return note.text;
  if (typeof note.description === "string") return note.description;

  return "";
}

function readNoteDate(note: NoteItem, fallback: string) {
  const createdAt = note.created_at ?? note.updated_at;

  if (typeof createdAt === "string" && createdAt.trim()) return createdAt;

  return fallback || "";
}

function NoteCard({
  disabled,
  note,
  onDelete,
  onEdit,
}: {
  disabled: boolean;
  note: NoteItem;
  onDelete: (noteId: string) => void;
  onEdit: (note: NoteItem) => void;
}) {
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const dragStartOffset = useRef(0);
  const noteId = getNoteId(note);
  const advertiseId = getNoteAdvertiseId(note);
  const mappedAd = mapAdvertisementToAdCard(getNoteAdvertiseSource(note), 0);
  const noteText = readNoteText(note) || "یادداشت";
  const dateText = mappedAd.timeAndLocation || readNoteDate(note, "");
  const maxDragOffset = 59;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (dragStartX.current === null || disabled || !noteId) return;

    const deltaX = event.clientX - dragStartX.current;
    setDragOffset(Math.min(maxDragOffset, Math.max(0, dragStartOffset.current + deltaX)));
  };

  const handlePointerEnd = () => {
    setDragOffset((current) => current >= maxDragOffset / 2 ? maxDragOffset : 0);
    dragStartX.current = null;
    dragStartOffset.current = 0;
  };

  return (
    <article className="relative h-[137px] overflow-hidden border-b border-[#f0f0f0] bg-white text-right [direction:rtl]">
      <Button unstyled
        aria-label="حذف یادداشت"
        className="absolute left-0 top-0 flex h-[136px] w-[59px] flex-col items-center justify-center gap-2 bg-[#ecdddd] text-[#c11004] disabled:opacity-50"
        disabled={disabled || !noteId}
        onClick={() => noteId && onDelete(noteId)}
        type="button"
      >
        <LinearDelete className="h-6 w-6" />
        <Typography as="span" variant="label" size="medium" weight="medium" className="text-[#c11004]">
          حذف
        </Typography>
      </Button>

      <div
        className="relative z-10 h-[136px] touch-pan-y bg-white px-4 py-4 transition-transform duration-150 ease-out"
        onPointerCancel={handlePointerEnd}
        onPointerDown={(event) => {
          dragStartX.current = event.clientX;
          dragStartOffset.current = dragOffset;
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        style={{ transform: `translateX(${dragOffset}px)` }}
      >
        <div className="flex h-10 items-center justify-end gap-3 [direction:ltr]">
          <Button unstyled
            aria-label="ویرایش یادداشت"
            className="grid h-6 w-6 shrink-0 place-items-center text-[#4d4d4d] disabled:opacity-50"
            disabled={!advertiseId || disabled}
            onClick={() => onEdit(note)}
            type="button"
          >
            <LinearEdit className="h-5 w-5" />
          </Button>
          <Typography as="h2" variant="body" size="large" weight="regular" className="m-0 min-w-0 max-w-[calc(100%_-_36px)] truncate text-right text-[#1a1a1a] [direction:rtl]">
            {noteText}
          </Typography>
        </div>

        <div className="mt-4 flex h-10 min-w-0 items-center gap-3 [direction:rtl]">
          <RouteLink
            aria-label={`مشاهده آگهی ${mappedAd.title}`}
            className={`relative h-10 w-[60px] shrink-0 overflow-hidden rounded-lg bg-[#ebebeb] bg-cover bg-center ${mappedAd.imageClassName}`}
            style={mappedAd.imageUrl ? { backgroundImage: `url(${mappedAd.imageUrl})` } : undefined}
            to={advertiseId ? `/ads/${advertiseId}` : "/search"}
          />

          <div className="min-w-0 flex-1 text-right">
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 truncate text-right text-[#1a1a1a]">
              {mappedAd.title}
            </Typography>
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-1 truncate text-right text-[#808080]">
              {dateText}
            </Typography>
          </div>
        </div>
      </div>
    </article>
  );
}

function AboutSection({
  isLast = false,
  text,
  title,
}: {
  isLast?: boolean;
  text: string;
  title: string;
}) {
  return (
    <section className={`${isLast ? "pb-0" : "border-b border-[#cccccc] pb-6"} pt-6 text-right`}>
      <div className="flex items-center justify-end gap-1.5">
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 min-w-0 flex-1 text-right text-base font-semibold leading-6 text-[#0048c4]">
          {title}
        </Typography>
        <Typography as="span" variant="body" size="medium" weight="regular" className="h-3 w-3 shrink-0 rounded-full bg-[#11a366]" aria-hidden="true" />
      </div>
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 whitespace-pre-line text-right text-sm font-normal leading-7 text-[#4d4d4d]">
        {text}
      </Typography>
    </section>
  );
}

function IdentityPendingState({
  isPending,
  showRequiredNotice = false,
  onVerify,
}: {
  isPending: boolean;
  showRequiredNotice?: boolean;
  onVerify: (nationalnumber: string) => void;
}) {
  const mobile = getStoredAuthSession()?.mobile ?? "-";
  const [nationalnumber, setNationalnumber] = useState("");
  const normalizedNationalnumber = nationalnumber.trim();
  const isNationalnumberComplete = normalizedNationalnumber.length === 10;

  return (
    <>
      {showRequiredNotice ? (
        <section className="px-2 pt-3">
          <div className="rounded-xl border border-[#ff6d00] bg-[#fff7f0] px-4 py-3 text-right text-[#ff6d00]">
            <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm font-semibold leading-6">
              احراز هویت مورد نیاز است!
            </Typography>
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-1 text-xs font-normal leading-5">
              برای ادامه استفاده از حساب، ابتدا کد ملی مالک شماره همراه را تایید کنید.
            </Typography>
          </div>
        </section>
      ) : null}

      <section className="px-2 pt-3">
        <div className="rounded-xl border border-[#0048C4] bg-[#0048C414] p-6">
          <div className="flex items-center justify-start gap-2 text-[#0048C4]">
            <IdentityCheckIcon className="h-6 w-6" />
            <Typography as="p" variant="body" size="large" className="m-0">
              ملاحظات در تایید هویت
            </Typography>
          </div>

          <Typography as="p" variant="body" size="large" weight="regular" className="mt-3 text-[#1a1a1a]">
            برای افزایش امنیت حساب و جلوگیری از سوءاستفاده، هویت شما با کد ملی و مالکیت شماره همراه بررسی می‌شود.
          </Typography>

          <Typography as="p" variant="body" size="large" weight="regular" className="mt-2 text-[#1a1a1a]">
            شماره همراه فعال:{" "}
            <Typography as="span" variant="body" size="large" weight="medium" dir="ltr" className="text-[#11A366]">
              {mobile}
            </Typography>
          </Typography>
        </div>
      </section>

      <section className="px-2 pt-4 text-center">
        <Typography as="h2" variant="title" size="small" weight="semibold" className="m-0 text-sm font-semibold leading-5 text-[#1a1a1a]">
          تایید با کد ملی
        </Typography>

        <div className="mt-1 flex items-center justify-center gap-1 text-[#808080]">
          <InfoCircleIcon className="h-3.5 w-3.5 shrink-0" />
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-[11px] font-normal leading-5">
            کد ملی باید متعلق به مالک همین شماره همراه باشد.
          </Typography>
        </div>

        <label className="relative mt-4 block">
          <Typography as="span" variant="body" size="small" weight="regular" className="absolute -top-2 right-4 bg-white px-1.5 text-xs font-normal leading-4 text-[#808080]">
            کد ملی مالک شماره همراه
          </Typography>

          <input
            className="h-11 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)]"
            inputMode="numeric"
            maxLength={10}
            value={nationalnumber}
            onChange={(event) => setNationalnumber(normalizeNumericInput(event.target.value).slice(0, 10))}
          />
        </label>
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button unstyled
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white disabled:opacity-50"
          disabled={!isNationalnumberComplete || isPending}
          onClick={() => onVerify(normalizedNationalnumber)}
          type="button"
        >
          {isPending ? "در حال بررسی..." : "بررسی و تایید هویت"}
        </Button>
      </div>
    </>
  );
}

function normalizeNumericInput(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/\D/g, "");
}

function IdentityVerifiedState({ onChangeOwner }: { onChangeOwner: () => void }) {
  return (
    <>
      <section className="px-2 pt-2">
        <div className="rounded-xl border border-[#11A366] bg-[#11A36614] px-4 pb-5 pt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-[#11A366]">
            <IdentityCheckIcon className="h-4 w-4" />
            <Typography as="p" variant="body" size="large" weight="medium" className="">
              هویت شما تایید شده است
            </Typography>
          </div>

          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-4 text-base font-normal leading-6 text-[#4d4d4d]">
            احراز هویت شما در بهمن ۱۴۰۱ با موفقیت انجام شده است.
          </Typography>
        </div>
      </section>

      <div className="mt-3 h-0.5 bg-[#f0f0f0]" />

      <section className="px-2 pt-4 text-center">
        <Typography as="h2" variant="title" size="medium" weight="medium" className="m-0 text-[#1a1a1a]">
          مالکیت سیم‌کارت
        </Typography>

        <div className="mt-2 flex items-start justify-center gap-1 text-[#808080]">
          <InfoCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 leading-5">
            در صورتی که سیم‌کارت را تازه خریده‌اید و یا قصد فروش دارید، حتماً تغییر مالکیت آن را اعلام کنید.
            <br />
            در غیر این صورت، عواقب هرگونه تخلف مالک قبلی یا جدید، بر عهدهٔ شما است.
          </Typography>
        </div>

        <Button unstyled
          className="relative mt-6 flex h-12 w-full items-center justify-center rounded-xl border border-[#0048c4] bg-white px-4 text-sm font-semibold leading-5 text-[#0048c4]"
          onClick={onChangeOwner}
          type="button"
        >
          <ChevronLeftIcon className="absolute left-4 h-4 w-4" />
          <Typography as="span" variant="label" size="large" weight="medium">ثبت تغییر مالکیت سیم‌کارت</Typography>
        </Button>
      </section>
    </>
  );
}

function SimCardOwnershipChangeState({ onSubmit }: { onSubmit: () => void }) {
  const [selectedReason, setSelectedReason] =
    useState<SimCardOwnershipReason>("selling");

  return (
    <>
      <section className="px-4 pt-5">
        <div className="space-y-7">
          {simCardOwnershipReasons.map((reason) => {
            const isSelected = selectedReason === reason.id;

            return (
              <label
                className="flex cursor-pointer items-center justify-start gap-3 text-right"
                key={reason.id}
              >
                <input
                  checked={isSelected}
                  className="sr-only"
                  name="sim-card-ownership-reason"
                  onChange={() => setSelectedReason(reason.id)}
                  type="radio"
                  value={reason.id}
                />

                <Typography as="span" variant="body" size="medium" weight="regular"
                  aria-hidden="true"
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${
                    isSelected
                      ? "border-[#0048c4]"
                      : "border-[#808080]"
                  }`}
                >
                  {isSelected ? (
                    <Typography as="span" variant="body" size="medium" weight="regular" className="h-2.5 w-2.5 rounded-full bg-[#0048c4]" />
                  ) : null}
                </Typography>

                <Typography as="span" variant="body" size="medium" weight="regular" className="text-sm font-normal leading-6 text-[#1a1a1a]">
                  {reason.label}
                </Typography>
              </label>
            );
          })}
        </div>
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button unstyled
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
          onClick={onSubmit}
          type="button"
        >
          ثبت
        </Button>
      </div>
    </>
  );
}

function EmptyMessage({ text }: { text: string }) {
  return (
    <Typography as="p" variant="body" size="medium" weight="medium" className="mx-auto m-0 flex min-h-0 w-full flex-1 items-center justify-center bg-white px-4 text-center text-sm font-medium text-[#808080]">
      {text}
    </Typography>
  );
}

function AccountProfileSkeleton() {
  return (
    <div aria-label="در حال دریافت مشخصات" className="bg-white pb-24">
      <section className="flex flex-col items-center px-4 pt-4">
        <AccountSkeletonBlock className="h-[100px] w-[100px] rounded-full" />
        <AccountSkeletonBlock className="mt-3 h-4 w-28" />
      </section>

      <section className="mt-6 space-y-6 px-4">
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
      </section>

      <div className="mt-4 h-4 bg-[#f0f0f0]" />

      <section className="space-y-6 px-4 pt-4">
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-4 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <AccountSkeletonBlock className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

function ProfileFieldSkeleton() {
  return (
    <div className="space-y-2">
      <AccountSkeletonBlock className="ml-auto h-4 w-20" />
      <AccountSkeletonBlock className="h-12 w-full" />
    </div>
  );
}

function AccountLoadingState({ text }: { text: string }) {
  return (
    <div className="space-y-3 bg-white px-4 py-5" aria-label={text}>
      <AccountSkeletonBlock className="ml-auto h-5 w-32" />
      <AccountSkeletonBlock className="h-14 w-full" />
      <AccountSkeletonBlock className="h-14 w-full" />
    </div>
  );
}

function AccountSkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#e8e8e8] ${className}`} />;
}

function AccountAdCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <article className="bg-white px-4 py-4" key={index}>
          <div className="flex gap-3 [direction:rtl]">
            <AccountSkeletonBlock className="h-[104px] w-[136px] shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <AccountSkeletonBlock className="ml-auto h-5 w-3/4" />
              <AccountSkeletonBlock className="ml-auto h-4 w-1/2" />
              <AccountSkeletonBlock className="ml-auto h-4 w-full" />
              <AccountSkeletonBlock className="ml-auto h-4 w-2/3" />
            </div>
          </div>
        </article>
      ))}
    </>
  );
}

function MyAdsAdCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <AdCardSkeleton key={index} />
      ))}
    </>
  );
}

function AccountNotesSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <article className="h-[137px] border-b border-[#f0f0f0] bg-white px-4 py-4" key={index}>
          <div className="flex h-10 items-center justify-end gap-3">
            <AccountSkeletonBlock className="h-5 w-5 shrink-0" />
            <AccountSkeletonBlock className="h-5 w-36" />
          </div>
          <div className="mt-4 flex h-10 items-center gap-3 [direction:rtl]">
            <AccountSkeletonBlock className="h-10 w-[60px] shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <AccountSkeletonBlock className="ml-auto h-3 w-3/4" />
              <AccountSkeletonBlock className="ml-auto h-3 w-1/2" />
            </div>
          </div>
        </article>
      ))}
    </>
  );
}

function AccountRetryState({
  error,
  message,
  onRetry,
}: {
  error?: unknown;
  message: string;
  onRetry?: () => void;
}) {
  const ErrorState = getRequestErrorState(error);
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="fixed inset-0 z-[999] bg-white">
        <ErrorState className="h-full" onRetry={onRetry ?? reloadPage} />
      </div>
      <Typography as="p" variant="body" size="medium" weight="regular" className="sr-only">{message}</Typography>
    </>
  );
}

function formatMoney(value: unknown) {
  const amount =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.replace(/,/g, ""))
        : 0;

  if (!Number.isFinite(amount)) {
    return String(value || "۰");
  }

  return new Intl.NumberFormat("fa-IR").format(amount);
}

function readPaymentStatus(payment: WalletPayment) {
  const status = String(payment.status ?? "0").toLowerCase();

  switch (status) {
    case "1":
    case "paid":
    case "success":
      return "پرداخت شده";

    case "0":
    case "failed":
    case "error":
      return "نا‌موفق";

    default:
      return status;
  }
}

function readPaymentStatusColor(payment: WalletPayment) {
  const status = String(payment.status ?? "");

  if (["1", "paid", "success"].includes(status)) {
    return "#11a366";
  }

  if (["0", "failed", "error"].includes(status)) {
    return "#EE3623";
  }

  return "#1a1a1a";
}

function formatPaymentDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="block">
      <Typography as="span" variant="body" size="small" weight="regular" className="mb-1 block pr-4 text-right text-xs font-normal text-[#b3b3b3]">
        {label}
      </Typography>
      <TextField
        className="text-sm text-[#b3b3b3]"
        disabled
        highlightWhenFilled={false}
        value={value}
      />
    </div>
  );
}

function PaymentHistoryCard({ payment }: { payment: WalletPayment }) {
  return (
    <article className="border-b border-[#f0f0f0] bg-white p-4 flex flex-col gap-y-2 text-right">
      <PaymentHistoryRow
        label="وضعیت"
        value={readPaymentStatus(payment)}
        valueColor={readPaymentStatusColor(payment)}
      />

      <PaymentHistoryRow
        icon={<AdCardTomanIcon className="h-6 w-6 text-[#4D4D4D]" />}
        label="هزینه"
        value={formatMoney(payment.price ?? 0)}
      />

      <PaymentHistoryRow
        label="زمان پرداخت"
        value={formatPaymentDate(payment.created_at)}
      />

      <PaymentHistoryRow
        label="شناسه پرداخت"
        value={String(payment.ref_id ?? "-")}
        isLast
      />
    </article>
  );
}

function PaymentHistoryRow({
  icon,
  label,
  value,
  valueColor = "#1a1a1a",
}: {
  icon?: React.ReactNode;
  isLast?: boolean;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-2 gap-4`}>
      <Typography as="span" variant="label" size="medium" weight="medium" className="shrink-0 font-medium leading-5 text-[#808080]">
        {label}
      </Typography>

      <Typography as="span" variant="label" size="medium" weight="medium"
        className="flex min-w-0 items-center gap-1 text-left font-medium"
        style={{ color: valueColor }}
      >
        {value}{icon}
      </Typography>
    </div>
  );
}

function EditIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function IdentityCheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect height="14" rx="2" width="18" x="3" y="5" />
      <path d="M8.5 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5.5 16a3 3 0 0 1 6 0M14 12l2 2 4-5" />
    </svg>
  );
}

function BuildingClusterIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M3 21V8l6-3 6 3v13" />
      <path d="M15 12h6v9" />
      <path d="M7 10h2M7 14h2M7 18h2M13 10h.01M13 14h.01M18 15h.01M18 18h.01" />
    </svg>
  );
}

function InfoCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function WarningTriangleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.5L13.7 4.2a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
