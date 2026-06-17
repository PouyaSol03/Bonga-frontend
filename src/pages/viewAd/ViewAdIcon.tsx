import type { IconName } from "./viewAdTypes";

function PublicIcon({ className, src }: { className: string; src: string }) {
  return <img alt="" aria-hidden="true" className={`${className} object-contain`} src={src} />;
}

export function ViewAdIcon({
  className = "",
  filled = false,
  name,
}: {
  className?: string;
  filled?: boolean;
  name: IconName;
}) {
  const common = {
    className: `h-6 w-6 shrink-0 ${className}`,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "add":
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "album":
      return <svg {...common}><rect width="15" height="15" x="5" y="4" rx="2" /><path d="M3 8v10a2 2 0 0 0 2 2h10" /></svg>;
    case "apartment":
      return <svg {...common}><path d="M7 21V4h10v17M10 8h4M10 12h4M10 16h4" /></svg>;
    case "area":
      return <svg {...common}><path d="M4 4h7v4H8v3H4V4ZM13 13h7v7h-7v-7Z" /><path d="M17 13V9h-4M13 17H9v-4" /></svg>;
    case "attachment":
      return <svg {...common}><path d="m8.5 12.5 5.8-5.8a3 3 0 1 1 4.2 4.2l-7.6 7.6a5 5 0 0 1-7.1-7.1l7.7-7.7" /></svg>;
    case "arrowLeft":
      return <svg {...common}><path d="m15 6-6 6 6 6" /></svg>;
    case "arrowDown":
      return <svg {...common}><path d="m6 9 6 6 6-6" /></svg>
    case "arrowUp":
      return <svg {...common}><path d="m6 15 6-6 6 6" /></svg>
    case "back":
      return <svg {...common}><path d="M4 12h16M14 6l6 6-6 6" /></svg>;
    case "bed":
      return <svg {...common}><path d="M4 11V6M20 14H4M20 18v-4a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v4M8 11V9h5v2" /></svg>;
    case "bookmark":
      if (filled) {
        return <PublicIcon className={common.className} src="/icons/bookmark_solid.svg" />;
      }

      return (
        <svg {...common}>
          <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z" />
        </svg>
      );
    case "building":
      return <svg {...common}><path d="M6 21V4h10v17M10 8h2M10 12h2M10 16h2M16 10h2v11" /></svg>;
    case "cabinet":
      return <svg {...common}><path d="M4 6h16v14H4V6ZM4 11h16M12 6v14M8 14h.01M16 14h.01" /></svg>;
    case "calendar":
      return <svg {...common}><path d="M8 3v4M16 3v4M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /></svg>;
    case "ceramic":
      return <svg {...common}><path d="M4 7h7v5H4V7ZM13 7h7v5h-7V7ZM4 14h7v3H4v-3ZM13 14h7v3h-7v-3Z" /></svg>;
    case "chat":
      return <PublicIcon className={common.className} src="/icons/chat.svg" />;
    case "checklist":
      return <svg {...common}><rect width="15" height="17" x="5" y="4" rx="2" /><path d="m8 9 1.5 1.5L12 8M14 10h3M8 15l1.5 1.5L12 14M14 16h3" /></svg>;
    case "cooler":
      return <svg {...common}><rect width="18" height="8" x="3" y="4" rx="2" /><path d="M8 17v2M12 17v2M16 17v2M8 12c0 2 8 2 8 0" /></svg>;
    case "document":
      return <svg {...common}><path d="M6 3h8l4 4v14H6V3ZM14 3v5h5M9 13h6M9 17h4" /></svg>;
    case "elevator":
      return <svg {...common}><rect width="14" height="18" x="5" y="3" rx="1.5" /><path d="M12 6v12M8.5 11l-2 2-2-2M15.5 13l2-2 2 2" /></svg>;
    case "exchange":
      return <svg {...common}><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>;
    case "floor":
      return <svg {...common}><path d="M6 21V4h12v17M9 8h6M9 12h6M9 16h6M4 21h16" /></svg>;
    case "info":
      return <svg {...common}><path d="M12 3 21 8v8l-9 5-9-5V8l9-5Z" /><path d="M12 10v6M12 7.5h.01" /></svg>;
    case "loan":
      return <svg {...common}><path d="M4 10h16v8H4v-8ZM7 10V7a5 5 0 0 1 10 0v3M8 14h.01M16 14h.01" /></svg>;
    case "location":
      return <svg {...common}><path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></svg>;
    case "money":
      return <svg {...common}><rect width="18" height="10" x="3" y="7" rx="2" /><path d="M7 12h.01M17 12h.01M12 9.5a2.5 2.5 0 1 1 0 5" /></svg>;
    case "more":
      return <svg {...common}><path d="M12 6h.01M12 12h.01M12 18h.01" /></svg>;
    case "navigation":
      return <svg {...common}><path d="m12 3 7 18-7-4-7 4 7-18Z" /></svg>;
    case "note":
      return <PublicIcon className={common.className} src="/icons/note_add.svg" />;
    case "parking":
      return <svg {...common}><path d="M5 21V7l7-4 7 4v14M8 16h8M8 16l1.5-5h5l1.5 5M9 18h.01M15 18h.01" /></svg>;
    case "payment":
      return <svg {...common}><rect width="18" height="11" x="3" y="7" rx="2" /><path d="M3 10h18M7 15h4" /></svg>;
    case "radiator":
      return <svg {...common}><path d="M5 10h14v9H5v-9ZM8 10V6M12 10V6M16 10V6M7 19v2M17 19v2M8 15h8" /></svg>;
    case "ruler":
      return <svg {...common}><path d="M4 17 17 4l3 3L7 20l-3-3ZM8 13l3 3M11 10l2 2M14 7l3 3" /></svg>;
    case "share":
      return <PublicIcon className={common.className} src="/icons/share.svg" />;
    case "ranking":
      return <PublicIcon className={common.className} src="/icons/ranking.svg" />;
    case "star":
      return <PublicIcon className={common.className} src="/icons/star.svg" />;
    case "terrace":
      return <svg {...common}><path d="M5 21v-7h14v7M4 10l8-7 8 7H4ZM9 21v-7M15 21v-7" /></svg>;
    case "tooman":
      return <svg {...common}><path d="M6 7h12M9 7v10M15 7v10M5 17h14" /></svg>;
    case "underfloorHeating":
      return <svg {...common}><path d="M4 15c2.5-3 5.5 3 8 0s5.5 3 8 0M7 4v6M12 4v6M17 4v6" /></svg>;
    case "video":
      return <svg {...common}><path d="M4 8h10v8H4zM14 11l6-3v8l-6-3" /></svg>;
    case "warehouse":
      return <svg {...common}><path d="M4 21V9l8-5 8 5v12M8 21v-8h8v8M8 13h8M10 17h4" /></svg>;
    case "waterCooler":
      return <svg {...common}><path d="M6 4h12v16H6V4ZM9 8h6M9 12h6M9 16h3" /></svg>;
    case "waterHeater":
      return <svg {...common}><rect width="10" height="17" x="7" y="3" rx="2" /><circle cx="12" cy="13" r="2.5" /><path d="M10 21v-1M14 21v-1" /></svg>;
    case "yard":
      return <svg {...common}><path d="M12 21V10M7 14c-2-1-3-3-3-5 4 0 6 2 8 5M17 14c2-1 3-3 3-5-4 0-6 2-8 5M8 21h8" /></svg>;
    default:
      return null;
  }
}
