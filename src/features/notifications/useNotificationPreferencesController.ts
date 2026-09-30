import { useEffect, useState } from "react";
import type { NotificationCategory } from "./api/notification.service";
import {
  useNotificationPreferencesQuery,
  useUpdateNotificationPreferenceMutation,
} from "./api/notification.hooks";
import { allPreferenceCategories } from "./types";

export function useNotificationPreferencesController() {
  const preferencesQuery = useNotificationPreferencesQuery();
  const updatePreferenceMutation = useUpdateNotificationPreferenceMutation();
  const [optimisticPreferences, setOptimisticPreferences] = useState<
    Partial<Record<NotificationCategory, boolean>>
  >({});
  const [pendingCategories, setPendingCategories] = useState<
    Set<NotificationCategory>
  >(() => new Set());

  const preferenceMap = new Map<NotificationCategory, boolean>(
    (preferencesQuery.data ?? []).map((preference) => [
      preference.category,
      preference.enabled,
    ]),
  );

  allPreferenceCategories.forEach((category) => {
    const optimisticValue = optimisticPreferences[category];
    if (optimisticValue !== undefined) {
      preferenceMap.set(category, optimisticValue);
    }
  });

  useEffect(() => {
    if (!preferencesQuery.data) return;

    setOptimisticPreferences((current) => {
      const next = { ...current };
      let hasChanges = false;

      preferencesQuery.data.forEach((preference) => {
        if (
          next[preference.category] !== undefined &&
          next[preference.category] === preference.enabled
        ) {
          delete next[preference.category];
          hasChanges = true;
        }
      });

      return hasChanges ? next : current;
    });
  }, [preferencesQuery.data]);

  const allNotificationsEnabled = allPreferenceCategories.every(
    (category) => preferenceMap.get(category) ?? true,
  );

  const updateCategory = async (
    category: NotificationCategory,
    enabled: boolean,
  ) => {
    const previousOptimisticValue = optimisticPreferences[category];
    setOptimisticPreferences((current) => ({ ...current, [category]: enabled }));
    setPendingCategories((current) => new Set(current).add(category));

    try {
      await updatePreferenceMutation.mutateAsync({ category, enabled });
    } catch {
      setOptimisticPreferences((current) => {
        if (current[category] !== enabled) return current;
        const next = { ...current };
        if (previousOptimisticValue === undefined) {
          delete next[category];
        } else {
          next[category] = previousOptimisticValue;
        }
        return next;
      });
      void preferencesQuery.refetch();
    } finally {
      setPendingCategories((current) => {
        const next = new Set(current);
        next.delete(category);
        return next;
      });
    }
  };

  const updateAllCategories = async (enabled: boolean) => {
    const previousOptimisticValues = { ...optimisticPreferences };

    setOptimisticPreferences((current) => {
      const next = { ...current };
      allPreferenceCategories.forEach((category) => {
        next[category] = enabled;
      });
      return next;
    });
    setPendingCategories(
      (current) => new Set([...current, ...allPreferenceCategories]),
    );

    try {
      for (const category of allPreferenceCategories) {
        await updatePreferenceMutation.mutateAsync({ category, enabled });
      }
    } catch {
      setOptimisticPreferences((current) => {
        const next = { ...current };
        allPreferenceCategories.forEach((category) => {
          if (current[category] !== enabled) return;
          const previousValue = previousOptimisticValues[category];
          if (previousValue === undefined) {
            delete next[category];
          } else {
            next[category] = previousValue;
          }
        });
        return next;
      });
      void preferencesQuery.refetch();
    } finally {
      setPendingCategories((current) => {
        const next = new Set(current);
        allPreferenceCategories.forEach((category) => next.delete(category));
        return next;
      });
    }
  };

  const hasPendingCategories = pendingCategories.size > 0;

  return {
    allNotificationsEnabled,
    hasPendingCategories,
    pendingCategories,
    preferenceMap,
    preferencesQuery,
    updateAllCategories,
    updateCategory,
  };
}
