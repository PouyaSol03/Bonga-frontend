import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import LinearCancel from "../../../../shared/icons/LinearCancel";
import LinearCategory from "../../../../shared/icons/LinearCategory";
import LinearDocument from "../../../../shared/icons/LinearDocument";
import LinearFlag from "../../../../shared/icons/LinearFlag";
import LinearPhone2 from "../../../../shared/icons/LinearPhone2";
import LinearUserAccount from "../../../../shared/icons/LinearUserAccount";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { PanelSupportRequestStatus } from "../../../support/api/panel-support.service";
import type { CrmSupportRequest } from "../types";
import { PriorityChip, RequestMetaItem } from "./SupportRequestChips";

export function SupportRequestDetailHeader({
  assignUserId,
  isAssignPending,
  isStatusPending,
  onAssignChange,
  onAssignSubmit,
  onCloseRequest,
  onStatusChange,
  selectedRequest,
}: {
  assignUserId: string;
  isAssignPending: boolean;
  isStatusPending: boolean;
  onAssignChange: (value: string) => void;
  onAssignSubmit: () => void;
  onCloseRequest: () => void;
  onStatusChange: (status: PanelSupportRequestStatus) => void;
  selectedRequest: CrmSupportRequest;
}) {
  return (
    <>
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-[#eeeeee] px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]"
          >
            <LinearUserAccount className="h-6 w-6" />
          </Typography>
          <div className="min-w-0">
            <strong className="block truncate text-sm font-bold text-[#1a1a1a]">
              {selectedRequest.customerName}
            </strong>
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#808080]"
            >
              <LinearPhone2 className="h-4 w-4" />
              {selectedRequest.customerMobile}
            </Typography>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <select
            className="h-9 rounded-lg border border-[#d9d9d9] bg-white px-3 text-xs font-semibold outline-none focus:border-[#0048c4]"
            disabled={isStatusPending}
            onChange={(event) => onStatusChange(event.target.value as PanelSupportRequestStatus)}
            value={selectedRequest.status}
          >
            <option value="open">باز</option>
            <option value="reviewing">در حال بررسی</option>
            <option value="closed">بسته شده</option>
          </select>
          <Button
            unstyled
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e3a2a2] px-3 text-xs font-semibold text-[#c32929] disabled:opacity-40"
            disabled={selectedRequest.status === "closed" || isStatusPending}
            onClick={onCloseRequest}
            type="button"
          >
            <LinearCancel className="h-4 w-4" />
            بستن درخواست
          </Button>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-3 border-b border-[#eeeeee] px-5 py-4 xl:grid-cols-4">
        <RequestMetaItem
          icon={<LinearCategory className="h-4 w-4" />}
          label="دسته‌بندی"
          value={selectedRequest.category}
        />
        <RequestMetaItem
          icon={<LinearDocument className="h-4 w-4" />}
          label="شماره درخواست"
          value={selectedRequest.requestNumber}
        />
        <RequestMetaItem
          icon={<LinearFlag className="h-4 w-4" />}
          label="اولویت"
          value={<PriorityChip priority={selectedRequest.priority} />}
        />
        <RequestMetaItem
          icon={<LinearCalendar className="h-4 w-4" />}
          label="زمان ثبت"
          value={selectedRequest.createdAt}
        />
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#eeeeee] px-5 py-3">
        <input
          className="h-9 w-52 rounded-lg border border-[#d9d9d9] px-3 text-xs outline-none focus:border-[#0048c4]"
          inputMode="numeric"
          onChange={(event) => onAssignChange(event.target.value)}
          placeholder="شناسه کارشناس پشتیبانی"
          value={assignUserId}
        />
        <Button
          unstyled
          className="h-9 rounded-lg bg-[#0048c4] px-4 text-xs font-semibold text-white disabled:opacity-50"
          disabled={isAssignPending}
          onClick={onAssignSubmit}
          type="button"
        >
          تخصیص درخواست
        </Button>
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="regular"
          className="text-xs text-[#808080]"
        >
          {selectedRequest.assignedSupportId
            ? `کارشناس فعلی: ${selectedRequest.assignedSupportId}`
            : "هنوز تخصیص داده نشده"}
        </Typography>
      </div>
    </>
  );
}
