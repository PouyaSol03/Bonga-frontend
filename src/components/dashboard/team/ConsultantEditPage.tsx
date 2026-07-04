import { useState } from "react";

import { SelectionCheckIndicator } from "../../SelectionCheckIndicator";
import { TopBar } from "../../TopBar";
import {
  AddConsultantRoleOption,
  ConsultantProfilePill,
  QuotaStepper,
  getRouteConsultant,
  managerAccessItems,
  type AccessRole,
} from "./ConsultantManagementPage";

export function ConsultantEditPage() {
  const consultant = getRouteConsultant();
  const [accessRole, setAccessRole] = useState<AccessRole>("consultant");
  const [managerAccess, setManagerAccess] = useState<string[]>(["ads", "requests"]);
  const [adQuota, setAdQuota] = useState(36);
  const [updateQuota, setUpdateQuota] = useState(24);
  const [specialQuota, setSpecialQuota] = useState(13);

  const isManager = accessRole === "manager";

  function toggleManagerAccess(id: string) {
    setManagerAccess((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <section
      className="relative mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-white text-[#1a1a1a]"
      dir="rtl"
    >
      <TopBar
        backTo="/account/dashboard/team"
        centerClassName="px-0"
        reserveStartSpace
        title="ویرایش اطلاعات"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-24">
        <ConsultantProfilePill consultant={consultant} />

        <section className="mt-5">
          <h2 className="m-0 text-right text-base font-semibold leading-6 text-[#1a1a1a]">
            انتخاب سمت
          </h2>

          <div className="mt-4 grid gap-4" role="radiogroup" aria-label="انتخاب سمت">
            <AddConsultantRoleOption
              checked={accessRole === "consultant"}
              label="مشاور"
              onClick={() => setAccessRole("consultant")}
            />
            <AddConsultantRoleOption
              checked={accessRole === "manager"}
              label="مدیر"
              onClick={() => setAccessRole("manager")}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-7 gap-y-5">
            {managerAccessItems.map((item) => {
              const checked = managerAccess.includes(item.id) && isManager;

              return (
                <button
                  aria-pressed={checked}
                  className={`flex items-center gap-2 text-right text-sm font-medium leading-5 ${
                    isManager ? "text-[#4d4d4d]" : "text-[#bdbdbd]"
                  }`}
                  disabled={!isManager}
                  key={item.id}
                  onClick={() => toggleManagerAccess(item.id)}
                  type="button"
                >
                  <SelectionCheckIndicator className="h-[18px] w-[18px] rounded-sm" checked={checked} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-4 grid gap-4">
          <QuotaStepper
            label="سهمیه آگهی"
            remaining="باقیمانده سهمیه آژانس: ۱۹۵"
            remainingClassName="text-[#0048c4]"
            setValue={setAdQuota}
            value={adQuota}
          />
          <QuotaStepper
            label="سهمیه بروزرسانی"
            remaining="باقیمانده سهمیه آژانس: ۹۳"
            remainingClassName="text-[#11a366]"
            setValue={setUpdateQuota}
            value={updateQuota}
          />
          <QuotaStepper
            label="سهمیه ویژه"
            remaining="باقیمانده سهمیه آژانس: ۱۹۵"
            remainingClassName="text-[#ff6d00]"
            setValue={setSpecialQuota}
            value={specialQuota}
          />
        </section>
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <button
          className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-semibold leading-5 text-white"
          type="button"
        >
          اعمال تغییرات
        </button>
      </div>
    </section>
  );
}
