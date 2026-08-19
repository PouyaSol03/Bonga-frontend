import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

import LinearCancel from "../../../../shared/icons/LinearCancel";
import LinearDelete from "../../../../shared/icons/LinearDelete";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import LinearSearch from "../../../../shared/icons/LinearSearch";
import LinearStairs from "../../../../shared/icons/LinearStairs";
import LinearStartup from "../../../../shared/icons/LinearStartup";
import LinearTag from "../../../../shared/icons/LinearTag";
import LinearUserAdd from "../../../../shared/icons/LinearUserAdd";
import LinearUserSolid from "../../../../shared/icons/LinearUserSolid";
import { RadioIndicator } from "../../../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { SelectionCheckIndicator } from "../../../../shared/components/SelectionCheckIndicator";
import { FormChoiceChip } from "../../../../shared/form/FormControls";
import { TopBar } from "../../../../shared/components/TopBar";
import { RouteLink } from "../../../../shared/navigation/RouteLink";
import NoSearchIcon from "../../../../shared/assets/icons/NoSearch.svg";
import { getApiErrorMessage } from "../../../../shared/api/api";
import {
  useAddAgencyConsultantMutation,
  useAgencyConsultantsQuery,
  useCancelAgencyConsultantRequestMutation,
  usePublicAgentsQuery,
} from "../../../agencies/api/agency.hooks";
import type {
  AgencyConsultantDto,
  AgencyConsultantPermissions,
} from "../../../agencies/api/agency.service";
import { Typography } from "../../../../shared/ui/Typography";
import { useAgencyDashboardQuery } from "../../api/dashboard.hooks";
import { Button } from "../../../../shared/ui/Button";
import { TextField } from "../../../../shared/ui/TextField";

type ConsultantStatus = "active" | "pending";

export type TeamConsultant = {
  adQuota?: number;
  agentId?: number;
  id: number;
  requestId?: number;
  name: string;
  avatarSrc?: string;
  phone: string;
  permissions?: AgencyConsultantPermissions;
  renewQuota?: number;
  roleLabel?: string;
  roleId?: number;
  isActive?: boolean;
  rankingScore?: number;
  specialQuota?: number;
  status: ConsultantStatus;
  scores: {
    ads: number;
    steps: number;
    rocket: number;
  };
};

function getTeamRoleLabel(role: string) {
  switch (role.trim().toLowerCase()) {
    case "owner":
      return "مدیر آژانس";
    case "manager":
      return "مدیر";
    case "consultant":
    case "member":
      return "مشاور";
    default:
      return role.trim() || "مشاور";
  }
}

export function mapAgencyConsultantToTeamConsultant(
  consultant: AgencyConsultantDto,
): TeamConsultant {
  return {
    adQuota: consultant.adQuota,
    agentId: consultant.agentId,
    avatarSrc: consultant.avatar,
    id: consultant.userId,
    isActive: consultant.isActive,
    name: consultant.name,
    permissions: consultant.permissions,
    phone: consultant.mobile,
    renewQuota: consultant.renewQuota,
    roleLabel: getTeamRoleLabel(consultant.role),
    roleId: consultant.roleId,
    rankingScore: consultant.metrics.rankingScore,
    requestId: consultant.requestId,
    specialQuota: consultant.specialQuota,
    scores: {
      ads: consultant.metrics.publishedAdvertises,
      rocket: consultant.metrics.specialUsed,
      steps: consultant.metrics.renewUsed,
    },
    status: consultant.isActive ? "active" : "pending",
  };
}

type TeamFilter = "consultants" | "pending";
export type AccessRole = "consultant" | "manager";


export const managerAccessItems = [
  { id: "ads", label: "مدیریت آگهی‌ها" },
  { id: "consultants", label: "مدیریت مشاورین" },
  { id: "requests", label: "مدیریت درخواست‌ها" },
  { id: "payments", label: "مدیریت اعتبار" },
  { id: "support", label: "پشتیبانی" },
];

const consultantTeamPaths = {
  edit: "/account/dashboard/team/edit",
  info: "/account/dashboard/team/info",
  remove: "/account/dashboard/team/remove",
};

type ConsultantRouteState = {
  consultant?: TeamConsultant;
};

export function getRouteConsultantId() {
  const routeConsultantId = window.location.pathname.match(
    /\/team\/(?:info|edit|remove)\/([^/]+)\/?$/,
  )?.[1];
  const parsedId = Number(routeConsultantId);

  return Number.isFinite(parsedId) ? parsedId : undefined;
}

