import { useEffect, useMemo, useState } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import type { CrmSubNeighborhoodDraft } from "./types";
import { parseCrmSubNeighborhoods, createSubNeighborhoodId } from "./subNeighborhoods";
import { stringifyValue } from "./recordFormatters";
import { NeighborhoodPolygonEditor } from "./NeighborhoodPolygonEditor";
import { miniGhostButtonClassName, modalInputClassName } from "./constants";

export function CrmSubNeighborhoodsField({
  lat,
  lng,
  onChange,
  value,
}: {
  lat: number;
  lng: number;
  onChange: (value: string) => void;
  value: string;
}) {
  const items = useMemo(() => parseCrmSubNeighborhoods(value), [value]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeItem = items.find((item) => item.id === activeId) ?? null;

  useEffect(() => {
    if (activeId && !items.some((item) => item.id === activeId)) {
      setActiveId(null);
    }
  }, [activeId, items]);

  const commit = (nextItems: CrmSubNeighborhoodDraft[]) => {
    onChange(JSON.stringify(nextItems, null, 2));
  };

  const updateItem = (id: string, patch: Partial<CrmSubNeighborhoodDraft>) => {
    commit(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    const id = createSubNeighborhoodId();
    commit([...items, { geofence: null, id, name: "" }]);
    setActiveId(id);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dce3ef] bg-[#f8faff]">
      <div className="flex items-center justify-between gap-3 border-b border-[#dce3ef] px-4 py-3">
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="m-0 text-sm leading-6 text-[#596477]"
        >
          هر زیرمحله داخل همین محله ذخیره می‌شود و شناسه، نام و محدوده جغرافیایی مستقل دارد.
        </Typography>
        <Button unstyled className={miniGhostButtonClassName} onClick={addItem} type="button">
          افزودن زیرمحله
        </Button>
      </div>

      <div className="space-y-3 p-4">
        {items.length === 0 ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="m-0 rounded-xl border border-dashed border-[#cfd8e6] bg-white px-4 py-5 text-center text-sm text-[#8b94a3]"
          >
            هنوز زیرمحله‌ای برای این محله اضافه نشده است.
          </Typography>
        ) : (
          items.map((item, index) => (
            <div
              className="rounded-xl border border-[#dce3ef] bg-white p-3"
              key={`${item.id}-${index}`}
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                <label>
                  <Typography
                    as="span"
                    variant="label"
                    size="small"
                    weight="medium"
                    className="mb-1.5 block text-xs text-[#596477]"
                  >
                    نام زیرمحله
                  </Typography>
                  <input
                    className={modalInputClassName}
                    onChange={(event) => updateItem(item.id, { name: event.target.value })}
                    placeholder={`زیرمحله ${index + 1}`}
                    value={item.name}
                  />
                </label>
                <label>
                  <Typography
                    as="span"
                    variant="label"
                    size="small"
                    weight="medium"
                    className="mb-1.5 block text-xs text-[#596477]"
                  >
                    شناسه زیرمحله
                  </Typography>
                  <input
                    className={`${modalInputClassName} bg-[#f7f8fa] text-[#7b8494]`}
                    dir="ltr"
                    readOnly
                    value={item.id}
                  />
                </label>
                <div className="flex gap-2">
                  <Button
                    unstyled
                    className={miniGhostButtonClassName}
                    onClick={() => setActiveId((current) => (current === item.id ? null : item.id))}
                    type="button"
                  >
                    {activeId === item.id ? "بستن محدوده" : "محدوده"}
                  </Button>
                  <Button
                    unstyled
                    className={`${miniGhostButtonClassName} text-[#cc3342]`}
                    onClick={() => commit(items.filter((current) => current.id !== item.id))}
                    type="button"
                  >
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activeItem ? (
        <div className="border-t border-[#dce3ef] bg-white p-4">
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="medium"
            className="m-0 mb-3 text-sm text-[#4f5a6c]"
          >
            محدوده زیرمحله {activeItem.name || "بدون نام"}
          </Typography>
          <NeighborhoodPolygonEditor
            lat={lat}
            lng={lng}
            onChange={({ polygon }) => {
              let geofence: unknown = null;
              if (polygon) {
                try {
                  geofence = JSON.parse(polygon) as unknown;
                } catch {
                  geofence = polygon;
                }
              }
              updateItem(activeItem.id, { geofence });
            }}
            value={stringifyValue(activeItem.geofence)}
          />
        </div>
      ) : null}
    </div>
  );
}
