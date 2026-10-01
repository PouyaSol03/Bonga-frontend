import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { SwitchButton } from "../../shared/components/SwitchButton";
import { Typography } from "../../shared/ui/Typography";
import LinearNotification from "../../shared/icons/LinearNotification";
import { notificationManagementOptions } from "./types";
import { useNotificationPreferencesController } from "./useNotificationPreferencesController";

export function NotificationManagementPage() {
  const {
    allNotificationsEnabled,
    hasPendingCategories,
    pendingCategories,
    preferenceMap,
    preferencesQuery,
    updateAllCategories,
    updateCategory,
  } = useNotificationPreferencesController();

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backLabel="بازگشت به اعلان‌ها"
        backTo="/notifications"
        heightClassName="h-14"
        title="مدیریت اعلان‌ها"
        titleClassName="text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto bg-surface-container-lowest pb-6">
        <section className="flex items-center justify-between px-4 py-3 [direction:ltr]">
          <SwitchButton
            ariaLabel="فعال‌سازی اعلان‌ها"
            checked={allNotificationsEnabled}
            disabled={preferencesQuery.isLoading || hasPendingCategories}
            onChange={(enabled) => void updateAllCategories(enabled)}
          />
          <div className="flex min-w-0 flex-1 items-start gap-2 text-right [direction:rtl]">
            <LinearNotification className="h-6 w-6 shrink-0 text-on-surface-var" />
            <div className="min-w-0">
              <Typography
                as="h2"
                variant="body"
                size="large"
                weight="regular"
                className="m-0 text-on-surface"
              >
                فعال‌سازی اعلان‌ها
              </Typography>
              <Typography
                as="p"
                variant="body"
                size="medium"
                weight="regular"
                className="m-0 max-w-[220px] text-sm text-outline"
              >
                با غیرفعال کردن این گزینه، همه اعلان‌ها متوقف می‌شوند.
              </Typography>
            </div>
          </div>
        </section>

        <div className="h-1.5 bg-surface-container" />

        <section aria-label="دسته‌بندی اعلان‌ها">
          {notificationManagementOptions.map((option) => {
            const enabled = preferenceMap.get(option.category) ?? true;

            return (
              <div
                className="flex items-center justify-between border-b border-outline-var px-4 py-3.5 [direction:ltr] last:border-b-0"
                key={option.category}
              >
                <SwitchButton
                  ariaLabel={`تغییر وضعیت ${option.label}`}
                  checked={enabled}
                  disabled={
                    preferencesQuery.isLoading ||
                    pendingCategories.has(option.category)
                  }
                  onChange={(nextEnabled) =>
                    void updateCategory(option.category, nextEnabled)
                  }
                />
                <div className="min-w-0 flex-1 text-right" dir="rtl">
                  <Typography
                    as="h2"
                    variant="body"
                    size="large"
                    weight="regular"
                    className="m-0 text-on-surface"
                  >
                    {option.label}
                  </Typography>
                  <Typography
                    as="p"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="m-0 text-sm font-normal text-outline"
                  >
                    {option.description}
                  </Typography>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </PageFrame>
  );
}
