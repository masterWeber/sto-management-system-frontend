import dayjs from "dayjs";

export function formatDate(value: string | Date): string {
  return dayjs(value).format("DD.MM.YYYY");
}

export function formatDateTime(value: string | Date): string {
  return dayjs(value).format("DD.MM.YYYY HH:mm");
}

export function toIso(value: string | Date): string {
  return dayjs(value).toISOString();
}
