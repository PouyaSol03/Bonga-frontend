import type { Meta, StoryObj } from "@storybook/react-vite";
import { NoConnectionState, ServerErrorState, NotFoundErrorState } from "./ErrorState";

const meta: Meta = {
  title: "Shared Components/ErrorState",
  tags: ["autodocs"],
};

export default meta;

export const NoConnection: StoryObj<typeof NoConnectionState> = {
  render: () => (
    <div className="h-[400px] border border-dashed border-gray-200">
      <NoConnectionState onRetry={() => alert("در حال اتصال مجدد...")} />
    </div>
  ),
};

export const ServerError: StoryObj<typeof ServerErrorState> = {
  render: () => (
    <div className="h-[400px] border border-dashed border-gray-200">
      <ServerErrorState onRetry={() => alert("درخواست مجدد به سرور...")} />
    </div>
  ),
};

export const NotFound: StoryObj<typeof NotFoundErrorState> = {
  render: () => (
    <div className="h-[400px] border border-dashed border-gray-200">
      <NotFoundErrorState onRetry={() => alert("تلاش مجدد")} />
    </div>
  ),
};
