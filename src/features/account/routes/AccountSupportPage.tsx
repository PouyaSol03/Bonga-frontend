import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearChat from "../../../shared/icons/LinearChat";
import { SUPPORT_CHAT_PATH, SupportMenuItem, supportItems } from "../accountSupportViews";

export function AccountSupportPage() {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface"
      variant="flush"
    >
      <TopBar backTo="/account" title="پشتیبانی" />

      <main className="min-h-0 flex-1 overflow-y-auto bg-surface-container-lowest">
        <nav aria-label="گزینه‌های پشتیبانی" className="w-full">
          {supportItems.map((item, index) => (
            <SupportMenuItem
              key={item.title}
              {...item}
              showDivider={index < supportItems.length - 1}
            />
          ))}
        </nav>
      </main>

      <RouteLink
        aria-label="گفتگوی آنلاین با پشتیبانی"
        className="absolute bottom-6 right-4 grid h-14 w-14 place-items-center rounded-full bg-primary text-on-primary shadow-lg outline-none active:scale-[0.98] focus-visible:ring-3 focus-visible:ring-primary"
        to={SUPPORT_CHAT_PATH}
      >
        <LinearChat className="h-6 w-6" />
      </RouteLink>
    </PageFrame>
  );
}
