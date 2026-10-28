import {
  type CategoryKey,
  type TransactionType,
  transactionTabs,
  categoryGroupsByTransaction,
  categoryLabels,
} from "./categories";
import { useNavigate } from "react-router";
import { useState } from "react";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { getBackToSearchPath } from "./filterNavigation";
import { FormSegmentedControl, FormChoiceChip } from "../../../shared/form/FormControls";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

export type CategorySelectionScreenProps = {
  backBasePath?: string;
  initialCategory?: CategoryKey;
  initialTransaction: TransactionType;
  onConfirm: (transaction: TransactionType, category: CategoryKey) => void;
};

export function CategorySelectionScreen({
  backBasePath = "/search",
  initialCategory,
  initialTransaction,
  onConfirm,
}: CategorySelectionScreenProps) {
  const navigate = useNavigate();
  const [draftTransaction, setDraftTransaction] = useState<TransactionType>(initialTransaction);

  const [draftCategory, setDraftCategory] = useState<CategoryKey | undefined>(initialCategory);

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden"
      variant="flush"
    >
      <div className="bg-surface-container shrink-0">
        <TopBar
          backTo={getBackToSearchPath(backBasePath)}
          centerClassName="px-0"
          className="bg-surface-container"
          onBack={() => {
            if (window.history.state?.idx > 0) navigate(-1);
            else navigate(getBackToSearchPath(backBasePath), { replace: true });
          }}
          title="انتخاب دسته‌بندی"
        />

        <div className="bg-surface-container px-4 py-2">
          <FormSegmentedControl
            ariaLabel="نوع معامله"
            onChange={(transaction) => {
              setDraftTransaction(transaction as TransactionType);
              setDraftCategory(undefined);
            }}
            options={transactionTabs}
            showDividers={false}
            value={draftTransaction}
          />
        </div>
      </div>

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-0">
        {categoryGroupsByTransaction[draftTransaction].map((group) => (
          <section key={group.title} className="mb-6 last:mb-0">
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="medium"
              className="border-outline-var text-outline mb-4 border-b pb-2 text-right text-base font-medium"
            >
              {group.title}
            </Typography>

            <div className="flex flex-wrap justify-start gap-2" dir="rtl">
              {group.items.map((item) => (
                <FormChoiceChip
                  key={item}
                  label={categoryLabels[item]}
                  onClick={() => setDraftCategory(item)}
                  selected={draftCategory === item}
                  showCheck
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="bg-surface-container-lowest shrink-0 px-4 py-3 shadow-[0_-4px_10px_rgba(26,26,26,0.04)]">
        <Button
          unstyled
          className="bg-primary text-on-primary flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!draftCategory}
          onClick={() => {
            if (!draftCategory) return;
            onConfirm(draftTransaction, draftCategory);
          }}
          type="button"
        >
          تایید
        </Button>
      </footer>
    </PageFrame>
  );
}
