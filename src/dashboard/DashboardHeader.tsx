import { useState } from "react";
import LinearUserSolid from "../components/(icons)/LinearUserSolid";
import { getApiAssetUrl } from "../api/api";
import { useMyProfileQuery } from "../hooks/account.hooks";
import { useNotificationUnreadCountQuery } from "../hooks/notification.hooks";
import { isUserIdentityVerified } from "../services/account.service";
import { RouteLink } from "../routes/RouteLink";
import { Typography } from "../components/ui/Typography";

const dashboardStats = [
  { Icon: Sale, label: "فروش", value: "۰" },
  { Icon: Steps, label: "مرحله‌ها", value: "۰" },
  { Icon: Rocket, label: "موشک", value: "۰" },
];

export function DashboardHeader() {
  const { data: profile } = useMyProfileQuery();
  const { data: unreadNotificationsCount = 0 } = useNotificationUnreadCountQuery();
  const fullName = [profile?.name, profile?.family]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ");
  const avatarUrl = profile?.avatar ? getApiAssetUrl(profile.avatar) : "";
  const profileName = isUserIdentityVerified(profile) ? fullName || "کاربر شناسا" : "احراز هویت نشده";

  return (
    <header className="flex h-[80px] w-full items-center justify-between bg-white px-6">
      <img className="h-[32px] w-[146px]" src="/images/logo/logo-dashboard.png" alt="" />

      <div className="flex items-center gap-4 text-[#4d4d4d]">
        <div className="flex gap-6">
          {dashboardStats.map(({ Icon, label, value }) => (
            <div className="flex items-center gap-1" key={label} aria-label={`${label}: ${value}`}>
              <Icon />
              <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm font-semibold">{value}</Typography>
            </div>
          ))}
        </div>

        <RouteLink
          aria-label="اعلان‌ها"
          className="relative grid h-10 w-10 place-items-center rounded-lg transition hover:bg-[#f5f7fb]"
          to="/notifications"
        >
          <Notification />
          {unreadNotificationsCount > 0 ? (
            <Typography as="span" variant="body" size="medium" weight="regular"
              aria-hidden="true"
              className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ef1f1f] ring-2 ring-white"
            />
          ) : null}
        </RouteLink>

        <ProfileBox avatarUrl={avatarUrl} name={profileName} />

        <RouteLink
          className="flex items-center gap-4 rounded-xl bg-[#0048c4] px-4 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-[#003ba1]"
          to="/new-ad"
        >
          <Typography as="span" variant="body" size="medium" weight="regular" aria-hidden="true">+</Typography>
          ثبت آگهی
        </RouteLink>
      </div>
    </header>
  );
}

function ProfileBox({ avatarUrl, name }: { avatarUrl: string; name: string }) {
  const [hasImageError, setHasImageError] = useState(false);
  const showAvatar = avatarUrl && !hasImageError;

  return (
    <div className="flex max-w-[220px] items-center gap-2 font-medium text-[#1a1a1a]">
      {showAvatar ? (
        <img
          className="h-6 w-6 shrink-0 rounded-full object-cover"
          src={avatarUrl}
          alt={name}
          onError={() => setHasImageError(true)}
        />
      ) : (
        <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e0e0e0] text-[#808080]">
          <LinearUserSolid className="h-4 w-4" />
        </Typography>
      )}
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 min-w-0 truncate text-sm">{name}</Typography>
    </div>
  );
}

function Notification() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M17.4727 9.63184C17.4727 6.33779 14.9779 3.75 12 3.75C9.02208 3.75 6.52734 6.3378 6.52734 9.63184V13.4199C6.52725 13.6103 6.45539 13.7937 6.3252 13.9326L5.00781 15.3369C4.8478 15.5075 4.75 15.7485 4.75 16.0088C4.75019 16.5656 5.16254 16.9345 5.57227 16.9346H18.4277C18.8375 16.9345 19.2498 16.5655 19.25 16.0088C19.25 15.7485 19.1522 15.5075 18.9922 15.3369L17.6748 13.9326C17.5446 13.7937 17.4728 13.6103 17.4727 13.4199V9.63184ZM9.74219 18.4346C10.0423 19.508 10.9671 20.25 12 20.25C13.0329 20.25 13.9577 19.508 14.2578 18.4346H9.74219ZM18.9727 13.1221L20.0859 14.3105H20.0869C20.5164 14.7685 20.75 15.3804 20.75 16.0088C20.7498 17.3026 19.7544 18.4345 18.4277 18.4346H15.7939C15.4624 20.2921 13.9239 21.75 12 21.75C10.0761 21.75 8.53765 20.2921 8.20605 18.4346H5.57227C4.24552 18.4345 3.25019 17.3026 3.25 16.0088C3.25 15.3805 3.48358 14.7686 3.91309 14.3105H3.91406L5.02734 13.1221V9.63184C5.02734 5.60084 8.10505 2.25 12 2.25C15.895 2.25 18.9727 5.60083 18.9727 9.63184V13.1221Z" fill="#4D4D4D" />
    </svg>
  );
}

