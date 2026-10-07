import { useState } from "react";
import { pushRoute } from "../../../../../shared/navigation/navigation";
import { Button } from "../../../../../shared/ui/Button";
import { ConsultantProfilePill } from "../ConsultantCardWidgets";
import type { TeamConsultant, AccessRole } from "../teamTypes";
import {
  buildManagerPermissions,
  getAgencyConsultantAccessRole,
  getManagerAccessFromPermissions,
} from "./consultantPermissionsUtils";
import { ConsultantEditRoleSection } from "./ConsultantEditRoleSection";
import { ConsultantEditQuotaSection } from "./ConsultantEditQuotaSection";
import { useUpdateAgencyConsultantMutation } from "../../../../agencies/api/agency.hooks";

export function ConsultantEditForm({
  agencyBalances,
  consultant,
  consultantId,
}: {
  agencyBalances?: {
    adCreditBalance?: number;
    renewCreditBalance?: number;
    specialCreditBalance?: number;
    unassignedAdCreditBalance?: number;
    unassignedRenewCreditBalance?: number;
    unassignedSpecialCreditBalance?: number;
  };
  consultant: TeamConsultant;
  consultantId: number | string;
}) {
  const updateConsultantMutation = useUpdateAgencyConsultantMutation();

  const [accessRole, setAccessRole] = useState<AccessRole>(() =>
    getAgencyConsultantAccessRole(consultant),
  );
  const [managerAccess, setManagerAccess] = useState<string[]>(() =>
    getManagerAccessFromPermissions(consultant.permissions),
  );
  const [adQuota, setAdQuota] = useState(consultant.adQuota ?? 0);
  const [updateQuota, setUpdateQuota] = useState(consultant.renewQuota ?? 0);
  const [specialQuota, setSpecialQuota] = useState(consultant.specialQuota ?? 0);
  const [errorMessage, setErrorMessage] = useState("");

  const initialAdQuota = consultant.adQuota ?? 0;
  const initialRenewQuota = consultant.renewQuota ?? 0;
  const initialSpecialQuota = consultant.specialQuota ?? 0;

  const maxAdQuota =
    initialAdQuota +
    (agencyBalances?.unassignedAdCreditBalance ?? agencyBalances?.adCreditBalance ?? 0);
  const maxRenewQuota =
    initialRenewQuota +
    (agencyBalances?.unassignedRenewCreditBalance ?? agencyBalances?.renewCreditBalance ?? 0);
  const maxSpecialQuota =
    initialSpecialQuota +
    (agencyBalances?.unassignedSpecialCreditBalance ?? agencyBalances?.specialCreditBalance ?? 0);

  const currentAgencyAdRemaining = Math.max(0, maxAdQuota - adQuota);
  const currentAgencyRenewRemaining = Math.max(0, maxRenewQuota - updateQuota);
  const currentAgencySpecialRemaining = Math.max(0, maxSpecialQuota - specialQuota);
  const isManager = accessRole === "manager";

  const formatRemaining = (value: number | undefined) =>
    value === undefined ? "—" : new Intl.NumberFormat("fa-IR").format(value);

  const toggleManagerAccess = (id: string) => {
    setManagerAccess((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const handleSubmit = () => {
    if (adQuota > maxAdQuota) {
      setErrorMessage("سهمیه آگهی بیشتر از سهمیه موجود آژانس است.");
      return;
    }
    if (updateQuota > maxRenewQuota) {
      setErrorMessage("سهمیه بروزرسانی بیشتر از سهمیه موجود آژانس است.");
      return;
    }
    if (specialQuota > maxSpecialQuota) {
      setErrorMessage("سهمیه ویژه بیشتر از سهمیه موجود آژانس است.");
      return;
    }
    setErrorMessage("");
    updateConsultantMutation.mutate(
      {
        adQuota,
        agentId: consultantId,
        permissions: buildManagerPermissions(accessRole, managerAccess),
        renewQuota: updateQuota,
        role: accessRole,
        specialQuota,
      },
      {
        onSuccess: () => {
          pushRoute("/account/dashboard/team");
        },
      },
    );
  };

  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-24">
        <ConsultantProfilePill consultant={consultant} />

        <ConsultantEditRoleSection
          accessRole={accessRole}
          isManager={isManager}
          managerAccess={managerAccess}
          onAccessRoleChange={setAccessRole}
          onToggleManagerAccess={toggleManagerAccess}
        />

        <ConsultantEditQuotaSection
          adQuota={adQuota}
          currentAgencyAdRemaining={currentAgencyAdRemaining}
          currentAgencyRenewRemaining={currentAgencyRenewRemaining}
          currentAgencySpecialRemaining={currentAgencySpecialRemaining}
          formatRemaining={formatRemaining}
          maxAdQuota={maxAdQuota}
          maxRenewQuota={maxRenewQuota}
          maxSpecialQuota={maxSpecialQuota}
          setAdQuota={setAdQuota}
          setErrorMessage={setErrorMessage}
          setSpecialQuota={setSpecialQuota}
          setUpdateQuota={setUpdateQuota}
          specialQuota={specialQuota}
          updateQuota={updateQuota}
        />

        {errorMessage ? (
          <div className="mt-4 rounded-xl border border-error/20 bg-error/10 p-3 text-center text-xs font-medium text-error">
            {errorMessage}
          </div>
        ) : null}
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-surface-container-lowest px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-sm">
        <Button
          fullWidth
          loading={updateConsultantMutation.isPending}
          size="md"
          variant="primary"
          onClick={handleSubmit}
          type="button"
        >
          اعمال تغییرات
        </Button>
      </div>
    </>
  );
}
