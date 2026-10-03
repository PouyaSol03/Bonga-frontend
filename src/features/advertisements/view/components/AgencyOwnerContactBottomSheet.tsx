import { useEffect, useState } from "react";
import { BottomSheet } from "../../../../shared/components/BottomSheet";
import LinearCall from "../../../../shared/icons/LinearCall";
import LinearLocation from "../../../../shared/icons/LinearLocation";
import LinearUserSolid from "../../../../shared/icons/LinearUserSolid";
import { toEnglishDigits, toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import { Typography } from "../../../../shared/ui/Typography";
import { updateOwnerContact } from "../../api/advertisement.service";

export interface AgencyOwnerContactBottomSheetProps {
  adId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  ownerContactAddress?: string;
  ownerContactName?: string;
  ownerContactPhone?: string;
}

type EditableField = "name" | "phone" | "address";

function PencilIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="24 92 12 12"
    >
      <path d="M31.3988 92.4767C31.8031 92.0638 32.4632 92.0638 32.8675 92.4767L35.3135 94.9741C35.7119 95.3811 35.7118 96.0365 35.3135 96.4435L28.2236 103.683C28.1296 103.779 28.0006 103.833 27.8662 103.833H24.667C24.3908 103.833 24.167 103.61 24.167 103.333V100.066C24.167 99.9352 24.2182 99.8097 24.3096 99.7163L31.3988 92.4767ZM35.3337 102.833C35.6098 102.833 35.8337 103.057 35.8337 103.333C35.8337 103.61 35.6098 103.833 35.3337 103.833H31.0667C30.7907 103.833 30.5667 103.61 30.5667 103.333C30.5667 103.057 30.7907 102.834 31.0667 102.833H35.3337ZM25.167 100.27V102.833H27.6566L32.4997 97.8868L29.9997 95.3341L25.167 100.27ZM32.124 93.1687C32.1215 93.1698 32.1179 93.1716 32.1136 93.1759L30.6995 94.6193L33.2002 97.172L34.5986 95.7443C34.6065 95.7362 34.6122 95.7245 34.6123 95.7091C34.6123 95.6936 34.6066 95.6814 34.5986 95.6733L32.1533 93.1759C32.1491 93.1716 32.1454 93.1698 32.1429 93.1687C32.14 93.1676 32.1365 93.1668 32.1331 93.1668C32.1299 93.1668 32.1268 93.1676 32.124 93.1687Z" />
    </svg>
  );
}

