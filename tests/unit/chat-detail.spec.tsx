import { act, useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../render";
import { UserChatDetailPage } from "../../src/features/chat/UserChatHomePage";

const mocks = vi.hoisted(() => ({
  on: vi.fn<(event: string, handler: (payload: unknown) => void) => void>(),
  off: vi.fn<(event: string, handler: (payload: unknown) => void) => void>(), join: vi.fn(), leave: vi.fn(), read: vi.fn(),
  text: vi.fn(() => Promise.resolve()), image: vi.fn(), location: vi.fn(), typing: vi.fn(),
  upload: vi.fn(), refetch: vi.fn(), notice: vi.fn(),
}));
vi.mock("../../src/features/chat/api/chat-socket", () => ({
  joinChatThread: mocks.join, leaveChatThread: mocks.leave, markChatRead: mocks.read,
  sendChatTextMessage: mocks.text, sendChatImageMessage: mocks.image,
  sendChatLocationMessage: mocks.location, sendChatTyping: mocks.typing,
}));
vi.mock("../../src/features/chat/api/chat.hooks", () => ({
  useChatEntryQuery: () => ({ data: { id: "thread-1", category: "advertise", participant: { name: "Alice" } } }),
  useChatMessagesQuery: () => ({ data: [], isLoading: false, refetch: mocks.refetch }),
  useBlockChatMutation: () => ({ isPending: false, mutate: vi.fn() }),
  useUnblockChatMutation: () => ({ isPending: false, mutate: vi.fn() }),
  useDeleteChatMutation: () => ({ mutate: vi.fn() }),
}));
vi.mock("../../src/features/chat/api/chat.service", () => ({ uploadChatAttachment: mocks.upload }));
vi.mock("../../src/shared/hooks/useTransientNotice", () => ({ useTransientNotice: () => ({ showNotice: mocks.notice }) }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.join.mockReturnValue({ on: mocks.on, off: mocks.off });
  HTMLElement.prototype.scrollTo = vi.fn();
  window.history.replaceState({}, "", "/chat/thread-1");
});

describe("chat detail characterization", () => {
  it("subscribes and removes the exact socket handlers on unmount", async () => {
    let unmount = () => {};
    function Host() {
      const [shown, setShown] = useState(true);
      unmount = () => setShown(false);
      return shown ? <UserChatDetailPage /> : null;
    }
    await render(<Host />);
    expect(mocks.join).toHaveBeenCalledWith(expect.objectContaining({ threadId: "thread-1", category: "advertise" }));
    expect(mocks.on.mock.calls.map(([event]) => event)).toEqual(["chat:message:new", "chat:typing", "chat:read", "chat:error"]);
    expect(mocks.read).toHaveBeenCalledWith("thread-1", "advertise");
    await act(async () => unmount());
    for (const [event, handler] of mocks.on.mock.calls) {
      expect(mocks.off).toHaveBeenCalledWith(event, handler);
    }
    expect(mocks.leave).toHaveBeenCalledWith("thread-1", "advertise");
  });
  it("renders socket messages, ignores malformed payloads, filters read receipts", async () => {
    const container = await render(<UserChatDetailPage />);
    const handler = (event: string) => mocks.on.mock.calls.find(([name]) => name === event)![1];
    await act(async () => handler("chat:message:new")({ data: { message: { id: "one", body: "Incoming" } } }));
    expect(container.textContent).toContain("Incoming");
    await act(async () => handler("chat:message:new")({ data: [] }));
    await act(async () => handler("chat:read")({ threadId: "other" }));
    expect(mocks.refetch).not.toHaveBeenCalled();
    await act(async () => handler("chat:read")({ threadId: "thread-1" }));
    expect(mocks.refetch).toHaveBeenCalledOnce();
  });
  it("validates all file sizes before image filtering; never uploads invalid files", async () => {
    const container = await render(<UserChatDetailPage />);
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
    const file = new File(["x"], "large.txt", { type: "text/plain" });
    Object.defineProperty(file, "size", { value: 10 * 1024 * 1024 + 1 });
    Object.defineProperty(input, "files", { configurable: true, value: [file] });
    await act(async () => input.dispatchEvent(new Event("change", { bubbles: true })));
    expect(mocks.upload).not.toHaveBeenCalled();
    Object.defineProperty(input, "files", { configurable: true, value: [new File(["x"], "text.txt", { type: "text/plain" })] });
    await act(async () => input.dispatchEvent(new Event("change", { bubbles: true })));
    expect(mocks.upload).not.toHaveBeenCalled();
  });
  it("uploads images, forwards metadata, replaces optimistic echo", async () => {
    mocks.upload.mockResolvedValue({ status: true, url: "images/a.jpg", file_name: "server.jpg", mime_type: "image/jpeg", size: 1 });
    const container = await render(<UserChatDetailPage />);
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
    const file = new File(["x"], "a.jpg", { type: "image/jpeg" });
    Object.defineProperty(input, "files", { configurable: true, value: [file] });
    await act(async () => input.dispatchEvent(new Event("change", { bubbles: true })));
    expect(mocks.upload).toHaveBeenCalledWith("thread-1", file);
    expect(mocks.image).toHaveBeenCalledWith({ attachmentUrl: "images/a.jpg", category: "advertise", fileName: "server.jpg", mimeType: "image/jpeg", size: 1, threadId: "thread-1" });
    const handler = mocks.on.mock.calls.find(([event]) => event === "chat:message:new")![1];
    await act(async () => handler({ message: { id: "echo", type: "image", metadata: { attachment_url: "images/a.jpg", file_name: "server.jpg" } } }));
    expect(container.querySelectorAll('img[alt="server.jpg"]')).toHaveLength(1);
  });
});
