"use client";

import { modals } from "@mantine/modals";

export function confirmDelete(message: string, onConfirm: () => void) {
  modals.openConfirmModal({
    title: "Подтвердите удаление",
    children: message,
    labels: { confirm: "Удалить", cancel: "Отмена" },
    confirmProps: { color: "red" },
    onConfirm,
  });
}
