import { useMemo, useState } from "react";

import LinearArrowDown1 from "../../(icons)/LinearArrowDown1";
import LinearBuilding3 from "../../(icons)/LinearBuilding3";
import LinearDanger from "../../(icons)/LinearDanger";
import LinearSearch from "../../(icons)/LinearSearch";
import { SelectionCheckIndicator } from "../../SelectionCheckIndicator";
import { TopBar } from "../../TopBar";
import {
  useAgencyConsultantQuery,
  useAgencyConsultantsQuery,
  useDeactivateAgencyConsultantMutation,
} from "../../../hooks/agency.hooks";
import {
  ConsultantAvatar,
  ConsultantProfilePill,
  type TeamConsultant,
  getRouteConsultant,
  getRouteConsultantId,
  mapAgencyConsultantToTeamConsultant,
} from "./ConsultantManagementPage";

type ReplacementTarget =
  | { id: "agency"; kind: "agency"; name: string; subtitle: string }
  | { id: string; kind: "consultant"; consultant: TeamConsultant };

const agencyReplacementTarget: ReplacementTarget = {
  id: "agency",
  kind: "agency",
  name: "آژانس جلیلیان",
  subtitle: "انتقال اطلاعات به حساب آژانس",
};

export function ConsultantRemovePage() {
  const routeConsultant = getRouteConsultant();
  const consultantId = getRouteConsultantId() ?? routeConsultant.id;
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
            <h2 className="m-0 text-base font-semibold leading-6">توجه!</h2>
          </div>
          <p className="m-0 mt-4 text-sm font-medium leading-6 text-[#4d4d4d]">
            در صورت حذف تمامی اطلاعات ثبت شده به مشاور جایگزین منتقل می‌گردد.
          </p>
        </section>

        <section className="mt-7">
          <label className="block text-right text-base font-semibold leading-6 text-[#1a1a1a]">
            انتخاب مشاور جایگزین <span className="text-[#ef1f1f]">*</span>
          </label>
          <button
            className="mt-3 flex h-14 w-full items-center justify-between rounded-xl border border-[#808080] bg-white px-4 text-sm font-medium leading-5 text-[#1a1a1a]"
            onClick={() => setIsReplacementPickerOpen(true)}
            type="button"
          >
            <span>
              {selectedReplacement
                ? getReplacementLabel(selectedReplacement)
                : "یکی از مشاورین را انتخاب کن"}
            </span>
            <LinearArrowDown1 className="h-6 w-6" />
          </button>
        </section>
      </main>

      <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-4 bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <button
          className="flex h-10 items-center justify-center rounded-lg border border-[#0048c4] bg-white text-sm font-semibold leading-5 text-[#0048c4]"
          onClick={() => window.history.back()}
          type="button"
        >
          انصراف
        </button>
        <button
          className={`flex h-10 items-center justify-center rounded-lg text-sm font-semibold leading-5 ${
            selectedReplacement
              ? "bg-[#0048c4] text-white"
              : "bg-[#e5e5e5] text-[#b8b8b8]"
          }`}
          disabled={!selectedReplacement || deactivateConsultantMutation.isPending}
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
        </button>
      </div>

      {isReplacementPickerOpen ? (
        <ReplacementPicker
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
  consultants,
  currentConsultantId,
  onClose,
  onConfirm,
  selectedTarget,
}: {
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

    return [agencyReplacementTarget, ...consultantTargets];
  }, [consultants, currentConsultantId]);
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
          <h2 className="m-0 text-xs font-semibold leading-5 text-[#1a1a1a]">
            نتیجه جستجو
          </h2>

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
          ) : (
            <p className="m-0 px-2 py-8 text-center text-sm font-medium leading-6 text-[#808080]">
              مشاوری برای نمایش نیست!
            </p>
          )}
        </section>
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <button
          className={`flex h-10 w-full items-center justify-center rounded-lg text-xs font-semibold leading-5 transition ${
            draftTarget ? "bg-[#0048c4] text-white" : "bg-[#e5e5e5] text-[#b8b8b8]"
          }`}
          disabled={!draftTarget}
          onClick={() => {
            if (draftTarget) onConfirm(draftTarget);
          }}
          type="button"
        >
          تایید
        </button>
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
    <button
      aria-pressed={isSelected}
      className={`flex h-[76px] w-full items-center gap-3 rounded-xl border px-3 text-right transition ${
        isSelected ? "border-[#0048c4] bg-[#eaf1ff]" : "border-[#e6e6e6] bg-white"
      }`}
      onClick={onSelect}
      type="button"
    >
      <div className="flex min-w-0 flex-1 gap-x-2">
        {target.kind === "agency" ? (
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eaf1ff] text-[#0048c4]">
            <LinearBuilding3 className="h-6 w-6" />
          </span>
        ) : (
          <ConsultantAvatar consultant={target.consultant} sizeClassName="h-11 w-11" />
        )}
        <div className="flex min-w-0 flex-col justify-center">
          <span className="block truncate text-sm font-semibold text-[#1a1a1a]">
            {getReplacementLabel(target)}
          </span>
          <span className="block truncate text-xs font-medium text-[#808080]">
            {target.kind === "agency" ? target.subtitle : target.consultant.phone}
          </span>
        </div>
      </div>
      <SelectionCheckIndicator
        checked={isSelected}
        className="!h-4.5 !w-4.5 rounded-sm"
      />
    </button>
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
