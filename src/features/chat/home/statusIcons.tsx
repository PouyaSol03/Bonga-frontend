

export function DoubleTickIcon({ className = "" }: { className?: string }) {
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
      <path d="m3.5 12.5 3.5 3.5 7-8" />
      <path d="m11 15.5 1 1 8-9" />
    </svg>
  );
}

export function ClockAlarmIcon({ className = "" }: { className?: string }) {
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
      <path d="M8 2.75 3.75 6.2" />
      <path d="M16 2.75 20.25 6.2" />
      <path d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path d="M12 8.5V12l2.5 2.2" />
      <path d="m7.5 20.5-1.4 1.4" />
      <path d="m16.5 20.5 1.4 1.4" />
    </svg>
  );
}

export function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18.6667 6.15L17.879 19.3089C17.8221 20.2589 17.0445 21 16.1044 21H7.89552C6.95545 21 6.17787 20.2589 6.121 19.3089L5.33333 6.15M4 6.15H8.44444M8.44444 6.15L9.54689 3.54547C9.68696 3.21456 10.0083 3 10.3639 3H13.6361C13.9916 3 14.3131 3.21456 14.4531 3.54547L15.5556 6.15M8.44444 6.15H15.5556M20 6.15H15.5556M9.77778 16.05V10.65M14.2222 16.05V10.65"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 16V11.5M12 8.01172V8.00172M21 15.3971V8.60294C21 8.35168 20.9001 8.11071 20.7225 7.93305L16.067 3.27747C15.8893 3.09981 15.6483 3 15.3971 3H8.60294C8.35168 3 8.11071 3.09981 7.93305 3.27747L3.27747 7.93305C3.09981 8.11071 3 8.35168 3 8.60294V15.3971C3 15.6483 3.09981 15.8893 3.27747 16.067L7.93305 20.7225C8.11071 20.9001 8.35168 21 8.60294 21H15.3971C15.6483 21 15.8893 20.9001 16.067 20.7225L20.7225 16.067C20.9001 15.8893 21 15.6483 21 15.3971Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
