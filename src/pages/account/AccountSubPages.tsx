import { useEffect, useMemo, useRef, useState } from "react";
import { PageFrame } from "../../app/PageFrame";
import { getApiErrorMessage } from "../../api/api";
import { getStoredAuthSession } from "../../auth/auth-storage";
import {
  useAdvertiseBadgesQuery,
  useAuthorizeMeMutation,
  useDeleteAdvertiseBadgeMutation,
  useDeleteAdvertiseNoteMutation,
  useMyAdsQuery,
  useMyNotesQuery,
  useMyProfileQuery,
  useSaveAdvertiseNoteMutation,
  useUpdateMyProfileMutation,
  useWalletPaymentsQuery,
} from "../../hooks/account.hooks";
import {
  mapAdvertisementToAdCard,
  type AdvertisementItem,
} from "../../services/advertisement.service";
import type {
  BadgeItem,
  MyAdsType,
  NoteItem,
  WalletPayment,
} from "../../services/account.service";
import { AdCard } from "../../components/AdCard";
import type { AdCardData } from "../../components/AdCard";
import { BottomSheet } from "../../components/BottomSheet";
import { DemoNotice } from "../../components/DemoNotice";
import { Snackbar, type SnackbarVariant } from "../../components/Snackbar";
import { getRequestErrorState } from "../../components/ErrorState";
import { useDemoNotice } from "../../hooks/useDemoNotice";
import { TopBar } from "../../components/TopBar";
import { RouteLink } from "../../routes/RouteLink";
import { latestMashhadAds } from "../home/homeData";
import { AdCardTomanIcon } from "../../components/AdCardIcons";
import { formatBigNumber, formatPrice } from "../../lib/MoneyHandler";

type TopBarProps = {
  action?: React.ReactNode;
  title: string;
};

const adFilters: Array<{ label: string; type: MyAdsType }> = [
  { label: "همه", type: "all" },
  { label: "فعال", type: "active" },
  { label: "در انتظار", type: "pending" },
  { label: "نیمه کاره", type: "pending" },
  { label: "غیر فعال", type: "deactive" },
];

export function AccountProfilePage() {
  const { message, showNotice } = useDemoNotice();
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

  return (
    <AccountPageShell title="مشخصات من">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-24">
        {isLoading ? <AccountLoadingState text="در حال دریافت مشخصات..." /> : null}
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
                  showNotice(getApiErrorMessage(submitError, "ذخیره اطلاعات با خطا مواجه شد"));
                },
                onSuccess: () => {
                  showNotice("اطلاعات حساب ذخیره شد");
                },
              });
            }}
            onUpdateAvatar={() => showNotice("تصویر پروفایل نمایشی به‌روزرسانی شد")}
          />
        ) : null}
      </main>

      <DemoNotice message={message} className="bottom-20" />
    </AccountPageShell>
  );
}

