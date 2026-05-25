import { TopBarNavigationLayout } from "../app/TopBarNavigationLayout";
import { TopBar } from "../components/TopBar";
import { RouteLink } from "../routes/RouteLink";

type ComingSoonPageProps = {
  activeKey: "new-ad" | "chat";
  title: string;
  message: string;
};

export function ComingSoonPage({
  activeKey,
  title,
  message,
}: ComingSoonPageProps) {
  return (
    <TopBarNavigationLayout
      activeKey={activeKey}
      contentClassName="flex items-center justify-center bg-white px-6 py-8"
      frameClassName="bg-[#f5f5f5] text-[#1a1a1a]"
      topBar={<TopBar showBack={false} title={title} />}
    >
      <section
        className="flex w-full max-w-[320px] flex-col items-center text-center"
        aria-labelledby="coming-soon-title"
      >
        <div
          className="relative mb-6 grid h-24 w-24 place-items-center rounded-full bg-[#edf2ff] text-[#0048c4] min-[390px]:h-28 min-[390px]:w-28"
          aria-hidden="true"
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-current bg-white shadow-[0_8px_20px_rgba(0,72,196,0.12)] min-[390px]:h-16 min-[390px]:w-16">
            <span className="h-7 w-7 rounded-lg border-2 border-current border-t-0 min-[390px]:h-8 min-[390px]:w-8" />
          </div>
          <span className="absolute left-5 top-5 h-3 w-3 rounded-full bg-[#11a366]" />
          <span className="absolute bottom-6 right-4 h-2.5 w-2.5 rounded-full bg-[#ffb100]" />
        </div>

        <h2
          className="m-0 text-base font-bold leading-6 text-[#1a1a1a] min-[390px]:text-lg min-[390px]:leading-7"
          id="coming-soon-title"
        >
          به زودی
        </h2>

        <p className="m-0 mt-3 text-sm font-normal leading-6 text-[#4d4d4d]">
          {message}
        </p>

        <RouteLink
          className="mt-6 inline-flex min-h-[42px] items-center justify-center rounded-[10px] bg-[#0048c4] px-5 py-2.5 text-sm font-medium leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          to="/home"
        >
          بازگشت به خانه
        </RouteLink>
      </section>
    </TopBarNavigationLayout>
  );
}

export function NewAdComingSoonPage() {
  return (
    <ComingSoonPage
      activeKey="new-ad"
      title="ثبت آگهی"
      message="این بخش در حال آماده‌سازی است و به زودی برای ثبت آگهی فعال می‌شود."
    />
  );
}

export function ChatComingSoonPage() {
  return (
    <ComingSoonPage
      activeKey="chat"
      title="چت"
      message="گفتگوها در نسخه بعدی فعال می‌شوند."
    />
  );
}
