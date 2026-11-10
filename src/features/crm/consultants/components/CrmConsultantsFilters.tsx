import { SwitchButton } from "../../../../shared/components/SwitchButton";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { getCrmRecordId } from "../../api/crm.service";
import {
  CrmSelect,
  FilterField,
  ghostButtonClassName,
  inputClassName,
  readText,
} from "../../CrmLayout";
import type { CrmConsultantsFiltersProps } from "../types";

export function CrmConsultantsFilters({
  agencies,
  agencyIdFilter,
  agencyOnly,
  onAgencyIdFilterChange,
  onAgencyOnlyChange,
  onClear,
  onSearchChange,
  onStatusFilterChange,
  search,
  statusFilter,
}: CrmConsultantsFiltersProps) {
  const hasActiveFilters = Boolean(search || statusFilter || agencyOnly);

  return (
    <form
      className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-4 lg:grid-cols-[minmax(220px,1fr)_190px_250px_minmax(220px,1fr)_auto]"
      onSubmit={(event) => event.preventDefault()}
    >
      <FilterField label="جستجو">
        <input
          className={inputClassName}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="نام، موبایل یا آژانس"
          type="search"
          value={search}
        />
      </FilterField>

      <FilterField label="وضعیت">
        <CrmSelect
          className={inputClassName}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          value={statusFilter}
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="pending">در انتظار</option>
          <option value="accept">تأیید شده</option>
          <option value="reject">رد شده</option>
        </CrmSelect>
      </FilterField>

      <div className="flex min-h-[66px] items-end">
        <div className="flex h-10 w-full items-center justify-between rounded-xl border border-[#dce3ef] bg-white px-3">
          <div>
            <Typography
              as="span"
              className="block text-sm font-semibold text-[#303030]"
              size="medium"
              variant="label"
              weight="semibold"
            >
              فقط مشاوران آژانس
            </Typography>
          </div>
          <SwitchButton
            ariaLabel="فیلتر مشاوران وابسته به آژانس"
            checked={agencyOnly}
            onChange={onAgencyOnlyChange}
          />
        </div>
      </div>

      <FilterField label="آژانس">
        <CrmSelect
          className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-[#f0f0f0] disabled:text-[#a0a0a0]`}
          disabled={!agencyOnly}
          onChange={(event) => onAgencyIdFilterChange(event.target.value)}
          value={agencyIdFilter}
        >
          <option value="">همه آژانس‌ها</option>
          {agencies.map((agency) => {
            const id = getCrmRecordId(agency);
            return (
              <option key={id} value={id}>
                {readText(agency, ["name", "title"], "آژانس بدون نام")}
              </option>
            );
          })}
        </CrmSelect>
      </FilterField>

      <div className="flex items-end gap-2">
        {hasActiveFilters ? (
          <Button
            className={ghostButtonClassName}
            onClick={onClear}
            type="button"
            unstyled
          >
            پاک کردن
          </Button>
        ) : null}
      </div>
    </form>
  );
}
