// Optimistic, client-only "I've seen this chat" tracking for the Patients
// list row coloring. The real source of truth for red/green is the
// backend's last_message_direction (see types/index.ts), which only flips
// to OUT once staff actually sends a reply — but staff expect a patient
// they just opened to stop looking urgent right away, not after their next
// reply round-trips through the server. We can't know here whether a new
// inbound message arrives later (the list payload carries no per-message
// timestamp to compare against), so this is a deliberate approximation:
// mark it seen locally, bounded by a TTL so a stale override can't persist
// forever if the backend never catches up.
const STORAGE_KEY = "gokavi_patient_visits_v1";
const VISIT_OVERRIDE_TTL_MS = 3 * 60 * 60 * 1000; // matches the staff session timeout

function readStore(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage full/unavailable — the override just won't apply, which is fine.
  }
}

export function markPatientVisited(patientId: string) {
  const store = readStore();
  store[patientId] = new Date().toISOString();
  writeStore(store);
}

export function isRecentlyVisited(patientId: string): boolean {
  const visitedAt = readStore()[patientId];
  if (!visitedAt) return false;
  const elapsed = Date.now() - new Date(visitedAt).getTime();
  return Number.isFinite(elapsed) && elapsed >= 0 && elapsed < VISIT_OVERRIDE_TTL_MS;
}
