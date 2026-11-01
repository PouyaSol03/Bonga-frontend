import { type ReactNode } from "react";
import { Typography } from "../../../shared/ui/Typography";

export type FilterSectionProps = {
  children: ReactNode;
  icon: ReactNode;
  sectionId?: string;
  title: ReactNode;
};

export function FilterSection({ children, icon, sectionId, title }: FilterSectionProps) {
  return (
    <section
      className="border-surface-container bg-surface-container-lowest relative scroll-mt-4 border-b-8 p-4"
      data-filter-section={sectionId}
      dir="rtl"
    >
      <div className="text-on-surface-var mb-2 flex h-8 items-center justify-start gap-2">
        {icon}
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="medium"
          className="text-on-surface m-0 text-right text-base leading-6 font-medium"
        >
          {title}
        </Typography>
      </div>
      {children}
    </section>
  );
}