function Rocket() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8.26908 5.14636C11.8185 1.46383 15.5034 1.49644 17.3576 2.34118C17.4976 2.40502 17.6092 2.51846 17.6709 2.65938C18.496 4.54443 18.5317 8.31838 14.8649 11.9554C15.7136 13.6524 15.3778 15.148 14.7998 16.2133C14.4956 16.774 14.1271 17.2156 13.8371 17.5153C13.6914 17.666 13.5629 17.7833 13.4693 17.8645C13.4224 17.9051 13.3841 17.9372 13.3562 17.9597C13.3422 17.9709 13.3304 17.9799 13.322 17.9865C13.3178 17.9897 13.3141 17.9926 13.3114 17.9947C13.3102 17.9956 13.3091 17.9964 13.3081 17.9971L13.3065 17.9979L13.3057 17.9987C13.0853 18.1649 12.7866 18.1647 12.5684 18.0101L12.4805 17.9353L9.68835 15.0552V15.0544L5.17826 10.4548L2.06058 7.37048C1.8413 7.15357 1.81287 6.80887 1.99385 6.55912L2.50004 6.92614C2.04007 6.59282 1.99832 6.56212 1.99467 6.55912V6.5583L1.99548 6.55668C1.99622 6.55566 1.99771 6.55482 1.99873 6.55342C2.00083 6.55058 2.00361 6.54639 2.00687 6.54203C2.01333 6.53341 2.02202 6.52192 2.03291 6.50785C2.0552 6.47906 2.08693 6.4391 2.12732 6.39066C2.20796 6.29394 2.32476 6.16118 2.47481 6.01061C2.77296 5.71146 3.21289 5.33038 3.77282 5.01859C4.89089 4.39604 6.48171 4.06322 8.26908 5.14636ZM13.89 12.8409C13.1099 13.4958 12.2017 14.1404 11.1467 14.7631L12.955 16.6275C13.1875 16.3847 13.4714 16.041 13.7012 15.6175C14.0902 14.9006 14.3295 13.9588 13.89 12.8409ZM4.59151 11.5314C4.83559 11.2875 5.23126 11.2874 5.4753 11.5314C5.71925 11.7755 5.71921 12.1712 5.4753 12.4152C5.12144 12.7691 4.47212 13.8413 4.79089 15.2082C6.15816 15.5274 7.23075 14.8785 7.58467 14.5246C7.82876 14.2807 8.22443 14.2806 8.46846 14.5246C8.71244 14.7686 8.71237 15.1643 8.46846 15.4084C7.85084 16.026 6.16602 17.0007 4.08695 16.3077C3.90047 16.2454 3.75443 16.0987 3.69226 15.9121L4.2847 15.7152L4.28389 15.7144L3.69226 15.9121C2.99939 13.8332 3.97393 12.149 4.59151 11.5314ZM16.613 3.38692C15.1304 2.84566 11.9916 2.84923 8.82491 6.38334C8.00446 7.29903 7.18225 8.45508 6.38757 9.90222L10.2474 13.8402C11.6488 13.0376 12.771 12.208 13.6621 11.3793C17.1456 8.13959 17.1523 4.91419 16.613 3.38692ZM13.7175 7.23701C13.7175 6.71016 13.2898 6.28242 12.7629 6.28242C12.2362 6.28258 11.8091 6.71025 11.8091 7.23701C11.8093 7.76364 12.2363 8.19063 12.7629 8.19079C13.2897 8.19079 13.7173 7.76373 13.7175 7.23701ZM7.42191 6.10257C6.18253 5.43742 5.15035 5.68218 4.38073 6.11071C3.95117 6.34994 3.60305 6.64992 3.36023 6.89359C3.35955 6.89427 3.35846 6.89454 3.35778 6.89522L5.46797 8.98262C6.10026 7.86925 6.75592 6.91603 7.42191 6.10257ZM14.9675 7.23701C14.9673 8.45408 13.98 9.44079 12.7629 9.44079C11.5459 9.44063 10.5593 8.45398 10.5591 7.23701C10.5591 6.01991 11.5458 5.03258 12.7629 5.03242C13.9801 5.03242 14.9675 6.01981 14.9675 7.23701Z" fill="#4D4D4D" />
    </svg>
  );
}

