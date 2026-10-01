import {
  DashboardCreditsCard,
  type DashboardCreditItem,
} from "../../components/DashboardCreditsCard";

export interface AgentCreditItem extends DashboardCreditItem {}

export interface AgentCreditsCardProps {
  items?: AgentCreditItem[];
}

const defaultCredits: AgentCreditItem[] = [
  { key: "ads", label: "آگهی", value: 34, deltaText: "۲۴%", isPositive: true, type: "ad" },
  { key: "updates", label: "بروزرسانی", value: 13, deltaText: "۵%", isPositive: true, type: "refresh" },
  { key: "specials", label: "ویژه", value: 9, deltaText: "۱۶%", isNegative: true, type: "special" },
  { key: "expiry", label: "اعتبار", value: 12, deltaText: "روز باقیمانده", type: "expiry" },
];

export function AgentCreditsCard({ items = defaultCredits }: AgentCreditsCardProps) {
  return <DashboardCreditsCard items={items} />;
}
