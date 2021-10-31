const dateFmtOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
} as const;

const datetimeFmtOptions = {
  ...dateFmtOptions,
  hour: "numeric",
  minute: "numeric",
} as const;

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", dateFmtOptions);
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("en-US", datetimeFmtOptions);
}
