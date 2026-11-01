import { describe, expect, test } from "vitest";
import { getPublisherContactActions } from "../../../src/features/advertisements/view/details/adContactActions";

describe("Single Ad Contact Button Labels by Publisher Type", () => {
  test("ad 295 payload (publisher_type: user / personal) yields personal labels: chat is 'چت' and call is 'تماس با کاربر'", () => {
    const ad295 = {
      id: 295,
      owner_type: "personal",
      publisher_type: "user",
      publisher_user_id: 23,
      contacts: {
        phone: null,
        chat: true,
        telegram: null,
        instagram: null,
        whatsapp: null,
      },
    };

    const actions = getPublisherContactActions(
      ad295 as unknown as Parameters<typeof getPublisherContactActions>[0],
    );

    expect(actions.category).toBe("personal");
    expect(actions.chatLabel).toBe("چت");
    expect(actions.callLabel).toBe("تماس با کاربر");
  });

  test("personal publisher (publisher_type: personal) yields personal labels", () => {
    const personalAd = {
      id: 296,
      publisher_type: "personal",
    };

    const actions = getPublisherContactActions(personalAd);

    expect(actions.category).toBe("personal");
    expect(actions.chatLabel).toBe("چت");
    expect(actions.callLabel).toBe("تماس با کاربر");
  });

  test("agency publisher (publisher_type: agency) yields agency labels: 'چت با آژانس' and 'تماس با آژانس'", () => {
    const agencyAd = {
      id: 300,
      owner_type: "agency",
      publisher_type: "agency",
      publisher_agency_id: 10,
    };

    const actions = getPublisherContactActions(agencyAd);

    expect(actions.category).toBe("agency");
    expect(actions.chatLabel).toBe("چت با آژانس");
    expect(actions.callLabel).toBe("تماس با آژانس");
  });

  test("consultant publisher (publisher_type: agency-consultant) yields consultant labels: 'چت با مشاور' and 'تماس با مشاور'", () => {
    const consultantAd = {
      id: 301,
      publisher_type: "agency-consultant",
      publisher_agent_id: 15,
    };

    const actions = getPublisherContactActions(consultantAd);
    expect(actions.category).toBe("agency-consultant");
    expect(actions.chatLabel).toBe("چت با مشاور");
    expect(actions.callLabel).toBe("تماس با مشاور");
    expect(actions.chatActionLabel).toBe("شروع گفتگو با مشاور");
  });
});
