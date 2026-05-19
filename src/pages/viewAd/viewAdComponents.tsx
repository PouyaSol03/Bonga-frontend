import type { ReactNode } from "react";

import { TopBar } from "../../components/TopBar";
import { RouteLink } from "../../routes/RouteLink";
import { ViewAdIcon } from "./ViewAdIcon";
import type {
  DetailItem,
  EquipmentSection,
  IconName,
  PropertyInfoRow,
} from "./viewAdTypes";

export function ViewAdIconButton({
  icon,
  label,
  onClick,
}: {
  icon: IconName;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="grid h-12 w-12 place-items-center rounded-full text-[#1a1a1a] transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#1a1a1a0a]"
      onClick={onClick}
      type="button"
    >
      <ViewAdIcon name={icon} />
    </button>
  );
}

export function ViewAdTopBar({
  actionIcons = ["share", "note", "bookmark"],
  backTo,
  onAction,
  title,
}: {
  actionIcons?: IconName[];
  backTo: string;
  onAction?: (icon: IconName) => void;
  title?: string;
}) {
  return (
    <TopBar
      actions={actionIcons.map((icon) => ({
        icon: <ViewAdIcon name={icon} />,
        id: icon,
        label: getActionLabel(icon),
        onClick: onAction ? () => onAction(icon) : undefined,
      }))}
      backTo={backTo}
      title={title}
    />
  );
}

function getActionLabel(icon: IconName) {
  switch (icon) {
    case "attachment":
      return "پیوست";
    case "bookmark":
      return "نشان کردن";
    case "note":
      return "افزودن یادداشت";
    case "share":
      return "اشتراک‌گذاری";
    default:
      return "اقدام";
  }
}

export function DetailSection({
  children,
  icon,
  mutedTitle = false,
  title,
}: {
  children: ReactNode;
  icon: IconName;
  mutedTitle?: boolean;
  title: string;
}) {
  return (
    <section className="border-t-8 border-[#f0f0f0] bg-white px-4 py-4">
      <div className="flex h-6 items-center justify-end gap-2 [direction:ltr]">
        <h2
          className={`m-0 text-right text-lg font-semibold leading-6 ${
            mutedTitle ? "text-[#808080]" : "text-[#1a1a1a]"
          }`}
        >
          {title}
        </h2>
        <ViewAdIcon className="text-[#4d4d4d]" name={icon} />
      </div>
      {children}
    </section>
  );
}

export function MoreLink({
  children,
  to,
}: {
  children: ReactNode;
  to: string;
}) {
  return (
    <RouteLink
      className="mx-auto mt-6 flex h-7 w-fit items-center justify-center gap-2 rounded-[10px] px-4 text-xs font-medium leading-4 text-[#0048c4] no-underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
      to={to}
    >
      <ViewAdIcon className="h-4 w-4" name="arrowLeft" />
      <span>{children}</span>
    </RouteLink>
  );
}

export function MoreButton({
  children,
  icon = "arrowLeft",
}: {
  children: ReactNode;
  icon?: IconName;
}) {
  return (
    <button
      className="mx-auto mt-6 flex h-7 items-center justify-center gap-2 rounded-[10px] px-4 text-xs font-medium leading-4 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
      type="button"
    >
      <ViewAdIcon className="h-4 w-4" name={icon} />
      <span>{children}</span>
    </button>
  );
}

export function PropertyGrid({
  items,
  withLabels = true,
}: {
  items: DetailItem[];
  withLabels?: boolean;
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 [direction:rtl]">
      {items.map((item) => (
        <div className="flex min-w-0 items-start gap-3" key={`${item.icon}-${item.value}`}>
          <ViewAdIcon className="mt-0.5 text-[#808080]" name={item.icon} />
          <div className="min-w-0 text-right">
            <div className="truncate text-base font-medium leading-6 text-[#1a1a1a]">
              {item.value}
            </div>
            {withLabels ? (
              <div className="mt-0.5 truncate text-xs font-medium leading-4 text-[#a6a6a6]">
                {item.label}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function EquipmentSections({
  sections,
}: {
  sections: EquipmentSection[];
}) {
  return (
    <div className="flex min-h-full flex-col bg-[#f0f0f0]">
      {sections.map((section) => (
        <section
          className="mb-2 bg-white px-4 py-4 last:mb-0 last:flex-1"
          key={section.title}
        >
          <div className="flex h-6 items-center justify-end gap-2 [direction:ltr]">
            <h2 className="m-0 text-right text-lg font-semibold leading-6 text-[#1a1a1a]">
              {section.title}
            </h2>
            <ViewAdIcon className="text-[#4d4d4d]" name={section.icon} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 [direction:rtl]">
            {section.items.map((item, index) => (
              <div
                className="flex min-w-0 items-center gap-3"
                key={`${section.title}-${item.value}-${index}`}
              >
                <ViewAdIcon className="text-[#808080]" name={item.icon} />
                <span className="min-w-0 truncate text-base font-medium leading-6 text-[#1a1a1a]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function PropertyInfoList({ rows }: { rows: PropertyInfoRow[] }) {
  return (
    <div className="bg-[#f0f0f0]">
      {rows.map((row) => (
        <div
          className="mb-0.5 flex h-14 items-center justify-between bg-white px-4 last:mb-0 [direction:ltr]"
          key={`${row.label}-${row.value}`}
        >
          <span className="min-w-0 flex-1 truncate text-left text-base font-medium leading-6 text-[#1a1a1a]">
            {row.value}
          </span>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-[#4d4d4d] [direction:rtl]">
            <ViewAdIcon className="text-[#808080]" name={row.icon} />
            <span className="truncate text-base font-medium leading-6">
              {row.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BottomBackAction({ to }: { to: string }) {
  return (
    <div className="shrink-0 bg-white px-4 py-3.5">
      <div className="flex justify-end [direction:ltr]">
        <RouteLink
          className="flex h-10 w-[156px] items-center justify-center gap-2 rounded-[10px] border border-[#0048c4] bg-white px-4 text-sm font-medium leading-5 text-[#0048c4] no-underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          to={to}
        >
          <ViewAdIcon className="h-5 w-5" name="back" />
          <span>بازگشت</span>
        </RouteLink>
      </div>
    </div>
  );
}
