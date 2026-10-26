import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import type { ReactNode } from "react";

/** Asks before deleting: destructive actions always take a second, explicit click. */
export function ConfirmDelete({
  title,
  visible,
  loading,
  onCancel,
  onConfirm,
  children,
}: {
  title: string;
  visible: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  children: ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      onDismiss={onCancel}
      header={title}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onCancel}>
              Cancelar
            </Button>
            <Button variant="primary" loading={loading} onClick={onConfirm}>
              Apagar
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      {children}
    </Modal>
  );
}
