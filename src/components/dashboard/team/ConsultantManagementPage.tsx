import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

import LinearCancel from "../../(icons)/LinearCancel";
import LinearDelete from "../../(icons)/LinearDelete";
import LinearEdit2 from "../../(icons)/LinearEdit2";
import LinearInfoCircle from "../../(icons)/LinearInfoCircle";
import LinearSearch from "../../(icons)/LinearSearch";
import LinearStairs from "../../(icons)/LinearStairs";
import LinearStartup from "../../(icons)/LinearStartup";
import LinearTag from "../../(icons)/LinearTag";
import LinearUserAdd from "../../(icons)/LinearUserAdd";
import LinearUserSolid from "../../(icons)/LinearUserSolid";
import { RadioIndicator } from "../../RadioIndicator";
import { SelectionCheckIndicator } from "../../SelectionCheckIndicator";
import { FormChoiceChip } from "../../form/FormControls";
import { Snackbar } from "../../Snackbar";
import { TopBar } from "../../TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import NoSearchIcon from "../../../assets/icons/NoSearch.svg";
import { getApiErrorMessage } from "../../../api/api";
import {
  useAddAgencyConsultantMutation,
  useAgencyConsultantsQuery,
  usePublicAgentsQuery,
} from "../../../hooks/agency.hooks";
import type {
  AgencyConsultantDto,
  AgencyConsultantPermissions,
} from "../../../services/agency.service";

type ConsultantStatus = "active" | "pending";

