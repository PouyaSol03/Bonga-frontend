import type { ReactNode } from "react";
import { Typography } from "../../../../shared/ui/Typography";

export function PriceBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-14 items-center justify-between rounded-xl bg-[#f7f7f7] px-4">
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="medium"
        className="text-sm font-medium text-[#4d4d4d]"
      >
        {label}
      </Typography>
      <strong className="text-base font-semibold text-[#1a1a1a]">{value}</strong>
    </div>
  );
}

export function PublicStyleSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-xl bg-white px-6 py-6">
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 text-lg font-semibold text-[#1a1a1a]"
      >
        {title}
      </Typography>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function InformationRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-[#f0f0f0] py-3.5 last:border-b-0">
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f5f5f5] text-[#0048c4]"
      >
        {icon}
      </Typography>
      <div className="min-w-0 flex-1">
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="block text-sm font-medium text-[#808080]"
        >
          {label}
        </Typography>
        <strong className="mt-1 block text-sm leading-6 font-bold break-words text-[#333333]">
          {value}
        </strong>
      </div>
    </div>
  );
}

export function DetailSection({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-xl bg-white p-5">
      <div className="flex items-center gap-2.5">
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]"
        >
          {icon}
        </Typography>
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-base font-bold text-[#1a1a1a]"
        >
          {title}
        </Typography>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-64 rounded-xl bg-white" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-24 rounded-xl bg-white" key={index} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="h-96 rounded-xl bg-white" />
        <div className="h-96 rounded-xl bg-white" />
      </div>
    </div>
  );
}
