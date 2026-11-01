import LinearFlag from "../../../shared/icons/LinearFlag";
import LinearRequestList from "../../../shared/icons/LinearRequestList";
import type { IconName } from "./types";

export function CrmIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    fill: "none",
    height: size,
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    width: size,
  };

  if (name === "home")
    return (
      <svg {...common}>
        <path d="M3 10.8 12 3l9 7.8" />
        <path d="M5.5 9.8V21h13V9.8" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
    );
  if (name === "ads")
    return (
      <svg {...common}>
        <path d="M4 6.5h16v11H4z" />
        <path d="M8 17.5V20m8-2.5V20M8 10h5m-5 3h8" />
        <path d="M7 3.5h10" />
      </svg>
    );
  if (name === "users")
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.4-3.4 2.3-5 5.5-5s5.1 1.6 5.5 5" />
        <circle cx="17" cy="9" r="2.2" />
        <path d="M15.5 14.5c2.9-.6 4.6.8 5 3.5" />
      </svg>
    );
  if (name === "building")
    return (
      <svg {...common}>
        <path d="M4 21V7l8-4v18M12 9h8v12M7.5 9.5h1m-1 4h1m-1 4h1m7-5h1m-1 4h1" />
        <path d="M2 21h20" />
      </svg>
    );
  if (name === "category")
    return (
      <svg {...common}>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    );
  if (name === "location")
    return (
      <svg {...common}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  if (name === "form")
    return (
      <svg {...common}>
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M15 3v5h4M9 12h6m-6 4h6" />
      </svg>
    );
  if (name === "wallet")
    return (
      <svg {...common}>
        <path d="M4 6h15a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h12" />
        <path d="M16 11h5v4h-5a2 2 0 0 1 0-4Z" />
      </svg>
    );
  if (name === "payment")
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18M7 15h4" />
        <circle cx="17" cy="14" r="1.5" />
      </svg>
    );
  if (name === "reports") return <LinearFlag aria-hidden="true" height={size} width={size} />;
  if (name === "requests")
    return <LinearRequestList aria-hidden="true" height={size} width={size} />;
  if (name === "settings")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </svg>
    );
  if (name === "support")
    return (
      <svg {...common}>
        <path d="M4 5h16v11H8l-4 4z" />
        <path d="M8 9h8m-8 3h5" />
        <path d="M18 18.5a2.5 2.5 0 0 0 2.5 2.5" />
      </svg>
    );
  if (name === "account")
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21c.5-4.3 2.8-6.5 7-6.5s6.5 2.2 7 6.5" />
      </svg>
    );
  if (name === "refresh")
    return (
      <svg {...common}>
        <path d="M20 7v5h-5" />
        <path d="M18.7 16a8 8 0 1 1 .8-7" />
      </svg>
    );
  if (name === "plus")
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  if (name === "search")
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
    );
  if (name === "filter")
    return (
      <svg {...common}>
        <path d="M4 6h16M7 12h10m-7 6h4" />
        <circle cx="8" cy="6" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (name === "arrow")
    return (
      <svg {...common}>
        <path d="m9 6 6 6-6 6" />
      </svg>
    );
  if (name === "close")
    return (
      <svg {...common}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    );
  if (name === "save")
    return (
      <svg {...common}>
        <path d="M5 4h12l2 2v14H5z" />
        <path d="M8 4v6h8V4M8 20v-6h8v6" />
      </svg>
    );
  if (name === "warning")
    return (
      <svg {...common}>
        <path d="M10.2 4.2 2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.8 4.2a2 2 0 0 0-3.6 0Z" />
        <path d="M12 9v4m0 4h.01" />
      </svg>
    );
  if (name === "check")
    return (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  if (name === "desktop")
    return (
      <svg {...common}>
        <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
        <path d="M8 21h8m-4-4.5V21" />
      </svg>
    );
  if (name === "empty")
    return (
      <svg {...common}>
        <path d="M4 6h16v14H4z" />
        <path d="M8 3h8v3M8 11h8m-8 4h5" />
      </svg>
    );

  return null;
}
