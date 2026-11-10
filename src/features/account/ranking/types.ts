import type { ReactNode } from "react";

export type RankIndicator = {
  icon: ReactNode;
  label: string;
  value: string;
};

export type RankingPeriod = "هفته" | "ماه";
