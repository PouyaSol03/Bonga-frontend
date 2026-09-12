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
      <div className="flex items-center gap-2.5 text-[#1a1a1a]">
        {isDark ? (
          <MoonIcon className="h-5 w-5 text-[#ffaa33]" />
        ) : (
          <SunIcon className="h-5 w-5 text-[#ffaa33]" />
        )}
        <Typography as="span" variant="body" size="medium" weight="medium">
          حالت نمایش
        </Typography>
      </div>

      <div className="inline-flex rounded-lg border border-[#e5e5e5] bg-[#f5f5f5] p-0.5" dir="rtl">
        {options.map((opt) => {
          const isSelected = theme === opt.id;
          return (
            <Button
              unstyled
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-white text-[#0048c4] shadow-sm"
                  : "text-[#666666] hover:text-[#1a1a1a]"
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
