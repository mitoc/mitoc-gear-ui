import dayjs from "dayjs";

export function formatDate(date: string) {
  return dayjs(date).format("MMM D YYYY");
}

export function formatDateTime(date: string) {
  return dayjs(date).format("MMM D YYYY, hh:mma");
}

export function formatDuration(duration: string) {
  return duration.split(":").slice(0, -1).join(":");
}
