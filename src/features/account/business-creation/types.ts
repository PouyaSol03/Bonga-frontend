import type { ComponentType, SVGProps } from "react";

export type BusinessType = "agency" | "independent-consultant";

export type BusinessToast = {
  message: string;
  title: string;
  variant: "error" | "success" | "info" | "warning";
};

export type InfoCardSection = {
  afterBullets?: string;
  bullets?: string[];
  description?: string;
  title?: string;
};

export type InfoCard = {
  bullets?: string[];
  description?: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  sections?: InfoCardSection[];
  subtitle: string;
  title: string;
};
