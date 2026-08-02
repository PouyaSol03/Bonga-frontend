import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listCrmAdvertiseForms, getCrmRecordId } from "../../../core/services/crm.service";
import { AdvertiseFormCard, EmptyState, FormCardSkeleton, Panel, PanelHeader, readText, useQueryErrorToast } from "../CrmLayout";
import type { CrmRoutePageProps } from "../CrmLayout";

export function CrmFormsPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const [selectedForm, setSelectedForm] = useState("");
  const query = useQuery({
    queryFn: listCrmAdvertiseForms,
    queryKey: ["crm", "forms", refreshNonce],
  });

  useQueryErrorToast([query.error], notify);

  const forms = useMemo(() => {
    if (!selectedForm) return query.data ?? [];
    return (query.data ?? []).filter((form) => readText(form, ["code"], "") === selectedForm);
  }, [query.data, selectedForm]);

  return (
    <Panel>
      <PanelHeader
        action={
          <select
            className="h-10 min-w-[240px] rounded-xl border border-[#dce3ef] bg-white px-3 text-sm text-[#384457] outline-none transition focus:border-[#0048c4]"
            onChange={(event) => setSelectedForm(event.target.value)}
            value={selectedForm}
          >
            <option value="">همه فرم‌ها</option>
            {(query.data ?? []).map((form) => {
              const code = readText(form, ["code"], getCrmRecordId(form));
              return <option key={code} value={code}>{readText(form, ["title"], code)}</option>;
            })}
          </select>
        }
        subtitle="این بخش فقط ساختار فرم‌های عمومی ثبت آگهی را نمایش می‌دهد."
        title="تعریف فرم‌های آگهی"
      />

      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-4">
        {query.isLoading ? (
          Array.from({ length: 4 }).map((_, index) => <FormCardSkeleton key={index} />)
        ) : forms.length ? (
          forms.map((form) => <AdvertiseFormCard form={form} key={readText(form, ["code"], getCrmRecordId(form))} />)
        ) : (
          <div className="col-span-full"><EmptyState description="فرم آگهی‌ای برای نمایش پیدا نشد." /></div>
        )}
      </div>
    </Panel>
  );
}
