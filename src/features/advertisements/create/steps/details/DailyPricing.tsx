import { InputBox, Section } from "../../components/NewAdControls";
import type { NewAdFieldErrors } from "../../types";
import { moneySupportingText } from "./formatters";
import type { PricingValues, SetDetailsField } from "./types";


export function DailyPricing({ values, errors, setField, desktop, isDailyHotelRent }: {
  values: PricingValues;
  errors: NewAdFieldErrors;
  setField: SetDetailsField;
  desktop: boolean; isDailyHotelRent: boolean;
}) {
  return (
    <Section icon="money.svg" title="اطلاعات قیمت">
      <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
        <div data-field-key="minPrice">
          <InputBox
            error={errors.minPrice}
            formatNumeric
            numeric
            leftText="تومان"
            onChange={(value) => setField("minPrice", value)}
            placeholder="حداقل قیمت *"
            supportingText={moneySupportingText(values.minPrice)}
            value={values.minPrice}
          />
        </div>
        <div data-field-key="maxPrice">
          <InputBox
            error={errors.maxPrice}
            formatNumeric
            numeric
            leftText="تومان"
            onChange={(value) => setField("maxPrice", value)}
            placeholder="حداکثر قیمت *"
            supportingText={moneySupportingText(values.maxPrice)}
            value={values.maxPrice}
          />
        </div>
      </div>

      {!isDailyHotelRent ? (
        <>
          <div className="border-outline-var my-5 border-t border-dashed" />
          <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            <div data-field-key="normalDailyPrice">
              <InputBox
                error={errors.normalDailyPrice}
                formatNumeric
                numeric
                leftText="تومان"
                onChange={(value) => setField("normalDailyPrice", value)}
                placeholder="روزهای عادی (شنبه تا چهارشنبه) *"
                supportingText={moneySupportingText(values.normalDailyPrice)}
                value={values.normalDailyPrice}
              />
            </div>
            <div data-field-key="weekendDailyPrice">
              <InputBox
                error={errors.weekendDailyPrice}
                formatNumeric
                numeric
                leftText="تومان"
                onChange={(value) => setField("weekendDailyPrice", value)}
                placeholder="آخر هفته (چهار شنبه تا جمعه) *"
                supportingText={moneySupportingText(values.weekendDailyPrice)}
                value={values.weekendDailyPrice}
              />
            </div>
            <div data-field-key="specialDailyPrice">
              <InputBox
                error={errors.specialDailyPrice}
                formatNumeric
                numeric
                leftText="تومان"
                onChange={(value) => setField("specialDailyPrice", value)}
                placeholder="روزهای خاص (تعطیلات و مناسبت ها) *"
                supportingText={moneySupportingText(values.specialDailyPrice)}
                value={values.specialDailyPrice}
              />
            </div>
            <div data-field-key="extraPersonPrice">
              <InputBox
                error={errors.extraPersonPrice}
                formatNumeric
                numeric
                leftText="تومان"
                onChange={(value) => setField("extraPersonPrice", value)}
                placeholder="هزینه هر نفر اضافه"
                supportingText={moneySupportingText(values.extraPersonPrice)}
                value={values.extraPersonPrice}
              />
            </div>
          </div>
        </>
      ) : null}
    </Section>
  );
}
