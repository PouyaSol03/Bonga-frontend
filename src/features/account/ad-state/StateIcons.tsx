import LinearAnalytics from "../../../shared/icons/LinearAnalytics";
import LinearCall from "../../../shared/icons/LinearCall";
import LinearCancel from "../../../shared/icons/LinearCancel";
import LinearChartUp from "../../../shared/icons/LinearChartUp";
import LinearChat from "../../../shared/icons/LinearChat";
import LinearDelete from "../../../shared/icons/LinearDelete";
import LinearEdit2 from "../../../shared/icons/LinearEdit2";
import LinearFactor from "../../../shared/icons/LinearFactor";
import LinearFlag from "../../../shared/icons/LinearFlag";
import LinearPayment from "../../../shared/icons/LinearPayment";
import LinearPreview from "../../../shared/icons/LinearPreview";
import "../../advertisements/components/AdCard.css";
import type { StateActionKey } from "./types";

export function StateIcon({ icon }: { icon: StateActionKey }) {
  if (icon === "preview") return <LinearPreview className="h-6 w-6" />;
  if (icon === "edit") return <LinearEdit2 className="h-6 w-6" />;
  if (icon === "delete") return <LinearDelete className="h-6 w-6" />;
  if (icon === "upgrade") return <LinearChartUp className="h-6 w-6" />;
  if (icon === "payment") return <LinearPayment className="h-6 w-6" />;
  if (icon === "result") return <LinearFlag className="h-6 w-6" />;
  if (icon === "stats") return <LinearAnalytics className="h-6 w-6" />;
  if (icon === "call") return <LinearCall className="h-6 w-6" />;
  if (icon === "chat") return <LinearChat className="h-6 w-6" />;
  if (icon === "stop_publish") return <LinearCancel className="h-6 w-6" />;

  return <LinearFactor className="h-6 w-6" />;
}

export function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m14 7-5 5 5 5" />
    </svg>
  );
}

export function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function AlertIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M10.35 4.4 2.8 17.5A2 2 0 0 0 4.55 20.5h14.9a2 2 0 0 0 1.75-3L13.65 4.4a1.9 1.9 0 0 0-3.3 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}
