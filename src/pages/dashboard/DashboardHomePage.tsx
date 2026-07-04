import LinearClock from "../../components/(icons)/LinearClock";
import { DashboardHomeOverview } from "../../components/dashboard/home/DashboardHomeOverview";
import {
  AddConsultantPage,
  ConsultantManagementPage,
} from "../../components/dashboard/team/ConsultantManagementPage";
import { ConsultantEditPage } from "../../components/dashboard/team/ConsultantEditPage";
import { ConsultantInfoPage } from "../../components/dashboard/team/ConsultantInfoPage";
import { ConsultantRemovePage } from "../../components/dashboard/team/ConsultantRemovePage";
import DashboardAgencyEditPage from "./DashboardAgencyEditPage";
import DashboardChatPage from "./DashboardChatPage";
import DashboardPaymentPage from "./DashboardPaymenPage";

export function DashboardHomePage() {
  return <DashboardHomeOverview />;
}

export function DashboardRequestsPage() {
  return <DashboardComingSoonPage title="مدیریت درخواست‌ها" />;
}

export function DashboardTeamPage() {
  return <ConsultantManagementPage />;
}

export function DashboardAddConsultantPage() {
  return <AddConsultantPage />;
}

export function DashboardConsultantInfoPage() {
  return <ConsultantInfoPage />;
}

export function DashboardConsultantEditPage() {
  return <ConsultantEditPage />;
}

export function DashboardConsultantRemovePage() {
  return <ConsultantRemovePage />;
}

export function DashboardPaymentsPage() {
  return <DashboardPaymentPage />;
}

export function DashboardRankingPage() {
  return <DashboardComingSoonPage title="شناساها و رتبه" />;
}

export function DashboardAgencyPage() {
  return <DashboardAgencyEditPage />;
}

export function DashboardMessagesPage() {
  return <DashboardChatPage />;
}

function DashboardComingSoonPage({ title }: { title: string }) {
  return (
    <section className="grid h-full min-h-[360px] place-items-center rounded-xl bg-white p-6 text-center">
      <div className="grid max-w-[360px] gap-3">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#0048c414] text-[#0048c4]">
          <LinearClock className="h-7 w-7" />
        </span>
        <h1 className="m-0 text-xl font-black text-[#111111]">{title}</h1>
        <p className="m-0 text-sm font-medium leading-6 text-[#666666]">
          این بخش به‌زودی آماده می‌شود.
        </p>
      </div>
    </section>
  );
}
