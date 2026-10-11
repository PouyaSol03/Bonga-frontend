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
import { useToast } from "../../../../shared/hooks/useToast";
import { AddConsultantSearchResults } from "./add-consultant/AddConsultantSearchResults";
import { AddConsultantRoleSection } from "./add-consultant/AddConsultantRoleSection";
import type { AccessRole } from "./teamTypes";

export function AddConsultantPage() {
  const { showToast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [accessRole, setAccessRole] = useState<AccessRole>("consultant");
  const [managerAccess, setManagerAccess] = useState<string[]>(["ads", "requests"]);
  const [errorMessage, setErrorMessage] = useState("");

  const addConsultantMutation = useAddAgencyConsultantMutation();

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
        adQuota: 0,
        agentId: selectedAgentId,
        permissions,
        renewQuota: 0,
        role: accessRole,
        specialQuota: 0,
      },
      {
        onError: (error) => {
          const msg = getApiErrorMessage(error, "اضافه کردن مشاور با خطا مواجه شد.");
          setErrorMessage(msg);
          showToast(msg, "خطا", "error");
        },
        onSuccess: () => {
          showToast("مشاور با موفقیت اضافه شد.");
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