function AccountProfileForm({
  isSubmitting,
  mobile,
  onSubmit,
  onUpdateAvatar,
  profile,
}: {
  isSubmitting: boolean;
  mobile: string;
  onSubmit: (form: {
    email: string;
    family: string;
    name: string;
    nationalnumber: string;
  }) => void;
  onUpdateAvatar: () => void;
  profile?: {
    email?: string;
    family?: string;
    mobile?: string;
    name?: string;
    nationalnumber?: string;
    phone?: string;
  };
}) {
  const [form, setForm] = useState({
    email: profile?.email ?? "",
    family: profile?.family ?? "",
    name: profile?.name ?? "",
    nationalnumber: profile?.nationalnumber ?? "",
  });

  return (
    <>
      <section className="flex flex-col items-center px-4 pt-4">
        <div className="relative grid h-[100px] w-[100px] place-items-center rounded-full bg-[#e0e0e0] text-[#808080]">
          <UserIcon className="h-10 w-10" />
          <button
            aria-label="ویرایش تصویر"
            className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full border-4 border-white bg-[#0048c4] text-white"
            type="button"
            onClick={onUpdateAvatar}
          >
            <EditIcon className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="mt-4 space-y-6 px-4">
        <ReadonlyField label="شماره همراه" value={profile?.mobile ?? profile?.phone ?? mobile} />
        <ReadonlyField label="کد ملی" value={form.nationalnumber || "-"} />
      </section>

      <div className="mt-4 h-4 bg-[#f0f0f0]" />

      <section className="space-y-6 px-4 pt-4">
        <TextField
          placeholder="نام خود را وارد کنید"
          value={form.name}
          onChange={(value) => setForm((current) => ({ ...current, name: value }))}
        />
        <TextField
          placeholder="نام خانوادگی خود را وارد کنید"
          value={form.family}
          onChange={(value) => setForm((current) => ({ ...current, family: value }))}
        />
        <TextField
          placeholder="پست الکترونیکی"
          value={form.email}
          onChange={(value) => setForm((current) => ({ ...current, email: value }))}
        />
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-4 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <button
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white disabled:opacity-50"
          disabled={isSubmitting}
          type="button"
          onClick={() => onSubmit(form)}
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت"}
        </button>
      </div>
    </>
  );
}

export function AccountMyAdsPage() {
  const [activeFilter, setActiveFilter] = useState(adFilters[0]);
  const { data: ads = [], error, isError, isLoading, refetch } = useMyAdsQuery({
    type: activeFilter.type,
  });

  return (
    <AccountPageShell
      action={
        <RouteLink className="grid h-12 w-12 place-items-center text-[#1a1a1a]" to="/search">
          <MapIcon className="h-6 w-6" />
        </RouteLink>
      }
      title="آگهی‌های من"
    >
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <AdFilterTabs activeFilter={activeFilter} onSelect={setActiveFilter} />
        <div className="space-y-2 bg-[#f0f0f0] pt-4">
          {isLoading ? <AccountAdCardsSkeleton /> : null}
          {isError ? (
            <AccountRetryState
              error={error}
              message={getApiErrorMessage(error, "دریافت آگهی‌ها با خطا مواجه شد.")}
              onRetry={() => void refetch()}
            />
          ) : null}
          {!isLoading && !isError && ads.map((ad, index) => (
            <AdCard ad={mapAdvertisementToAdCard(ad, index)} key={String(ad.id ?? ad._id ?? index)} />
          ))}
          {!isLoading && !isError && ads.length === 0 ? (
            <EmptyMessage text="آگهی‌ای برای نمایش وجود ندارد" />
          ) : null}
        </div>
      </main>
    </AccountPageShell>
  );
}

export function AccountMyAdsEmptyPage() {
  const [activeFilter, setActiveFilter] = useState(adFilters[0]);
  const { data: ads = [], error, isError, isLoading, refetch } = useMyAdsQuery({
    type: activeFilter.type,
  });

  return (
    <AccountPageShell
      action={
        <RouteLink className="grid h-12 w-12 place-items-center text-[#1a1a1a]" to="/search">
          <MapIcon className="h-6 w-6" />
        </RouteLink>
      }
      title="آگهی‌های من"
    >
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <AdFilterTabs activeFilter={activeFilter} onSelect={setActiveFilter} />
        {isLoading ? <AccountAdCardsSkeleton /> : null}
        {isError ? (
          <AccountRetryState
            error={error}
            message={getApiErrorMessage(error, "دریافت آگهی‌ها با خطا مواجه شد.")}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && ads.length > 0 ? (
          <div className="space-y-2 bg-[#f0f0f0] pt-4">
            {ads.map((ad, index) => (
              <AdCard ad={mapAdvertisementToAdCard(ad, index)} key={String(ad.id ?? ad._id ?? index)} />
            ))}
          </div>
        ) : null}
        {!isLoading && !isError && ads.length === 0 ? (
          <section className="flex min-h-[560px] flex-col items-center justify-center px-10 text-center">
            <div className="relative mb-6 grid h-[74px] w-[74px] place-items-center text-[#dfe3eb]">
              <DocumentSadIcon className="h-[68px] w-[68px]" />
              <span className="absolute bottom-1 right-2 grid h-7 w-7 place-items-center rounded-full bg-[#ffb100] text-base font-bold leading-none text-white">
                !
              </span>
            </div>
            <h2 className="m-0 text-base font-bold leading-6 text-[#1a1a1a]">
              هیچ آگهی‌ای برای نمایش وجود ندارد!
            </h2>
            <p className="m-0 mt-2 text-sm font-normal leading-6 text-[#4d4d4d]">
              می‌توانید آگهی‌های خود را ثبت کرده و در این بخش مشاهده کنید.
            </p>
            <RouteLink
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white"
              to="/new-ad"
            >
              <PlusIcon className="h-5 w-5" />
              ثبت آگهی
            </RouteLink>
          </section>
        ) : null}
      </main>
    </AccountPageShell>
  );
}

export function AccountWalletPage() {
  const [amount, setAmount] = useState("");
  const { message, showNotice } = useDemoNotice();
  const { data: wallet, error, isError, isLoading, refetch } = useWalletPaymentsQuery();

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
                <p className="m-0 text-xs font-medium leading-5 text-[#4D4D4D]">
                  اعتبار قابل استفاده:
                </p>

                <div className="mt-2 flex items-end gap-1 text-[#0048c4]">
                  <strong className="text-2xl font-bold leading-7">
                    {formatMoney(wallet?.balance ?? 0)}
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
              <h2 className="m-0 text-base font-medium leading-6">
                افزایش اعتبار
              </h2>
            </div>

            <label className="mt-4 flex py-3 items-center rounded-xl border border-[#cccccc] bg-white px-4 [direction:ltr]">
              <span className="text-xs font-normal leading-4 text-[#808080]">
                تومان
              </span>

              <input
                className="min-w-0 flex-1 border-0 bg-transparent text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] placeholder:text-sm [direction:rtl]"
                inputMode="numeric"
                placeholder="مبلغ اعتبار دلخواه"
                value={amount && amount !== "0" ? formatPrice(Number(amount.replace(/,/g, ""))) : ""}
                onChange={(event) => {
                  const cleanValue = event.target.value.replace(/,/g, "");
                  setAmount(cleanValue);
                }}
              />
            </label>
            {Number(amount) > 0 && (
              <p className="px-4 pt-1 text-xs text-[#808080]">
                {formatBigNumber(Number(amount))} تومان
              </p>
            )}

            <h3 className="m-0 mt-6 text-sm font-medium leading-5 text-[#1a1a1a]">
              مبالغ پیشنهادی
            </h3>

            <div className="mt-3 grid grid-cols-3 gap-3 [direction:rtl]">
              {suggestedAmounts.map((amountOption) => {
                const isActive = amount === amountOption.value;

                return (
                  <button
                    className={`rounded-xl border py-1.5 !text-xs !font-medium leading-4 ${isActive
                      ? "border-[#0048c4] bg-[#0048c414] text-[#0048c4]"
                      : "border-[#cccccc] bg-white text-[#1a1a1a]"
                      }`}
                    key={amountOption.value}
                    onClick={() => setAmount(amountOption.value)}
                    type="button"
                  >
                    {amountOption.label}
                  </button>
                );
              })}
            </div>

            <RouteLink
              className="relative mt-8 flex gap-2 p-4 w-full items-center justify-center rounded-xl border border-[#cccccc] bg-white px-4 text-sm font-medium leading-5 text-[#1a1a1a] no-underline"
              to="/account/wallet/history"
            >
              <img src="/icons/walletHistory.svg" alt="" />
              <span className="text-base flex-1">تاریخچه پرداخت</span>
              <ChevronLeftIcon className="h-4 w-4 text-[#4d4d4d]" />
            </RouteLink>
          </section>
        ) : null}
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-white px-3 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <button
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white disabled:opacity-50"
          disabled={amount.trim().length === 0}
          onClick={() => showNotice(`درخواست شارژ کیف پول به مبلغ ${formatMoney(amount)} تومان ثبت شد`)}
          type="button"
        >
          شارژ کیف پول
        </button>
      </div>

      <DemoNotice message={message} className="bottom-20" />
    </AccountPageShell>
  );
}

