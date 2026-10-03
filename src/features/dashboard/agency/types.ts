export interface AgencyTaskItem {
  id: string;
  count: number;
  label: string;
  onClick?: () => void;
  to?: string;
}

export interface AgencyCreditItem {
  key: string;
  label: string;
  value: number;
  deltaText: string;
  isPositive?: boolean;
  isNegative?: boolean;
  type: "ad" | "update" | "special" | "expiry";
}

export interface AgencyUrgentAction {
  id: string;
  count: number;
  title: string;
  description: string;
  urgency: "critical" | "warning" | "caution";
  to?: string;
  onClick?: () => void;
}

export interface AgencyNotificationItem {
  id: string;
  title: string;
  time: string;
  description: string;
  type: "deal_approval" | "ad_published" | "ad_stopped";
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  linkAction?: {
    label: string;
    to: string;
  };
}

export interface AgencyRecentAdItem {
  id: string;
  title: string;
  price: string;
  area: number;
  rooms: number;
  buildYear: number;
  timeLocation: string;
  imageUrl?: string;
  to: string;
}
