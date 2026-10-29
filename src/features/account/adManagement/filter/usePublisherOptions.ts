import { useMemo, useState } from "react";
import { useAgencyConsultantsQuery } from "../../../agencies/api/agency.hooks";
import { useMyAgencyProfileQuery } from "../../api/account.hooks";
import type { PublisherFilterOption } from "./types";

export function usePublisherOptions(isOpen: boolean, value?: string) {
  const [query, setQuery] = useState("");
  const agencyQuery = useMyAgencyProfileQuery({ enabled: isOpen });
  const consultantsQuery = useAgencyConsultantsQuery({
    enabled: isOpen,
    page: 1,
    perPage: 100,
  });

  const publisherOptions = useMemo<PublisherFilterOption[]>(() => {
    const options: PublisherFilterOption[] = [];
    const agencyName = agencyQuery.data?.name?.trim();

    if (agencyName) {
      options.push({
        id: String(agencyQuery.data?.id ?? agencyQuery.data?._id ?? "agency"),
        image: agencyQuery.data?.logo ?? agencyQuery.data?.img ?? undefined,
        name: agencyName,
        type: "agency",
      });
    }

    (consultantsQuery.data?.data ?? []).forEach((consultant) => {
      if (!consultant.name?.trim()) return;
      const id = String(consultant.agentId ?? consultant.userId);

      options.push({
        id,
        image: consultant.avatar,
        name: consultant.name.trim(),
        type: "consultant",
      });
    });

    return options;
  }, [agencyQuery.data, consultantsQuery.data]);

  const selectedPublisher = publisherOptions.find(
    (publisherOption) => publisherOption.name === value,
  );
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPublishers = useMemo(
    () =>
      normalizedQuery
        ? publisherOptions.filter((publisherOption) =>
            publisherOption.name.toLowerCase().includes(normalizedQuery),
          )
        : publisherOptions,
    [normalizedQuery, publisherOptions],
  );

  return {
    filteredPublishers,
    isLoading: agencyQuery.isLoading || consultantsQuery.isLoading,
    query,
    selectedPublisher,
    setQuery,
  };
}