export function getRouteConsultant(): TeamConsultant {
  const routeState = window.history.state as ConsultantRouteState | null;
  const routeConsultantId = getRouteConsultantId();

  return routeState?.consultant ?? {
    id: routeConsultantId ?? 0,
    name: "—",
    phone: "",
    scores: { ads: 0, rocket: 0, steps: 0 },
    status: "active",
  };
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
      className="mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-white text-[#1a1a1a]"
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
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${showConsultantControls ? "bg-[#f5f5f5]" : "bg-white"
          }`}
      >
        {showConsultantControls ? (
          <div className="shrink-0 bg-surface-container px-4 py-2">
            <label className="flex h-12 items-center gap-2 rounded-xl border border-[#bdbdbd] bg-white px-3 focus-within:border-[#0048c4] focus-within:ring-2 focus-within:ring-[#0048c41a]">
              <input
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm font-normal text-[#1a1a1a] outline-none placeholder:text-[#bdbdbd]"
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="جستجوی مشاور"
                type="search"
                value={searchValue}
              />
              <LinearSearch className="h-5 w-5 shrink-0 text-[#4d4d4d]" />
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

      <div className="shrink-0 bg-white px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
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
    value === undefined
      ? "—"
      : new Intl.NumberFormat("fa-IR").format(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 350);

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
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
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
        adQuota,
        agentId: selectedAgentId,
        permissions,
        renewQuota: updateQuota,
        role: accessRole,
        specialQuota,
      },
      {
        onError: (error) => {
          setErrorMessage(
            getApiErrorMessage(error, "اضافه کردن مشاور با خطا مواجه شد."),
          );
        },
        onSuccess: () => {
          window.history.pushState({}, "", "/account/dashboard/team");
          window.dispatchEvent(new PopStateEvent("popstate"));
        },
      },
    );
  };

  return (
    <section
      className="relative mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-[#f5f5f5] text-[#1a1a1a]"
      dir="rtl"
    >
      <TopBar
        backTo="/account/dashboard/team"
        centerClassName="px-0"
        reserveStartSpace
        title="انتخاب مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />


      <main className="min-h-0 flex-1 overflow-y-auto pb-14">
        <div className="bg-white px-4 pb-2.5 pt-4">
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

          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-3 flex items-start gap-1 text-right text-sm text-[#808080]">
            <LinearInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#4d4d4d]" />
            <Typography as="span" variant="body" size="medium" weight="regular">
              برای یافتن مشاور، لازم است قبلاً به عنوان مشاور مستقل در سایت فعالیت کرده باشد.
            </Typography>
          </Typography>
        </div>

        <div className="bg-white">
          {hasSearch && visibleResults.length > 0 ? (
            <section className="bg-white px-4 py-4">
              <Typography as="h2" variant="title" size="small" weight="semibold" className="m-0 text-xs font-semibold leading-5 text-[#1a1a1a]">
                نتیجه جستجو
              </Typography>
              <div className="mt-3 space-y-2">
                {visibleResults.map((consultant) => {
                  const isSelected = selectedAgentId === consultant.id;

                  return (
                    <Button unstyled
                      aria-pressed={isSelected}
                      className={`flex h-[76px] w-full items-center gap-3 rounded-xl border px-3 text-right transition ${isSelected
                        ? "border-[#0048c4] bg-[#eaf1ff]"
                        : "border-[#e6e6e6] bg-white"
                        }`}
                      key={consultant.id}
                      onClick={() => setSelectedAgentId(consultant.id)}
                      type="button"
                    >
                      <div className="flex flex-1 gap-x-2">
                        {consultant.avatar ? (
                          <img
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-full object-cover"
                            draggable={false}
                            src={consultant.avatar}
                          />
                        ) : (
                          <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e0e0e0] text-[#808080]">
                            <LinearUserSolid className="h-6 w-6" />
                          </Typography>
                        )}
                        <div className="flex flex-col justify-center">
                          <Typography as="span" variant="label" size="medium" weight="semibold" className="block truncate text-sm font-semibold text-[#1a1a1a]">
                            {consultant.fullName}
                          </Typography>
                          <Typography as="span" variant="label" size="small" weight="medium" className="block text-xs font-medium text-[#808080]">
                            {consultant.mobile ?? ""}
                          </Typography>
                        </div>
                      </div>
                      <SelectionCheckIndicator className="!h-4.5 !w-4.5 rounded-sm" checked={isSelected} />
                    </Button>
                  );
                })}
              </div>
            </section>
          ) : hasSearch && isSearchReady && !publicAgentsQuery.isLoading ? (
            <SearchEmptyState />
          ) : (
            <AddConsultantEmptyState />
          )}

          <section className="border-t-[8px] border-[#f5f5f5] bg-white px-4 py-5">
            <Typography as="p" variant="title" size="medium" weight="semibold" className="m-0 text-[#1a1a1a]">
              انتخاب سمت
            </Typography>

            <div
              aria-label="انتخاب سمت"
              className="mt-4 grid"
              role="radiogroup"
            >
              <AddConsultantRoleOption
                checked={accessRole === "consultant"}
                label="مشاور"
                onClick={() => setAccessRole("consultant")}
              />
              <AddConsultantRoleOption
                checked={accessRole === "manager"}
                label="مدیر"
                onClick={() => setAccessRole("manager")}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-3 mt-3">
              {managerAccessItems.map((item) => {
                const checked = managerAccess.includes(item.id);
                const isManager = accessRole === "manager";
                const isChecked = checked && isManager;

                return (
                  <Button unstyled
                    aria-pressed={isChecked}
                    className={`flex items-center gap-2 text-right leading-4 ${isManager ? "text-[#4d4d4d]" : "text-[#bdbdbd]"
                      }`}
                    disabled={!isManager}
                    key={item.id}
                    onClick={() => toggleManagerAccess(item.id)}
                    type="button"
                  >
                    <SelectionCheckIndicator
                      className={`h-4.5 w-4.5 rounded-sm ${isChecked
                          ? ""
                          : isManager
                            ? "!border-[#4d4d4d]"
                            : "!border-[#bdbdbd]"
                        }`}
                      checked={isChecked}
                    />
                    <Typography as="span" variant="label" size="medium" weight="medium" className={`${isManager ? "text-[#4d4d4d]" : "text-[#bdbdbd]"}`}>{item.label}</Typography>
                  </Button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 border-t-[8px] border-[#f5f5f5] bg-white px-4 py-5">
            <QuotaStepper
              label="سهمیه آگهی"
              remaining={`باقیمانده سهمیه آژانس: ${formatRemaining(agencyBalances?.adCreditBalance)}`}
              remainingClassName="text-[#0048c4]"
              setValue={setAdQuota}
              value={adQuota}
            />
            <QuotaStepper
              label="سهمیه بروزرسانی"
              remaining={`باقیمانده سهمیه آژانس: ${formatRemaining(agencyBalances?.renewCreditBalance)}`}
              remainingClassName="text-[#11a366]"
              setValue={setUpdateQuota}
              value={updateQuota}
            />
            <QuotaStepper
              label="سهمیه ویژه"
              remaining={`باقیمانده سهمیه آژانس: ${formatRemaining(agencyBalances?.specialCreditBalance)}`}
              remainingClassName="text-[#ff6d00]"
              setValue={setSpecialQuota}
              value={specialQuota}
            />
          </section>
        </div>
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <Button
          fullWidth
          leadingIcon={
            <Typography as="span" variant="body" size="medium" weight="regular" className="text-[13px] leading-none">
              +
            </Typography>
          }
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

function AddConsultantEmptyState() {
  return (
    <div className="mx-auto flex h-[104px] w-full items-center justify-center gap-3 bg-white px-4 text-center">
      <img src={NoSearchIcon} alt="" className="h-[40px] w-[40px]" />
      <Typography as="span" variant="label" size="medium" weight="medium" className="font-medium text-[#808080]">
        مشاوری برای نمایش نیست!
      </Typography>
    </div>
  );
}

export function AddConsultantRoleOption({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button unstyled
      aria-checked={checked}
      className="flex w-full items-center py-2.25 gap-3.5 text-[#1a1a1a]"
      onClick={onClick}
      role="radio"
      type="button"
    >
      <RadioIndicator checked={checked} />
      <Typography as="span" variant="label" size="large" weight="medium">{label}</Typography>
    </Button>
  );
}

export function ConsultantProfileSummary({ consultant }: { consultant: TeamConsultant }) {
  return (
    <div className="mt-4 flex items-center gap-3 bg-primary/12 px-4 py-2 rounded-2xl">
      <ConsultantAvatar consultant={consultant} sizeClassName="h-14 w-14" />
      <div className="grid">
        <Typography as="h1" variant="body" size="large" weight="regular" className="m-0 text-on-surface">
          {consultant.name} (مشاور)
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-[#1a1a1a]/40">
          {consultant.phone}
        </Typography>
      </div>
    </div>
  );
}

export function ConsultantProfilePill({ consultant }: { consultant: TeamConsultant }) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#cccccc] bg-white px-4 py-2">
      <ConsultantAvatar consultant={consultant} sizeClassName="h-14 w-14" />
      <div className="flex flex-col justify-center">
        <Typography as="h1" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">
          {consultant.name}
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="medium" className="text-sm font-medium leading-5 text-[#bdbdbd]">
          {consultant.phone}
        </Typography>
      </div>
    </div>
  );
}

export function ConsultantAvatar({
  consultant,
  sizeClassName,
}: {
  consultant: TeamConsultant;
  sizeClassName: string;
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const showAvatar = Boolean(consultant.avatarSrc) && !hasImageError;

  return (
    <Typography as="span" variant="body" size="medium" weight="regular"
      className={`${sizeClassName} grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#e0e0e0] text-[#808080]`}
    >
      {showAvatar ? (
        <img
          alt={consultant.name}
          className="h-full w-full object-cover"
          draggable={false}
          onError={() => setHasImageError(true)}
          src={consultant.avatarSrc}
        />
      ) : (
        <LinearUserSolid className="h-1/2 w-1/2" />
      )}
    </Typography>
  );
}

