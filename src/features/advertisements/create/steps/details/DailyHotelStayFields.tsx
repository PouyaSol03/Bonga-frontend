import { SelectBox } from "../../components/NewAdControls";
import { dailyRentalPeriodOptions, minStayDaysOptions, rentPetPolicyOptions, timeOptions } from "../../data";
import type { NewAdFormValues, SelectKey } from "../../types";
import { formatMinStayDaysLabel } from "../../utils";
import type { SetDetailsField } from "./types";

export function DailyHotelStayFields({
  values,
  setField,
  openSelectSheet,
}: {
  values: NewAdFormValues;
  setField: SetDetailsField;
  openSelectSheet: (key: SelectKey, title: string, options: string[]) => void;
}) {
  return (
    <>
      <SelectBox
        onClear={() => setField("rentalPeriod", "")}
        onClick={() => openSelectSheet("rentalPeriod", "دوره اجاره", dailyRentalPeriodOptions)}
        placeholder="دوره اجاره"
        value={values.rentalPeriod}
      />
      <SelectBox
        onClear={() => setField("minStayDays", "")}
        onClick={() => openSelectSheet("minStayDays", "حداقل مدت اقامت", minStayDaysOptions)}
        placeholder="حداقل مدت اقامت"
        value={formatMinStayDaysLabel(values.minStayDays)}
      />
      <SelectBox
        onClear={() => setField("checkInTime", "")}
        onClick={() => openSelectSheet("checkInTime", "ساعت ورود", timeOptions)}
        placeholder="ساعت ورود"
        value={values.checkInTime}
      />
      <SelectBox
        onClear={() => setField("checkOutTime", "")}
        onClick={() => openSelectSheet("checkOutTime", "ساعت خروج", timeOptions)}
        placeholder="ساعت خروج"
        value={values.checkOutTime}
      />
      <SelectBox
        onClear={() => setField("petPolicy", "")}
        onClick={() => openSelectSheet("petPolicy", "حیوان خانگی", rentPetPolicyOptions)}
        placeholder="حیوان خانگی"
        value={values.petPolicy}
      />
    </>
  );
}
