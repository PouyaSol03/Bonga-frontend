import LinearEdit2 from "../../../shared/icons/LinearEdit2";
import { getCrmRecordId, type CrmRecord } from "../api/crm.service";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { readText, fullName } from "./recordFormatters";
import { consultantStatusValue, consultantStatusLabel } from "./consultantFormatters";
import { ModalShell } from "./ModalShell";
import { CrmIcon } from "./CrmIcon";
import { TableHead, TableCell , TableLoadingRows , TableEmptyRow  } from "./TableCells";



import { SmallActionButton } from "./ActionButtons";

export function AgencyAgentsModal({
  agency,
  agents,
  isLoading,
  onClose,
  onEdit,
}: {
  agency: CrmRecord | null;
  agents: CrmRecord[];
  isLoading: boolean;
  onClose: () => void;
  onEdit: (agent: CrmRecord) => void;
}) {
  if (!agency) return null;

  return (
    <ModalShell onClose={onClose}>
      <section
        className="max-h-[calc(100vh-64px)] w-[min(900px,calc(100vw-64px))] overflow-hidden rounded-xl bg-white shadow-[0_24px_70px_rgba(14,34,68,0.18)]"
        dir="rtl"
      >
        <div className="flex h-16 items-center justify-between border-b border-[#f0f0f0] px-6">
          <div>
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="m-0 text-base font-bold"
            >
              مشاوران {readText(agency, ["name"], "آژانس")}
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="m-0 mt-1 text-sm text-[#919aa8]"
            >
              فهرست مشاوران وابسته به این آژانس
            </Typography>
          </div>
          <Button
            unstyled
            aria-label="بستن"
            className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f5f8] text-[#596477]"
            onClick={onClose}
            type="button"
          >
            <CrmIcon name="close" size={18} />
          </Button>
        </div>
        <div className="max-h-[calc(100vh-160px)] overflow-auto p-6">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-right">
            <thead>
              <tr>
                <TableHead>نام مشاور</TableHead>
                <TableHead>شماره موبایل</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableLoadingRows columns={5} rows={5} />
              ) : agents.length ? (
                agents.map((agent) => {
                  const status = consultantStatusValue(agent);
                  return (
                    <tr key={getCrmRecordId(agent)}>
                      <TableCell>
                        <strong>{fullName(agent)}</strong>
                      </TableCell>
                      <TableCell>
                        <Typography
                          as="span"
                          variant="body"
                          size="medium"
                          weight="regular"
                          dir="ltr"
                        >
                          {readText(agent, ["mobile", "phone"], "-")}
                        </Typography>
                      </TableCell>
                      <TableCell>{agent.type === "independent" ? "مستقل" : "وابسته"}</TableCell>
                      <TableCell>
                        <Typography
                          as="span"
                          variant="label"
                          size="small"
                          weight="semibold"
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${status === "accept" ? "bg-[#ebfaf3] text-[#0b8b55]" : status === "reject" ? "bg-[#fff0f0] text-[#cc3342]" : "bg-[#fff7df] text-[#a06a00]"}`}
                        >
                          {consultantStatusLabel(status)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <SmallActionButton
                          icon={<LinearEdit2 className="h-4 w-4" />}
                          label="ویرایش"
                          onClick={() => onEdit(agent)}
                          tone="primary"
                        />
                      </TableCell>
                    </tr>
                  );
                })
              ) : (
                <TableEmptyRow columns={5} message="مشاوری برای این آژانس ثبت نشده است." />
              )}
            </tbody>
          </table>
        </div>
      </section>
    </ModalShell>
  );
}
