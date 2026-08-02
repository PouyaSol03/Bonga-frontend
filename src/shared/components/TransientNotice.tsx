import { Typography } from "../ui/Typography";

export function TransientNotice({
  message,
  className = "bottom-20",
}: {
  message: string | null;
  className?: string;
}) {
  return (
    <div
      aria-live="polite"
      className={`pointer-events-none absolute inset-x-4 z-[70] flex justify-center ${
        message ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${className}`}
      role="status"
    >
      <Typography as="span" variant="label" size="medium" weight="medium" className="rounded-xl bg-[#1a1a1a] px-4 py-2.5 text-center text-sm font-medium leading-5 text-white shadow-[0_6px_18px_rgba(26,26,26,0.22)]">
        {message ?? ""}
      </Typography>
    </div>
  );
}
