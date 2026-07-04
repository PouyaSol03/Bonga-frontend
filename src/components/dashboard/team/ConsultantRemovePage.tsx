import LinearArrowDown1 from "../../(icons)/LinearArrowDown1";
import LinearDanger from "../../(icons)/LinearDanger";
import { TopBar } from "../../TopBar";
import {
  ChevronDownIcon,
  ConsultantProfilePill,
  WarningIcon,
  getRouteConsultant,
} from "./ConsultantManagementPage";

export function ConsultantRemovePage() {
  const consultant = getRouteConsultant();

  return (
    <section
      className="relative mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-white text-[#1a1a1a]"
      dir="rtl"
    >
      <TopBar
        backTo="/account/dashboard/team"
        centerClassName="px-0"
        reserveStartSpace
        title="حذف مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
        <ConsultantProfilePill consultant={consultant} />

        <section className="mt-4 rounded-2xl border border-[#ff6d00] bg-[#fff6ed] p-4">
          <div className="flex items-center gap-2 text-[#ff6d00]">
            <LinearDanger className="h-6 w-6 text-[#ff6d00"/>
            <h2 className="m-0 text-base font-semibold leading-6">توجه!</h2>
          </div>
          <p className="m-0 mt-4 text-sm font-medium leading-6 text-[#4d4d4d]">
            در صورت حذف تمامی اطلاعات ثبت شده به مشاور جایگزین منتقل می‌گردد.
          </p>
        </section>

        <section className="mt-7">
          <label className="block text-right text-base font-semibold leading-6 text-[#1a1a1a]">
            انتخاب مشاور جایگزین <span className="text-[#ef1f1f]">*</span>
          </label>
          <button
            className="mt-3 flex h-14 w-full items-center justify-between rounded-xl border border-[#808080] bg-white px-4 text-sm font-medium leading-5 text-[#1a1a1a]"
            type="button"
          >
            <span>یکی از مشاورین را انتخاب کن</span>
            <LinearArrowDown1 className="w-6 h-6"/>
          </button>
        </section>
      </main>

      <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-4 bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <button
          className="flex h-10 items-center justify-center rounded-lg border border-[#0048c4] bg-white text-sm font-semibold leading-5 text-[#0048c4]"
          type="button"
        >
          انصراف
        </button>
        <button
          className="flex h-10 items-center justify-center rounded-lg bg-[#0048c4] text-sm font-semibold leading-5 text-white"
          type="button"
        >
          حذف مشاور
        </button>
      </div>
    </section>
  );
}
