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
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M22.1748 18.4766C22.1748 18.565 22.1603 18.7133 22.083 18.8643L22.0781 18.873C22.0259 18.9623 21.9449 19.0782 21.8057 19.1494L21.8066 19.1514L16.7422 21.9844H16.7412C16.5207 22.1055 16.2437 22.187 15.9141 22.1602V22.1592C15.656 22.145 15.3648 22.066 15.0664 21.9014L15.0645 21.9004L13.498 21.0117V21.0107L13.3223 20.9199L13.0234 20.7646L13.3223 20.6094L13.499 20.5166L19.2666 17.2695L19.2764 17.2637C19.3343 17.2352 19.3745 17.1921 19.415 17.1328C19.4393 17.097 19.457 17.0385 19.457 16.9707C19.4569 16.9031 19.4392 16.8453 19.415 16.8096L19.4102 16.8018C19.3904 16.7697 19.3505 16.7288 19.2949 16.6924L15.916 14.7881L15.8311 14.7412L15.6982 14.668L15.7529 14.5254L15.7891 14.4307C15.9602 13.9783 16.026 13.5079 16.001 13.0332L15.9854 12.8291C15.9276 12.2768 15.7304 11.7192 15.4248 11.1914V11.1904C15.1589 10.7515 14.7759 10.3446 14.3115 10.0273V10.0264C13.8545 9.71774 13.3307 9.48038 12.7764 9.37891L12.7666 9.37695L12.6689 9.35352L12.5352 9.32031V9.08789L12.5469 7.17773H12.5352V6.4834L12.7988 6.6377L12.9814 6.74414H12.9805L21.2725 11.4258L21.2744 11.4268L21.4629 11.5498C21.5822 11.6375 21.6888 11.7361 21.7803 11.8457L21.9053 12.0186L21.9092 12.0244C22.0443 12.2618 22.1257 12.5282 22.126 12.8447L22.1748 18.4746V18.4766ZM4.82324 17.4004C4.82382 17.4061 4.82463 17.4103 4.8252 17.4121L4.83008 17.4258L4.83203 17.4395C4.83871 17.4786 4.86151 17.5332 4.90234 17.5811C4.92208 17.604 4.96544 17.6377 5.08496 17.6377C5.12528 17.6377 5.15489 17.6348 5.18848 17.6299C5.49666 17.4462 6.672 16.7931 7.56152 16.2969L8.63965 15.6943L8.64258 15.6924L8.72754 15.6445L8.85254 15.5752L8.94531 15.6836L9.00684 15.7549C9.3533 16.1607 9.80623 16.4907 10.2734 16.7188L10.2754 16.7197C10.8291 16.9957 11.3828 17.127 11.7461 17.1162H11.8818C12.2561 17.1103 12.7326 17.0983 13.2773 16.9258C13.8201 16.7538 14.4388 16.4193 15.0869 15.7578L15.0898 15.7559L15.1504 15.6963L15.251 15.5986L15.3682 15.6748L15.4355 15.7178L17.3525 16.7305L17.5479 16.8262L17.8408 16.9688L17.5586 17.1338L17.377 17.2412L17.374 17.2422L14.6182 18.7949L14.6172 18.7959C12.2007 20.1354 9.39881 21.7095 8.93848 21.9814L8.93262 21.9854C8.79674 22.059 8.5044 22.1467 8.20801 22.1719H8.2041C7.99149 22.1848 7.752 22.1602 7.5459 22.0596L7.54102 22.0576C7.04003 21.7952 4.59763 20.442 3.20215 19.6602L2.23438 19.1172C2.02668 19.0316 1.91622 18.8902 1.86523 18.7432C1.81695 18.6037 1.8252 18.4645 1.8252 18.417V18.3926L1.84961 12.8574C1.84972 12.4544 1.97014 12.1342 2.1377 11.9023C2.30301 11.6737 2.51987 11.5281 2.66699 11.4492L4.30664 10.5244L4.30859 10.5234L4.50293 10.417L4.76172 10.2744V10.7705L4.82227 17.3848V17.3857C4.82227 17.3902 4.82271 17.395 4.82324 17.4004ZM18.1924 8.47559L17.9365 8.34277L17.7539 8.24805L17.749 8.24512L11.9814 4.99707C11.9243 4.96531 11.8569 4.94928 11.7881 4.94922C11.7214 4.94922 11.6594 4.96422 11.5879 4.99414C11.5457 5.0118 11.5129 5.04089 11.4805 5.09473C11.4562 5.14327 11.4404 5.19762 11.4404 5.25977V9.31445L11.2871 9.33301L11.1904 9.34375L11.1914 9.34473C11.027 9.36612 10.8825 9.40948 10.7324 9.46582C10.5785 9.52361 10.428 9.59139 10.252 9.66504C9.8743 9.83324 9.5272 10.0813 9.22363 10.3662C8.90937 10.6735 8.64204 11.026 8.43262 11.4121C8.22944 11.82 8.08923 12.2605 8.03418 12.7109L8.01562 12.9053C7.98064 13.4175 8.03939 13.9486 8.21094 14.4189L8.24707 14.5137L8.30176 14.6553L8.16895 14.7295L8.08398 14.7773L8.08301 14.7764L6.24121 15.8174L6.05957 15.9248L5.7959 16.0791V6.33887C5.7959 6.06244 5.83465 5.79134 5.92871 5.54199C6.02643 5.28309 6.20715 5.04061 6.47949 4.85449L6.52441 4.82422H6.54492L11.6289 1.9541L11.6318 1.95312C11.6833 1.92519 11.74 1.89339 11.7949 1.87012C11.8515 1.84617 11.919 1.8252 11.9941 1.8252C12.0858 1.8252 12.1726 1.84492 12.2637 1.88379L12.3564 1.92871L12.3594 1.93066L17.4092 4.77441L17.5684 4.87598C17.7224 4.98783 17.8586 5.13217 17.9629 5.31543C18.1006 5.55736 18.1793 5.84659 18.1924 6.20117V8.47559Z" fill="url(#paint0_radial_1513_2356)" stroke="#F59C0A" stroke-width="0.35" />
        <path d="M12 10.45C13.5112 10.45 14.75 11.676 14.75 13.2C14.75 14.7239 13.5112 15.95 12 15.95C10.4888 15.95 9.25 14.7239 9.25 13.2C9.25 11.688 10.4881 10.45 12 10.45Z" fill="url(#paint1_radial_1513_2356)" stroke="#F59C0A" stroke-width="0.5" />
        <defs>
          <radialGradient id="paint0_radial_1513_2356" cx="0" cy="0" r="1" gradientTransform="matrix(6.80011 8.4161 -8.4161 6.47986 7.9501 6.26732)" gradientUnits="userSpaceOnUse">
            <stop stop-color="#F5CBD3" />
            <stop offset="0.792363" stop-color="#D22335" />
          </radialGradient>
          <radialGradient id="paint1_radial_1513_2356" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(10.8848 11.8036) rotate(52.8153) scale(4.09916)">
            <stop stop-color="#FFD171" />
            <stop offset="1" stop-color="#F89923" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M16.6372 5.77734C16.637 5.21866 16.1763 4.75 15.5894 4.75H4.82037C4.23357 4.7501 3.77379 5.21873 3.77356 5.77734V18.2227C3.77376 18.7812 4.23355 19.2499 4.82037 19.25H19.1797C19.7665 19.2499 20.2263 18.7813 20.2265 18.2227V9.33301C20.2263 8.77436 19.7666 8.30577 19.1797 8.30566H10.2054C9.79236 8.30566 9.45755 7.96985 9.45751 7.55566C9.45751 7.14145 9.79234 6.80566 10.2054 6.80566H16.6372V5.77734ZM17.534 13.7773C17.5338 13.4642 17.2751 13.1944 16.9361 13.1943C16.5971 13.1943 16.3375 13.4641 16.3373 13.7773C16.3373 14.0907 16.597 14.3613 16.9361 14.3613C17.2752 14.3612 17.534 14.0907 17.534 13.7773ZM19.0298 13.7773C19.0298 14.9366 18.0837 15.8612 16.9361 15.8613C15.7885 15.8613 14.8415 14.9367 14.8415 13.7773C14.8418 12.6182 15.7886 11.6943 16.9361 11.6943C18.0836 11.6944 19.0295 12.6183 19.0298 13.7773ZM18.1329 6.80566H19.1797C20.5751 6.80577 21.7221 7.92844 21.7223 9.33301V18.2227C21.722 19.6272 20.5751 20.7499 19.1797 20.75H4.82037C3.42509 20.7499 2.27803 19.6272 2.27783 18.2227V5.77734C2.27806 4.37279 3.42507 3.2501 4.82037 3.25H15.5894C16.9848 3.25 18.1327 4.37274 18.1329 5.77734V6.80566Z" fill="#4D4D4D" />
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
