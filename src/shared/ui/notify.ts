"use client";

import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/shared/api/api-error";

export function notifyError(error: unknown) {
  notifications.show({
    color: "red",
    title: "Ошибка",
    message: getErrorMessage(error),
  });
}

export function notifySuccess(message: string) {
  notifications.show({
    color: "green",
    title: "Готово",
    message,
  });
}
