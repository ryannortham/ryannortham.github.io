export function formatDate(date: Date) {
  return Intl.DateTimeFormat("en-AU", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function readingTime(content: string) {
  const textOnly = content.replace(/<[^>]+>/g, "").trim();
  const wordCount = textOnly ? textOnly.split(/\s+/).length : 0;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

export function dateRange(startDate?: Date, endDate?: Date | string) {
  if (!startDate) return typeof endDate === "string" ? endDate : "Present";

  const format = (date: Date) =>
    date.toLocaleDateString("en-AU", { month: "short", year: "numeric" });
  const end = endDate instanceof Date ? format(endDate) : endDate ?? "Present";

  return `${format(startDate)} – ${end}`;
}