function Steps() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.875 15.7357V3.38216C16.8749 3.24018 16.7598 3.1251 16.6178 3.125H13.9705C13.8285 3.12503 13.7135 3.24013 13.7134 3.38216V6.02946C13.7134 6.37457 13.4335 6.65438 13.0884 6.65446H10.4411C10.299 6.65451 10.184 6.76958 10.1839 6.91162V9.55892C10.1839 9.90402 9.90402 10.1839 9.55892 10.1839H6.91162C6.76958 10.184 6.65451 10.299 6.65446 10.4411V13.0884C6.65438 13.4335 6.37457 13.7134 6.02946 13.7134H3.38216C3.24013 13.7135 3.12503 13.8285 3.125 13.9705V16.6178C3.1251 16.7598 3.24018 16.8749 3.38216 16.875H15.7357C16.3648 16.8748 16.8748 16.3648 16.875 15.7357ZM18.125 15.7357C18.1248 17.0552 17.0552 18.1248 15.7357 18.125H3.38216C2.54984 18.1249 1.8751 17.4502 1.875 16.6178V13.9705C1.87503 13.1381 2.54979 12.4635 3.38216 12.4634H5.40446V10.4411C5.40451 9.60866 6.07924 8.934 6.91162 8.93392H8.93392V6.91162C8.934 6.07924 9.60866 5.40451 10.4411 5.40446H12.4634V3.38216C12.4635 2.54979 13.1381 1.87503 13.9705 1.875H16.6178C17.4502 1.8751 18.1249 2.54984 18.125 3.38216V15.7357Z" fill="#4D4D4D" />
    </svg>
  );
}

function Sale() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.875 3.125H10.3239C10.0748 3.12504 9.83602 3.224 9.6598 3.40007L3.40003 9.65983C3.03327 10.0268 3.03313 10.6219 3.40003 10.9888L9.0112 16.5999C9.37811 16.9668 9.97314 16.9667 10.3401 16.5999L16.5999 10.3402C16.776 10.164 16.8749 9.92515 16.875 9.67611V3.125ZM6.08802 10.6828C6.33204 10.4388 6.72772 10.4389 6.97181 10.6828L9.31963 13.0298C9.56358 13.2737 9.56334 13.6695 9.31963 13.9136C9.07556 14.1577 8.67911 14.1585 8.43503 13.9144L6.08802 11.5666C5.84412 11.3225 5.84403 10.9268 6.08802 10.6828ZM14.1349 6.41195C14.1348 6.10902 13.8893 5.86346 13.5864 5.86344C13.2835 5.86344 13.0379 6.10901 13.0379 6.41195C13.0379 6.71493 13.2834 6.96045 13.5864 6.96045C13.8894 6.96043 14.1349 6.71492 14.1349 6.41195ZM18.125 9.67611C18.1249 10.2568 17.8943 10.8141 17.4837 11.2248L11.2239 17.4837C10.3688 18.3386 8.98247 18.3388 8.12741 17.4837L2.51624 11.8726C1.66119 11.0175 1.66131 9.6312 2.51624 8.77604L8.77601 2.51628C9.18663 2.10581 9.74328 1.87504 10.3239 1.875H17.5C17.8451 1.875 18.125 2.15482 18.125 2.5V9.67611ZM15.3849 6.41195C15.3849 7.40529 14.5797 8.21043 13.5864 8.21045C12.5931 8.21045 11.7879 7.4053 11.7879 6.41195C11.7879 5.41864 12.5931 4.61344 13.5864 4.61344C14.5797 4.61346 15.3848 5.41865 15.3849 6.41195Z" fill="#4D4D4D" />
    </svg>
  );
}
