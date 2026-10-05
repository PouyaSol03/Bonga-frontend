import LinearUserSolid from "../../../../../shared/icons/LinearUserSolid";
import { SelectionCheckIndicator } from "../../../../../shared/components/SelectionCheckIndicator";
import { SearchEmptyState } from "../../../../../shared/components/SearchEmptyState";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import NoSearchIcon from "../../../../../shared/assets/icons/NoSearch.svg";
import type { PublicAgentListDto } from "../../../../agencies/api/agency.service";

function AddConsultantEmptyState() {
  return (
    <div className="mx-auto flex h-[104px] w-full items-center justify-center gap-3 bg-surface-container-lowest px-4 text-center">
      <img src={NoSearchIcon} alt="" className="h-[40px] w-[40px]" />
      <Typography as="span" variant="label" size="medium" weight="medium" className="font-medium text-outline">
        مشاوری برای نمایش نیست!
      </Typography>
    </div>
  );
}

export function AddConsultantSearchResults({
  hasSearch,
  isLoading,
  isSearchReady,
  onSelectAgent,
  results,
  selectedAgentId,
}: {
  hasSearch: boolean;
  isLoading: boolean;
  isSearchReady: boolean;
  onSelectAgent: (id: string) => void;
  results: PublicAgentListDto[];
  selectedAgentId: string | null;
}) {
  if (hasSearch && results.length > 0) {
    return (
      <section className="bg-surface-container-lowest px-4 py-4">
        <Typography as="h2" variant="title" size="small" weight="semibold" className="m-0 text-xs font-semibold leading-5 text-on-surface">
          نتیجه جستجو
        </Typography>
        <div className="mt-3 space-y-2">
          {results.map((consultant) => {
            const isSelected = selectedAgentId === consultant.id;

            return (
              <Button
                unstyled
                aria-pressed={isSelected}
                className={`flex h-[76px] w-full items-center gap-3 rounded-xl border px-3 text-right transition ${
                  isSelected
                    ? "border-primary bg-primary-container"
                    : "border-outline-var bg-surface-container-lowest"
                }`}
                key={consultant.id}
                onClick={() => onSelectAgent(consultant.id)}
                type="button"
              >
                <div className="flex flex-1 gap-x-2">
                  {consultant.avatar ? (
                    <img
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                      draggable={false}
                      src={consultant.avatar}
                    />
                  ) : (
                    <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-container-high text-outline">
                      <LinearUserSolid className="h-6 w-6" />
                    </Typography>
                  )}
                  <div className="flex flex-col justify-center">
                    <Typography as="span" variant="label" size="medium" weight="semibold" className="block truncate text-sm font-semibold text-on-surface">
                      {consultant.fullName}
                    </Typography>
                    <Typography as="span" variant="label" size="small" weight="medium" className="block text-xs font-medium text-outline">
                      {consultant.mobile ?? ""}
                    </Typography>
                  </div>
                </div>
                <SelectionCheckIndicator className="!h-4.5 !w-4.5 rounded-sm" checked={isSelected} />
              </Button>
            );
          })}
        </div>
      </section>
    );
  }

  if (hasSearch && isSearchReady && !isLoading) {
    return <SearchEmptyState />;
  }

  return <AddConsultantEmptyState />;
}
