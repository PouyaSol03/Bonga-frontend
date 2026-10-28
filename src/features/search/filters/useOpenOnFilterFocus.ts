import { useState, useEffect } from "react";

export function useOpenOnFilterFocus(sectionId?: string, focusTarget?: string | null) {
  const [openedTarget, setOpenedTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionId || focusTarget !== sectionId || openedTarget === sectionId) return;

    setOpenedTarget(sectionId);
  }, [focusTarget, openedTarget, sectionId]);

  return openedTarget !== sectionId && Boolean(sectionId && focusTarget === sectionId);
}
