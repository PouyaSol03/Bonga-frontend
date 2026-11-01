import { Typography } from "../../../shared/ui/Typography";
import { advertiseStatusLabel } from "./advertiseFormatters";

export function StatusBadge({ status }: { status: unknown }) {
  const key = String(status ?? "")
    .trim()
    .toLowerCase();
  const tone =
    key === "accepted" || key === "3"
      ? "bg-[#ebfaf3] text-[#0b8b55]"
      : key === "wait_for_payment" || key === "0" || key === "incomplete" || key === "نیمه کاره"
        ? "bg-[#fff3e8] text-[#ff6d00]"
        : key === "wait_for_admin" || key === "wait_for_agency" || key === "1" || key === "2"
          ? "bg-[#fff7df] text-[#a06a00]"
          : "bg-[#fff0f0] text-[#cc3342]";

  return (
    <Typography
      as="span"
      variant="label"
      size="medium"
      weight="semibold"
      className={`inline-flex min-w-[82px] justify-center rounded-full px-2.5 py-1.5 text-sm font-bold ${tone}`}
    >
      {advertiseStatusLabel(status)}
    </Typography>
  );
}

export function UserStatusBadge({ status }: { status: unknown }) {
  const isActive = Number(status) === 1;
  return (
    <Typography
      as="span"
      variant="label"
      size="medium"
      weight="semibold"
      className={`inline-flex min-w-[78px] justify-center rounded-full px-2.5 py-1.5 text-sm font-bold ${isActive ? "bg-[#ebfaf3] text-[#0b8b55]" : "bg-[#fff0f0] text-[#cc3342]"}`}
    >
      {isActive ? "فعال" : "غیرفعال"}
    </Typography>
  );
}
