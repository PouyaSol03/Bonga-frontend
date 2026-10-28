import { getCrmRecordId, type CrmRecord } from "../api/crm.service";
import { Typography } from "../../../shared/ui/Typography";
import { readText, getCategoryChildren, getCategoryLabel } from "./recordFormatters";
import { CrmIcon } from "./CrmIcon";

export function CategoryTree({
  categories,
  depth = 0,
  onEdit,
}: {
  categories: CrmRecord[];
  depth?: number;
  onEdit: (category: CrmRecord) => void;
}) {
  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const id = getCrmRecordId(category);
        const children = getCategoryChildren(category);

        return (
          <div key={id || `${getCategoryLabel(category)}-${depth}`}>
            <div
              className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-[#f0f0f0] bg-white px-4 transition hover:border-[#d9e2f2] hover:bg-[#fbfcff]"
              style={{ marginRight: depth * 24 }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]"
                >
                  <CrmIcon name="category" size={18} />
                </Typography>
                <div className="min-w-0">
                  <strong className="block truncate text-sm text-[#1a1a1a]">
                    {getCategoryLabel(category)}
                  </strong>
                  <small className="mt-1 block truncate text-sm text-[#969eab]">
                    {readText(category, ["code", "slug"], id)}
                  </small>
                </div>
              </div>
              {/* <SmallActionButton label="ویرایش" onClick={() => onEdit(category)} /> */}
            </div>
            {children.length ? (
              <div className="mt-2">
                <CategoryTree categories={children} depth={depth + 1} onEdit={onEdit} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
