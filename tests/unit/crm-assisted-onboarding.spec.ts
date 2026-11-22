import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  generateRequestId,
  createCrmUser,
  saveCrmUser,
  createCrmAgency,
  createCrmAgencyAdvertise,
  createCrmUserAdvertise,
} from "../../src/features/crm/api/crm.service";

const mocks = vi.hoisted(() => ({
  postCalls: [] as Array<{ endpoint: string; options?: unknown }>,
}));

vi.mock("../../src/shared/api/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/shared/api/api")>();
  return {
    ...actual,
    api: {
      post: (endpoint: string, options?: unknown) => {
        mocks.postCalls.push({ endpoint, options });
        return {
          json: async () => ({
            status: true,
            data: { id: 99, ...((options as { json?: unknown })?.json as object) },
          }),
        };
      },
    },
  };
});

describe("CRM Assisted Onboarding APIs", () => {
  beforeEach(() => {
    mocks.postCalls = [];
  });

  describe("generateRequestId", () => {
    it("generates a valid UUID v4 format", () => {
      const id = generateRequestId();
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("generates unique IDs across calls", () => {
      const id1 = generateRequestId();
      const id2 = generateRequestId();
      expect(id1).not.toBe(id2);
    });
  });

  describe("createCrmUser (POST /api/v1/panel/user/create)", () => {
    it("posts user creation payload without reason or request_id", async () => {
      await createCrmUser({
        name: "Ali",
        family: "Ahmadi",
        mobile: "09121234567",
      });

      expect(mocks.postCalls).toHaveLength(1);
      const call = mocks.postCalls[0];
      expect(call.endpoint).toBe("panel/user/create");
      const json = (call.options as { json: Record<string, unknown> }).json;
      expect(json.name).toBe("Ali");
      expect(json.family).toBe("Ahmadi");
      expect(json.mobile).toBe("09121234567");
      expect(json.reason).toBeUndefined();
      expect(json.request_id).toBeUndefined();
    });

    it("saveCrmUser with null id delegates to createCrmUser without reason or request_id", async () => {
      await saveCrmUser(null, {
        name: "Reza",
        family: "Rad",
        mobile: "09129876543",
      });

      expect(mocks.postCalls).toHaveLength(1);
      expect(mocks.postCalls[0].endpoint).toBe("panel/user/create");
      const json = (mocks.postCalls[0].options as { json: Record<string, unknown> }).json;
      expect(json.name).toBe("Reza");
      expect(json.family).toBe("Rad");
      expect(json.mobile).toBe("09129876543");
      expect(json.reason).toBeUndefined();
      expect(json.request_id).toBeUndefined();
    });
  });

  describe("createCrmAgency (POST /api/v1/panel/agency/create)", () => {
    it("posts agency creation payload without reason or request_id", async () => {
      await createCrmAgency({
        name: "املاک نمونه",
        phone1: "02188888888",
        address: "خیابان ولیعصر، پلاک ۱",
        owner_user_id: 42,
        neighborhood_id: 10,
        lat: 35.7123,
        lng: 51.4123,
      });

      expect(mocks.postCalls).toHaveLength(1);
      const call = mocks.postCalls[0];
      expect(call.endpoint).toBe("panel/agency/create");
      const json = (call.options as { json: Record<string, unknown> }).json;
      expect(json.name).toBe("املاک نمونه");
      expect(json.phone1).toBe("02188888888");
      expect(json.address).toBe("خیابان ولیعصر، پلاک ۱");
      expect(json.owner_user_id).toBe(42);
      expect(json.neighborhood_id).toBe(10);
      expect(json.lat).toBe(35.7123);
      expect(json.lng).toBe(51.4123);
      expect(json.reason).toBeUndefined();
      expect(json.request_id).toBeUndefined();
    });
  });

  describe("createCrmAgencyAdvertise (POST /api/v1/panel/agency/:agencyId/advertise/create)", () => {
    it("posts agency advertisement with JSON without reason or request_id and sanitizes owner_type and agency_id", async () => {
      const adData = {
        title: "آپارتمان ۱۲۰ متری",
        meterage: 120,
        owner_type: "agency",
        target_owner_type: "agency",
        target_owner_id: 55,
        images: ["uploads/image/advertiseImg/photo1.jpg"],
        features: [
          { key: "area", value: 120 },
          { key: "agency_id", value: 55 },
        ],
      };

      await createCrmAgencyAdvertise(55, {
        advertisement: adData,
      });

      expect(mocks.postCalls).toHaveLength(1);
      const call = mocks.postCalls[0];
      expect(call.endpoint).toBe("panel/agency/55/advertise/create");
      const json = (call.options as { json: Record<string, unknown> }).json;
      expect(json).toBeDefined();
      expect(json.reason).toBeUndefined();
      expect(json.request_id).toBeUndefined();

      const sentAd = json.advertisement as Record<string, unknown>;
      expect(sentAd.owner_type).toBeUndefined();
      expect(sentAd.target_owner_type).toBeUndefined();
      expect(sentAd.target_owner_id).toBeUndefined();
      expect(sentAd.title).toBe("آپارتمان ۱۲۰ متری");
      expect(sentAd.images).toEqual(["uploads/image/advertiseImg/photo1.jpg"]);
      expect(sentAd.features).toEqual([{ key: "area", value: 120 }]);
    });

    it("creates user advertisement via POST /panel/personal/:userId/advertise/create with JSON body", async () => {
      const adData = {
        title: "آپارتمان ۷۵ متری",
        meterage: 75,
        owner_type: "user",
        target_owner_type: "user",
        target_owner_id: 27,
        images: ["uploads/image/advertiseImg/photo2.jpg"],
        features: [
          { key: "area", value: 75 },
          { key: "has_virtual_tour", value: false },
        ],
      };

      await createCrmUserAdvertise(27, {
        advertisement: adData,
      });

      expect(mocks.postCalls).toHaveLength(1);
      const call = mocks.postCalls[0];
      expect(call.endpoint).toBe("panel/personal/27/advertise/create");
      const json = (call.options as { json: Record<string, unknown> }).json;
      expect(json).toBeDefined();
      expect(json.reason).toBeUndefined();
      expect(json.request_id).toBeUndefined();

      const sentAd = json.advertisement as Record<string, unknown>;
      expect(sentAd.owner_type).toBeUndefined();
      expect(sentAd.target_owner_type).toBeUndefined();
      expect(sentAd.target_owner_id).toBeUndefined();
      expect(sentAd.title).toBe("آپارتمان ۷۵ متری");
      expect(sentAd.images).toEqual(["uploads/image/advertiseImg/photo2.jpg"]);
      expect(sentAd.features).toEqual([{ key: "area", value: 75 }]);
    });

    it("does not include files as data URLs in buildCrmAdvertisePayload", async () => {
      const { buildCrmAdvertisePayload } = await import(
        "../../src/features/advertisements/create/edit-mapping/crmEditNormalizer"
      );
      const { getDefaultValues } = await import(
        "../../src/features/advertisements/create/utils/defaultValues"
      );

      const base = getDefaultValues();
      const values = {
        ...base,
        title: "ویلای شمال",
        description: "ویو عالی",
        photos: [
          {
            id: "p1",
            name: "existing.jpg",
            size: 100,
            type: "image/jpeg",
            previewUrl: "https://bonga.exirfirm.com/uploads/photo.jpg",
            existingValue: "uploads/photo.jpg",
          },
        ],
        targetOwnerType: "agency" as const,
        targetOwnerId: 55,
      };

      const payload = await buildCrmAdvertisePayload(values);
      expect(payload.images).toEqual(["uploads/photo.jpg"]);
      expect(payload.images[0]).not.toContain("data:image/");
    });

    it("does not include build_permit for apartment sale", async () => {
      const { buildCrmAdvertisePayload } = await import(
        "../../src/features/advertisements/create/edit-mapping/crmEditNormalizer"
      );
      const { getDefaultValues } = await import(
        "../../src/features/advertisements/create/utils/defaultValues"
      );

      // Simulate apartment sale URL state
      window.history.replaceState({}, "", "/new-ad/details?transaction=sale&category=apartment&editSource=crm");

      const base = getDefaultValues();
      const values = {
        ...base,
        title: "آپارتمان فروش",
        meterage: "100",
        rooms: "2",
        floor: "3",
      };

      const payload = await buildCrmAdvertisePayload(values);
      const buildPermitFeature = payload.features.find((f) => f.key === "build_permit");
      expect(buildPermitFeature).toBeUndefined();

      const hasVirtualTourFeature = payload.features.find((f) => f.key === "has_virtual_tour");
      expect(hasVirtualTourFeature).toBeUndefined();

      const hasImageFeature = payload.features.find((f) => f.key === "has_image");
      expect(hasImageFeature).toBeUndefined();

      const agencyIdFeature = payload.features.find((f) => f.key === "agency_id");
      expect(agencyIdFeature).toBeUndefined();
    });

    it("filters features strictly by dynamicFieldKeys when provided", async () => {
      const { buildCrmAdvertisePayload } = await import(
        "../../src/features/advertisements/create/edit-mapping/crmEditNormalizer"
      );
      const { getDefaultValues } = await import(
        "../../src/features/advertisements/create/utils/defaultValues"
      );

      const base = getDefaultValues();
      const values = {
        ...base,
        title: "آپارتمان فروش",
        meterage: "100",
        rooms: "2",
        floor: "3",
        hasVirtualTour: true,
        virtualTourLink: "https://tour.example.com",
      };

      const payload = await buildCrmAdvertisePayload(values, {}, {
        dynamicFieldKeys: ["meterage", "rooms", "floor"],
      });

      expect(payload.virtual_tour_link).toBe("https://tour.example.com");
      expect(payload.features.map((f) => f.key).sort()).toEqual(["floor", "meterage", "rooms"]);
    });
  });

  describe("getCrmAdvertiseCreatePath with owner options", () => {
    it("builds query path with target owner and optional owner contact info", async () => {
      const { getCrmAdvertiseCreatePath } = await import(
        "../../src/features/crm/crmAdvertiseNavigation"
      );

      const path = getCrmAdvertiseCreatePath({
        targetOwnerType: "agency",
        targetOwnerId: 42,
        agencyName: "املاک بهشت",
        ownerFullName: "حسن محمدی",
        ownerPhone: "09121112233",
        ownerExactAddress: "خیابان ولیعصر، کوچه دوم",
      });

      expect(path).toContain("editSource=crm");
      expect(path).toContain("targetOwnerType=agency");
      expect(path).toContain("targetOwnerId=42");
      expect(path).toContain("agencyId=42");
      expect(path).toContain("ownerFullName=%D8%AD%D8%B3%D9%86+%D9%85%D8%AD%D9%85%D8%AF%DB%8C");
      expect(path).toContain("ownerPhone=09121112233");
      expect(path).toContain("ownerExactAddress=");
    });
  });

  describe("CRM ad creation defaultValues initialization", () => {
    it("initializes agency and owner fields from query parameters without personal fallback", async () => {
      const { getDefaultValues } = await import(
        "../../src/features/advertisements/create/utils/defaultValues"
      );

      const oldSearch = window.location.search;
      try {
        window.history.replaceState(
          {},
          "",
          "/new/apartment-sell?editSource=crm&targetOwnerType=agency&targetOwnerId=88&targetOwnerName=%D8%A7%D9%85%D9%84%D8%A7%DA%A9+%D9%86%D9%85%D9%88%D9%86%D9%87&ownerFullName=%D8%B9%D9%84%DB%8C&ownerPhone=09301234567&ownerExactAddress=%D9%BE%D9%84%D8%A7%DA%A9+1",
        );

        const values = getDefaultValues();
        expect(values.registrantType).toBe("agency");
        expect(values.agencyId).toBe("88");
        expect(values.publisherName).toBe("املاک نمونه");
        expect(values.targetOwnerType).toBe("agency");
        expect(values.targetOwnerId).toBe("88");
        expect(values.ownerFullName).toBe("علی");
        expect(values.ownerPhone).toBe("09301234567");
        expect(values.ownerExactAddress).toBe("پلاک 1");
      } finally {
        window.history.replaceState({}, "", oldSearch || "/");
      }
    });

    it("initializes user ad values without personal-to-agency assignment", async () => {
      const { getDefaultValues } = await import(
        "../../src/features/advertisements/create/utils/defaultValues"
      );

      const oldSearch = window.location.search;
      try {
        window.history.replaceState(
          {},
          "",
          "/new/apartment-sell?editSource=crm&targetOwnerType=user&targetOwnerId=55",
        );

        const values = getDefaultValues();
        expect(values.registrantType).toBe("personal");
        expect(values.targetOwnerType).toBe("user");
        expect(values.targetOwnerId).toBe("55");
        expect(values.agencyId).toBe("");
      } finally {
        window.history.replaceState({}, "", oldSearch || "/");
      }
    });
  });
});
