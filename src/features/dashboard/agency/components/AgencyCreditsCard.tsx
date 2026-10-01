import {
  DashboardCreditsCard,
  type DashboardCreditItem,
} from "../../components/DashboardCreditsCard";
import type { AgencyCreditItem } from "../types";

export interface AgencyCreditsCardProps {
  items?: AgencyCreditItem[];
}

const defaultCredits: AgencyCreditItem[] = [
  { key: "ads", label: "آگهی", value: 34, deltaText: "۲۴% ↗", isPositive: true, type: "ad" },
  { key: "updates", label: "بروزرسانی", value: 13, deltaText: "۵% ↗", isPositive: true, type: "update" },
  { key: "specials", label: "ویژه", value: 9, deltaText: "۱۶% ↘", isNegative: true, type: "special" },
  { key: "expiry", label: "اعتبار", value: 249, deltaText: "روز ۱۲", type: "expiry" },
];

export function AgencyCreditsCard({ items = defaultCredits }: AgencyCreditsCardProps) {
  return <DashboardCreditsCard items={items as unknown as DashboardCreditItem[]} />;
}