export function InfoStatRow({
  className = "",
  icon,
  iconClassName,
  labelClassName,
  label,
  value,
}: {
  className?: string;
  icon?: ReactNode;
  iconClassName?: string;
  labelClassName?: string;
  label: string;
  value: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-4">
        {icon ? (
          <Typography as="span" variant="body" size="large" weight="regular" className={`grid h-6 w-6 place-items-center rounded-2xl ${iconClassName ?? "text-[#4d4d4d]"}`}>
            {icon}
          </Typography>
        ) : null}
        <Typography as="span" variant="body" size="large" weight="regular" className={`text-[#1a1a1a] ${labelClassName}`}>
          {label}
        </Typography>
      </div>
      <Typography as="span" variant="label" size="large" weight="semibold" className="text-[#1a1a1a]">
        {value}
      </Typography>
    </div>
  );
}

export function QuotaStepper({
  label,
  remaining,
  remainingClassName,
  setValue,
  value,
}: {
  label: string;
  remaining: string;
  remainingClassName: string;
  setValue: Dispatch<SetStateAction<number>>;
  value: number;
}) {
  return (
    <div>
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold leading-6 text-[#1a1a1a]">
        {label}
      </Typography>
      <div className="mt-3 grid h-14 grid-cols-[80px_1fr_80px] overflow-hidden rounded-xl border border-[#cccccc] bg-white">
        <Button unstyled
          className="grid place-items-center border-r border-[#cccccc] bg-[#e9eaee] text-2xl font-normal text-[#4d4d4d]"
          onClick={() => setValue((current) => Math.max(0, current - 1))}
          type="button"
        >
          -
        </Button>
        <Typography as="span" variant="label" size="large" weight="medium" className="grid place-items-center text-base font-medium leading-6 text-[#1a1a1a]">
          {new Intl.NumberFormat("fa-IR").format(value)}
        </Typography>
        <Button unstyled
          className="grid place-items-center border-l border-[#cccccc] bg-[#e9eaee] text-2xl font-normal text-[#4d4d4d]"
          onClick={() => setValue((current) => current + 1)}
          type="button"
        >
          +
        </Button>
      </div>
      <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-2 pr-3 text-xs font-medium leading-5 text-[#808080]">
        <Typography as="span" variant="body" size="medium" weight="regular">باقیمانده سهمیه آژانس: </Typography>
        <Typography as="span" variant="body" size="medium" weight="regular" className={remainingClassName}>{remaining.split(": ")[1]}</Typography>
      </Typography>
    </div>
  );
}

export function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

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

function ConsultantCard({ consultant }: { consultant: TeamConsultant }) {
  const isPending = consultant.status === "pending";
  const cancelRequestMutation = useCancelAgencyConsultantRequestMutation();
  const [cancelError, setCancelError] = useState("");

  const cancelRequest = () => {
    const agentId = consultant.agentId;
    if (!agentId || cancelRequestMutation.isPending) return;

    setCancelError("");
    cancelRequestMutation.mutate(agentId, {
      onError: (error) => {
        setCancelError(
          getApiErrorMessage(error, "لغو درخواست همکاری با خطا مواجه شد."),
        );
      },
    });
  };

  return (
    <article className="bg-white px-4 pb-4 pt-5">
      {isPending && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <Typography as="span" variant="label" size="medium" weight="medium" className="rounded-lg bg-[#fff5ed] px-4 py-2 text-[#FF6D00]">
              در انتظار تایید انتشار
            </Typography>
            <Button unstyled
              className="inline-flex items-center gap-2 rounded-lg bg-white px-1 !text-sm font-medium text-on-error-container disabled:opacity-50"
              disabled={!consultant.agentId || cancelRequestMutation.isPending}
              onClick={cancelRequest}
              type="button"
            >
              <LinearCancel className="h-5 w-5" />
              {cancelRequestMutation.isPending ? "در حال لغو..." : "لغو"}
            </Button>
          </div>
          {cancelError ? (
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs text-on-error-container">
              {cancelError}
            </Typography>
          ) : null}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-[#1a1a1a]">
          {consultant.name}
        </Typography>
        <Typography as="span" variant="body" size="small" weight="medium" className="rounded-lg px-2 py-0.5 text-xs text-[#808080] bg-[#80808014] font-medium">
          {consultant.roleLabel || "مشاور"}
        </Typography>
      </div>

      {!isPending && (
        <>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <ConsultantStat
              tone="blue"
              icon={<LinearTag className="h-6 w-6" />}
              value={consultant.scores.ads}
            />
            <ConsultantStat
              tone="green"
              icon={<LinearStairs className="h-5 w-5" />}
              value={consultant.scores.steps}
            />
            <ConsultantStat
              tone="orange"
              icon={<LinearStartup className="h-5 w-5" />}
              value={consultant.scores.rocket}
            />
          </div>

          <div className="mt-4 grid h-10 py-2 grid-cols-3 overflow-hidden rounded-lg bg-[#f5f5f5] text-xs font-medium text-[#4d4d4d]">
            <RouteLink
              className="flex justify-center items-center gap-2 border-l border-[#e0e0e0]"
              state={{ consultant }}
              to={`${consultantTeamPaths.info}/${consultant.agentId ?? consultant.id}`}
            >
              <LinearInfoCircle className="w-5 h-5" />
              اطلاعات
            </RouteLink>
            <RouteLink
              className="flex justify-center items-center gap-2 border-l border-[#e0e0e0]"
              state={{ consultant }}
              to={`${consultantTeamPaths.edit}/${consultant.id}`}
            >
              <LinearEdit2 className="w-5 h-5" />
              ویرایش
            </RouteLink>
            <RouteLink
              className="flex justify-center items-center gap-2"
              state={{ consultant }}
              to={`${consultantTeamPaths.remove}/${consultant.id}`}
            >
              <LinearDelete className="w-5 h-5" />
              حذف
            </RouteLink>
          </div>
        </>
      )}
    </article>
  );
}

function ConsultantStat({
  icon,
  tone,
  value,
}: {
  icon: ReactNode;
  tone: "blue" | "green" | "orange";
  value: number;
}) {
  const toneClassNames = {
    blue: "bg-[#dfe8ff] text-[#0048c4]",
    green: "bg-[#d9f7ea] text-[#11a366]",
    orange: "bg-[#fff0dc] text-[#ff7a00]",
  };

  return (
    <div className="grid justify-items-center gap-2">
      <Typography as="span" variant="body" size="medium" weight="regular"
        className={`grid h-10 w-10 place-items-center rounded-xl ${toneClassNames[tone]}`}
      >
        {icon}
      </Typography>
      <Typography as="span" variant="label" size="medium" weight="semibold" className="text-sm font-semibold leading-5 text-[#1a1a1a]">
        {value}
      </Typography>
    </div>
  );
}

function ConsultantEmptyState() {
  return (
    <div className="mx-auto flex min-h-0 w-full flex-1 items-center justify-center bg-white px-8 py-8 text-center">
      <div className="mx-auto grid w-full max-w-[260px] justify-items-center">
        <img src="/vectors/NoAgent.svg" alt="" className="h-[66px] w-[66px]" />
        <Typography as="h2" variant="title" size="small" weight="semibold" className="mt-4 text-sm font-semibold leading-5 text-[#1a1a1a]">
          هیچ مشاوری برای مدیریت وجود ندارد!
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="mt-2 text-sm text-[#4d4d4d]">
          برای افزودن مشاورین جدید،<br />
          از گزینه «افزودن مشاور»<br />
          استفاده کنید.
        </Typography>
      </div>
    </div>
  );
}
