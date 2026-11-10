import { type ReactNode } from "react";
import { TopBar } from "../../../shared/components/TopBar";
import { PageFrame } from "../../../shared/layout/PageFrame";

export type ChatPageShellProps = {
  action?: ReactNode;
  children: ReactNode;
  onBack?: () => void;
  title: string;
};

export function ChatPageShell({ action, children, onBack, title }: ChatPageShellProps) {
  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/chat"
        onBack={onBack}
        startSlot={
          <div className="flex h-12 w-12 shrink-0 items-center justify-center">{action}</div>
        }
        title={title}
      />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </PageFrame>
  );
}
