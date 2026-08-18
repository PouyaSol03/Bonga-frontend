export type FreehandPointerTerminationEvent =
  | "pointerup"
  | "pointercancel"
  | "lostpointercapture";

export type FreehandPointerTerminationAction = "finish" | "cancel" | "ignore";

export function resolveFreehandPointerTermination(
  activePointerId: number | null,
  eventPointerId: number,
  eventType: FreehandPointerTerminationEvent,
): FreehandPointerTerminationAction {
  if (activePointerId === null || activePointerId !== eventPointerId) {
    return "ignore";
  }

  return eventType === "pointerup" ? "finish" : "cancel";
}

export function restoreMapDragging(
  wasEnabledBeforeDrawing: boolean,
  interaction: { enable: () => void; disable: () => void },
) {
  if (wasEnabledBeforeDrawing) {
    interaction.enable();
  } else {
    interaction.disable();
  }
}
