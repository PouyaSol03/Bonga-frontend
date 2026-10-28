import { type ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "../../../shared/ui/Button";
import { primaryButtonClassName } from "./constants";
import type { IconName } from "./types";
import { CrmIcon } from "./CrmIcon";

export function PrimaryButton({
  disabled = false,
  icon,
  label,
  onClick,
}: {
  disabled?: boolean;
  icon: IconName;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      unstyled
      className={primaryButtonClassName}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <CrmIcon name={icon} size={18} />
      {label}
    </Button>
  );
}

export function SmallActionButton({
  disabled = false,
  icon,
  label,
  onClick,
  tone = "default",
}: {
  disabled?: boolean;
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  tone?: "danger" | "default" | "primary" | "success" | "warning";
}) {
  const classes = {
    danger: "border-[#f1c7cc] bg-[#fff7f8] text-[#c63242] hover:bg-[#fff0f1]",
    default: "border-[#d8e1ef] bg-white text-[#3e5d88] hover:border-[#b8c9e2] hover:bg-[#f8faff]",
    primary:
      "border-[#c9daf8] bg-[#eef4ff] text-[#0048c4] hover:border-[#0048c4] hover:bg-[#e3edff]",
    success: "border-[#bfe6d2] bg-[#f5fcf8] text-[#087d4b] hover:bg-[#ebfaf3]",
    warning: "border-[#f0ddb1] bg-[#fffaf0] text-[#9b6800] hover:bg-[#fff5da]",
  }[tone];

  return (
    <Button
      unstyled
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-bold whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-50 ${classes}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </Button>
  );
}

export function TextLink({ label, to }: { label: string; to: string }) {
  return (
    <Link
      className="inline-flex items-center gap-1 text-sm font-bold text-[#0048c4] no-underline"
      to={to}
    >
      {label}
      <CrmIcon name="arrow" size={15} />
    </Link>
  );
}
