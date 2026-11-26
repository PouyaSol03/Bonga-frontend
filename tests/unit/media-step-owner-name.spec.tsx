import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { blankValues } from "../../src/features/advertisements/create/constants/initialValues";
import { MediaStep } from "../../src/features/advertisements/create/steps/MediaStep";
import type { NewAdFormValues } from "../../src/features/advertisements/create/types";

// Mock queries and shared auth
vi.mock("../../src/features/account/api/account.hooks", () => ({
  useMyProfileQuery: () => ({
    data: {
      name: "حسین",
      family: "رضایی",
      mobile: "09123456789",
    },
  }),
  useMyAgencyProfileQuery: () => ({ data: null }),
}));

vi.mock("../../src/features/agencies/api/agency-consultants.hooks", () => ({
  useAgencyConsultantsQuery: () => ({ data: null }),
}));

vi.mock("../../src/shared/auth/auth-storage", () => ({
  getActiveAuthRole: () => "real_estate_manager",
  getStoredAuthSession: () => ({
    mobile: "09123456789",
  }),
}));

vi.mock("../../src/features/advertisements/create/utils/routeAndDraftState", () => ({
  getParams: () => ({
    publisherType: "agency",
    transaction: "sale",
    category: "apartment",
  }),
}));

let root: Root;
let container: HTMLDivElement;
let form: UseFormReturn<NewAdFormValues>;
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function TestFlow({
  isEditMode = false,
  showMedia = true,
}: {
  isEditMode?: boolean;
  showMedia?: boolean;
}) {
  return showMedia ? (
    <MediaStep
      isEditMode={isEditMode}
      label="آپلود عکس و اطلاعات"
      onBack={() => {}}
      onSubmit={() => {}}
    />
  ) : (
    <div data-testid="details-step">صفحه مشخصات</div>
  );
}

function Wrapper({
  initialValues,
  isEditMode = false,
  showMedia = true,
}: {
  initialValues: Partial<NewAdFormValues>;
  isEditMode?: boolean;
  showMedia?: boolean;
}) {
  const methods = useForm<NewAdFormValues>({
    defaultValues: { ...blankValues, ...initialValues },
    mode: "onChange",
  });
  form = methods;

  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider {...methods}>
        <TestFlow isEditMode={isEditMode} showMedia={showMedia} />
      </FormProvider>
    </QueryClientProvider>
  );
}

describe("MediaStep ownerFullName reset prevention on step remount and edit mode", () => {
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("populates profileFullName on first mount in agency flow for new ads", async () => {
    await act(async () => {
      root.render(
        <Wrapper
          initialValues={{
            registrantType: "agency",
            ownerFullName: "",
            agencyContactInitialized: false,
          }}
        />,
      );
    });

    expect(form.getValues("ownerFullName")).toBe("حسین رضایی");
    expect(form.getValues("agencyContactInitialized")).toBe(true);
  });

  it("preserves cleared ownerFullName when leaving to details and returning to media step", async () => {
    // 1. Mount MediaStep
    await act(async () => {
      root.render(
        <Wrapper
          initialValues={{
            registrantType: "agency",
            ownerFullName: "",
            agencyContactInitialized: false,
          }}
          showMedia={true}
        />,
      );
    });

    expect(form.getValues("ownerFullName")).toBe("حسین رضایی");

    // 2. User clears the owner name field
    await act(async () => {
      form.setValue("ownerFullName", "", { shouldDirty: true });
    });
    expect(form.getValues("ownerFullName")).toBe("");

    // 3. User navigates back to Details step (MediaStep unmounts)
    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <FormProvider {...form}>
            <TestFlow isEditMode={false} showMedia={false} />
          </FormProvider>
        </QueryClientProvider>,
      );
    });
    expect(container.textContent).toContain("صفحه مشخصات");

    // 4. User navigates back to Media step (MediaStep remounts)
    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <FormProvider {...form}>
            <TestFlow isEditMode={false} showMedia={true} />
          </FormProvider>
        </QueryClientProvider>,
      );
    });

    // ownerFullName MUST remain empty and not get overwritten with profileFullName!
    expect(form.getValues("ownerFullName")).toBe("");
  });

  it("does not populate profileFullName in isEditMode even when ownerFullName is empty", async () => {
    await act(async () => {
      root.render(
        <Wrapper
          initialValues={{
            registrantType: "agency",
            ownerFullName: "",
            agencyContactInitialized: true,
          }}
          isEditMode={true}
        />,
      );
    });

    expect(form.getValues("ownerFullName")).toBe("");
  });

  it("preserves cleared ownerFullName across steps during edit mode", async () => {
    // 1. Mount MediaStep in edit mode with existing name
    await act(async () => {
      root.render(
        <Wrapper
          initialValues={{
            registrantType: "agency",
            ownerFullName: "مالک قبلی",
            agencyContactInitialized: true,
          }}
          isEditMode={true}
          showMedia={true}
        />,
      );
    });

    expect(form.getValues("ownerFullName")).toBe("مالک قبلی");

    // 2. User clears owner name
    await act(async () => {
      form.setValue("ownerFullName", "", { shouldDirty: true });
    });
    expect(form.getValues("ownerFullName")).toBe("");

    // 3. Navigate away and back
    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <FormProvider {...form}>
            <TestFlow isEditMode={true} showMedia={false} />
          </FormProvider>
        </QueryClientProvider>,
      );
    });

    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <FormProvider {...form}>
            <TestFlow isEditMode={true} showMedia={true} />
          </FormProvider>
        </QueryClientProvider>,
      );
    });

    expect(form.getValues("ownerFullName")).toBe("");
  });
});
