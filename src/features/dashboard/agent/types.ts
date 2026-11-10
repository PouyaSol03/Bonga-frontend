export type AgentRoleType = "REAL_ESTATE_CONSULTANT" | "INDEPENDENT_CONSULTANT";

export interface FunnelStage {
  id: string;
  label: string;
  valueText: string;
  percentageText: string;
  color: string;
}
