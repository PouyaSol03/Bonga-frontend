import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { listCrmAdvertises, updateCrmAdvertiseStatus, getCrmRecordId, type AdvertiseStatus } from "../../../services/crm.service";
import { getApiErrorMessage } from "../../../api/api";
import { pushRoute } from "../../../routes/navigation";
import { getCrmAdvertiseCreatePath, getCrmAdvertiseEditPath, getCrmAdvertiseEditState } from "../crmAdvertiseNavigation";
import { AdCard } from "../../../components/AdCard";
import { SearchEmptyState } from "../../../components/SearchEmptyState";
import LinearEdit2 from "../../../components/(icons)/LinearEdit2";
import LinearCheckmark from "../../../components/(icons)/LinearCheckmark";
import LinearCancel from "../../../components/(icons)/LinearCancel";
import LinearDelete from "../../../components/(icons)/LinearDelete";
import { ConfirmModal, CrmIcon, CrmSelect, FilterField, PrimaryButton, SmallActionButton, advertiseStatusOptions, ghostButtonClassName, inputClassName, mapCrmAdvertiseToCard, readText, useQueryErrorToast } from "../CrmLayout";
import type { ConfirmState, CrmRoutePageProps } from "../CrmLayout";
import { Typography } from "../../../components/ui/Typography";
import { Button } from "../../../components/ui/Button";

