import { ConfirmModal, EditorModal } from "../../CrmLayout";
import type { CrmConsultantsModalsProps } from "../types";

export function CrmConsultantsModals({
  confirm,
  editor,
  isPending,
  notify,
  onCloseConfirm,
  onCloseEditor,
}: CrmConsultantsModalsProps) {
  return (
    <>
      <EditorModal
        editor={editor}
        isPending={isPending}
        notify={notify}
        onClose={onCloseEditor}
      />
      <ConfirmModal
        confirm={confirm}
        notify={notify}
        onClose={onCloseConfirm}
      />
    </>
  );
}
