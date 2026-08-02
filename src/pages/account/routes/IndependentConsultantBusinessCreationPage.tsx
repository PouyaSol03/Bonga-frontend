import { useState, useEffect } from "react";
import { useCreateMyAgentMutation } from "../../../core/hooks/account.hooks";
import { getApiErrorMessage } from "../../../core/api/api";
import { BusinessFormPage, RequiredLabel, normalizePhoneDigits } from "../businessCreationViews";
import type { BusinessToast } from "../businessCreationViews";

export function IndependentConsultantBusinessCreationPage() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [toast, setToast] = useState<BusinessToast | null>(null);
  const createAgentMutation = useCreateMyAgentMutation();

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleSubmitAgent = async () => {
    createAgentMutation.reset();

    const trimmedFullName = fullName.trim();
    const normalizedMobile = normalizePhoneDigits(mobile);

    if (!trimmedFullName) {
      setToast({
        message: "نام و نام خانوادگی مشاور الزامی است.",
        title: "خطا",
        variant: "error",
      });
      return false;
    }

    if (!normalizedMobile) {
      setToast({
        message: "شماره همراه الزامی است.",
        title: "خطا",
        variant: "error",
      });
      return false;
    }

    try {
      await createAgentMutation.mutateAsync({
        agency_id: null,
        name: trimmedFullName,
        phonenumber: normalizedMobile,
      });

      return true;
    } catch (error) {
      setToast({
        message: getApiErrorMessage(error, "ایجاد کسب و کار با خطا مواجه شد."),
        title: "خطا",
        variant: "error",
      });
      return false;
    }
  };

  return (
    <BusinessFormPage
      businessType="independent-consultant"
      fields={
        <>
          <div>
            <RequiredLabel>نام و نام خانوادگی مشاور</RequiredLabel>
            <input
              className="mt-2 h-14 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4]"
              onChange={(event) => setFullName(event.target.value)}
              placeholder="مثال: املاک نوروزیان"
              value={fullName}
            />
          </div>

          <div>
            <RequiredLabel>شماره همراه</RequiredLabel>
            <input
              className="mt-2 h-14 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4]"
              inputMode="tel"
              onChange={(event) => setMobile(event.target.value)}
              placeholder="مثال: ۰۹۱۵۵۲۱۴۰۶۲"
              value={mobile}
            />
          </div>
        </>
      }
      isSubmitting={createAgentMutation.isPending}
      onDismissToast={() => setToast(null)}
      onSubmit={handleSubmitAgent}
      toast={toast}
    />
  );
}