export function AccountWalletHistoryPage() {
  const { data: wallet, error, isError, isLoading, refetch } = useWalletPaymentsQuery();
  const payments = wallet?.payments ?? [];

  return (
    <AccountPageShell title="تاریخچه پرداخت کیف پول">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
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
  variant: SnackbarVariant;
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
    variant: SnackbarVariant = "success",
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
        <button
          aria-label="حذف همه یادداشت‌ها"
          className="grid h-12 w-12 place-items-center text-[#1a1a1a] disabled:opacity-40"
          disabled={notes.length === 0 || deleteNote.isPending}
          onClick={() => setIsConfirmDeleteAllOpen(true)}
          type="button"
        >
          <img alt="" aria-hidden="true" className="h-6 w-6" src="/icons/trash.svg" />
        </button>
      }
      title="یادداشت ها"
    >
      {toast ? (
        <Snackbar
          className="top-16"
          message={toast.message}
          onDismiss={() => setToast(null)}
          title={toast.title}
          variant={toast.variant}
        />
      ) : null}

      <main className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden ${!isLoading && !isError && notes.length === 0 ? "bg-white" : "bg-[#f0f0f0]"}`}>
        <div className={`${!isLoading && !isError && notes.length === 0 ? "bg-white" : "space-y-0 bg-white"}`}>
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
        heightClassName="h-[220px]"
        isOpen={isConfirmDeleteAllOpen}
        onClose={() => setIsConfirmDeleteAllOpen(false)}
        showHeader={false}
      >
        <p className="m-0 text-center text-base font-semibold leading-7 text-[#1a1a1a]">
          آیا از حذف همه یادداشت‌ها مطمئن هستید؟
        </p>
        <div className="mt-7 grid grid-cols-2 gap-4 [direction:ltr]">
          <button
            className="h-10 rounded-[10px] border border-[#0048C4] bg-white px-4 text-sm font-medium leading-5 text-[#0048C4] disabled:opacity-50"
            disabled={deleteNote.isPending}
            onClick={deleteAllNotes}
            type="button"
          >
            بله
          </button>
          <button
            className="h-10 rounded-[10px] border border-[#0048C4] bg-white px-4 text-sm font-medium leading-5 text-[#0048C4]"
            onClick={() => setIsConfirmDeleteAllOpen(false)}
            type="button"
          >
            خیر
          </button>
        </div>
      </BottomSheet>

      <BottomSheet
        ariaLabel="ویرایش یادداشت"
        contentClassName="px-4 pt-4"
        heightClassName="h-[360px]"
        isOpen={Boolean(editingNote)}
        onClose={() => setEditingNote(null)}
        title="ویرایش یادداشت"
      >
        <textarea
          aria-label="متن یادداشت"
          className="h-40 w-full resize-none rounded-xl border border-[#cccccc] bg-white px-4 py-3 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)]"
          onChange={(event) => setNoteDraft(event.target.value)}
          placeholder="یادداشت شما"
          value={noteDraft}
        />
        <div className="mt-5 grid grid-cols-2 gap-4 [direction:ltr]">
          <button
            className="h-10 rounded-[10px] bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white disabled:opacity-50"
            disabled={!noteDraft.trim() || !editingNote || !getNoteAdvertiseId(editingNote) || saveNote.isPending}
            onClick={updateEditingNote}
            type="button"
          >
            {saveNote.isPending ? "در حال ذخیره..." : "ذخیره"}
          </button>
          <button
            className="h-10 rounded-[10px] border border-[#0048c4] bg-white px-4 text-sm font-medium leading-5 text-[#0048c4]"
            onClick={() => setEditingNote(null)}
            type="button"
          >
            انصراف
          </button>
        </div>
      </BottomSheet>
    </AccountPageShell>
  );
}

export function AccountBookmarksPage() {
  const [isConfirmDeleteAllOpen, setIsConfirmDeleteAllOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { message, showNotice } = useDemoNotice();
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
    deleteBadge.mutate(advertiseId, {
      onError: (deleteError) => {
        showNotice(getApiErrorMessage(deleteError, "حذف نشان با خطا مواجه شد."));
      },
      onSuccess: () => {
        showNotice("آگهی از نشان‌ها حذف شد");
      },
    });
  };

  const deleteAllBookmarks = () => {
    deleteBadge.mutate("all", {
      onError: (deleteError) => {
        showNotice(getApiErrorMessage(deleteError, "حذف نشان‌ها با خطا مواجه شد."));
      },
      onSuccess: () => {
        setIsConfirmDeleteAllOpen(false);
        showNotice("همه نشان‌ها حذف شدند");
      },
    });
  };

  return (
    <AccountPageShell
      action={
        <button
          aria-label="حذف همه نشان‌ها"
          className="grid h-12 w-12 place-items-center text-[#1a1a1a] disabled:opacity-40"
          disabled={bookmarks.length === 0 || deleteBadge.isPending}
          onClick={() => setIsConfirmDeleteAllOpen(true)}
          type="button"
        >
          <img alt="" aria-hidden="true" className="h-6 w-6" src="/icons/trash.svg" />
        </button>
      }
      title="نشان‌ها"
    >
      <main className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden ${!isLoading && !isError && bookmarks.length === 0 ? "bg-white" : "bg-[#f0f0f0]"}`}>
        <div className={`${!isLoading && !isError && bookmarks.length === 0 ? "bg-white" : "space-y-2 bg-[#f0f0f0] pt-2"}`}>
          {isLoading ? <AccountAdCardsSkeleton /> : null}
          {isError ? (
            <AccountRetryState
              error={error}
              message={getApiErrorMessage(error, "دریافت نشان‌ها با خطا مواجه شد.")}
              onRetry={() => void refetch()}
            />
          ) : null}
          {!isLoading && !isError && bookmarks.map((bookmark, index) => (
            <div className="contents" key={getBadgeAdvertiseId(bookmark) || index}>
              <BookmarkAdCard
                badge={bookmark}
                disabled={deleteBadge.isPending}
                onDelete={deleteBookmark}
              />
              {hasNextPage && index === prefetchIndex ? (
                <div aria-hidden="true" className="h-px" ref={loadMoreRef} />
              ) : null}
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
        heightClassName="h-[220px]"
        isOpen={isConfirmDeleteAllOpen}
        onClose={() => setIsConfirmDeleteAllOpen(false)}
        showHeader={false}
      >
        <p className="m-0 text-center text-base font-semibold leading-7 text-[#1a1a1a]">
          آیا از حذف همه نشان‌ها مطمئن هستید؟
        </p>
        <div className="mt-7 grid grid-cols-2 gap-4 [direction:ltr]">
          <button
            className="h-10 rounded-[10px] border border-[#0048C4] bg-white px-4 text-sm font-medium leading-5 text-[#0048C4] disabled:opacity-50"
            disabled={deleteBadge.isPending}
            onClick={deleteAllBookmarks}
            type="button"
          >
            بله
          </button>
          <button
            className="h-10 rounded-[10px] border border-[#0048C4] bg-white px-4 text-sm font-medium leading-5 text-[#0048C4]"
            onClick={() => setIsConfirmDeleteAllOpen(false)}
            type="button"
          >
            خیر
          </button>
        </div>
      </BottomSheet>
      <DemoNotice message={message} />
    </AccountPageShell>
  );
}

export function AccountRecentViewsPage() {
  return (
    <AccountPageShell
      action={
        <RouteLink className="grid h-12 w-12 place-items-center text-[#1a1a1a]" to="/search">
          <MapIcon className="h-6 w-6" />
        </RouteLink>
      }
      title="بازدیدهای اخیر"
    >
      <ListingCardsPage count={9} />
    </AccountPageShell>
  );
}

export function AccountIdentityPage() {
  const [status, setStatus] = useState<"pending" | "verified">("pending");
  const { message, showNotice } = useDemoNotice();
  const authorize = useAuthorizeMeMutation();

  return (
    <AccountPageShell title={status === "verified" ? "مالکیت سیم‌کارت" : "تایید هویت"}>
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-24">
        {status === "pending" ? (
          <IdentityPendingState
            isPending={authorize.isPending}
            onVerify={(nationalnumber) => {
              authorize.mutate(
                { nationalnumber },
                {
                  onError: (error) => {
                    showNotice(getApiErrorMessage(error, "تایید کد ملی با خطا مواجه شد"));
                  },
                  onSuccess: () => {
                    setStatus("verified");
                    showNotice("کد ملی با موفقیت تایید شد");
                  },
                },
              );
            }}
          />
        ) : (
          <IdentityVerifiedState onChangeOwner={() => showNotice("درخواست تغییر مالکیت ثبت شد")} />
        )}
      </main>

      <DemoNotice message={message} className="bottom-20" />
    </AccountPageShell>
  );
}

export function AccountRequestsPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "results">("requests");
  const [requestIds, setRequestIds] = useState([1, 2, 3, 4]);
  const isRequestsLoading = false;

  return (
    <AccountPageShell title="درخواست‌ها">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <section className="bg-[#f0f0f0] px-4 py-2">
          <div className="grid h-10 grid-cols-2 overflow-hidden rounded-2xl border border-[#808080] bg-white [direction:ltr]">
            {[
              { id: "results", label: "نتایج" },
              { id: "requests", label: "درخواست‌ها" },
            ].map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  className={`text-base font-medium leading-6 ${isActive ? "bg-[#0048c414] text-[#002099]" : "bg-white text-[#4d4d4d]"
                    }`}
                  key={item.id}
                  onClick={() => setActiveTab(item.id as "requests" | "results")}
                  type="button"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        {activeTab === "requests" ? (
          <div className="space-y-2 bg-[#f0f0f0] pt-2">
            {isRequestsLoading ? <AccountRequestsSkeleton /> : null}
            {!isRequestsLoading && requestIds.map((id) => (
              <RequestCard key={id} onCancel={() => setRequestIds((items) => items.filter((item) => item !== id))} />
            ))}
            {!isRequestsLoading && requestIds.length === 0 ? <EmptyMessage text="درخواستی باقی نمانده است" /> : null}
          </div>
        ) : (
          <div className="space-y-2 bg-[#f0f0f0] pt-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <AdCard ad={latestMashhadAds[index % latestMashhadAds.length]} key={index} />
            ))}
          </div>
        )}
      </main>
    </AccountPageShell>
  );
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
              <h2 className="m-0 text-base font-semibold leading-6 text-[#0048c4]">
                درباره ما
              </h2>
            </div>
          </div>

          <p className="m-0 mt-3 text-right text-sm font-normal leading-7 text-[#4d4d4d]">
            ما بیش از ۱۰ سال است که در دنیای املاک همراه خریداران، فروشندگان و آژانس‌های املاک هستیم. در این سال‌ها هدف ما همیشه یک چیز بوده: ساده‌تر کردن مسیر معامله ملک و ایجاد بستری مطمئن برای همه کسانی که در بازار املاک فعالیت دارند.
          </p>
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

