"use client";

import type { FormEvent, ReactNode } from "react";
import { Button, Group, Modal, Stack } from "@mantine/core";

export function FormModal({
  opened,
  onClose,
  title,
  onSubmit,
  submitting,
  submitLabel = "Сохранить",
  children,
}: {
  opened: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting?: boolean;
  submitLabel?: string;
  children: ReactNode;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form onSubmit={onSubmit}>
        <Stack>
          {children}
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" loading={submitting}>
              {submitLabel}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
