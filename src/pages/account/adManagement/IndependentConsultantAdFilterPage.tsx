import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import { ChevronDownIcon } from "./AdManagementIcons";
import { adManagementPaths, getAdManagementRouteState } from "./adManagementData";

export function IndependentConsultantAdFilterPage() {
  const tab = getAdManagementRouteState().tab ?? "active";

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ tab }}
        backTo={adManagementPaths.root}
        className="[&_a]:text-[#1a1a1a]"
        title="فیلتر"
      />

      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pt-4">
        <section className="flex h-14 items-center justify-between [direction:ltr]" aria-label="نمایش آگهی های من">
          <FilterToggle />
          <h2 className="m-0 text-base font-medium leading-6 text-[#1a1a1a] [direction:rtl]">
            آگهی‌های من
          </h2>
        </section>

        <div className="mt-4 space-y-6">
          {["شهر", "محله", "وضعیت آگهی", "نوع معامله"].map((label) => (
            <FilterSelect key={label} label={label} />
          ))}
        </div>
      </main>

      <footer className="shrink-0 bg-white px-4 pb-3 pt-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <button
            className="h-10 rounded-lg border border-[#0048c4] bg-white text-sm font-medium leading-5 text-[#0048c4]"
            type="button"
          >
            حذف فیلتر
          </button>
          <RouteLink
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white no-underline"
            state={{ tab }}
            to={adManagementPaths.root}
          >
            اعمال
          </RouteLink>
        </div>
      </footer>
    </PageFrame>
  );
}

function FilterToggle() {
  return (
    <button
      aria-label="نمایش آگهی های من"
      aria-pressed="false"
      className="flex h-6 w-11 items-center rounded-full bg-[#0048c41f] px-1 [direction:ltr]"
      type="button"
    >
      <span className="block h-4 w-4 rounded-full bg-[#808080]" />
    </button>
  );
}

function FilterSelect({ label }: { label: string }) {
  return (
    <button
      className="flex h-14 w-full items-center justify-between rounded-xl border border-[#cccccc] bg-white px-4 [direction:ltr]"
      type="button"
    >
      <ChevronDownIcon className="h-5 w-5 text-[#4d4d4d]" />
      <span className="text-sm font-normal leading-5 text-[#a6a6a6] [direction:rtl]">{label}</span>
    </button>
  );
}
