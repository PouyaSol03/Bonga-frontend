import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getApiErrorMessage } from "../../../shared/api/api";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { PackageCard } from "./components/PackageCard";
import { PackageListSkeleton } from "./components/PackageListSkeleton";
import { PackageModal } from "./components/PackageModal";
import { useCrmPackages } from "./hooks/useCrmPackages";
import { buildPackagePayload, draftFromPackage, packageRecordId } from "./package.helpers";
import { emptyDraft, type CrmPackageKind, type CrmRecord, type ViewProps } from "./types";

export function CrmPackagesView({ notify, refreshNonce }: ViewProps) {
  const [editing, setEditing] = useState<CrmRecord | null | undefined>(undefined);
  const [draft, setDraft] = useState(emptyDraft);
  const [viewKind, setViewKind] = useState<CrmPackageKind>("panel_subscription");

  const {
    query,
    updateMutation,
    createMutation,
    detailMutation,
    deleteMutation,
    toggleStatus,
    deactivatePackage,
    isSaving,
  } = useCrmPackages(notify, refreshNonce);

  const openModal = async (item: CrmRecord | null) => {
    if (!item) {
      setEditing(null);
      setDraft({ ...emptyDraft, kind: viewKind });
      return;
    }
    const id = packageRecordId(item);
    if (!id) {
      setEditing(item);
      setDraft(draftFromPackage(item));
      return;
    }
    try {
      const detailed = await detailMutation.mutateAsync(id);
      const target = detailed ?? item;
      setEditing(target);
      setDraft(draftFromPackage(target));
    } catch {
      setEditing(item);
      setDraft(draftFromPackage(item));
    }
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const id = packageRecordId(editing);
        const payload = buildPackagePayload(draft, id);
        await updateMutation.mutateAsync({ id, payload });
      } else {
        const payload = buildPackagePayload(draft);
        await createMutation.mutateAsync(payload);
      }
      setEditing(undefined);
    } catch (error) {
      notify(
        getApiErrorMessage(error, error instanceof Error ? error.message : "ذخیره بسته ناموفق بود."),
        "error",
      );
    }
  };

  const visiblePackages = (query.data ?? []).filter((item) =>
    viewKind === "credit_bundle" ? item.kind === "credit_bundle" : item.kind !== "credit_bundle",
  );

  return (
    <>
      <section className="rounded-xl bg-white p-6">
        <div className="flex items-start justify-between gap-4 border-b border-[#f0f0f0] pb-5">
          <div>
            <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-lg font-bold text-[#1a1a1a]">
              بسته‌ها و اعتبار پنل
            </Typography>
            <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-sm text-[#7b8494]">
              تمام بسته‌های فعال و غیرفعال پنل را ایجاد، ویرایش و مدیریت کنید.
            </Typography>
          </div>
          <motion.button
            className="h-10 rounded-xl bg-[#0048c4] px-4 text-sm font-bold text-white"
            onClick={() => openModal(null)}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            + افزودن بسته
          </motion.button>
        </div>

        <div className="mt-5 grid h-11 max-w-md grid-cols-2 overflow-hidden rounded-xl border border-[#0048c4]" role="tablist" aria-label="نمایش نوع بسته">
          <Button unstyled
            aria-selected={viewKind === "panel_subscription"}
            className={`text-sm font-bold transition ${
              viewKind === "panel_subscription" ? "bg-[#0048c4] text-white" : "bg-white text-[#0048c4]"
            }`}
            onClick={() => setViewKind("panel_subscription")}
            role="tab"
            type="button"
          >
            اعتبار پنل
          </Button>
          <Button unstyled
            aria-selected={viewKind === "credit_bundle"}
            className={`border-r border-[#0048c4] text-sm font-bold transition ${
              viewKind === "credit_bundle" ? "bg-[#0048c4] text-white" : "bg-white text-[#0048c4]"
            }`}
            onClick={() => setViewKind("credit_bundle")}
            role="tab"
            type="button"
          >
            بسته‌ها
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
          {query.isLoading ? (
            <PackageListSkeleton />
          ) : visiblePackages.length ? (
            visiblePackages.map((item, index) => {
              const id = packageRecordId(item);
              return (
                <PackageCard
                  index={index}
                  isChangingStatus={updateMutation.isPending && updateMutation.variables?.id === id}
                  isDeactivating={deleteMutation.isPending && deleteMutation.variables === id}
                  isLoadingDetail={detailMutation.isPending && detailMutation.variables === id}
                  item={item}
                  key={id || `${item.slug}-${index}`}
                  onDeactivate={deactivatePackage}
                  onEdit={openModal}
                  onStatusToggle={toggleStatus}
                />
              );
            })
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-[#d9d9d9] bg-[#fafafa] px-4 py-12 text-center text-sm text-[#7b8494]">
              بسته‌ای برای نمایش وجود ندارد.
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {editing !== undefined ? (
          <PackageModal
            draft={draft}
            isEditing={Boolean(editing)}
            isPending={isSaving}
            onChange={setDraft}
            onClose={() => setEditing(undefined)}
            onSubmit={handleSave}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
