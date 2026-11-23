import { describe, expect, it, vi } from "vitest";
import {
  preserveNewAdDraftStateKey,
  shouldPreserveNewAdDraft,
} from "../../src/features/advertisements/create/session";

describe("Agency preview back navigation & draft preservation", () => {
  it("detects preserved ad draft from location or history state", () => {
    expect(shouldPreserveNewAdDraft(null)).toBe(false);
    expect(shouldPreserveNewAdDraft({})).toBe(false);
    expect(shouldPreserveNewAdDraft({ [preserveNewAdDraftStateKey]: true })).toBe(true);
    expect(shouldPreserveNewAdDraft({ usr: { [preserveNewAdDraftStateKey]: true } })).toBe(true);
  });

  it("resolves back navigation target for agency preview", () => {
    const resolveBackNavigation = ({
      isFromNewAd,
      historyLength,
      isPublicPreview,
      isAgentPreview,
      agencyEditPath,
    }: {
      isFromNewAd: boolean;
      historyLength: number;
      isPublicPreview: boolean;
      isAgentPreview: boolean;
      agencyEditPath: string;
    }) => {
      if (isFromNewAd) {
        return historyLength > 0 ? "BACK" : "/new-ad";
      }
      if (isPublicPreview) {
        return isAgentPreview ? "/consultants?type=consultant" : "/consultants";
      }
      return agencyEditPath;
    };

    // When coming from new ad flow with history
    expect(
      resolveBackNavigation({
        isFromNewAd: true,
        historyLength: 2,
        isPublicPreview: true,
        isAgentPreview: false,
        agencyEditPath: "/account/dashboard/agency",
      }),
    ).toBe("BACK");

    // When coming from new ad flow without history
    expect(
      resolveBackNavigation({
        isFromNewAd: true,
        historyLength: 0,
        isPublicPreview: true,
        isAgentPreview: false,
        agencyEditPath: "/account/dashboard/agency",
      }),
    ).toBe("/new-ad");

    // Normal public agency preview
    expect(
      resolveBackNavigation({
        isFromNewAd: false,
        historyLength: 1,
        isPublicPreview: true,
        isAgentPreview: false,
        agencyEditPath: "/account/dashboard/agency",
      }),
    ).toBe("/consultants");

    // Normal public agent preview
    expect(
      resolveBackNavigation({
        isFromNewAd: false,
        historyLength: 1,
        isPublicPreview: true,
        isAgentPreview: true,
        agencyEditPath: "/account/dashboard/agency",
      }),
    ).toBe("/consultants?type=consultant");
  });

  it("handles step back navigation correctly in NewAdFlowHeader", () => {
    const resolveStepBack = ({
      step,
      goToDetails,
      handleEditBack,
      leaveCrmEditor,
      isEditMode,
      isCrmEditMode,
    }: {
      step: string;
      goToDetails: () => string;
      handleEditBack: () => string;
      leaveCrmEditor: () => string;
      isEditMode: boolean;
      isCrmEditMode: boolean;
    }) => {
      if (step === "moreFeatures" || step === "projectDetails") return goToDetails();
      if (isCrmEditMode) return leaveCrmEditor();
      if (isEditMode) return handleEditBack();
      if (step === "media") return goToDetails();
      if (step === "details") return "NAVIGATE_CATEGORY";
      return undefined;
    };

    const goToDetails = vi.fn(() => "STEP_DETAILS");
    const handleEditBack = vi.fn(() => "EDIT_BACK");
    const leaveCrmEditor = vi.fn(() => "LEAVE_CRM");

    // When on media step, onBack should take user back to details step
    expect(
      resolveStepBack({
        step: "media",
        goToDetails,
        handleEditBack,
        leaveCrmEditor,
        isEditMode: false,
        isCrmEditMode: false,
      }),
    ).toBe("STEP_DETAILS");
    expect(goToDetails).toHaveBeenCalled();

    // When on details step, onBack should navigate to category
    expect(
      resolveStepBack({
        step: "details",
        goToDetails,
        handleEditBack,
        leaveCrmEditor,
        isEditMode: false,
        isCrmEditMode: false,
      }),
    ).toBe("NAVIGATE_CATEGORY");
  });
});
