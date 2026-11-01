export function ClearCircleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="m7.5 7.5 5 5m0-5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export function NeighborhoodSkeleton() {
  return (
    <div className="space-y-2">
      <div className="bg-surface-container h-12 rounded-[10px]" />
      <div className="bg-surface-container h-12 rounded-[10px]" />
      <div className="bg-surface-container h-12 rounded-[10px]" />
    </div>
  );
}
