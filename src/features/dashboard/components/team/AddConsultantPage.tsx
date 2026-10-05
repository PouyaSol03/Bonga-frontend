import { useEffect, useState } from "react";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import LinearSearch from "../../../../shared/icons/LinearSearch";
import { TopBar } from "../../../../shared/components/TopBar";
import { Button } from "../../../../shared/ui/Button";
import { TextField } from "../../../../shared/ui/TextField";
import { Typography } from "../../../../shared/ui/Typography";
import { getApiErrorMessage } from "../../../../shared/api/api";
import {
  useAddAgencyConsultantMutation,
  usePublicAgentsQuery,
} from "../../../agencies/api/agency.hooks";
import { useAgencyDashboardQuery } from "../../api/dashboard.hooks";
import { AddConsultantSearchResults } from "./add-consultant/AddConsultantSearchResults";
import { AddConsultantRoleSection } from "./add-consultant/AddConsultantRoleSection";
import { AddConsultantQuotaSection } from "./add-consultant/AddConsultantQuotaSection";
import type { AccessRole } from "./teamTypes";

export function AddConsultantPage() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [accessRole, setAccessRole] = useState<AccessRole>("consultant");
  const [managerAccess, setManagerAccess] = useState<string[]>(["ads", "requests"]);
  const [adQuota, setAdQuota] = useState(0);
  const [updateQuota, setUpdateQuota] = useState(0);
  const [specialQuota, setSpecialQuota] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const addConsultantMutation = useAddAgencyConsultantMutation();
  const agencyDashboardQuery = useAgencyDashboardQuery();
  const agencyBalances = agencyDashboardQuery.data?.balances;

  const formatRemaining = (value: number | undefined) =>
    value === undefined ? "—" : new Intl.NumberFormat("fa-IR").format(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchValue.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    if (!errorMessage) return;
    const timer = window.setTimeout(() => setErrorMessage(""), 3200);
    return () => window.clearTimeout(timer);
  }, [errorMessage]);

  const hasSearch = searchValue.trim().length > 0;
  const publicAgentsQuery = usePublicAgentsQuery({
    enabled: debouncedSearch.length > 0,
    page: 1,
    perPage: 100,
    search: debouncedSearch,
  });
  const isSearchReady = hasSearch && searchValue.trim() === debouncedSearch;
  const visibleResults = isSearchReady ? publicAgentsQuery.data?.data ?? [] : [];

  const toggleManagerAccess = (id: string) => {
    setManagerAccess((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const handleAddConsultant = () => {
    if (!selectedAgentId) {
      setErrorMessage("ابتدا یک مشاور را از نتیجه جستجو انتخاب کنید.");
      return;
    }

    const maxAd = agencyBalances?.unassignedAdCreditBalance ?? agencyBalances?.adCreditBalance ?? 0;
    if (adQuota > maxAd) {
      setErrorMessage("سهمیه آگهی نمی‌تواند بیشتر از سهمیه باقیمانده آژانس باشد.");
      return;
    }
    const maxRenew = agencyBalances?.unassignedRenewCreditBalance ?? agencyBalances?.renewCreditBalance ?? 0;
    if (updateQuota > maxRenew) {
      setErrorMessage("سهمیه بروزرسانی نمی‌تواند بیشتر از سهمیه باقیمانده آژانس باشد.");
      return;
    }
    const maxSpecial = agencyBalances?.unassignedSpecialCreditBalance ?? agencyBalances?.specialCreditBalance ?? 0;
    if (specialQuota > maxSpecial) {
      setErrorMessage("سهمیه ویژه نمی‌تواند بیشتر از سهمیه باقیمانده آژانس باشد.");
      return;
    }

    const permissions: Record<string, boolean> =
      accessRole === "manager"
        ? {
            manage_advertises: managerAccess.includes("ads"),
            manage_consultants: managerAccess.includes("consultants"),
            manage_credits: managerAccess.includes("payments"),
            manage_requests: managerAccess.includes("requests"),
            support: managerAccess.includes("support"),
          }
        : {};

    addConsultantMutation.mutate(
      {
        adQuota,
        agentId: selectedAgentId,
        permissions,
        renewQuota: updateQuota,
        role: accessRole,
        specialQuota,
      },
      {
        onError: (error) => {
          setErrorMessage(getApiErrorMessage(error, "اضافه کردن مشاور با خطا مواجه شد."));
        },
        onSuccess: () => {
          window.history.pushState({}, "", "/account/dashboard/team");
          window.dispatchEvent(new PopStateEvent("popstate"));
        },
      },
    );
  };

  return (
    <section className="relative mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-surface-container text-on-surface" dir="rtl">
      <TopBar backTo="/account/dashboard/team" centerClassName="px-0" reserveStartSpace title="انتخاب مشاور" titleClassName="text-center text-sm font-semibold leading-5" />

      <main className="min-h-0 flex-1 overflow-y-auto pb-14">
        <div className="bg-surface-container-lowest px-4 pb-2.5 pt-4">
          <TextField
            onChange={(event) => {
              setSearchValue(event.target.value);
              setSelectedAgentId(null);
            }}
            placeholder="شماره تلفن مشاور مورد نظر را وارد کنید"
            trailingSlot={<LinearSearch className="h-6 w-6 text-outline" />}
            type="search"
            value={searchValue}
          />

          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-3 flex items-start gap-1 text-right text-sm text-outline">
            <LinearInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-var" />
            <Typography as="span" variant="body" size="medium" weight="regular">
              برای یافتن مشاور، لازم است قبلاً به عنوان مشاور مستقل در سایت فعالیت کرده باشد.
            </Typography>
          </Typography>
        </div>

        <div className="bg-surface-container-lowest">
          <AddConsultantSearchResults
            hasSearch={hasSearch}
            isLoading={publicAgentsQuery.isLoading}
            isSearchReady={isSearchReady}
            onSelectAgent={setSelectedAgentId}
            results={visibleResults}
            selectedAgentId={selectedAgentId}
          />

          <AddConsultantRoleSection
            accessRole={accessRole}
            managerAccess={managerAccess}
            onAccessRoleChange={setAccessRole}
            onToggleManagerAccess={toggleManagerAccess}
          />

          <AddConsultantQuotaSection
            adQuota={adQuota}
            availableAdBalance={agencyBalances?.unassignedAdCreditBalance ?? agencyBalances?.adCreditBalance ?? 0}
            availableRenewBalance={agencyBalances?.unassignedRenewCreditBalance ?? agencyBalances?.renewCreditBalance ?? 0}
            availableSpecialBalance={agencyBalances?.unassignedSpecialCreditBalance ?? agencyBalances?.specialCreditBalance ?? 0}
            formatRemaining={formatRemaining}
            setAdQuota={setAdQuota}
            setSpecialQuota={setSpecialQuota}
            setUpdateQuota={setUpdateQuota}
            specialQuota={specialQuota}
            updateQuota={updateQuota}
          />
        </div>
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-surface-container-lowest px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-3 shadow-sm">
        <Button
          fullWidth
          leadingIcon={<Typography as="span" variant="body" size="medium" weight="regular" className="text-[13px] leading-none">+</Typography>}
          loading={addConsultantMutation.isPending}
          onClick={handleAddConsultant}
          size="x-medium"
          type="button"
          variant="primary"
        >
          {addConsultantMutation.isPending ? "در حال افزودن..." : "اضافه کن"}
        </Button>
      </div>
    </section>
  );
}
