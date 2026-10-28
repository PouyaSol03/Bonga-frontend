import type { ReactNode } from "react";

export function ModalShell({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[#1a1a1a]/35 p-8 backdrop-blur-[2px]"
      onMouseDown={() => onClose?.()}
    >
      <div onMouseDown={(event) => event.stopPropagation()}>{children}</div>
    </div>
  );
}
