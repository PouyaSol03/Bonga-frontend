import LinearArrowLeft1 from "../../../../../shared/icons/LinearArrowLeft1";
import { Typography } from "../../../../../shared/ui/Typography";
import { Button } from "../../../../../shared/ui/Button";
import { Tag } from "../../components/NewAdControls";
import type { NewAdFieldErrors } from "../../types";
import type { PricingValues, SetDetailsField } from "./types";

export function MobileExchangeField({ values, errors, setField, onOpenExchange }: {
  values: Pick<PricingValues, "exchangeTargets">;
  errors: NewAdFieldErrors;
  setField: SetDetailsField;
  onOpenExchange: () => void;
}) {
  const hasItems = values.exchangeTargets.length > 0;
  const hasError = Boolean(errors.exchangeTargets);

  return (
    <div
      data-field-key="exchangeTargets"
      className="border-outline-var mt-3 rounded-2xl border p-4"
    >
      <div
        className={`flex items-center justify-between [direction:rtl] ${
          hasItems || hasError ? "mb-3" : ""
        }`}
      >
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="medium"
          className="text-on-surface [direction:rtl]"
        >
          معاوضه با
        </Typography>

        <Button
          unstyled
          className="text-primary flex items-center gap-1"
          onClick={() =>
            onOpenExchange()
          }
          type="button"
        >
          <Typography as="span" variant="label" size="medium" weight="medium">
            انتخاب
          </Typography>
          <LinearArrowLeft1 aria-hidden="true" className="h-5 w-5" />
        </Button>
      </div>

      {hasItems ? (
        <div className="flex flex-wrap justify-start gap-2" dir="rtl">
          {values.exchangeTargets.map((target) => (
            <Tag
              className="h-9 px-2 py-0"
              key={target}
              label={target}
              onRemove={() =>
                setField(
                  "exchangeTargets",
                  values.exchangeTargets.filter((item) => item !== target),
                )
              }
            />
          ))}
        </div>
      ) : null}

      {hasError ? (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-error m-0 mt-3 text-right"
        >
          {errors.exchangeTargets}
        </Typography>
      ) : null}
    </div>
  );
}
