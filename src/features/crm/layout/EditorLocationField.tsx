import type { Dispatch, SetStateAction } from "react";
import { CityPointEditor } from "./CityPointEditor";
import { DEFAULT_CENTER } from "./constants";
import { CrmNeighborhoodMultiField } from "./CrmNeighborhoodMultiField";
import { CrmSubNeighborhoodsField } from "./CrmSubNeighborhoodsField";
import { NeighborhoodPolygonEditor } from "./NeighborhoodPolygonEditor";
import type { ModalField } from "./types";
type Props = {
  field: ModalField;
  values: Record<string, string>;
  setValues: Dispatch<SetStateAction<Record<string, string>>>;
};
export function EditorLocationField({ field, values, setValues }: Props) {
  const value = values[field.name] ?? "";
  if (field.type === "map-point") {
    return (
      <div className="col-span-2" key={field.name}>
        <label className="mb-2 block text-sm font-bold text-[#4d4d4d]">{field.label}</label>
        <CityPointEditor
          onChange={(point) => {
            setValues((current) => ({
              ...current,
              [field.name]: JSON.stringify(point),
            }));
          }}
          value={value}
        />
      </div>
    );
  }
  if (field.type === "neighborhood-multi") {
    return (
      <div className="col-span-2" key={field.name}>
        <label className="mb-2 block text-sm font-bold text-[#4f5a6c]">{field.label}</label>
        <CrmNeighborhoodMultiField
          onChange={(ids) => setValues((current) => ({ ...current, [field.name]: ids.join(",") }))}
          value={value}
        />
      </div>
    );
  }
  if (field.type === "sub-neighborhoods") {
    return (
      <div className="col-span-2" key={field.name}>
        <label className="mb-2 block text-sm font-bold text-[#4f5a6c]">{field.label}</label>
        <CrmSubNeighborhoodsField
          lat={Number(values.lat) || DEFAULT_CENTER[0]}
          lng={Number(values.lng) || DEFAULT_CENTER[1]}
          onChange={(nextValue) =>
            setValues((current) => ({ ...current, [field.name]: nextValue }))
          }
          value={value}
        />
      </div>
    );
  }
  if (field.type === "geofence") {
    return (
      <div className="col-span-2" key={field.name}>
        <label className="mb-2 block text-sm font-bold text-[#4f5a6c]">{field.label}</label>
        <NeighborhoodPolygonEditor
          lat={Number(values.lat) || DEFAULT_CENTER[0]}
          lng={Number(values.lng) || DEFAULT_CENTER[1]}
          onChange={({ lat, lng, polygon }) => {
            setValues((current) => ({
              ...current,
              lat: String(lat),
              lng: String(lng),
              [field.name]: polygon,
            }));
          }}
          value={value}
        />
      </div>
    );
  }
  return null;
}
