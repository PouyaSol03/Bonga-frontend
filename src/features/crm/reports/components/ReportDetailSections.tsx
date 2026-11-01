import type { ReactNode } from "react";
import LinearCancel from "../../../../shared/icons/LinearCancel";
import LinearFlag from "../../../../shared/icons/LinearFlag";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";

export function ReportModalHeader({
  code,
  onClose,
}: {
  code: string;
  onClose: () => void;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-[#edf0f5] px-5 py-4">
      <div className="flex items-center gap-3">
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]"
        >
          <LinearFlag className="h-5 w-5" />
        </Typography>
        <div>
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 text-base font-black text-[#263042]"
          >
            جزئیات گزارش تخلف
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="m-0 mt-1 text-sm text-[#8a94a3]"
          >
            کد گزارش: {code}
          </Typography>
        </div>
      </div>
      <Button
        unstyled
        aria-label="بستن"
        className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f5f8] text-[#596477] transition hover:bg-[#e9edf3]"
        onClick={onClose}
        type="button"
      >
        <LinearCancel className="h-5 w-5" />
      </Button>
    </header>
  );
}

export function ReportModalFooter({ onClose }: { onClose: () => void }) {
  return (
    <footer className="flex shrink-0 justify-end border-t border-[#edf0f5] px-5 py-4">
      <Button
        unstyled
        className="h-10 rounded-xl bg-[#0048c4] px-5 text-sm font-bold text-white"
        onClick={onClose}
        type="button"
      >
        بستن
      </Button>
    </footer>
  );
}

export function DetailsSection({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-xl border border-[#edf0f5] bg-[#fbfcfe] p-4">
      <div className="mb-3 flex items-center gap-2 text-[#344054]">
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="text-[#0048c4]"
        >
          {icon}
        </Typography>
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="semibold"
          className="m-0 text-sm font-black"
        >
          {title}
        </Typography>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function DetailItem({
  label,
  ltr = false,
  value,
  wide = false,
}: {
  label: string;
  ltr?: boolean;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-lg bg-white px-3 py-2.5 ${wide ? "sm:col-span-2" : ""}`}>
      <Typography
        as="span"
        variant="label"
        size="small"
        weight="semibold"
        className="block text-xs font-semibold text-[#8a94a3]"
      >
        {label}
      </Typography>
      <strong
        className={`mt-1 block text-sm leading-7 font-bold break-words text-[#303846] ${
          ltr ? "text-left [direction:ltr]" : ""
        }`}
      >
        {value}
      </strong>
    </div>
  );
}
