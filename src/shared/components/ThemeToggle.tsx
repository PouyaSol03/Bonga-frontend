import { useAppTheme, type AppTheme } from "../theme/themeStorage";
import { Typography } from "../ui/Typography";
import { Button } from "../ui/Button";

function SunIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggleRow() {
  const { theme, setTheme, isDark } = useAppTheme();

  const options: { id: AppTheme; label: string }[] = [
    { id: "light", label: "روشن" },
    { id: "dark", label: "تاریک" },
    { id: "system", label: "خودکار" },
  ];

  return (
    <div className="flex items-center justify-between py-2 px-1">
      <div className="flex items-center gap-2.5 text-on-surface">
        {isDark ? (
          <MoonIcon className="h-5 w-5 text-warning" />
        ) : (
          <SunIcon className="h-5 w-5 text-warning" />
        )}
        <Typography as="span" variant="body" size="medium" weight="medium">
          حالت نمایش
        </Typography>
      </div>

      <div className="inline-flex rounded-lg border border-outline-var bg-surface-container p-0.5" dir="rtl">
        {options.map((opt) => {
          const isSelected = theme === opt.id;
          return (
            <Button
              unstyled
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-var hover:text-on-surface"
              }`}
              type="button"
            >
              {opt.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
