type ClassValue = string | number | null | boolean | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

/** "10:42 AM" for today, "Yesterday", or a short date — mirrors how WhatsApp
 * itself timestamps a conversation list. Returns "—" for a null timestamp
 * (a patient record with no message history yet). */
export function formatConversationTimestamp(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round((startOfToday.getTime() - startOfDate.getTime()) / 86_400_000);

  if (dayDiff <= 0) return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (dayDiff === 1) return "Yesterday";
  if (dayDiff < 7) return date.toLocaleDateString(undefined, { weekday: "short" });
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** "08:14 AM" — a bare time for inside a chat thread where every bubble
 * already sits under a date divider. */
export function formatMessageTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

/** "04:12" elapsed since a timestamp — the Escalation Queue's wait-time
 * readout. Computed once at render time (not a live ticking clock). */
export function formatElapsedSince(iso: string): string {
  const start = new Date(iso).getTime();
  if (Number.isNaN(start)) return "--:--";
  const diffSeconds = Math.max(0, Math.floor((Date.now() - start) / 1000));
  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
