import type { PropsWithChildren, ReactNode } from "react";
import { useNavigate } from "react-router";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { TopBar } from "../../../../shared/components/TopBar";

export type TopBarProps = {
  action?: ReactNode;
  onBack?: () => void;
  title: string;
};

export type AccountToast = {
  message: string;
  title: string;
  variant: "error" | "success" | "info" | "warning";
};

export function AccountPageShell({
  action,
  children,
  onBack,
  title,
}: PropsWithChildren<TopBarProps>) {
  const navigate = useNavigate();
  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account"
        onBack={onBack ?? (() => navigate("/account", { replace: true }))}
        startSlot={
          <div className="flex h-12 w-12 shrink-0 items-center justify-center">{action}</div>
        }
        title={title}
      />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </PageFrame>
  );
}
