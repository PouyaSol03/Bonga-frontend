import type { CrmDiscountServiceType } from "../../api/crm-discount.service";
import { serviceLabels } from "../types";

export function DiscountServiceCheckboxes({
  selectedServices,
  toggleService,
}: {
  selectedServices: CrmDiscountServiceType[];
  toggleService: (service: CrmDiscountServiceType) => void;
}) {
  return (
    <div className="border-outline-var bg-surface-container-low rounded-xl border p-3.5">
      <label className="text-on-surface mb-2 block text-xs font-semibold">
        سرویس‌های مجاز برای این کد تخفیف <span className="text-error">*</span>
      </label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {(["advertise", "package", "panel"] as CrmDiscountServiceType[]).map((service) => {
          const isChecked = selectedServices.includes(service);
          return (
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition ${
                isChecked
                  ? "border-primary bg-primary/5 text-primary font-bold"
                  : "border-outline-var bg-surface-container-lowest text-on-surface-var"
              }`}
              key={service}
            >
              <input
                checked={isChecked}
                className="accent-primary"
                onChange={() => toggleService(service)}
                type="checkbox"
              />
              <span>{serviceLabels[service as CrmDiscountServiceType]}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
