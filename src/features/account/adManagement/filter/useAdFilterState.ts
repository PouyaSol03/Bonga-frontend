import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import {
  getAdManagementRouteState,
  type AdManagementPropertyType,
  type AdManagementTransaction,
} from "../adManagementData";
import {
  buildFilters,
  emptyFilters,
  getInitialPropertyTypes,
} from "./filterHelpers";

export function useAdFilterState() {
  const location = useLocation();
  const routeState = useMemo(() => getAdManagementRouteState(location.state), [location.state]);
  const tab = routeState.tab ?? "active";
  const isAssignedTab = tab === "status";
  const initialFilters = routeState.filters ?? emptyFilters;
  const previousOnlyMine = routeState.onlyMine ?? false;

  const [onlyMine, setOnlyMine] = useState(previousOnlyMine);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState(initialFilters.neighborhoods);
  const [transaction, setTransaction] = useState(initialFilters.transaction);
  const [propertyTypes, setPropertyTypes] = useState<AdManagementPropertyType[]>(
    getInitialPropertyTypes(initialFilters),
  );
  const [status, setStatus] = useState(initialFilters.status);
  const [publisher, setPublisher] = useState(initialFilters.publisher);
  const [isPropertyTypePickerOpen, setIsPropertyTypePickerOpen] = useState(false);

  const filters = buildFilters({
    neighborhoods: selectedNeighborhoods,
    propertyTypes,
    publisher: isAssignedTab ? undefined : publisher,
    status: isAssignedTab ? undefined : status,
    transaction,
  });

  const selectTransaction = (nextTransaction: AdManagementTransaction) => {
    const isSelected = transaction === nextTransaction;

    if (isSelected) {
      setTransaction(undefined);
      setPropertyTypes([]);
      return;
    }

    setTransaction(nextTransaction);
    setPropertyTypes([]);
  };

  const confirmPropertyType = (nextPropertyTypes: AdManagementPropertyType[]) => {
    setPropertyTypes(nextPropertyTypes);
    setIsPropertyTypePickerOpen(false);
  };

  const resetFilters = () => {
    setOnlyMine(false);
    setSelectedNeighborhoods([]);
    setTransaction(undefined);
    setPropertyTypes([]);
    setStatus(undefined);
    setPublisher(undefined);
  };

  const removePropertyType = (targetPropertyType: AdManagementPropertyType) => {
    setPropertyTypes((current) => current.filter((item) => item !== targetPropertyType));
  };

  const openPropertyTypePicker = () => {
    if (!transaction) {
      setTransaction("sale");
    }
    setIsPropertyTypePickerOpen(true);
  };

  return {
    confirmPropertyType,
    filters,
    initialFilters,
    isAssignedTab,
    isPropertyTypePickerOpen,
    onlyMine,
    openPropertyTypePicker,
    previousOnlyMine,
    propertyTypes,
    publisher,
    removePropertyType,
    resetFilters,
    selectedNeighborhoods,
    selectTransaction,
    setIsPropertyTypePickerOpen,
    setOnlyMine,
    setPublisher,
    setSelectedNeighborhoods,
    setStatus,
    status,
    tab,
    transaction,
  };
}