function AccountPageShell({ action, children, title }: React.PropsWithChildren<TopBarProps>) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/login"
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
          <button
            className={`relative h-9 shrink-0 overflow-hidden rounded-lg border px-3 text-sm font-medium leading-5 ${activeFilter.label === filter.label
              ? "border-[#0048c4] bg-[#0048c414] text-[#0048c4]"
              : "border-[#cccccc] bg-white text-[#1a1a1a]"
              }`}
            key={filter.label}
            onClick={() => onSelect(filter)}
            type="button"
          >
            {activeFilter.label === filter.label ? (
              <span className="absolute inset-0 rounded-lg bg-[#0048c414]" />
            ) : null}
            <span className="relative z-10">{filter.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ListingCardsPage({ count, emptyText }: { count: number; emptyText?: string }) {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
      <div className="space-y-2 bg-[#f0f0f0] pt-2">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            <AdCard ad={latestMashhadAds[index % latestMashhadAds.length]} />
          </div>
        ))}
        {count === 0 && emptyText ? <EmptyMessage text={emptyText} /> : null}
      </div>
    </main>
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
    <section className="flex min-h-[560px] flex-col items-center justify-center px-9 text-center">
      <img alt="" aria-hidden="true" className="mb-5 h-[66px] w-[66px]" src={iconSrc} />
      <h2 className="m-0 text-base font-bold leading-6 text-[#1a1a1a]">
        {title}
      </h2>
      <p className="m-0 mt-2 max-w-[290px] text-sm font-normal leading-6 text-[#4d4d4d]">
        {description}
      </p>
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

      <button
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
      </button>
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
  const noteId = getNoteId(note);
  const advertiseId = getNoteAdvertiseId(note);
  const mappedAd = mapAdvertisementToAdCard(getNoteAdvertiseSource(note), 0);
  const noteText = readNoteText(note) || "یادداشت";
  const dateText = readNoteDate(note, mappedAd.timeAndLocation);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (dragStartX.current === null || disabled || !noteId) return;

    const deltaX = Math.max(0, event.clientX - dragStartX.current);
    setDragOffset(Math.min(deltaX, 88));
  };

  const handlePointerEnd = () => {
    const shouldDelete = dragOffset > 64;
    setDragOffset(0);
    dragStartX.current = null;

    if (shouldDelete && noteId) {
      onDelete(noteId);
    }
  };

  return (
    <article className="relative overflow-hidden border-b border-[#f0f0f0] bg-white text-right [direction:rtl]">
      <button
        aria-label="حذف یادداشت"
        className="absolute inset-y-0 left-0 flex w-[88px] flex-col items-center justify-center gap-1 bg-[#fff1f1] text-xs font-medium leading-4 text-[#e5231a] disabled:opacity-50"
        disabled={disabled || !noteId}
        onClick={() => noteId && onDelete(noteId)}
        type="button"
      >
        <TrashIcon className="h-5 w-5" />
        حذف
      </button>

      <div
        className="relative z-10 flex min-h-[92px] touch-pan-y items-center gap-3 bg-white px-4 py-3 transition-transform duration-150 ease-out"
        onPointerCancel={handlePointerEnd}
        onPointerDown={(event) => {
          dragStartX.current = event.clientX;
        }}
        onPointerLeave={handlePointerEnd}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        style={{ transform: `translateX(${dragOffset}px)` }}
      >
        <RouteLink
          aria-label={`مشاهده آگهی ${mappedAd.title}`}
          className={`relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#ebebeb] bg-cover ${mappedAd.imageClassName}`}
          style={mappedAd.imageUrl ? { backgroundImage: `url(${mappedAd.imageUrl})` } : undefined}
          to={advertiseId ? `/ads/${advertiseId}` : "/search"}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-end gap-2">
            <button
              aria-label="ویرایش یادداشت"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#4d4d4d] disabled:opacity-50"
              disabled={!advertiseId || disabled}
              onClick={() => onEdit(note)}
              type="button"
            >
              <EditIcon className="h-4 w-4" />
            </button>
            <h2 className="m-0 min-w-0 flex-1 truncate text-right text-sm font-medium leading-5 text-[#1a1a1a]">
              {noteText}
            </h2>
          </div>

          <p className="m-0 mt-1 truncate text-right text-xs font-medium leading-5 text-[#1a1a1a]">
            {mappedAd.title}
          </p>
          <p className="m-0 mt-0.5 truncate text-right text-xs font-normal leading-4 text-[#808080]">
            {dateText}
          </p>
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
        <h2 className="m-0 min-w-0 flex-1 text-right text-base font-semibold leading-6 text-[#0048c4]">
          {title}
        </h2>
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#11a366]" aria-hidden="true" />
      </div>
      <p className="m-0 mt-2 whitespace-pre-line text-right text-sm font-normal leading-7 text-[#4d4d4d]">
        {text}
      </p>
    </section>
  );
}