export type TeamConsultant = {
  adQuota?: number;
  id: number;
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

export const teamConsultants: TeamConsultant[] = [
  {
    id: 1,
    avatarSrc: "/figma/consultants/consultant-naser.png",
    name: "مجتبی مطلبی",
    phone: "09154884578",
    status: "pending",
    scores: {
      ads: 35,
      rocket: 18,
      steps: 12,
    },
  },
  {
    id: 2,
    avatarSrc: "/figma/consultants/consultant-mohammad.png",
    name: "آدرین رنگز",
    phone: "09154884578",
    status: "active",
    scores: {
      ads: 25,
      rocket: 18,
      steps: 12,
    },
  },
  {
    id: 3,
    avatarSrc: "/figma/consultants/consultant-naser.png",
    name: "ناصر اشرفی",
    phone: "09154884578",
    status: "active",
    scores: {
      ads: 25,
      rocket: 18,
      steps: 12,
    },
  },
];


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

export function getRouteConsultant() {
  const routeState = window.history.state as ConsultantRouteState | null;
  const routeConsultantId = getRouteConsultantId();

  return (
    routeState?.consultant ??
    (routeConsultantId !== undefined
      ? {
          id: routeConsultantId,
          name: "مشاور",
          phone: "",
          scores: { ads: 0, rocket: 0, steps: 0 },
          status: "active" as const,
        }
      : undefined) ??
    teamConsultants.find((consultant) => consultant.status === "active") ??
    teamConsultants[0]
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

  return (
    <section
      className="relative mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-white text-[#1a1a1a]"
      dir="rtl"
    >
      <TopBar
        backTo="/account"
        centerClassName="px-0"
        reserveStartSpace
        title="مدیریت مشاورین"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <div className="min-h-0 flex-1 overflow-y-auto bg-[#f5f5f5] pb-24">
        <div className="bg-white px-4 pb-4 pt-3">
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

        {visibleConsultants.length > 0 ? (
          <div className="space-y-1">
            {visibleConsultants.map((consultant) => (
              <ConsultantCard consultant={consultant} key={consultant.id} />
            ))}
          </div>
        ) : agencyConsultantsQuery.isPending ? null : (
          <ConsultantEmptyState />
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <RouteLink
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0048c4] text-sm font-semibold leading-5 text-white no-underline transition hover:bg-[#003da8]"
          to="/account/dashboard/team/add-consultant"
        >
          <LinearUserAdd className="h-5 w-5" />
          اضافه کردن مشاور
        </RouteLink>
      </div>
    </section>
  );
}

export function AddConsultantPage() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedConsultantId, setSelectedConsultantId] = useState<string | null>(null);
  const [accessRole, setAccessRole] = useState<AccessRole>("consultant");
  const [managerAccess, setManagerAccess] = useState<string[]>(["ads", "requests"]);
  const [adQuota, setAdQuota] = useState(0);
  const [updateQuota, setUpdateQuota] = useState(0);
  const [specialQuota, setSpecialQuota] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const addConsultantMutation = useAddAgencyConsultantMutation();

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
    if (!selectedConsultantId) {
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
        permissions,
        renewQuota: updateQuota,
        role: accessRole,
        specialQuota,
        userId: selectedConsultantId,
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

      {errorMessage ? (
        <Snackbar
          message={errorMessage}
          onDismiss={() => setErrorMessage("")}
          title="خطا"
          variant="error"
        />
      ) : null}

      <main className="min-h-0 flex-1 overflow-y-auto pb-24">
        <div className="bg-white px-4 pb-5 pt-3">
          <label className="flex h-12 items-center gap-2 rounded-lg border border-[#d9d9d9] bg-white px-3 focus-within:border-[#0048c4] focus-within:ring-2 focus-within:ring-[#0048c41a]">
            <input
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-[#1a1a1a] outline-none placeholder:text-[#bdbdbd]"
              onChange={(event) => {
                setSearchValue(event.target.value);
                setSelectedConsultantId(null);
              }}
              placeholder="شماره تلفن مشاور مورد نظر را وارد کنید"
              type="search"
              value={searchValue}
            />
            <LinearSearch className="h-5 w-5 shrink-0 text-[#4d4d4d]" />
          </label>

          <p className="m-0 mt-3 flex items-start gap-1 text-right text-sm text-[#808080]">
            <LinearInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#4d4d4d]" />
            <span>
              برای یافتن مشاور، لازم است قبلاً به عنوان مشاور مستقل در سایت فعالیت کرده باشد.
            </span>
          </p>
        </div>

        <div className="bg-white">
          {hasSearch && visibleResults.length > 0 ? (
            <section className="bg-white px-4 py-4">
              <h2 className="m-0 text-xs font-semibold leading-5 text-[#1a1a1a]">
                نتیجه جستجو
              </h2>
              <div className="mt-3 space-y-2">
                {visibleResults.map((consultant) => {
                  const isSelected = selectedConsultantId === consultant.id;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`flex h-[76px] w-full items-center gap-3 rounded-xl border px-3 text-right transition ${isSelected
                        ? "border-[#0048c4] bg-[#eaf1ff]"
                        : "border-[#e6e6e6] bg-white"
                        }`}
                      key={consultant.id}
                      onClick={() => setSelectedConsultantId(consultant.id)}
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
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e0e0e0] text-[#808080]">
                            <LinearUserSolid className="h-6 w-6" />
                          </span>
                        )}
                        <div className="flex flex-col justify-center">
                          <span className="block truncate text-sm font-semibold text-[#1a1a1a]">
                            {consultant.fullName}
                          </span>
                          <span className="block text-xs font-medium text-[#808080]">
                            {consultant.mobile ?? ""}
                          </span>
                        </div>
                      </div>
                      <SelectionCheckIndicator className="!h-4.5 !w-4.5 rounded-sm" checked={isSelected} />
                    </button>
                  );
                })}
              </div>
            </section>
          ) : (
            <AddConsultantEmptyState />
          )}

          <section className="border-t border-[#f0f0f0] bg-white px-4 py-5">
            <h2 className="m-0 text-right font-semibold leading-5 text-[#1a1a1a]">
              انتخاب سمت
            </h2>

            <div
              aria-label="انتخاب سمت"
              className="mt-3 grid"
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
                  <button
                    aria-pressed={isChecked}
                    className={`flex items-center gap-2 text-right leading-4 ${isManager ? "text-[#4d4d4d]" : "text-[#bdbdbd]"
                      }`}
                    disabled={!isManager}
                    key={item.id}
                    onClick={() => toggleManagerAccess(item.id)}
                    type="button"
                  >
                    <SelectionCheckIndicator className="w-[18px] h-[18px] rounded-sm" checked={isChecked} />
                    <span className="text-sm ">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 border-t border-[#f0f0f0] bg-white px-4 py-5">
            <QuotaStepper
              label="سهمیه آگهی"
              remaining="باقیمانده سهمیه آژانس: ۱۹۵"
              remainingClassName="text-[#0048c4]"
              setValue={setAdQuota}
              value={adQuota}
            />
            <QuotaStepper
              label="سهمیه بروزرسانی"
              remaining="باقیمانده سهمیه آژانس: ۹۳"
              remainingClassName="text-[#11a366]"
              setValue={setUpdateQuota}
              value={updateQuota}
            />
            <QuotaStepper
              label="سهمیه ویژه"
              remaining="باقیمانده سهمیه آژانس: ۱۹۵"
              remainingClassName="text-[#ff6d00]"
              setValue={setSpecialQuota}
              value={specialQuota}
            />
          </section>
        </div>
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <button
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0048c4] text-xs font-semibold leading-5 text-white transition disabled:bg-[#b3c8ef]"
          disabled={addConsultantMutation.isPending}
          onClick={handleAddConsultant}
          type="button"
        >
          <span className="text-[13px] leading-none">+</span>
          {addConsultantMutation.isPending ? "در حال افزودن..." : "اضافه کن"}
        </button>
      </div>
    </section>
  );
}

