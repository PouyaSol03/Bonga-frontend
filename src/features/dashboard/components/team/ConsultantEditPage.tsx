import { TopBar } from "../../../../shared/components/TopBar";
import { useAgencyConsultantQuery } from "../../../agencies/api/agency.hooks";
import { useAgencyDashboardQuery } from "../../api/dashboard.hooks";
import {
  getRouteConsultant,
  getRouteConsultantId,
  mapAgencyConsultantToTeamConsultant,
} from "./ConsultantManagementPage";
import { ConsultantEditForm } from "./edit-consultant/ConsultantEditForm";

export function ConsultantEditPage() {
  const routeConsultant = getRouteConsultant();
  const consultantId =
    routeConsultant.agentId ??
    getRouteConsultantId() ??
    (Number(routeConsultant.id) > 0 ? routeConsultant.id : undefined);
  const consultantQuery = useAgencyConsultantQuery({
    agentId: consultantId,
    enabled: Boolean(consultantId),
  });
  const agencyDashboardQuery = useAgencyDashboardQuery();
  const agencyBalances = agencyDashboardQuery.data?.balances;

  const consultant = consultantQuery.data
    ? mapAgencyConsultantToTeamConsultant(consultantQuery.data)
    : routeConsultant;

  return (
    <section
      className="relative mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-surface-container-lowest text-on-surface"
      dir="rtl"
    >
      <TopBar
        backTo="/account/dashboard/team"
        centerClassName="px-0"
        reserveStartSpace
        title="ویرایش اطلاعات"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <ConsultantEditForm
        key={consultant.id}
        agencyBalances={agencyBalances}
        consultant={consultant}
        consultantId={consultantId ?? routeConsultant.id}
      />
    </section>
  );
}