function RequestCard({ onCancel }: { onCancel: () => void }) {
  const details = [
    "قیمت 3 میلیارد تومان",
    "محله صیاد شیرازی",
    "سال ساخت نوساز",
    "متراژ از 100متر تا 200 متر",
    "دو خوابه",
  ];

  return (
    <article className="bg-white px-4 py-4 text-right">
      <div className="flex items-center justify-between gap-3 [direction:ltr]">
        <button
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[10px] px-3 text-sm font-medium leading-5 text-[#c11004] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#c1100440]"
          onClick={onCancel}
          type="button"
        >
          <CancelIcon className="h-5 w-5" />
          <span>لغو درخواست</span>
        </button>

        <h2 className="m-0 min-w-0 flex-1 truncate text-right text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
          فروش آپارتمان
        </h2>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {details.map((detail) => (
          <span
            className="rounded-lg bg-[#f5f5f5] px-3 py-2 text-sm font-semibold leading-5 text-[#1a1a1a]"
            key={detail}
          >
            {detail}
          </span>
        ))}
      </div>
    </article>
  );
}

function IdentityPendingState({
  isPending,
  onVerify,
}: {
  isPending: boolean;
  onVerify: (nationalnumber: string) => void;
}) {
  const mobile = getStoredAuthSession()?.mobile ?? "-";
  const [nationalnumber, setNationalnumber] = useState("");

  return (
    <>
      <section className="px-2 pt-3">
        <div className="rounded-xl border border-[#0048C4] bg-[#0048C414] p-6">
          <div className="flex items-center justify-start gap-2 text-[#0048C4]">
            <IdentityCheckIcon className="h-6 w-6" />
            <h2 className="m-0 font-semibold leading-5">
              ملاحظات در تایید هویت
            </h2>
          </div>

          <p className="m-0 mt-3 font-normal leading-7 text-[#1a1a1a]">
            برای افزایش امنیت حساب و جلوگیری از سوءاستفاده، هویت شما با کد ملی و مالکیت شماره همراه بررسی می‌شود.
          </p>

          <p className="m-0 mt-2 font-medium leading-6 text-[#1a1a1a]">
            شماره همراه فعال:{" "}
            <span dir="ltr" className="font-semibold text-[#11A366]">
              {mobile}
            </span>
          </p>
        </div>
      </section>

      <section className="px-2 pt-4 text-center">
        <h2 className="m-0 text-sm font-semibold leading-5 text-[#1a1a1a]">
          تایید با کد ملی
        </h2>

        <div className="mt-1 flex items-center justify-center gap-1 text-[#808080]">
          <InfoCircleIcon className="h-3.5 w-3.5 shrink-0" />
          <p className="m-0 text-[11px] font-normal leading-5">
            کد ملی باید متعلق به مالک همین شماره همراه باشد.
          </p>
        </div>

        <label className="relative mt-4 block">
          <span className="absolute -top-2 right-4 bg-white px-1.5 text-xs font-normal leading-4 text-[#808080]">
            کد ملی مالک شماره همراه
          </span>

          <input
            className="h-11 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)]"
            inputMode="numeric"
            value={nationalnumber}
            onChange={(event) => setNationalnumber(event.target.value)}
          />
        </label>
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <button
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white disabled:opacity-50"
          disabled={nationalnumber.trim().length === 0 || isPending}
          onClick={() => onVerify(nationalnumber)}
          type="button"
        >
          {isPending ? "در حال بررسی..." : "بررسی و تایید هویت"}
        </button>
      </div>
    </>
  );
}

function IdentityVerifiedState({ onChangeOwner }: { onChangeOwner: () => void }) {
  return (
    <>
      <section className="px-2 pt-2">
        <div className="rounded-xl border border-[#11A366] bg-[#11A36614] px-4 pb-5 pt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-[#11A366]">
            <IdentityCheckIcon className="h-4 w-4" />
            <h2 className="m-0 text-sm font-semibold leading-5">
              هویت شما تایید شده است
            </h2>
          </div>

          <p className="m-0 mt-4 text-sm font-normal leading-7 text-[#4d4d4d]">
            احراز هویت شما در بهمن ۱۴۰۱ با موفقیت انجام شده است.
          </p>
        </div>
      </section>

      <div className="mt-3 h-0.5 bg-[#f0f0f0]" />

      <section className="px-2 pt-4 text-center">
        <h2 className="m-0 text-sm font-semibold leading-5 text-[#1a1a1a]">
          مالکیت سیم‌کارت
        </h2>

        <div className="mt-2 flex items-start justify-center gap-1 text-[#808080]">
          <InfoCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p className="m-0 max-w-[240px] text-[11px] font-normal leading-5">
            در صورتی که سیم‌کارت را تازه خریده‌اید و یا قصد فروش دارید، حتماً تغییر مالکیت آن را اعلام کنید.
            <br />
            در غیر این صورت، عواقب هرگونه تخلف مالک قبلی یا جدید، بر عهدهٔ شما است.
          </p>
        </div>

        <button
          className="relative mt-6 flex h-12 w-full items-center justify-center rounded-xl border border-[#0048c4] bg-white px-4 text-sm font-semibold leading-5 text-[#0048c4]"
          onClick={onChangeOwner}
          type="button"
        >
          <ChevronLeftIcon className="absolute left-4 h-4 w-4" />
          <span>ثبت تغییر مالکیت سیم‌کارت</span>
        </button>
      </section>
    </>
  );
}

function EmptyMessage({ text }: { text: string }) {
  return (
    <p className="m-0 bg-white px-4 py-16 text-center text-sm font-medium text-[#808080]">
      {text}
    </p>
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
  return <div className={`rounded-lg bg-[#e8e8e8] ${className}`} />;
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

function AccountNotesSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <article className="bg-white px-4 py-4" key={index}>
          <div className="flex gap-3 [direction:rtl]">
            <AccountSkeletonBlock className="h-[104px] w-[136px] shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <AccountSkeletonBlock className="ml-auto h-5 w-3/4" />
              <AccountSkeletonBlock className="ml-auto h-4 w-1/2" />
            </div>
          </div>
          <AccountSkeletonBlock className="mt-4 h-20 w-full rounded-xl" />
        </article>
      ))}
    </>
  );
}

function AccountRequestsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <article className="bg-white px-4 py-4" key={index}>
          <div className="flex items-center justify-between gap-3 [direction:ltr]">
            <AccountSkeletonBlock className="h-10 w-28" />
            <AccountSkeletonBlock className="h-5 w-40" />
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            {Array.from({ length: 5 }).map((__, itemIndex) => (
              <AccountSkeletonBlock className="h-9 w-24" key={itemIndex} />
            ))}
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
      <p className="sr-only">{message}</p>
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
  const status = String(payment.status ?? "-");

  switch (status) {
    case "paid":
    case "success":
      return "پرداخت شده";

    case "failed":
    case "error":
      return "ناموفق";

    case "pending":
      return "در انتظار";

    default:
      return status;
  }
}

function readPaymentStatusColor(payment: WalletPayment) {
  const status = String(payment.status ?? "");

  if (["paid", "success", "پرداخت شده"].includes(status)) {
    return "#11a366";
  }

  if (["failed", "error", "ناموفق"].includes(status)) {
    return "#ee3623";
  }

  return "#1a1a1a";
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1 block pr-4 text-right text-xs font-normal leading-4 text-[#b3b3b3]">
        {label}
      </span>
      <input
        className="h-14 w-full rounded-xl border border-[#e0e0e0] bg-white px-4 text-right text-sm font-normal leading-5 text-[#b3b3b3] outline-none"
        readOnly
        value={value}
      />
    </label>
  );
}