function AddConsultantEmptyState() {
  return (
    <div className="flex h-[104px] items-center justify-center gap-3 bg-white px-4 text-center">
      <img src={NoSearchIcon} alt="" className="h-[40px] w-[40px]" />
      <span className="font-medium text-[#808080]">
        مشاوری برای نمایش نیست!
      </span>
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
    <button
      aria-checked={checked}
      className="flex w-full items-center gap-2 text-right text-xs font-semibold pt-3 text-[#1a1a1a]"
      onClick={onClick}
      role="radio"
      type="button"
    >
      <RadioIndicator checked={checked} />
      <span>{label}</span>
    </button>
  );
}

export function ConsultantProfileSummary({ consultant }: { consultant: TeamConsultant }) {
  return (
    <div className="mt-3 flex items-center gap-3">
      <ConsultantAvatar consultant={consultant} sizeClassName="h-14 w-14" />
      <div className="grid">
        <h1 className="m-0 text-base text-[#1a1a1a]">
          {consultant.name} (مشاور)
        </h1>
        <p className="m-0 mt-1 text-sm font-normal text-[#bdbdbd]">
          {consultant.phone}
        </p>
      </div>
    </div>
  );
}

export function ConsultantProfilePill({ consultant }: { consultant: TeamConsultant }) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#cccccc] bg-white px-4 py-2">
      <ConsultantAvatar consultant={consultant} sizeClassName="h-14 w-14" />
      <div className="flex flex-col justify-center">
        <h1 className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">
          {consultant.name}
        </h1>
        <p className="text-sm font-medium leading-5 text-[#bdbdbd]">
          {consultant.phone}
        </p>
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
    <span
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
    </span>
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
          <span className={`grid h-6 w-6 place-items-center rounded-2xl ${iconClassName ?? "text-[#808080]"}`}>
            {icon}
          </span>
        ) : null}
        <span className={`text-[#1a1a1a] ${labelClassName}`}>
          {label}
        </span>
      </div>
      <strong className="font-semibold text-[#1a1a1a]">
        {value}
      </strong>
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
      <h2 className="m-0 text-right text-base font-semibold leading-6 text-[#1a1a1a]">
        {label}
      </h2>
      <div className="mt-3 grid h-14 grid-cols-[80px_1fr_80px] overflow-hidden rounded-xl border border-[#cccccc] bg-white">
        <button
          className="grid place-items-center border-r border-[#cccccc] bg-[#e9eaee] text-2xl font-normal text-[#4d4d4d]"
          onClick={() => setValue((current) => Math.max(0, current - 1))}
          type="button"
        >
          -
        </button>
        <span className="grid place-items-center text-base font-medium leading-6 text-[#1a1a1a]">
          {new Intl.NumberFormat("fa-IR").format(value)}
        </span>
        <button
          className="grid place-items-center border-l border-[#cccccc] bg-[#e9eaee] text-2xl font-normal text-[#4d4d4d]"
          onClick={() => setValue((current) => current + 1)}
          type="button"
        >
          +
        </button>
      </div>
      <p className="m-0 mt-2 pr-3 text-xs font-medium leading-5 text-[#808080]">
        <span>باقیمانده سهمیه آژانس: </span>
        <span className={remainingClassName}>{remaining.split(": ")[1]}</span>
      </p>
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

