import { TopBar } from "../../../shared/components/TopBar";

function MoreVerticalIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="5" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="12" cy="19" r="1.75" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

export function NotificationHeader({
  onOpenSettings,
  onRefresh,
}: {
  onOpenSettings: () => void;
  onRefresh: () => void;
}) {
  return (
    <TopBar
      actions={[
        {
          icon: <MoreVerticalIcon className="h-6 w-6" />,
          id: "more",
          label: "تنظیمات اعلان‌ها",
          onClick: onOpenSettings,
        },
        {
          icon: <RefreshIcon className="h-6 w-6" />,
          id: "refresh",
          label: "بروزرسانی اعلان‌ها",
          onClick: onRefresh,
        },
      ]}
      backLabel="بازگشت به خانه"
      backTo="/home"
      heightClassName="h-14"
      title="اعلان‌ها"
      titleClassName="text-sm font-semibold leading-5 text-on-surface"
    />
  );
}
