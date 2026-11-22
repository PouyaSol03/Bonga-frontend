import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ModalShell } from "./ModalShell";
import { CrmIcon } from "./CrmIcon";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { CrmTargetOwnerSelect } from "../../advertisements/create/components/CrmTargetOwnerSelect";
import { getCrmAdvertiseCreatePath } from "../crmAdvertiseNavigation";
import { ghostButtonClassName, primaryButtonClassName } from "./constants";

export type CrmAdvertiseCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialAgency?: {
    id: string | number;
    name: string;
  } | null;
};

export function CrmAdvertiseCreateModal({
  isOpen,
  onClose,
  initialAgency,
}: CrmAdvertiseCreateModalProps) {
  const navigate = useNavigate();
  const [targetType, setTargetType] = useState<"agency" | "user">("agency");
  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");

  // Optional owner contact info if agency is chosen
  const [ownerFullName, setOwnerFullName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerExactAddress, setOwnerExactAddress] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSelectedId("");
      setSelectedName("");
      setOwnerFullName("");
      setOwnerPhone("");
      setOwnerExactAddress("");
      setTargetType("agency");
      return;
    }

    if (initialAgency) {
      setTargetType("agency");
      setSelectedId(String(initialAgency.id));
      setSelectedName(initialAgency.name);
    }
  }, [isOpen, initialAgency]);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (!selectedId) return;

    const path = getCrmAdvertiseCreatePath({
      targetOwnerType: targetType,
      targetOwnerId: selectedId,
      targetOwnerName: selectedName,
      agencyId: targetType === "agency" ? selectedId : undefined,
      agencyName: targetType === "agency" ? selectedName : undefined,
      ownerFullName: targetType === "agency" ? ownerFullName.trim() : undefined,
      ownerPhone: targetType === "agency" ? ownerPhone.trim() : undefined,
      ownerExactAddress: targetType === "agency" ? ownerExactAddress.trim() : undefined,
    });

    onClose();
    navigate(path);
  };

  return (
    <ModalShell onClose={onClose}>
      <div
        className="w-[min(560px,94vw)] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl [direction:rtl]"
        dir="rtl"
      >
        <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff] text-[#0048c4]">
              <CrmIcon name="plus" size={20} />
            </div>
            <div>
              <Typography as="h2" variant="title" size="small" weight="semibold" className="text-base text-[#1a1a1a]">
                ثبت آگهی جدید در پنل مدیریت
              </Typography>
              <Typography as="p" variant="body" size="small" className="text-xs text-[#737373]">
                مالک آگهی را مشخص کنید تا طبق ضوابط سیستم ثبت گردد.
              </Typography>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8c8c8c] hover:bg-[#f5f5f5] hover:text-[#262626]"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold text-[#434343]">نوع مالک آگهی</label>
            <div className="grid h-11 grid-cols-2 overflow-hidden rounded-xl border border-[#d9d9d9]">
              <Button
                unstyled
                className={`text-sm font-bold transition ${
                  targetType === "agency" ? "bg-[#0048c4] text-white" : "bg-white text-[#595959]"
                }`}
                onClick={() => {
                  setTargetType("agency");
                  if (initialAgency) {
                    setSelectedId(String(initialAgency.id));
                    setSelectedName(initialAgency.name);
                  } else {
                    setSelectedId("");
                    setSelectedName("");
                  }
                }}
                type="button"
              >
                آژانس املاک
              </Button>
              <Button
                unstyled
                className={`border-r border-[#d9d9d9] text-sm font-bold transition ${
                  targetType === "user" ? "bg-[#0048c4] text-white" : "bg-white text-[#595959]"
                }`}
                onClick={() => {
                  setTargetType("user");
                  setSelectedId("");
                  setSelectedName("");
                }}
                type="button"
              >
                کاربر عادی
              </Button>
            </div>
          </div>

          <div>
            {targetType === "agency" && initialAgency ? (
              <div className="rounded-xl border border-[#b7eb8f] bg-[#f6ffed] p-3 text-sm text-[#389e0d]">
                <div className="font-bold">آژانس انتخاب شده: {initialAgency.name}</div>
                <div className="mt-0.5 text-xs text-[#52c41a]" dir="ltr">
                  شناسه: {initialAgency.id}
                </div>
              </div>
            ) : (
              <CrmTargetOwnerSelect
                type={targetType}
                value={selectedId}
                onChange={(id) => setSelectedId(id)}
                onSelectName={(name) => setSelectedName(name)}
              />
            )}
          </div>

          {targetType === "agency" && (
            <div className="rounded-xl border border-[#e5e9f2] bg-[#f9fafc] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#edf0f5] pb-2">
                <span className="text-xs font-bold text-[#1a1a1a]">
                  اطلاعات تماس با مالک واقعی (اختیاری)
                </span>
                <span className="text-[11px] text-[#8c8c8c]">
                  فقط در پنل مدیریت و آژانس ذخیره می‌شود
                </span>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#595959]">
                  نام و نام خانوادگی مالک
                </label>
                <input
                  type="text"
                  maxLength={50}
                  className="h-10 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-sm outline-none transition focus:border-[#0048c4]"
                  placeholder="مثال: علی احمدی (اختیاری)"
                  value={ownerFullName}
                  onChange={(e) => setOwnerFullName(e.target.value.slice(0, 50))}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#595959]">
                  شماره تماس مالک
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  maxLength={11}
                  className="h-10 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-sm text-left outline-none transition focus:border-[#0048c4]"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#595959]">
                  نشانی دقیق ملک
                </label>
                <textarea
                  rows={2}
                  maxLength={300}
                  className="w-full resize-none rounded-lg border border-[#d9d9d9] bg-white p-2.5 text-sm outline-none transition focus:border-[#0048c4]"
                  placeholder="آدرس دقیق و پلاک ملک (اختیاری)..."
                  value={ownerExactAddress}
                  onChange={(e) => setOwnerExactAddress(e.target.value.slice(0, 300))}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#f0f0f0] pt-4">
          <Button unstyled className={ghostButtonClassName} onClick={onClose} type="button">
            انصراف
          </Button>
          <Button
            unstyled
            className={`${primaryButtonClassName} ${!selectedId ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!selectedId}
            onClick={handleContinue}
            type="button"
          >
            ادامه و انتخاب دسته‌بندی
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
