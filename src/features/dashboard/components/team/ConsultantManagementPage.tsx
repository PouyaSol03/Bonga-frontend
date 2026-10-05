import { useMemo, useState } from "react";
import LinearSearch from "../../../../shared/icons/LinearSearch";
import LinearUserAdd from "../../../../shared/icons/LinearUserAdd";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { FormChoiceChip } from "../../../../shared/form/FormControls";
import { TopBar } from "../../../../shared/components/TopBar";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { useAgencyConsultantsQuery } from "../../../agencies/api/agency.hooks";
import { ConsultantCard } from "./ConsultantCard";
import type { TeamFilter } from "./teamTypes";
import { mapAgencyConsultantToTeamConsultant } from "./teamUtils";

export * from "./teamTypes";
export * from "./teamUtils";
export * from "./ConsultantCardWidgets";
export * from "./ConsultantCard";
export * from "./AddConsultantPage";

function TeamFilterButton({
  children,
  isActive,
  onClick,
}: {
  children: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <FormChoiceChip label={children} onClick={onClick} selected={isActive} />
  );
}

function ConsultantEmptyState() {
  return (
    <div className="mx-auto flex min-h-0 w-full flex-1 items-center justify-center bg-surface-container-lowest px-8 py-8 text-center">
      <div className="mx-auto grid w-full max-w-[260px] justify-items-center">
        <img src="/vectors/NoAgent.svg" alt="" className="h-[66px] w-[66px]" />
        <Typography as="h2" variant="title" size="small" weight="semibold" className="mt-4 text-sm font-semibold leading-5 text-on-surface">
          هیچ مشاوری برای مدیریت وجود ندارد!
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="mt-2 text-sm text-on-surface-var">
          برای افزودن مشاورین جدید،<br />
          از گزینه «افزودن مشاور»<br />
          استفاده کنید.
        </Typography>
      </div>
    </div>
  );
}

export function ConsultantManagementPage() {
  const [activeFilter, setActiveFilter] = useState<TeamFilter>("consultants");
  const [searchValue, setSearchValue] = useState("");
  const agencyConsultantsQuery = useAgencyConsultantsQuery({ perPage: 100 });
  const consultants = useMemo(
    () =>
      (agencyConsultantsQuery.data?.data ?? []).map(
        mapAgencyConsultantToTeamConsultant,
      ),
    [agencyConsultantsQuery.data?.data],
  );

  const visibleConsultants = useMemo(() => {
    const normalizedSearch = searchValue.trim();

    return consultants.filter((consultant) => {
      const matchesFilter =
        activeFilter === "consultants" || consultant.status === "pending";
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${consultant.name} ${consultant.phone}`.includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, consultants, searchValue]);

  const hasConsultants = consultants.length > 0;
  const showConsultantControls = agencyConsultantsQuery.isPending || hasConsultants;

  return (
    <section
      className="mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-surface-container-lowest text-on-surface"
      dir="rtl"
    >
      <TopBar
        backTo="/account"
        centerClassName="px-0"
        reserveStartSpace
        title="مدیریت مشاورین"
        titleClassName="text-right text-base font-semibold leading-6"
      />

      <div
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${
          showConsultantControls ? "bg-surface-container" : "bg-surface-container-lowest"
        }`}
      >
        {showConsultantControls ? (
          <div className="shrink-0 bg-surface-container px-4 py-2">
            <label className="flex h-12 items-center gap-2 rounded-xl border border-outline bg-surface-container-lowest px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <input
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm font-normal text-on-surface outline-none placeholder:text-outline"
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="جستجوی مشاور"
                type="search"
                value={searchValue}
              />
              <LinearSearch className="h-5 w-5 shrink-0 text-on-surface-var" />
            </label>

            <div className="mt-3 flex items-center gap-2">
              <TeamFilterButton
                isActive={activeFilter === "consultants"}
                onClick={() => setActiveFilter("consultants")}
              >
                مشاورین
              </TeamFilterButton>
              <TeamFilterButton
                isActive={activeFilter === "pending"}
                onClick={() => setActiveFilter("pending")}
              >
                در انتظار تایید
              </TeamFilterButton>
            </div>
          </div>
        ) : null}

        {visibleConsultants.length > 0 ? (
          <div className="space-y-1">
            {visibleConsultants.map((consultant) => (
              <ConsultantCard consultant={consultant} key={consultant.id} />
            ))}
          </div>
        ) : agencyConsultantsQuery.isPending ? null : searchValue.trim() || activeFilter !== "consultants" ? (
          <SearchEmptyState />
        ) : (
          <ConsultantEmptyState />
        )}
      </div>

      <div className="shrink-0 bg-surface-container-lowest px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-sm">
        <Button
          fullWidth
          leadingIcon={<LinearUserAdd className="h-5 w-5" />}
          onClick={() => {
            window.history.pushState({}, "", "/account/dashboard/team/add-consultant");
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
          size="x-medium"
          radius="medium"
          type="button"
          variant="primary"
        >
          اضافه کردن مشاور
        </Button>
      </div>
    </section>
  );
}
