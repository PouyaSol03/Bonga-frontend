import { elevatorCountOptions } from "../../data";
import type { NewAdFormValues } from "../../types";
import type { SetDetailsField, OpenDetailsSheet } from "./types";
import { toggleArray } from "./formatters";

export function useDetailsFacilities(
  values: NewAdFormValues,
  setField: SetDetailsField,
  setSheet: OpenDetailsSheet,
) {
  const handleFacilityClick = (id: string) => {
    if (id === "elevator") {
      if (values.facilities.includes("elevator")) {
        setField(
          "facilities",
          values.facilities.filter((facilityId) => facilityId !== "elevator"),
        );
        setField("elevatorCount", "");
        return;
      }

      setSheet({
        kind: "select",
        key: "elevatorCount",
        title: "تعداد آسانسور",
        options: elevatorCountOptions,
      });
      return;
    }

    if (id === "parking") {
      if (values.facilities.includes("parking")) {
        setField(
          "facilities",
          values.facilities.filter((facilityId) => facilityId !== "parking"),
        );
        setField("parkingCount", "");
        return;
      }

      setSheet({
        kind: "select",
        key: "parkingCount",
        title: "تعداد پارکینگ",
        options: elevatorCountOptions,
      });
      return;
    }

    if (id === "terrace") {
      if (values.facilities.includes("terrace")) {
        setField(
          "facilities",
          values.facilities.filter((facilityId) => facilityId !== "terrace"),
        );
        setField("terraceCount", "");
        return;
      }

      setSheet({
        kind: "select",
        key: "terraceCount",
        title: "تعداد تراس",
        options: elevatorCountOptions,
      });
      return;
    }

    setField("facilities", toggleArray(values.facilities, id));
  };

  return handleFacilityClick;
}
