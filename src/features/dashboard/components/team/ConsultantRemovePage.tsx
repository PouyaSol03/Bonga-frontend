import { useMemo, useState } from "react";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearDanger from "../../../../shared/icons/LinearDanger";
import { TopBar } from "../../../../shared/components/TopBar";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import { useMyAgencyProfileQuery } from "../../../account/api/account.hooks";
import {
  useAgencyConsultantQuery,
  useAgencyConsultantsQuery,
  useDeactivateAgencyConsultantMutation,
} from "../../../agencies/api/agency.hooks";
import {
  ConsultantProfilePill,
  getRouteConsultant,
  getRouteConsultantId,
  mapAgencyConsultantToTeamConsultant,
} from "./ConsultantManagementPage";
import {
  getReplacementLabel,
  ReplacementPicker,
  type ReplacementTarget,
} from "./remove-consultant/ConsultantRemoveReplacementPicker";

export function ConsultantRemovePage() {
  const routeConsultant = getRouteConsultant();
  const routeId = getRouteConsultantId();
  const agencyProfileQuery = useMyAgencyProfileQuery();
  const consultantsQuery = useAgencyConsultantsQuery({ perPage: 100 });
  const deactivateConsultantMutation = useDeactivateAgencyConsultantMutation();

  const matchedConsultant = useMemo(() => {
    const list = consultantsQuery.data?.data ?? [];
    return list.find(
      (c) =>
        (routeConsultant.agentId && c.agentId === routeConsultant.agentId) ||
        (routeId && (c.agentId === routeId || c.userId === routeId)) ||
        (routeConsultant.id &&
          (c.agentId === routeConsultant.id || c.userId === routeConsultant.id)),
    );
  }, [consultantsQuery.data?.data, routeConsultant, routeId]);

  const targetAgentId =
    matchedConsultant?.agentId ??
    routeConsultant.agentId ??
    routeId ??
    routeConsultant.id;

  const consultantQuery = useAgencyConsultantQuery({ agentId: targetAgentId });
  const consultant = consultantQuery.data
    ? mapAgencyConsultantToTeamConsultant(consultantQuery.data)
    : matchedConsultant
      ? mapAgencyConsultantToTeamConsultant(matchedConsultant)
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
      className="relative mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-surface-container-lowest text-on-surface"
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

        <section className="mt-4 rounded-2xl border border-warning bg-warning-container/30 p-4">
          <div className="flex items-center gap-2 text-warning">
            <LinearDanger className="h-6 w-6 text-warning" />
            <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6">توجه!</Typography>
          </div>
          <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 mt-4 text-sm font-medium leading-6 text-on-surface-var">
            در صورت حذف تمامی اطلاعات ثبت شده به مشاور جایگزین منتقل می‌گردد.
          </Typography>
        </section>

        <section className="mt-7">
          <label className="block text-right text-base font-semibold leading-6 text-on-surface">
            انتخاب مشاور جایگزین <Typography as="span" variant="body" size="medium" weight="regular" className="text-error">*</Typography>
          </label>
          <Button
            unstyled
            className="mt-3 flex h-14 w-full items-center justify-between rounded-xl border border-outline bg-surface-container-lowest px-4 text-sm font-medium leading-5 text-on-surface"
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

      <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-4 bg-surface-container-lowest px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-sm">
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

            const finalAgentId =
              consultant.agentId ??
              matchedConsultant?.agentId ??
              targetAgentId;

            deactivateConsultantMutation.mutate(
              selectedReplacement.kind === "agency"
                ? {
                    agentId: finalAgentId,
                    transferTo: "agency",
                  }
                : {
                    agentId: finalAgentId,
                    transferTo: "member",
                    transferUserId:
                      selectedReplacement.consultant.userId ??
                      selectedReplacement.consultant.id,
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
          currentConsultant={consultant}
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