function TextField({
  onChange,
  placeholder,
  value,
}: {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <input
      className="h-14 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-sm font-normal leading-5 text-[#808080] outline-none placeholder:text-[#808080]"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function PaymentHistoryCard({ payment }: { payment: WalletPayment }) {
  return (
    <article className="border-b border-[#f0f0f0] bg-white px-4 py-4 text-right">
      <PaymentHistoryRow
        label="وضعیت"
        value={readPaymentStatus(payment)}
        valueColor={readPaymentStatusColor(payment)}
      />

      <PaymentHistoryRow
        label="هزینه"
        value={`${formatMoney(payment.amount ?? 0)} تومان`}
      />

      <PaymentHistoryRow
        label="زمان پرداخت"
        value={String(payment.created_at ?? "-")}
      />

      <PaymentHistoryRow
        label="شناسه پرداخت"
        value={String(payment.tracking_code ?? payment.id ?? "-")}
        isLast
      />
    </article>
  );
}

function PaymentHistoryRow({
  isLast = false,
  label,
  value,
  valueColor = "#1a1a1a",
}: {
  isLast?: boolean;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${isLast ? "" : "mb-3"}`}>
      <span className="shrink-0 text-xs font-normal leading-5 text-[#808080]">
        {label}
      </span>

      <span
        className="min-w-0 text-left text-xs font-medium leading-5"
        style={{ color: valueColor }}
      >
        {value}
      </span>
    </div>
  );
}

function DocumentSadIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 80 80">
      <path d="M24 12h28l12 12v40a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4Z" fill="currentColor" opacity=".25" stroke="none" />
      <path d="M52 12v14h14" />
      <path d="M30 38h.01M50 38h.01M32 54c5-4 11-4 16 0M31 29l6 6M37 29l-6 6M47 29l6 6M53 29l-6 6" />
    </svg>
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

function MapIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
      <path d="M9 3v15M15 6v15" />
    </svg>
  );
}

function CancelIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" />
      <path d="m9 9 6 6M15 9l-6 6" />
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

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 6h16M9 6V4h6v2M7 6l.8 13a2 2 0 0 0 2 2h4.4a2 2 0 0 0 2-2L17 6M10 11v5M14 11v5" />
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
