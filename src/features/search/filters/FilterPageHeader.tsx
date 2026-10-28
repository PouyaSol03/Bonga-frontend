import { type TransactionType, type CategoryKey } from "./categories";
import { useNavigate } from "react-router";
import { TopBar } from "../../../shared/components/TopBar";
import { getBackToSearchPath } from "./filterNavigation";
import { Button } from "../../../shared/ui/Button";
import LinearCategory from "../../../shared/icons/LinearCategory";
import { Typography } from "../../../shared/ui/Typography";
import { FormChoiceChip } from "../../../shared/form/FormControls";
import { getApprovedSelectedCategoryLabel } from "./categoryLabel";

export function FilterPageHeader({
  backBasePath,
  title,
  transaction,
  category,
  openCategoryPicker,
}: {
  backBasePath: string;
  title: string;
  transaction: TransactionType;
  category: CategoryKey;
  openCategoryPicker: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="bg-surface-container shrink-0">
      <TopBar
        backTo={getBackToSearchPath(backBasePath)}
        centerClassName="px-0"
        className="bg-surface-container"
        onBack={() => {
          if (window.history.state?.idx > 0) navigate(-1);
          else navigate(getBackToSearchPath(backBasePath), { replace: true });
        }}
        title={title}
      />

      <div className="border-surface-container bg-surface-container-lowest border-b-8 px-4 py-3">
        <Button
          unstyled
          className="flex w-full items-center justify-between gap-3 text-right"
          dir="rtl"
          onClick={openCategoryPicker}
          type="button"
        >
          <div className="text-on-surface flex items-center gap-2 text-sm font-medium">
            <LinearCategory className="h-6 w-6" />
            <Typography as="span" variant="label" size="large" weight="medium">
              انتخاب دسته
            </Typography>
          </div>

          <FormChoiceChip
            label={getApprovedSelectedCategoryLabel(transaction, category)}
            selected
            onClick={openCategoryPicker}
          />
        </Button>
      </div>
    </div>
  );
}
