import type { ReactNode } from "react";

export function SvgIcon({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  );
}

export function ReceiptIcon() {
  return (
    <SvgIcon>
      <path d="M6 3h12v18l-2.2-1.5L13.9 21 12 19.5 10.1 21l-1.9-1.5L6 21V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </SvgIcon>
  );
}

export function CheckIcon() {
  return (
    <SvgIcon>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.7 2.7L16.5 9" />
    </SvgIcon>
  );
}

export function ClockIcon() {
  return (
    <SvgIcon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </SvgIcon>
  );
}

export function CloseIcon() {
  return (
    <SvgIcon>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6m0-6-6 6" />
    </SvgIcon>
  );
}

export function FilterIcon() {
  return (
    <SvgIcon size={18}>
      <path d="M4 6h16M7 12h10m-7 6h4" />
    </SvgIcon>
  );
}

export function CalendarIcon() {
  return (
    <SvgIcon size={18}>
      <rect height="16" rx="2" width="17" x="3.5" y="5" />
      <path d="M8 3v4m8-4v4M3.5 10h17" />
    </SvgIcon>
  );
}

export function InfoIcon() {
  return (
    <SvgIcon size={16}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-8h.01" />
    </SvgIcon>
  );
}

export function ClosePlainIcon() {
  return (
    <SvgIcon size={18}>
      <path d="m7 7 10 10M17 7 7 17" />
    </SvgIcon>
  );
}
