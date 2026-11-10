import { motion } from "motion/react";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import { Typography } from "../../../../shared/ui/Typography";
import { getCrmRecordId } from "../../api/crm.service";
import {
  consultantAgencyName,
  consultantStatusLabel,
  consultantStatusTone,
  consultantStatusValue,
  fullName,
  readText,
  SearchTableEmptyRow,
  SmallActionButton,
  TableCell,
  TableHead,
  TableLoadingRows,
} from "../../CrmLayout";
import type { CrmConsultantsTableProps } from "../types";

export function CrmConsultantsTable({
  agencyNames,
  consultants,
  isActionPending,
  isLoading,
  onEdit,
  onRequestStatusChange,
}: CrmConsultantsTableProps) {
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-[#f0f0f0] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-separate border-spacing-0 text-right">
          <thead>
            <tr>
              <TableHead>نام مشاور</TableHead>
              <TableHead>شماره موبایل</TableHead>
              <TableHead>آژانس</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>عملیات</TableHead>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableLoadingRows columns={5} rows={6} />
            ) : consultants.length ? (
              consultants.map((consultant, index) => {
                const id = getCrmRecordId(consultant);
                const status = consultantStatusValue(consultant);
                const agencyName = consultantAgencyName(consultant, agencyNames);
                const isIndependent = agencyName === "مستقل";

                return (
                  <motion.tr
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 8 }}
                    key={id}
                    transition={{ delay: Math.min(index * 0.035, 0.28), duration: 0.2 }}
                  >
                    <TableCell>
                      <Typography
                        as="span"
                        className="font-bold text-[#1a1a1a]"
                        size="medium"
                        variant="label"
                        weight="semibold"
                      >
                        {fullName(consultant)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        as="span"
                        dir="ltr"
                        size="medium"
                        variant="body"
                        weight="regular"
                      >
                        {readText(consultant, ["mobile", "phone"])}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        as="span"
                        className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${isIndependent ? "border-[#dce3ef] bg-[#f7f8fa] text-[#596477]" : "border-[#cfe4ff] bg-[#eef4ff] text-[#0048c4]"}`}
                        size="small"
                        variant="label"
                        weight="semibold"
                      >
                        {agencyName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        as="span"
                        className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${consultantStatusTone(status)}`}
                        size="small"
                        variant="label"
                        weight="semibold"
                      >
                        {consultantStatusLabel(status)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-nowrap items-center gap-1.5 whitespace-nowrap shrink-0">
                        <SmallActionButton
                          disabled={isActionPending}
                          icon={<LinearEdit2 className="h-4 w-4" />}
                          label="ویرایش"
                          onClick={() => onEdit(consultant)}
                          tone="primary"
                        />
                        {status !== "accept" ? (
                          <SmallActionButton
                            disabled={isActionPending}
                            label="تایید"
                            onClick={() => onRequestStatusChange(consultant, "accept")}
                            tone="success"
                          />
                        ) : null}
                        {status !== "reject" ? (
                          <SmallActionButton
                            disabled={isActionPending}
                            label="رد"
                            onClick={() => onRequestStatusChange(consultant, "reject")}
                            tone="danger"
                          />
                        ) : null}
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })
            ) : (
              <SearchTableEmptyRow columns={5} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
