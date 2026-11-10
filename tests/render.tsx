import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach } from "vitest";

const cleanups: Array<() => void> = [];

afterEach(() => {
  cleanups
    .splice(0)
    .reverse()
    .forEach((cleanup) => cleanup());
});

export async function render(ui: ReactNode, status = "published") {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity, gcTime: 0 } },
  });
  client.setQueryData(["advertisement", "history", "ad-130", "user"], []);
  for (const [key, enabled] of [
    ["re-register-status", status === "wait_for_repost"],
    ["archive-status", status === "archived"],
    ["submit-result-status", status === "wait_for_deal_confirmation"],
  ] as const) {
    client.setQueryData(["advertisement", key, "ad-130", "user"], { status: enabled });
  }
  client.setQueryData(["agencies", "public-detail", "101"], {});
  cleanups.push(() => {
    act(() => root.unmount());
    client.clear();
    container.remove();
  });
  await act(async () => {
    root.render(
      <MemoryRouter>
        <QueryClientProvider client={client}>{ui}</QueryClientProvider>
      </MemoryRouter>,
    );
  });
  return container;
}