export function WarningIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 8v5M12 16.5v.1M10.3 4.5 2.8 17.2A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.8L13.7 4.5a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
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

  return (
    <article className="bg-white px-4 pb-4 pt-5">
      {isPending && (
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-lg bg-[#fff5ed] px-3 py-2 text-sm font-medium leading-4 text-[#FF6D00]">
            در انتظار تایید انتشار
          </span>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-white px-1 !text-sm font-medium text-[#ef1f1f]"
            type="button"
          >
            <LinearCancel className="h-5 w-5" />
            لغو
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <h2 className="m-0 font-semibold text-[#1a1a1a]">
          {consultant.name}
        </h2>
        <span className="rounded-lg px-2 py-0.5 text-xs text-[#808080] bg-[#80808014] font-medium">
          {consultant.roleLabel || "مشاور"}
        </span>
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

          <div className="mt-4 grid h-10 grid-cols-3 overflow-hidden rounded-lg bg-[#f5f5f5] text-xs font-medium text-[#4d4d4d]">
            <ConsultantAction
              consultant={consultant}
              icon={<LinearInfoCircle className="h-4 w-4" />}
              label="اطلاعات"
              to={consultantTeamPaths.info}
            />
            <ConsultantAction
              consultant={consultant}
              icon={<LinearEdit2 className="h-4 w-4" />}
              label="ویرایش"
              to={consultantTeamPaths.edit}
            />
            <ConsultantAction
              consultant={consultant}
              icon={<LinearDelete className="h-4 w-4" />}
              label="حذف"
              to={consultantTeamPaths.remove}
            />
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
      <span
        className={`grid h-10 w-10 place-items-center rounded-xl ${toneClassNames[tone]}`}
      >
        {icon}
      </span>
      <span className="text-sm font-semibold leading-5 text-[#1a1a1a]">
        {value}
      </span>
    </div>
  );
}

function ConsultantAction({
  consultant,
  icon,
  label,
  to,
}: {
  consultant: TeamConsultant;
  icon: ReactNode;
  label: string;
  to: string;
}) {
  return (
    <RouteLink
      className="flex items-center justify-center gap-1 border-l border-[#e6e6e6] text-[#4d4d4d] no-underline last:border-l-0"
      state={{ consultant }}
      to={`${to}/${consultant.id}`}
    >
      {icon}
      {label}
    </RouteLink>
  );
}

function ConsultantEmptyState() {
  return (
    <div className="grid min-h-[420px] place-items-center bg-white px-8 text-center">
      <div className="grid max-w-[260px] justify-items-center">
        <img src="NoAgent.svg" alt="" className="h-[66px] w-[66px]" />
        <h2 className="mt-4 text-sm font-semibold leading-5 text-[#1a1a1a]">
          هیچ مشاوری برای مدیریت وجود ندارد!
        </h2>
        <p className="mt-2 text-xs font-medium leading-5 text-[#4d4d4d]">
          برای افزودن مشاور جدید، <br />
          ابتدا از دکمه افزودن مشاور استفاده کنید.
        </p>
      </div>
    </div>
  );
}
