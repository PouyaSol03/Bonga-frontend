import { Typography } from "../../../shared/ui/Typography";
import { CrmIcon } from "./CrmIcon";
import type { ToastState } from "./types";

export function Toast({ toast }: { toast: ToastState }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[100] flex min-w-[320px] -translate-x-1/2 items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-[0_18px_60px_rgba(18,38,72,0.2)] ${toast.tone === "error" ? "border-[#f2c8cd]" : "border-[#c6e8d7]"}`}
      dir="rtl"
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`grid h-8 w-8 place-items-center rounded-xl ${toast.tone === "error" ? "bg-[#fff0f0] text-[#cc3342]" : "bg-[#ebfaf3] text-[#0b8b55]"}`}
      >
        <CrmIcon name={toast.tone === "error" ? "warning" : "check"} size={18} />
      </Typography>
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="semibold"
        className="text-sm font-semibold text-[#3a4558]"
      >
        {toast.message}
      </Typography>
    </div>
  );
}
