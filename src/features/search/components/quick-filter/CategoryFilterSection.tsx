import { FormChoiceChip, FormSegmentedControl } from "../../../../shared/form/FormControls";
import { Typography } from "../../../../shared/ui/Typography";
import {
  categoryGroupsByTransaction,
  categoryLabels,
  transactionTabs,
  type CategoryKey,
  type TransactionType,
} from "../../filters/categories";

type CategoryFilterSectionProps = {
  category: CategoryKey | undefined;
  onCategoryChange: (category: CategoryKey) => void;
  onTransactionChange: (transaction: TransactionType) => void;
  transaction: TransactionType;
};

export function CategoryFilterSection({
  category,
  onCategoryChange,
  onTransactionChange,
  transaction,
}: CategoryFilterSectionProps) {
  return (
    <div className="space-y-5" dir="rtl">
      <FormSegmentedControl
        ariaLabel="نوع معامله"
        onChange={(value) => {
          onTransactionChange(value);
        }}
        options={transactionTabs}
        value={transaction}
      />

      {categoryGroupsByTransaction[transaction].map((group) => (
        <section key={group.title}>
          <Typography
            as="h3"
            variant="title"
            size="medium"
            weight="medium"
            className="border-outline-var text-outline mb-3 border-b pb-2 text-right"
          >
            {group.title}
          </Typography>
          <div className="flex flex-wrap justify-start gap-2">
            {group.items.map((item) => (
              <FormChoiceChip
                key={item}
                label={categoryLabels[item]}
                onClick={() => onCategoryChange(item)}
                selected={category === item}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
