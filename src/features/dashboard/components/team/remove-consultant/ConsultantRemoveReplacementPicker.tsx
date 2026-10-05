import { useMemo, useState } from "react";
import LinearSearch from "../../../../../shared/icons/LinearSearch";
import { TopBar } from "../../../../../shared/components/TopBar";
import { SearchEmptyState } from "../../../../../shared/components/SearchEmptyState";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import type { TeamConsultant } from "../teamTypes";
import {
  getReplacementSearchText,
  ReplacementOption,
  type ReplacementTarget,
} from "./ReplacementOption";

export * from "./ReplacementOption";

export function ReplacementPicker({
  agencyTarget,
  consultants,
  currentConsultant,
  onClose,
  onConfirm,
  selectedTarget,
}: {
  agencyTarget: ReplacementTarget;
  consultants: TeamConsultant[];
  currentConsultant: TeamConsultant;
  onClose: () => void;
  onConfirm: (target: ReplacementTarget) => void;
  selectedTarget: ReplacementTarget | null;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [draftTarget, setDraftTarget] = useState<ReplacementTarget | null>(selectedTarget);
  const normalizedSearch = searchValue.trim();
  const currentAgentId = currentConsultant.agentId ?? currentConsultant.id;
  const currentUserId = currentConsultant.userId;

  const replacementTargets = useMemo<ReplacementTarget[]>(() => {
    const consultantTargets = consultants
      .filter(
        (item) =>
          item.status === "active" &&
          item.id !== currentAgentId &&
          (currentAgentId === undefined || item.agentId !== currentAgentId) &&
          (currentUserId === undefined || item.userId !== currentUserId),
      )
      .map<ReplacementTarget>((item) => ({
        id: `consultant-${item.agentId ?? item.id}`,
        kind: "consultant",
        consultant: item,
      }));

    return [agencyTarget, ...consultantTargets];
  }, [agencyTarget, consultants, currentAgentId, currentUserId]);

  const visibleTargets = useMemo(() => {
    if (!normalizedSearch) return replacementTargets;
    return replacementTargets.filter((target) =>
      getReplacementSearchText(target).includes(normalizedSearch),
    );
  }, [normalizedSearch, replacementTargets]);

  return (
    <section
      aria-label="انتخاب مشاور جایگزین"
      aria-modal="true"
      className="fixed inset-y-0 left-1/2 z-[1100] flex w-full max-w-[500px] -translate-x-1/2 flex-col overflow-hidden bg-surface-container text-on-surface"
      dir="rtl"
      role="dialog"
    >
      <TopBar
        placement="inline"
        centerClassName="px-0"
        onBack={onClose}
        reserveStartSpace
        title="انتخاب مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto pb-24">
        <div className="bg-surface-container-lowest px-4 pb-5 pt-3">
          <label className="flex h-12 items-center gap-2 rounded-lg border border-outline-var bg-surface-container-lowest px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <input
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-on-surface outline-none placeholder:text-outline"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="جستجوی مشاور"
              type="search"
              value={searchValue}
            />
            <LinearSearch className="h-5 w-5 shrink-0 text-on-surface-var" />
          </label>
        </div>

        <section className="bg-surface-container-lowest px-4 py-4">
          <Typography as="h2" variant="title" size="small" weight="semibold" className="m-0 text-xs font-semibold leading-5 text-on-surface">
            نتیجه جستجو
          </Typography>

          {visibleTargets.length > 0 ? (
            <div className="mt-3 space-y-2">
              {visibleTargets.map((target) => {
                const isSelected = draftTarget?.id === target.id;
                return (
                  <ReplacementOption
                    isSelected={isSelected}
                    key={target.id}
                    onSelect={() => setDraftTarget(target)}
                    target={target}
                  />
                );
              })}
            </div>
          ) : normalizedSearch ? (
            <SearchEmptyState compact />
          ) : (
            <Typography as="p" variant="body" size="medium" weight="medium" className="mx-auto m-0 w-full px-2 py-8 text-center text-sm font-medium leading-6 text-outline">
              مشاور دیگری برای جایگزینی وجود ندارد.
            </Typography>
          )}
        </section>
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-surface-container-lowest px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-3 shadow-sm">
        <Button
          fullWidth
          disabled={!draftTarget}
          size="x-medium"
          variant="primary"
          onClick={() => {
            if (draftTarget) onConfirm(draftTarget);
          }}
          type="button"
        >
          تایید
        </Button>
      </div>
    </section>
  );
}
