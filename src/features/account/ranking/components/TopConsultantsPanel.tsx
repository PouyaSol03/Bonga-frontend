import { Typography } from "../../../../shared/ui/Typography";
import { usePublicAgentsQuery } from "../../../agencies/api/agency.hooks";
import { formatOptionalNumber } from "../rankingHelpers";

export function TopConsultantsPanel() {
  const consultantsQuery = usePublicAgentsQuery({ page: 1, perPage: 10, sort: "score" });
  const consultants = consultantsQuery.data?.data ?? [];

  return (
    <section
      className="bg-surface-container-lowest h-[509px] rounded-2xl p-4"
      aria-label="10 مشاور برتر"
    >
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 text-right"
      >
        10 مشاور برتر
      </Typography>
      <div className="mt-4">
        <div className="text-outline flex h-9.25 items-start pt-1 text-sm font-normal [direction:ltr]">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="w-[41px] text-center"
          >
            امتیاز
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="flex-1 text-right [direction:rtl]"
          >
            رتبه و نام مشاور
          </Typography>
        </div>
        <div className="bg-outline-var h-px" aria-hidden="true" />
        {consultantsQuery.isPending ? (
          <div className="animate-pulse space-y-2 py-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-container-high/40 h-9 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          consultants.map((consultant, index) => (
            <div
              className={`flex h-10 items-center gap-1 p-2 text-sm [direction:ltr] ${
                index % 2 === 1 ? "bg-surface-container rounded-lg" : ""
              }`}
              key={consultant.id}
            >
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="medium"
                className="w-6.25 text-center font-medium"
              >
                {formatOptionalNumber(consultant.score)}
              </Typography>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="flex-1 text-right font-normal [direction:rtl]"
              >
                {consultant.fullName}
              </Typography>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="w-5 text-center font-normal [direction:ltr]"
              >
                .{formatOptionalNumber(consultant.rank)}
              </Typography>
            </div>
          ))
        )}
        {!consultantsQuery.isPending && consultants.length === 0 ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline m-0 mx-auto w-full py-6 text-center"
          >
            اطلاعات مشاوران برتر از سرور دریافت نشده است.
          </Typography>
        ) : null}
      </div>
    </section>
  );
}
