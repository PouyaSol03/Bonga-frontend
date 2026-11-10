import type { Dispatch, SetStateAction } from "react";
import { EditorChecklistField } from "./EditorChecklistField";
import { EditorLocationField } from "./EditorLocationField";
import { EditorStandardField } from "./EditorStandardField";
import type { ModalField } from "./types";
type Props = {
  field: ModalField;
  values: Record<string, string>;
  setValues: Dispatch<SetStateAction<Record<string, string>>>;
};

export function EditorField(props: Props) {
  const type = props.field.type;
  if (["map-point", "neighborhood-multi", "sub-neighborhoods", "geofence"].includes(type ?? ""))
    return <EditorLocationField {...props} />;
  if (type === "checklist") return <EditorChecklistField {...props} />;
  return <EditorStandardField {...props} />;
}