export function AgencyOwnerContactBottomSheet({
  adId,
  isOpen,
  onClose,
  onUpdated,
  ownerContactAddress = "",
  ownerContactName = "",
  ownerContactPhone = "",
}: AgencyOwnerContactBottomSheetProps) {
  const [name, setName] = useState(ownerContactName);
  const [phone, setPhone] = useState(ownerContactPhone);
  const [address, setAddress] = useState(ownerContactAddress);

  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(ownerContactName);
    setPhone(ownerContactPhone);
    setAddress(ownerContactAddress);
    setEditingField(null);
    setErrorMessage(null);
  }, [ownerContactName, ownerContactPhone, ownerContactAddress, isOpen]);

  const handleStartEdit = (field: EditableField) => {
    setEditingField(field);
    setErrorMessage(null);
    if (field === "name") setDraftValue(name);
    else if (field === "phone") setDraftValue(phone);
    else if (field === "address") setDraftValue(address);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setDraftValue("");
    setErrorMessage(null);
  };

  const handleSaveEdit = async () => {
    const trimmed = draftValue.trim();
    if (editingField === "phone" && trimmed) {
      const normalizedPhone = toEnglishDigits(trimmed).replace(/\s+/g, "");
      if (!/^(09\d{9}|0\d{10})$/.test(normalizedPhone)) {
        setErrorMessage("شماره وارد شده معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹ یا ۰۲۱۲۲۳۳۴۴۵۵)");
        return;
      }
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const nextName = editingField === "name" ? trimmed : name;
      const nextPhone = editingField === "phone" ? toEnglishDigits(trimmed) : phone;
      const nextAddress = editingField === "address" ? trimmed : address;

      await updateOwnerContact({
        advertiseId: adId,
        ownerContactAddress: nextAddress,
        ownerContactName: nextName,
        ownerContactPhone: nextPhone,
      });

      if (editingField === "name") setName(nextName);
      if (editingField === "phone") setPhone(nextPhone);
      if (editingField === "address") setAddress(nextAddress);

      setEditingField(null);
      onUpdated?.();
    } catch {
      setErrorMessage("خطا در ثبت اطلاعات. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsSaving(false);
    }
  };

  const phoneHref = phone ? toEnglishDigits(phone).replace(/[^\d+]/g, "") : "";
  const phoneDisplay = phone ? toPersianDigits(phone) : "";

  return (
    <BottomSheet
      ariaLabel="تماس با مالک"
      contentClassName="px-4 pb-6 pt-2"
      heightClassName="h-auto max-h-[calc(100svh-56px)]"
      isOpen={isOpen}
      onBack={onClose}
      onClose={onClose}
      showBackButton
      showHandle
      title="تماس با مالک"
    >
      <div className="flex flex-col [direction:rtl]">
        {/* Row 1: نام مالک */}
        <div className="py-3">
          {editingField === "name" ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Typography as="span" variant="label" size="small" weight="medium" className="text-xs font-medium text-on-surface-var">
                  ویرایش نام مالک
                </Typography>
              </div>
              <input
                autoFocus
                className="w-full rounded-lg border border-outline-var bg-surface-container px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                onChange={(e) => setDraftValue(e.target.value)}
                placeholder="نام و نام خانوادگی مالک"
                type="text"
                value={draftValue}
              />
              {errorMessage ? (
                <Typography as="span" variant="label" size="small" className="text-xs text-error">
                  {errorMessage}
                </Typography>
              ) : null}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  className="rounded-md px-3 py-1 text-xs font-medium text-on-surface-var hover:bg-surface-container"
                  disabled={isSaving}
                  onClick={handleCancelEdit}
                  type="button"
                >
                  انصراف
                </button>
                <button
                  className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-on-primary hover:bg-primary/90 disabled:opacity-50"
                  disabled={isSaving}
                  onClick={handleSaveEdit}
                  type="button"
                >
                  {isSaving ? "در حال ذخیره..." : "ذخیره"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinearUserSolid className="h-5 w-5 text-[#4D4D4D]" />
                <Typography as="span" className="text-sm font-medium text-on-surface-var">
                  نام مالک
                </Typography>
              </div>
              <div className="flex items-center gap-2 [direction:ltr]">
                <button
                  aria-label="ویرایش نام مالک"
                  className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#E9EAEE] text-[#2E2D3E] transition-colors hover:bg-[#DCDFE5]"
                  onClick={() => handleStartEdit("name")}
                  type="button"
                >
                  <PencilIcon />
                </button>
                {name.trim() ? (
                  <Typography as="span" className="text-sm font-semibold text-on-surface">
                    {name.trim()}
                  </Typography>
                ) : (
                  <Typography as="span" className="text-sm font-normal text-[#808080]">
                    بدون نام
                  </Typography>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-px w-full bg-[#CCCCCC]" />

        {/* Row 2: شماره همراه */}
        <div className="py-3">
          {editingField === "phone" ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Typography as="span" variant="label" size="small" weight="medium" className="text-xs font-medium text-on-surface-var">
                  ویرایش شماره همراه
                </Typography>
              </div>
              <input
                autoFocus
                className="w-full rounded-lg border border-outline-var bg-surface-container px-3 py-2 text-sm text-on-surface outline-none focus:border-primary [direction:ltr]"
                onChange={(e) => setDraftValue(e.target.value)}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                type="tel"
                value={draftValue}
              />
              {errorMessage ? (
                <Typography as="span" variant="label" size="small" className="text-xs text-error">
                  {errorMessage}
                </Typography>
              ) : null}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  className="rounded-md px-3 py-1 text-xs font-medium text-on-surface-var hover:bg-surface-container"
                  disabled={isSaving}
                  onClick={handleCancelEdit}
                  type="button"
                >
                  انصراف
                </button>
                <button
                  className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-on-primary hover:bg-primary/90 disabled:opacity-50"
                  disabled={isSaving}
                  onClick={handleSaveEdit}
                  type="button"
                >
                  {isSaving ? "در حال ذخیره..." : "ذخیره"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinearCall className="h-5 w-5 text-[#4D4D4D]" />
                <Typography as="span" className="text-sm font-medium text-on-surface-var">
                  شماره همراه
                </Typography>
              </div>
              <div className="flex items-center gap-2 [direction:ltr]">
                <button
                  aria-label="ویرایش شماره همراه"
                  className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#E9EAEE] text-[#2E2D3E] transition-colors hover:bg-[#DCDFE5]"
                  onClick={() => handleStartEdit("phone")}
                  type="button"
                >
                  <PencilIcon />
                </button>
                {phone.trim() ? (
                  <a
                    className="text-sm font-semibold text-on-surface no-underline hover:text-primary"
                    href={`tel:${phoneHref}`}
                  >
                    {phoneDisplay}
                  </a>
                ) : (
                  <Typography as="span" className="text-sm font-normal text-[#808080]">
                    بدون شماره
                  </Typography>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-px w-full bg-[#CCCCCC]" />

        {/* Row 3: نشانی دقیق آگهی */}
        <div className="py-3">
          {editingField === "address" ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Typography as="span" variant="label" size="small" weight="medium" className="text-xs font-medium text-on-surface-var">
                  ویرایش نشانی دقیق
                </Typography>
              </div>
              <textarea
                autoFocus
                className="w-full rounded-lg border border-outline-var bg-surface-container px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                onChange={(e) => setDraftValue(e.target.value)}
                placeholder="نشانی دقیق ملک"
                rows={2}
                value={draftValue}
              />
              {errorMessage ? (
                <Typography as="span" variant="label" size="small" className="text-xs text-error">
                  {errorMessage}
                </Typography>
              ) : null}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  className="rounded-md px-3 py-1 text-xs font-medium text-on-surface-var hover:bg-surface-container"
                  disabled={isSaving}
                  onClick={handleCancelEdit}
                  type="button"
                >
                  انصراف
                </button>
                <button
                  className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-on-primary hover:bg-primary/90 disabled:opacity-50"
                  disabled={isSaving}
                  onClick={handleSaveEdit}
                  type="button"
                >
                  {isSaving ? "در حال ذخیره..." : "ذخیره"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LinearLocation className="h-5 w-5 text-[#4D4D4D]" />
                  <Typography as="span" className="text-sm font-medium text-on-surface-var">
                    نشانی دقیق آگهی
                  </Typography>
                </div>
                <button
                  aria-label="ویرایش نشانی دقیق"
                  className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#E9EAEE] text-[#2E2D3E] transition-colors hover:bg-[#DCDFE5]"
                  onClick={() => handleStartEdit("address")}
                  type="button"
                >
                  <PencilIcon />
                </button>
              </div>
              {address.trim() ? (
                <Typography as="p" className="mt-2 text-right text-sm font-medium leading-6 text-on-surface">
                  {address.trim()}
                </Typography>
              ) : (
                <Typography as="p" className="mt-2 text-right text-sm font-normal text-[#808080]">
                  نشانی درج نشده
                </Typography>
              )}
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
