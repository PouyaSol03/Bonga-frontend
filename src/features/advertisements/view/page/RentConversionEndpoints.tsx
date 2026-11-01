import { Typography } from "../../../../shared/ui/Typography";
import { formatRentNumberText } from "./rentNumberText";

export function RentConversionEndpoints({baseMortgage,baseRent,limitMortgage,limitRent}: {baseMortgage:number;baseRent:number;limitMortgage:number;limitRent:number}) { return (
      <div className="text-on-surface-var mt-3 flex items-start justify-between text-xs leading-5 font-medium [direction:rtl]">
        <div className="text-right">
          <div>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-outline"
            >
              رهن:{" "}
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-on-surface-var"
            >
              {formatRentNumberText(baseMortgage)}
            </Typography>
          </div>
          <div>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-outline"
            >
              اجاره:{" "}
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-on-surface-var"
            >
              {formatRentNumberText(baseRent)}
            </Typography>
          </div>
        </div>
        <div className="text-left">
          <div>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-outline"
            >
              رهن:{" "}
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-on-surface-var"
            >
              {formatRentNumberText(limitMortgage)}
            </Typography>
          </div>
          <div>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-outline"
            >
              اجاره:{" "}
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-on-surface-var"
            >
              {formatRentNumberText(limitRent)}
            </Typography>
          </div>
        </div>
      </div>

); }
