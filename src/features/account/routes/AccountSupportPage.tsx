import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { Link } from "react-router";
import LinearChat from "../../../shared/icons/LinearChat";
import { SUPPORT_CHAT_PATH, SupportMenuItem, supportItems } from "../accountSupportViews";

export function AccountSupportPage() {
  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden"
      variant="flush"
    >
      <TopBar backTo="/account" title="پشتیبانی" />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto">
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

      <Link
        aria-label="گفتگوی آنلاین با پشتیبانی"
        className="bg-primary text-on-primary focus-visible:ring-primary absolute right-4 bottom-6 grid h-14 w-14 place-items-center rounded-full shadow-lg outline-none focus-visible:ring-3 active:scale-[0.98]"
        to={SUPPORT_CHAT_PATH}
      >
        <LinearChat className="h-6 w-6" />
      </Link>
    </PageFrame>
  );
}
