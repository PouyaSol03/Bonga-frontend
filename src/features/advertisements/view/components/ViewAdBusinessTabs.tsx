import React from "react";
import LinearSetting2 from "../../../../shared/icons/LinearSetting2";
import { Typography } from "../../../../shared/ui/Typography";

export type ViewAdBusinessTabKey = "management" | "lead" | "performance";

export interface ViewAdBusinessTabsProps {
  activeTab?: ViewAdBusinessTabKey;
  onTabChange?: (tab: ViewAdBusinessTabKey) => void;
  adId?: string | number;
  className?: string;
}

function LeadIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height="22"
      viewBox="169 23 22 22"
      width="22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M179 35.25C179.414 35.25 179.75 35.5858 179.75 36C179.75 36.4142 179.414 36.75 179 36.75C175.911 36.75 173.194 39.2311 172.801 42.25H179C179.414 42.25 179.75 42.5858 179.75 43C179.75 43.4142 179.414 43.75 179 43.75H172C171.586 43.75 171.25 43.4142 171.25 43C171.25 38.8239 174.831 35.25 179 35.25ZM186.25 39C186.25 37.7627 185.242 36.75 184 36.75C182.758 36.75 181.75 37.7627 181.75 39C181.75 40.2373 182.758 41.25 184 41.25C185.242 41.25 186.25 40.2373 186.25 39ZM183.25 29C183.25 27.2051 181.795 25.75 180 25.75C178.205 25.75 176.75 27.2051 176.75 29C176.75 30.7949 178.205 32.25 180 32.25C181.795 32.25 183.25 30.7949 183.25 29ZM187.75 39C187.75 39.7573 187.522 40.4627 187.134 41.0537L188.534 42.4736L187.466 43.5264L186.078 42.1191C185.483 42.5168 184.769 42.75 184 42.75C181.928 42.75 180.25 41.0637 180.25 39C180.25 36.9363 181.928 35.25 184 35.25C186.072 35.25 187.75 36.9363 187.75 39ZM184.75 29C184.75 31.6234 182.623 33.75 180 33.75C177.377 33.75 175.25 31.6234 175.25 29C175.25 26.3766 177.377 24.25 180 24.25C182.623 24.25 184.75 26.3766 184.75 29Z" />
    </svg>
  );
}

function PerformanceIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height="22"
      viewBox="49 23 22 22"
      width="22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M68.25 26.8945C68.2499 26.2625 67.7375 25.7501 67.1055 25.75H52.8945C52.2625 25.7501 51.7501 26.2625 51.75 26.8945V41.1055C51.7501 41.7375 52.2625 42.2499 52.8945 42.25H67.1055C67.7376 42.2499 68.2499 41.7376 68.25 41.1055V26.8945ZM54.5137 39.6846V37.7891C54.5139 37.375 54.8496 37.0391 55.2637 37.0391C55.6776 37.0392 56.0135 37.3751 56.0137 37.7891V39.6846C56.0135 40.0985 55.6776 40.4344 55.2637 40.4346C54.8496 40.4346 54.5139 40.0986 54.5137 39.6846ZM59.25 39.6846V36.8418C59.2502 36.4278 59.586 36.0919 60 36.0918C60.4141 36.0918 60.7498 36.4277 60.75 36.8418V39.6846C60.7498 40.0986 60.4141 40.4346 60 40.4346C59.586 40.4345 59.2502 40.0986 59.25 39.6846ZM63.9873 39.6846V34.9473C63.9874 34.5331 64.3231 34.1973 64.7373 34.1973C65.1514 34.1974 65.4872 34.5332 65.4873 34.9473V39.6846C65.4871 40.0985 65.1513 40.4344 64.7373 40.4346C64.3232 40.4346 63.9875 40.0986 63.9873 39.6846ZM64.9346 31.1582V30.168C64.4082 30.6764 63.6461 31.3449 62.6748 32.0127C60.702 33.369 57.832 34.7499 54.3164 34.75C53.9022 34.75 53.5664 34.4142 53.5664 34C53.5664 33.5858 53.9022 33.25 54.3164 33.25C57.4319 33.2499 60.0087 32.0252 61.8252 30.7764C62.5048 30.3092 63.0728 29.8421 63.5166 29.4414L63.9189 29.0654H62.8428C62.4286 29.0654 62.0928 28.7296 62.0928 28.3154C62.093 27.9014 62.4287 27.5654 62.8428 27.5654H65.6846C66.0986 27.5655 66.4344 27.9014 66.4346 28.3154V31.1582C66.4344 31.5722 66.0986 31.9081 65.6846 31.9082C65.2705 31.9082 64.9347 31.5723 64.9346 31.1582ZM69.75 41.1055C69.7499 42.566 68.566 43.7499 67.1055 43.75H52.8945C51.4341 43.7499 50.2501 42.566 50.25 41.1055V26.8945C50.2501 25.434 51.434 24.2501 52.8945 24.25H67.1055C68.566 24.2501 69.7499 25.4341 69.75 26.8945V41.1055Z" />
    </svg>
  );
}

export function ViewAdBusinessTabs({
  activeTab = "management",
  onTabChange,
  className = "",
}: ViewAdBusinessTabsProps) {
  const tabs: {
    key: ViewAdBusinessTabKey;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: "management", label: "مدیریت", Icon: LinearSetting2 },
    { key: "lead", label: "سرنخ", Icon: LeadIcon },
    { key: "performance", label: "عملکرد", Icon: PerformanceIcon },
  ];

  return (
    <nav
      aria-label="تب‌های مدیریتی آگهی"
      className={`relative w-full h-[72px] grid grid-cols-3 bg-surface-container-lowest border-b border-outline-variant/60 shadow-xs [direction:rtl] ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const IconComponent = tab.Icon;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange?.(tab.key)}
            className={`relative flex flex-col items-center justify-center gap-1.5 h-full w-full bg-transparent border-none cursor-pointer transition select-none ${
              isActive
                ? "text-primary"
                : "text-on-surface-var/70 hover:text-on-surface hover:opacity-100"
            }`}
          >
            <IconComponent
              className={`h-5 w-5 transition ${isActive ? "text-primary" : "text-on-surface-var/70"}`}
            />
            <Typography
              as="span"
              variant="label"
              size="small"
              weight={isActive ? "semibold" : "medium"}
              className={`text-xs ${isActive ? "text-primary font-semibold" : "text-on-surface-var/70"}`}
            >
              {tab.label}
            </Typography>

            {isActive && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 right-0 left-0 h-[2px] bg-primary rounded-t-full"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
