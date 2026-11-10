import { AdCardTomanIcon } from "../../components/AdCardIcons";
import { Typography } from "../../../../shared/ui/Typography";
import { formatRentNumberText } from "./rentNumberText";

export function RentConversionAmounts({currentMortgage,currentRent}: {currentMortgage:number;currentRent:number}) { return (
      <div className="grid grid-cols-2 gap-3 [direction:rtl]">
        <div className="bg-surface-container-low border-outline-var flex h-17 flex-col items-center gap-y-1 rounded-lg border p-2">
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-on-surface-var"
          >
            رهن
          </Typography>
          <div className="flex items-center gap-1.5 [direction:rtl]">
            <Typography
              as="span"
              variant="label"
              size="large"
              weight="semibold"
              className="text-on-surface"
            >
              {formatRentNumberText(currentMortgage)}
            </Typography>
            <AdCardTomanIcon className="text-on-surface-var h-6 w-6" />
          </div>
        </div>
        <div className="bg-surface-container-low border-outline-var flex h-17 flex-col items-center gap-y-1 rounded-lg border p-2">
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-on-surface-var"
          >
            اجاره ماهیانه
          </Typography>
          <div className="flex items-center gap-1.5 [direction:rtl]">
            <Typography
              as="span"
              variant="label"
              size="large"
              weight="semibold"
              className="text-on-surface"
            >
              {formatRentNumberText(currentRent)}
            </Typography>
            <AdCardTomanIcon className="text-on-surface-var h-6 w-6" />
          </div>
        </div>
      </div>

      

); }
