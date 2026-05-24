export function FilterIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 7h5M15 7h5M4 17h11M19 17h1" />
      <rect height="6" rx="1.5" width="6" x="9" y="4" />
      <rect height="6" rx="1.5" width="4" x="15" y="14" />
    </svg>
  );
}

export function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m20 20-4.5-4.5" />
      <circle cx="10.5" cy="10.5" r="7" />
    </svg>
  );
}

export function AnalyticsIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <rect height="17" rx="2" width="16" x="4" y="3" />
      <path d="M8 16V12M12 16V8M16 16v-5M7 18h10" />
    </svg>
  );
}

export function StatisticsIcon({
  className = "",
  icon,
}: {
  className?: string;
  icon: "call" | "chat" | "display" | "view";
}) {
  if (icon === "chat") {
    return (
      <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
        <path d="M5 4.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4.5 3v-3H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M8 9h8M8 13h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      </svg>
    );
  }

  if (icon === "call") {
    return (
      <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
        <path d="M6.25 3.5h3l1.25 5-2 1.75a13.5 13.5 0 0 0 5.25 5.25l1.75-2 5 1.25v3A2.25 2.25 0 0 1 18.25 20C10.38 20 4 13.62 4 5.75A2.25 2.25 0 0 1 6.25 3.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    );
  }

  if (icon === "display") {
    return (
      <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
        <rect height="16" rx="2" stroke="currentColor" strokeWidth="1.7" width="14" x="3" y="3.5" />
        <path d="M6.5 9h7M6.5 12.5h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        <circle cx="16.5" cy="15.5" r="3.25" fill="white" stroke="currentColor" strokeWidth="1.7" />
        <path d="m19 18 2 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M2.75 12s3.5-6 9.25-6 9.25 6 9.25 6-3.5 6-9.25 6-9.25-6-9.25-6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m8 10 4 4 4-4" />
    </svg>
  );
}

export function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m14 7-5 5 5 5" />
    </svg>
  );
}

export function AllocationIcon({
  className = "",
  icon,
}: {
  className?: string;
  icon: "edit" | "preview";
}) {
  if (icon === "preview") {
    return (
      <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
        <rect height="13" rx="1.5" width="17" x="3.5" y="4" />
        <path d="m8 11 2 2 5-5M12 17v3M8.5 20h7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M4.5 19.5h4l10-10a2.1 2.1 0 0 0-4-4l-10 10v4ZM13.5 6.5l4 4M19 15v5H4" />
    </svg>
  );
}

export function TagIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3.5 12.5 12 4h7.5v7.5L11 20 3.5 12.5Z" />
      <circle cx="16" cy="8" r="1.5" />
    </svg>
  );
}

export function PaymentOptionIcon({
  className = "",
  icon,
}: {
  className?: string;
  icon: "credit" | "online" | "wallet";
}) {
  if (icon === "online") {
    return (
      <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 28 28">
        <path d="M5 8 14 3l9 5v11l-9 5-9-5V8Z" fill="#eb3455" />
        <path d="M14 6v16M8 10l6 3 6-3M8 18l6-3 6 3" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="14" cy="14" fill="#f7a800" r="3.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={`${className} text-[#4d4d4d]`} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 28 28">
      {icon === "credit" ? (
        <>
          <path d="M4 10h19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14" />
          <path d="M19 6v4M19 6l-9 4M20 16h2" />
        </>
      ) : (
        <>
          <path d="M6 10h17a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h13" />
          <path d="M19 6v4M19 6l-9 4M20 16h2" />
        </>
      )}
    </svg>
  );
}

export function PublishedActionIcon({
  className = "",
  icon,
}: {
  className?: string;
  icon: "delete" | "edit" | "history" | "preview" | "upgrade";
}) {
  if (icon === "delete") {
    return (
      <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 10v7M14 10v7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === "upgrade") {
    return (
      <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="m5 16 6-6 4 4 5-7M15 7h5v5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === "history") {
    return (
      <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path d="M7 3h10v18l-5-2.5L7 21V3Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.8 9.2c-.4-.5-1-.7-1.8-.7-.9 0-1.6.5-1.6 1.2 0 1.8 3.5.8 3.5 2.8 0 .7-.7 1.2-1.7 1.2-.8 0-1.5-.3-2-.8M12.1 7.4v7.4" strokeLinecap="round" />
      </svg>
    );
  }

  return <AllocationIcon className={className} icon={icon} />;
}

export function CardSpriteIcon({ icon }: { icon: "area" | "rooms" | "tooman" | "year" }) {
  const positions = {
    area: "-308px -267.302px",
    rooms: "-222px -267.302px",
    tooman: "-212px -233.302px",
    year: "-140px -267.302px",
  };

  return (
    <span
      aria-hidden="true"
      className="inline-block h-5 w-5 shrink-0 bg-no-repeat"
      style={{
        backgroundImage: "url('/figma/account/consultant-ad-card-1.png')",
        backgroundPosition: positions[icon],
        backgroundSize: "328px 355.302px",
      }}
    />
  );
}
