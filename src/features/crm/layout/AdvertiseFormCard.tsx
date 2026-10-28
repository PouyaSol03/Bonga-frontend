import { type CrmRecord } from "../api/crm.service";
import { Typography } from "../../../shared/ui/Typography";
import { stringifyValue, readText, readArray } from "./recordFormatters";
import { FieldMeta } from "./FieldMeta";

export function AdvertiseFormCard({ form }: { form: CrmRecord }) {
  const fields = readArray(form, "fields") as CrmRecord[];

  return (
    <article className="overflow-hidden rounded-xl border border-[#f0f0f0] bg-white">
      <header className="flex items-start justify-between gap-3 border-b border-[#f0f0f0] bg-[#fafafa] p-4">
        <div className="min-w-0">
          <Typography
            as="h3"
            variant="title"
            size="small"
            weight="semibold"
            className="m-0 truncate text-sm font-bold text-[#1a1a1a]"
          >
            {readText(form, ["title", "code"])}
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="m-0 mt-1 text-sm text-[#9098a6]"
          >
            {readText(form, ["code"])} · {readText(form, ["group"])}
          </Typography>
        </div>
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="semibold"
          className="shrink-0 rounded-full bg-[#eef4ff] px-2.5 py-1 text-sm font-bold text-[#0048c4]"
        >
          {new Intl.NumberFormat("fa-IR").format(fields.length)} فیلد
        </Typography>
      </header>
      <div className="max-h-[420px] divide-y divide-[#edf0f5] overflow-y-auto px-4">
        {fields.map((field, index) => {
          const options = readArray(field, "options") as CrmRecord[];

          return (
            <div className="py-3" key={`${readText(field, ["key"], String(index))}-${index}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <code className="block truncate text-sm font-bold text-[#0048c4]">
                    {readText(field, ["key"])}
                  </code>
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="mt-1 block truncate text-sm text-[#596477]"
                  >
                    {readText(field, ["label"])}
                  </Typography>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-1">
                  <FieldMeta>{readText(field, ["type"])}</FieldMeta>
                  {field.unit ? <FieldMeta>{stringifyValue(field.unit)}</FieldMeta> : null}
                  {field.searchable ? <FieldMeta>قابل جستجو</FieldMeta> : null}
                  {field.required ? <FieldMeta>الزامی</FieldMeta> : null}
                </div>
              </div>
              {options.length ? (
                <Typography
                  as="p"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="m-0 mt-2 line-clamp-2 text-sm leading-5 text-[#929aa8]"
                >
                  گزینه‌ها:{" "}
                  {options
                    .slice(0, 10)
                    .map((option) => readText(option, ["label", "value"]))
                    .join("، ")}
                  {options.length > 10 ? " ..." : ""}
                </Typography>
              ) : null}
            </div>
          );
        })}
      </div>
    </article>
  );
}