export function CrmAdvertisesPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const [trackCode, setTrackCode] = useState("");
  const [status, setStatus] = useState("");
  const filters = useMemo(
    () => ({ status, trackCode: trackCode.trim() }),
    [status, trackCode],
  );
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const query = useQuery({
    queryFn: () =>
      listCrmAdvertises({
        status: filters.status === "" ? undefined : filters.status as AdvertiseStatus,
        trackCode: filters.trackCode,
      }),
    queryKey: ["crm", "advertises", filters, refreshNonce],
  });

  useQueryErrorToast([query.error], notify);

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus, reason }: { id: string; nextStatus: AdvertiseStatus; reason?: string }) =>
      updateCrmAdvertiseStatus(id, nextStatus, reason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "advertises"] });
      await queryClient.invalidateQueries({ queryKey: ["crm", "overview", "advertises"] });
      notify("وضعیت آگهی به‌روزرسانی شد.");
    },
  });

  const updateStatus = async (id: string, nextStatus: AdvertiseStatus) => {
    try {
      await statusMutation.mutateAsync({ id, nextStatus });
    } catch (error) {
      notify(getApiErrorMessage(error, "به‌روزرسانی وضعیت آگهی ناموفق بود."), "error");
    }
  };

  const openRejectModal = (id: string) => {
    setConfirm({
      body: "لطفاً دلیل رد آگهی را وارد کنید. این دلیل برای کاربر ثبت و نمایش داده می‌شود.",
      confirmLabel: "رد آگهی",
      onConfirm: async (reason) => {
        const normalizedReason = reason?.trim();
        if (!normalizedReason) throw new Error("دلیل رد آگهی الزامی است.");

        await statusMutation.mutateAsync({
          id,
          nextStatus: "needs_edit",
          reason: normalizedReason,
        });
      },
      prompt: {
        label: "دلیل رد آگهی",
        placeholder: "دلیل رد آگهی را بنویسید...",
        required: true,
      },
      title: "رد آگهی",
    });
  };

  return (
    <>
      <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white px-6 pb-6 pt-3 text-[#1a1a1a] [direction:rtl]">
        <div className="shrink-0">
          <nav aria-label="وضعیت آگهی‌ها" className="flex justify-end overflow-x-auto">
            <div className="inline-flex min-w-max items-center gap-12">
              {[{ label: "همه آگهی‌ها", value: "" }, ...advertiseStatusOptions].map((option) => {
                const isActive = status === option.value;

                return (
                  <Button unstyled
                    aria-current={isActive ? "page" : undefined}
                    className={`relative h-10 whitespace-nowrap bg-transparent px-0 text-sm font-semibold transition ${isActive ? "text-[#0048c4]" : "text-[#666666] hover:text-[#303030]"}`}
                    key={option.value || "all"}
                    onClick={() => setStatus(option.value)}
                    type="button"
                  >
                    {option.label}
                    {isActive ? <Typography as="span" variant="body" size="medium" weight="regular" className="absolute -bottom-px right-0 h-0.5 w-full rounded-full bg-[#0048c4]" /> : null}
                  </Button>
                );
              })}
            </div>
          </nav>

          <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button unstyled
                className={`inline-flex h-10 items-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold transition ${showFilters ? "border-[#0048c4] text-[#0048c4]" : "border-[#cccccc] text-[#1a1a1a] hover:border-[#0048c4] hover:text-[#0048c4]"}`}
                onClick={() => setShowFilters((value) => !value)}
                type="button"
              >
                <CrmIcon name="filter" size={19} />
                فیلترها
              </Button>

              <label className="relative block h-10 w-[min(360px,42vw)] min-w-[240px]">
                <Typography as="span" variant="body" size="medium" weight="regular" className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#4d4d4d]"><CrmIcon name="search" size={19} /></Typography>
                <input
                  className="h-full w-full rounded-xl border border-[#cccccc] bg-white pl-12 pr-4 text-right text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4]"
                  onChange={(event) => setTrackCode(event.target.value)}
                  placeholder="جستجو با کد پیگیری"
                  type="search"
                  value={trackCode}
                />
              </label>
            </div>

            <PrimaryButton icon="plus" label="ثبت آگهی جدید" onClick={() => pushRoute(getCrmAdvertiseCreatePath())} />
          </div>
        </div>

        {showFilters ? <form
          className="mt-5 flex shrink-0 flex-wrap items-end gap-3 rounded-xl bg-[#f5f5f5] p-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <FilterField label="کد پیگیری">
            <input
              className={inputClassName}
              onChange={(event) => setTrackCode(event.target.value)}
              placeholder="مثلاً ۱۲۳۴۵"
              value={trackCode}
            />
          </FilterField>
          <FilterField label="وضعیت">
            <CrmSelect className={inputClassName} onChange={(event) => setStatus(event.target.value)} value={status}>
              <option value="">همه وضعیت‌ها</option>
              {advertiseStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </CrmSelect>
          </FilterField>
          {(status || trackCode) ? (
            <Button unstyled
              className={ghostButtonClassName}
              onClick={() => {
                setStatus("");
                setTrackCode("");
              }}
              type="button"
            >
              پاک کردن فیلتر
            </Button>
          ) : null}
        </form> : null}

        <div className="mt-6 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pl-1">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 2xl:grid-cols-3">
          {query.isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div className="h-[430px] animate-pulse rounded-xl border border-[#f0f0f0] bg-white p-4" key={index}>
                <div className="h-[224px] rounded-2xl bg-[#e7ebf2]" />
                <div className="mt-4 h-5 w-2/5 rounded-full bg-[#e7ebf2]" />
                <div className="mt-3 h-4 w-4/5 rounded-full bg-[#eef0f4]" />
                <div className="mt-3 h-4 w-3/5 rounded-full bg-[#eef0f4]" />
              </div>
            ))
          ) : query.data?.length ? (
            query.data.map((ad, index) => {
              const id = getCrmRecordId(ad);
              const card = mapCrmAdvertiseToCard(ad, index);
              return (
                <article
                  className="overflow-hidden rounded-xl border border-[#f0f0f0] bg-white p-3 transition hover:border-[#d9e2f2]"
                  key={id}
                >
                  <div>
                    <AdCard
                      ad={card}
                      showStatusBadge
                      state={{ ad, card, status: ad.status }}
                      to={`/crm/advertises/${encodeURIComponent(id)}`}
                      variant="dashboard"
                    />
                  </div>

                  <div className="mt-3 border-t border-[#f0f0f0] pt-3">
                    <div className="mb-3 flex items-center px-1 text-xs text-[#808080]">
                      <Typography as="span" variant="body" size="medium" weight="regular">کد پیگیری: <strong className="font-semibold text-[#4d4d4d]">{readText(ad, ["track_code"])}</strong></Typography>
                    </div>
                    <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                      <SmallActionButton icon={<LinearEdit2 className="h-4 w-4" />} label="ویرایش" onClick={() => pushRoute(getCrmAdvertiseEditPath(id), getCrmAdvertiseEditState(id))} tone="primary" />
                      <SmallActionButton icon={<LinearCheckmark className="h-4 w-4" />} label="تأیید" onClick={() => updateStatus(id, "accepted")} tone="success" />
                      <SmallActionButton icon={<LinearCancel className="h-4 w-4" />} label="رد آگهی" onClick={() => openRejectModal(id)} tone="warning" />
                      <SmallActionButton
                        icon={<LinearDelete className="h-4 w-4" />}
                        label="حذف"
                        onClick={() => setConfirm({
                          body: "این آگهی از فهرست فعال خارج و در وضعیت حذف‌شده قرار می‌گیرد.",
                          confirmLabel: "حذف آگهی",
                          onConfirm: async () => { await statusMutation.mutateAsync({ id, nextStatus: "deleted" }); },
                          title: "حذف آگهی",
                        })}
                        tone="danger"
                      />
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full rounded-xl bg-white">
              <SearchEmptyState />
            </div>
          )}
          </div>
        </div>
      </section>

      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} notify={notify} />
    </>
  );
}
