import TonalInstagram from "../../../../shared/icons/TonalInstagram";
import TonalTelegram from "../../../../shared/icons/TonalTelegram";
import TonalWhatsapp from "../../../../shared/icons/TonalWhatsapp";

export function PhoneIcon({ className = "" }: { className?: string }) {
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
      <path d="M6.6 4.8 9 4.2l2.1 4.8-1.5 1.1a11.2 11.2 0 0 0 4.3 4.3L15 12.9l4.8 2.1-.6 2.4c-.3 1.2-1.4 2-2.6 1.8C10.2 18.2 5.8 13.8 4.8 7.4 4.6 6.2 5.4 5.1 6.6 4.8Z" />
    </svg>
  );
}

export function MessageIcon({ className = "" }: { className?: string }) {
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
      <path d="M5 18.5V20l3.1-1.6A8 8 0 1 0 4 11.5c0 2.6 1.2 4.9 3.1 6.4" />
      <path d="M8.5 12h7" />
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
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

export function SocialIcon({ type }: { type: "instagram" | "telegram" | "whatsapp" }) {
  if (type === "instagram") return <TonalInstagram className="h-8 w-8" />;
  if (type === "telegram") return <TonalTelegram className="h-8 w-8" />;
  return <TonalWhatsapp className="h-8 w-8" />;
}
