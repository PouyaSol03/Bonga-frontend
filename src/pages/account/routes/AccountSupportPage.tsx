import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import LinearChat from "../../../components/(icons)/LinearChat";
import { SUPPORT_CHAT_PATH, SupportMenuItem, supportItems } from "../accountSupportViews";

export function AccountSupportPage() {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <TopBar backTo="/account" title="پشتیبانی" />

      <main className="min-h-0 flex-1 overflow-y-auto bg-white">
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
        className="absolute bottom-6 right-4 grid h-14 w-14 place-items-center rounded-full bg-[#0048c4] text-white shadow-[0_6px_16px_rgba(0,72,196,0.24)] outline-none active:scale-[0.98] focus-visible:ring-3 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0048c4]"
        to={SUPPORT_CHAT_PATH}
      >
        <LinearChat className="h-6 w-6" />
      </RouteLink>
    </PageFrame>
  );
}
