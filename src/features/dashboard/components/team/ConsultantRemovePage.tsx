import { useMemo, useState } from "react";

import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearBuilding3 from "../../../../shared/icons/LinearBuilding3";
import LinearDanger from "../../../../shared/icons/LinearDanger";
import LinearSearch from "../../../../shared/icons/LinearSearch";
import { SelectionCheckIndicator } from "../../../../shared/components/SelectionCheckIndicator";
import { TopBar } from "../../../../shared/components/TopBar";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { useMyAgencyProfileQuery } from "../../../account/api/account.hooks";
import {
  useAgencyConsultantQuery,
  useAgencyConsultantsQuery,
  useDeactivateAgencyConsultantMutation,
} from "../../../agencies/api/agency.hooks";
import {
  ConsultantAvatar,
  ConsultantProfilePill,
  type TeamConsultant,
  getRouteConsultant,
  getRouteConsultantId,
  mapAgencyConsultantToTeamConsultant,
} from "./ConsultantManagementPage";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";

type ReplacementTarget =
  | { id: "agency"; kind: "agency"; name: string; subtitle: string }
  | { id: string; kind: "consultant"; consultant: TeamConsultant };

export function ConsultantRemovePage() {
  const routeConsultant = getRouteConsultant();
  const consultantId = getRouteConsultantId() ?? routeConsultant.id;
  const agencyProfileQuery = useMyAgencyProfileQuery();
  const consultantQuery = useAgencyConsultantQuery({ userId: consultantId });
  const consultantsQuery = useAgencyConsultantsQuery({ perPage: 100 });
  const deactivateConsultantMutation = useDeactivateAgencyConsultantMutation();
  const consultant = consultantQuery.data
    ? mapAgencyConsultantToTeamConsultant(consultantQuery.data)
    : routeConsultant;
  const consultants = useMemo(
    () =>
      (consultantsQuery.data?.data ?? []).map(
        mapAgencyConsultantToTeamConsultant,
      ),
    [consultantsQuery.data?.data],
  );
  const agencyReplacementTarget = useMemo<ReplacementTarget>(
    () => ({
      id: "agency",
      kind: "agency",
      name: agencyProfileQuery.data?.name?.trim() || "حساب آژانس شما",
      subtitle: "انتقال اطلاعات به حساب آژانس",
    }),
    [agencyProfileQuery.data?.name],
  );
  const [isReplacementPickerOpen, setIsReplacementPickerOpen] = useState(false);
  const [selectedReplacement, setSelectedReplacement] =
    useState<ReplacementTarget | null>(null);

  return (
    <section
      className="relative mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-white text-[#1a1a1a]"
      dir="rtl"
    >
      <TopBar
        backTo="/account/dashboard/team"
        centerClassName="px-0"
        reserveStartSpace
        title="حذف مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
        <ConsultantProfilePill consultant={consultant} />

        <section className="mt-4 rounded-2xl border border-[#ff6d00] bg-[#fff6ed] p-4">
          <div className="flex items-center gap-2 text-[#ff6d00]">
            <LinearDanger className="h-6 w-6 text-[#ff6d00]" />
            <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6">توجه!</Typography>
          </div>
          <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 mt-4 text-sm font-medium leading-6 text-[#4d4d4d]">
            در صورت حذف تمامی اطلاعات ثبت شده به مشاور جایگزین منتقل می‌گردد.
          </Typography>
        </section>

        <section className="mt-7">
          <label className="block text-right text-base font-semibold leading-6 text-[#1a1a1a]">
            انتخاب مشاور جایگزین <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#ef1f1f]">*</Typography>
          </label>
          <Button unstyled
            className="mt-3 flex h-14 w-full items-center justify-between rounded-xl border border-[#808080] bg-white px-4 text-sm font-medium leading-5 text-[#1a1a1a]"
            onClick={() => setIsReplacementPickerOpen(true)}
            type="button"
          >
            <Typography as="span" variant="body" size="medium" weight="regular">
              {selectedReplacement
                ? getReplacementLabel(selectedReplacement)
                : "یکی از مشاورین را انتخاب کن"}
            </Typography>
            <LinearArrowDown1 className="h-6 w-6" />
          </Button>
        </section>
      </main>

      <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-4 bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <Button
          fullWidth
          onClick={() => window.history.back()}
          size="x-medium"
          type="button"
          variant="secondary"
        >
          انصراف
        </Button>
        <Button
          fullWidth
          loading={deactivateConsultantMutation.isPending}
          disabled={!selectedReplacement} 
          size="x-medium"
          variant="primary"
          onClick={() => {
            if (!selectedReplacement) return;

            deactivateConsultantMutation.mutate(
              selectedReplacement.kind === "agency"
                ? {
                    transferTo: "agency",
                    userId: consultantId,
                  }
                : {
                    transferTo: "member",
                    transferUserId: selectedReplacement.consultant.id,
                    userId: consultantId,
                  },
              {
                onSuccess: () => {
                  window.history.pushState({}, "", "/account/dashboard/team");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                },
              },
            );
          }}
          type="button"
        >
          حذف مشاور
        </Button>
      </div>

      {isReplacementPickerOpen ? (
        <ReplacementPicker
          agencyTarget={agencyReplacementTarget}
          currentConsultantId={consultant.id}
          consultants={consultants}
          onClose={() => setIsReplacementPickerOpen(false)}
          onConfirm={(target) => {
            setSelectedReplacement(target);
            setIsReplacementPickerOpen(false);
          }}
          selectedTarget={selectedReplacement}
        />
      ) : null}
    </section>
  );
}

function ReplacementPicker({
  agencyTarget,
  consultants,
  currentConsultantId,
  onClose,
  onConfirm,
  selectedTarget,
}: {
  agencyTarget: ReplacementTarget;
  consultants: TeamConsultant[];
  currentConsultantId: number;
  onClose: () => void;
  onConfirm: (target: ReplacementTarget) => void;
  selectedTarget: ReplacementTarget | null;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [draftTarget, setDraftTarget] =
    useState<ReplacementTarget | null>(selectedTarget);
  const normalizedSearch = searchValue.trim();
  const replacementTargets = useMemo<ReplacementTarget[]>(() => {
    const consultantTargets = consultants
      .filter(
        (item) => item.status === "active" && item.id !== currentConsultantId,
      )
      .map<ReplacementTarget>((item) => ({
        id: `consultant-${item.id}`,
        kind: "consultant",
        consultant: item,
      }));

    return [agencyTarget, ...consultantTargets];
  }, [agencyTarget, consultants, currentConsultantId]);
  const visibleTargets = useMemo(() => {
    if (!normalizedSearch) return replacementTargets;

    return replacementTargets.filter((target) =>
      getReplacementSearchText(target).includes(normalizedSearch),
    );
  }, [normalizedSearch, replacementTargets]);

  return (
    <section
      aria-label="انتخاب مشاور جایگزین"
      aria-modal="true"
      className="fixed inset-y-0 left-1/2 z-[1100] flex w-full max-w-[500px] -translate-x-1/2 flex-col overflow-hidden bg-[#f5f5f5] text-[#1a1a1a]"
      dir="rtl"
      role="dialog"
    >
      <TopBar
        placement="inline"
        centerClassName="px-0"
        onBack={onClose}
        reserveStartSpace
        title="انتخاب مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto pb-24">
        <div className="bg-white px-4 pb-5 pt-3">
          <label className="flex h-12 items-center gap-2 rounded-lg border border-[#d9d9d9] bg-white px-3 focus-within:border-[#0048c4] focus-within:ring-2 focus-within:ring-[#0048c41a]">
            <input
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-[#1a1a1a] outline-none placeholder:text-[#bdbdbd]"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="جستجوی مشاور"
              type="search"
              value={searchValue}
            />
            <LinearSearch className="h-5 w-5 shrink-0 text-[#4d4d4d]" />
          </label>
        </div>

        <section className="bg-white px-4 py-4">
          <Typography as="h2" variant="title" size="small" weight="semibold" className="m-0 text-xs font-semibold leading-5 text-[#1a1a1a]">
            نتیجه جستجو
          </Typography>

          {visibleTargets.length > 0 ? (
            <div className="mt-3 space-y-2">
              {visibleTargets.map((target) => {
                const isSelected = draftTarget?.id === target.id;

                return (
                  <ReplacementOption
                    isSelected={isSelected}
                    key={target.id}
                    onSelect={() => setDraftTarget(target)}
                    target={target}
                  />
                );
              })}
            </div>
          ) : normalizedSearch ? (
            <SearchEmptyState compact />
          ) : (
            <Typography as="p" variant="body" size="medium" weight="medium" className="mx-auto m-0 w-full px-2 py-8 text-center text-sm font-medium leading-6 text-[#808080]">
              مشاور دیگری برای جایگزینی وجود ندارد.
            </Typography>
          )}
        </section>
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <Button
          fullWidth
          disabled={!draftTarget}
          size="x-medium"
          variant="primary"
          onClick={() => {
            if (draftTarget) onConfirm(draftTarget);
          }}
          type="button"
        >
          تایید
        </Button>
      </div>
    </section>
  );
}

function ReplacementOption({
  isSelected,
  onSelect,
  target,
}: {
  isSelected: boolean;
  onSelect: () => void;
  target: ReplacementTarget;
}) {
  return (
    <Button unstyled
      aria-pressed={isSelected}
      className={`flex h-[76px] w-full items-center gap-3 rounded-xl border px-3 text-right transition ${
        isSelected ? "border-[#0048c4] bg-[#eaf1ff]" : "border-[#e6e6e6] bg-white"
      }`}
      onClick={onSelect}
      type="button"
    >
      <div className="flex min-w-0 flex-1 gap-x-2">
        {target.kind === "agency" ? (
          <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eaf1ff] text-[#0048c4]">
            <LinearBuilding3 className="h-6 w-6" />
          </Typography>
        ) : (
          <ConsultantAvatar consultant={target.consultant} sizeClassName="h-11 w-11" />
        )}
        <div className="flex min-w-0 flex-col justify-center">
          <Typography as="span" variant="label" size="medium" weight="semibold" className="block truncate text-sm font-semibold text-[#1a1a1a]">
            {getReplacementLabel(target)}
          </Typography>
          <Typography as="span" variant="label" size="small" weight="medium" className="block truncate text-xs font-medium text-[#808080]">
            {target.kind === "agency" ? target.subtitle : target.consultant.phone}
          </Typography>
        </div>
      </div>
      <SelectionCheckIndicator
        checked={isSelected}
        className="!h-4.5 !w-4.5 rounded-sm"
      />
    </Button>
  );
}

function getReplacementLabel(target: ReplacementTarget) {
  return target.kind === "agency" ? target.name : target.consultant.name;
}

function getReplacementSearchText(target: ReplacementTarget) {
  return target.kind === "agency"
    ? `${target.name} ${target.subtitle}`
    : `${target.consultant.name} ${target.consultant.phone}`;
}
