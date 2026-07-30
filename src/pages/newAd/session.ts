import type { FlowStep, NewAdFormValues } from "./types";

export const preserveNewAdDraftStateKey = "__bongaPreserveNewAdDraft";

type NewAdFlowSession = {
  step: FlowStep;
  values: NewAdFormValues;
};

let activeSession: NewAdFlowSession | null = null;

function cloneValues(values: NewAdFormValues): NewAdFormValues {
  try {
    return structuredClone(values);
  } catch {
    return {
      ...values,
      dailyHotelRooms: values.dailyHotelRooms.map((room) => ({ ...room })),
      exchangeTargets: [...values.exchangeTargets],
      facilities: [...values.facilities],
      heatingCooling: [...values.heatingCooling],
      photos: values.photos.map((photo) => ({ ...photo })),
      projectDetails: values.projectDetails.map((item) => ({ ...item })),
      selectedSpecs: [...values.selectedSpecs],
      video: values.video ? { ...values.video } : null,
    };
  }
}

export function saveNewAdFlowSession(
  values: NewAdFormValues,
  step: FlowStep,
) {
  activeSession = {
    step,
    values: cloneValues(values),
  };
}

export function getNewAdFlowSession() {
  if (!activeSession) return null;

  return {
    step: activeSession.step,
    values: cloneValues(activeSession.values),
  } satisfies NewAdFlowSession;
}

export function updateNewAdFlowSessionLocation(location: string) {
  if (!activeSession) return;

  activeSession = {
    ...activeSession,
    values: {
      ...cloneValues(activeSession.values),
      location,
    },
  };
}

export function clearNewAdFlowSession() {
  activeSession = null;
}

export function shouldPreserveNewAdDraft(state: unknown) {
  return (
    Boolean(state) &&
    typeof state === "object" &&
    !Array.isArray(state) &&
    (state as Record<string, unknown>)[preserveNewAdDraftStateKey] === true
  );
}
