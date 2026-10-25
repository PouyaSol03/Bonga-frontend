import { expect, test } from "@playwright/test";
import { getPublisherContactActions } from "../../../src/features/advertisements/view/details/adContactActions";

test.describe("Single Ad Contact Button Labels by Publisher Type", () => {
  test("ad 295 payload (publisher_type: user) yields personal labels: chat is 'چت' and call is 'تماس با کاربر'", () => {
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

    const actions = getPublisherContactActions(ad295);

    expect(actions.category).toBe("user");
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

  test("consultant publisher (publisher_type: agent / agency-consultant) yields consultant labels: 'چت با مشاور' and 'تماس با مشاور'", () => {
    const consultantAd1 = {
      id: 301,
      publisher_type: "agency-consultant",
      publisher_agent_id: 15,
    };

    const actions1 = getPublisherContactActions(consultantAd1);
    expect(actions1.category).toBe("agent");
    expect(actions1.chatLabel).toBe("چت با مشاور");
    expect(actions1.callLabel).toBe("تماس با مشاور");

    const consultantAd2 = {
      id: 302,
      publisher_type: "agent",
      publisher_agent_id: 15,
    };

    const actions2 = getPublisherContactActions(consultantAd2);
    expect(actions2.category).toBe("agent");
    expect(actions2.chatLabel).toBe("چت با مشاور");
    expect(actions2.callLabel).toBe("تماس با مشاور");
  });
});
