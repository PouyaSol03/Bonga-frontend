import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { SearchInputBar } from "../../../../shared/ui/SearchBar";
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
  return <FormChoiceChip label={children} onClick={onClick} selected={isActive} />;
}

function ConsultantCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest w-full animate-pulse space-y-4 p-4 [direction:rtl]">
      <div className="flex items-center gap-3">
        <div className="bg-surface-container-high h-12 w-12 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="bg-surface-container-high h-4 w-32 rounded" />
          <div className="bg-surface-container-high h-3 w-24 rounded" />
        </div>
      </div>
      <div className="border-outline-var/40 flex items-center justify-between border-t pt-3">
        <div className="bg-surface-container-high h-4 w-20 rounded" />
        <div className="flex gap-2">
          <div className="bg-surface-container-high h-8 w-8 rounded-lg" />
          <div className="bg-surface-container-high h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function ConsultantEmptyState() {
  return (
    <div className="bg-surface-container-lowest mx-auto flex min-h-0 w-full flex-1 items-center justify-center px-8 py-8 text-center">
      <div className="mx-auto grid w-full max-w-[260px] justify-items-center">
        <img src="/vectors/NoAgent.svg" alt="" className="h-[66px] w-[66px]" />
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="semibold"
          className="text-on-surface mt-4 text-sm leading-5 font-semibold"
        >
          هیچ مشاوری برای مدیریت وجود ندارد!
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var mt-2 text-sm"
        >
          برای افزودن مشاورین جدید،
          <br />
          از گزینه «افزودن مشاور»
          <br />
          استفاده کنید.
        </Typography>
      </div>
    </div>
  );
}

export function ConsultantManagementPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<TeamFilter>("consultants");
  const [searchValue, setSearchValue] = useState("");
  const agencyConsultantsQuery = useAgencyConsultantsQuery({ perPage: 100 });
  const consultants = useMemo(
    () => (agencyConsultantsQuery.data?.data ?? []).map(mapAgencyConsultantToTeamConsultant),
    [agencyConsultantsQuery.data?.data],
  );

  const visibleConsultants = useMemo(() => {
    const normalizedSearch = searchValue.trim();

    return consultants.filter((consultant) => {
      const matchesFilter = activeFilter === "consultants" || consultant.status === "pending";
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
      className="bg-surface-container-lowest text-on-surface mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden"
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
          <div className="bg-surface-container shrink-0 px-4 py-2">
            <SearchInputBar
              compact
              containerClassName="border-outline"
              debounceMs={300}
              onClear={() => setSearchValue("")}
              onDebouncedChange={setSearchValue}
              onValueChange={setSearchValue}
              placeholder="جستجوی مشاور"
              value={searchValue}
            />

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

        {agencyConsultantsQuery.isLoading ? (
          <div className="space-y-1">
            <ConsultantCardSkeleton />
            <ConsultantCardSkeleton />
            <ConsultantCardSkeleton />
          </div>
        ) : visibleConsultants.length > 0 ? (
          <div className="space-y-1">
            {visibleConsultants.map((consultant) => (
              <ConsultantCard consultant={consultant} key={consultant.id} />
            ))}
          </div>
        ) : agencyConsultantsQuery.isPending ? null : searchValue.trim() ||
          activeFilter !== "consultants" ? (
          <SearchEmptyState />
        ) : (
          <ConsultantEmptyState />
        )}
      </div>

      <div className="bg-surface-container-lowest shrink-0 px-4 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] shadow-sm">
        <Button
          fullWidth
          leadingIcon={<LinearUserAdd className="h-5 w-5" />}
          onClick={() => {
            navigate("/account/dashboard/team/add-consultant");
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
