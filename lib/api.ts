import type {
  AcquisitionChannel,
  AnalyticsOverview,
  AppointmentSlotStatus,
  AuditLogEntry,
  BackendRole,
  CalendarWeek,
  CallAvailabilitySummary,
  CallBooking,
  Conversation,
  Escalation,
  EscalationSeverity,
  EscalationStatusValue,
  EscalationTrigger,
  FollowUpStatus,
  LabResultInput,
  LanguageCode,
  LeadStatus,
  MedicationEntry,
  MedicationOrderInput,
  Message,
  Patient,
  PatientReportEntry,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const TOKEN_KEY = "gokavi.auth.token";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage unavailable (private browsing, etc.) — session just won't persist.
  }
}

// Same keys as lib/auth.tsx's ROLE_KEY/EMAIL_KEY — duplicated here rather
// than imported to avoid a circular import (auth.tsx already imports this
// file). Clears everything auth.tsx's AuthProvider reads on mount, so a
// 401 here (see request() below) can force a real sign-out even though
// this module has no access to React state.
function clearSession(): void {
  setToken(null);
  try {
    window.localStorage.removeItem("gokavi.auth.role");
    window.localStorage.removeItem("gokavi.auth.email");
  } catch {
    // ignore
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  // A FormData body (voice note upload) must NOT get an explicit
  // Content-Type here — the browser sets its own multipart/form-data with
  // the correct boundary, which is lost if we override it.
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(options.body && !isFormData ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message: string = res.statusText || `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") message = body.detail;
    } catch {
      // non-JSON error body — keep statusText
    }
    // A 401 means the token is missing/expired/invalid — never leave the
    // UI sitting there re-rendering stale or empty data as if signed in.
    // Login's own failed-attempt 401 (wrong password) must NOT bounce the
    // user, since they're already on /login trying to get in.
    if (res.status === 401 && path !== "/admin/auth/login") {
      clearSession();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ── Auth ─────────────────────────────────────────────────────────────────

interface RawLoginResponse {
  access_token: string;
  token_type: string;
  role: BackendRole;
}

export async function login(email: string, password: string): Promise<RawLoginResponse> {
  return request<RawLoginResponse>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ── Conversations (Inbox) ───────────────────────────────────────────────────

interface RawConversationSummary {
  patient_id: string;
  patient_name: string | null;
  phone: string;
  lead_status: LeadStatus;
  language: LanguageCode;
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count: number;
}

function mapConversation(raw: RawConversationSummary): Conversation {
  return {
    patientId: raw.patient_id,
    patientName: raw.patient_name,
    phone: raw.phone,
    status: raw.lead_status,
    language: raw.language,
    lastMessageAt: raw.last_message_at,
    lastMessagePreview: raw.last_message_preview,
    unreadCount: raw.unread_count,
  };
}

export async function listConversations(): Promise<Conversation[]> {
  const raw = await request<RawConversationSummary[]>("/admin/conversations");
  return raw.map(mapConversation);
}

interface RawMessage {
  id: string;
  direction: "IN" | "OUT";
  message_type: string;
  body: string | null;
  status: string;
  created_at: string;
  media_url?: string | null;
}

function mapMessage(raw: RawMessage): Message {
  return {
    id: raw.id,
    sender: raw.direction === "IN" ? "patient" : "staff",
    text: raw.body ?? "",
    timestamp: raw.created_at,
    read: raw.direction === "OUT" ? raw.status === "READ" : undefined,
    type: raw.message_type,
    mediaUrl: raw.media_url ?? null,
  };
}

export async function getConversationThread(patientId: string): Promise<Message[]> {
  const raw = await request<RawMessage[]>(`/admin/conversations/${patientId}/messages`);
  return raw.map(mapMessage);
}

export async function sendMessage(patientId: string, body: string): Promise<Message> {
  const raw = await request<RawMessage>(`/admin/conversations/${patientId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
  return mapMessage(raw);
}

export async function sendVoiceNote(patientId: string, audio: Blob, filename = "voice-note.webm"): Promise<Message> {
  const formData = new FormData();
  formData.append("audio", audio, filename);
  const raw = await request<RawMessage>(`/admin/conversations/${patientId}/voice-note`, {
    method: "POST",
    body: formData,
  });
  return mapMessage(raw);
}

// ── Patients ─────────────────────────────────────────────────────────────

interface RawPatientSummary {
  id: string;
  phone: string;
  name: string | null;
  status: string;
  lead_status: LeadStatus;
  blood_group: string | null;
  preferred_language: LanguageCode;
  has_reports: boolean;
  detected_condition: string | null;
  follow_up_status: FollowUpStatus;
  has_replied: boolean;
  last_message_direction: "IN" | "OUT" | null;
  is_blocked: boolean;
  blocked_reason: string | null;
}

function mapPatientSummary(raw: RawPatientSummary): Patient {
  return {
    id: raw.id,
    name: raw.name,
    age: null,
    gender: null,
    bloodGroup: raw.blood_group,
    cycleLabel: null,
    status: raw.lead_status,
    rawStatus: raw.status,
    phone: raw.phone,
    language: raw.preferred_language,
    consents: [],
    hasReports: raw.has_reports,
    hasDiseaseMentioned: raw.detected_condition !== null,
    detectedCondition: raw.detected_condition,
    followUpStatus: raw.follow_up_status,
    hasReplied: raw.has_replied,
    lastMessageDirection: raw.last_message_direction,
    isBlocked: raw.is_blocked,
    blockedReason: raw.blocked_reason,
  };
}

export async function listPatients(
  options?: {
    /** Case-insensitive match against name, phone, or patient code — now
     * server-side, since a page only holds 10-20 rows (see limit/offset). */
    search?: string;
    hasReports?: boolean;
    hasDisease?: boolean;
    followUpStatus?: FollowUpStatus;
    hasReplied?: boolean;
    /** Page size — defaults to the backend's own default (20) when omitted. */
    limit?: number;
    /** Row offset for pagination — 0 for the first page, limit for the second, etc. */
    offset?: number;
  },
): Promise<Patient[]> {
  const params = new URLSearchParams();
  if (options?.search) params.set("search", options.search);
  if (options?.hasReports !== undefined) params.set("has_reports", String(options.hasReports));
  if (options?.hasDisease !== undefined) params.set("has_disease", String(options.hasDisease));
  if (options?.followUpStatus !== undefined) params.set("follow_up_status", options.followUpStatus);
  if (options?.hasReplied !== undefined) params.set("has_replied", String(options.hasReplied));
  if (options?.limit !== undefined) params.set("limit", String(options.limit));
  if (options?.offset !== undefined) params.set("offset", String(options.offset));
  const query = params.toString();
  const raw = await request<RawPatientSummary[]>(`/admin/patients${query ? `?${query}` : ""}`);
  return raw.map(mapPatientSummary);
}

interface RawPatientCounts {
  total: number;
  by_lead_status: Record<LeadStatus, number>;
}

export interface PatientCounts {
  total: number;
  byLeadStatus: Record<LeadStatus, number>;
}

/** Real, unpaginated totals — use this for dashboard/summary numbers.
 * listPatients() above caps at 200 rows for table rendering, so its
 * length silently freezes once there are more than 200 patients; never
 * derive a total from it. */
export async function getPatientCounts(): Promise<PatientCounts> {
  const raw = await request<RawPatientCounts>("/admin/patients/counts");
  return { total: raw.total, byLeadStatus: raw.by_lead_status };
}

interface RawConsent {
  id: string;
  label: string;
  description: string;
  granted: boolean;
  updated_at: string | null;
}

interface RawCycleStep {
  id: string;
  label: string;
  detail: string;
  state: "completed" | "current" | "upcoming";
}

interface RawMedication {
  id: string;
  name: string;
  dosage: string;
  status: string;
}

interface RawPatientReport {
  id: string;
  media_type: string;
  filename: string | null;
  created_at: string;
  download_url: string | null;
}

interface RawPatientDetail {
  id: string;
  phone: string;
  name: string | null;
  age: number | null;
  gender: string | null;
  blood_group: string | null;
  status: string;
  lead_status: LeadStatus;
  preferred_language: LanguageCode;
  consents: RawConsent[];
  reports: RawPatientReport[];
  detected_condition: string | null;
  condition_evidence: string | null;
  follow_up_status: FollowUpStatus;
  has_replied: boolean;
  last_message_direction: "IN" | "OUT" | null;
  is_blocked: boolean;
  blocked_reason: string | null;
  cycle_label?: string | null;
  cycle_progress?: RawCycleStep[];
  medications?: RawMedication[];
}

function mapPatientDetail(raw: RawPatientDetail): Patient {
  return {
    id: raw.id,
    name: raw.name,
    age: raw.age,
    gender: raw.gender,
    bloodGroup: raw.blood_group,
    cycleLabel: raw.cycle_label ?? null,
    status: raw.lead_status,
    rawStatus: raw.status,
    phone: raw.phone,
    language: raw.preferred_language,
    consents: raw.consents.map((c) => ({
      id: c.id,
      label: c.label,
      description: c.description,
      granted: c.granted,
      updatedAt: c.updated_at,
    })),
    hasReports: raw.reports.length > 0,
    reports: raw.reports.map((r) => ({
      id: r.id,
      mediaType: r.media_type as PatientReportEntry["mediaType"],
      filename: r.filename,
      createdAt: r.created_at,
      downloadUrl: r.download_url,
    })),
    hasDiseaseMentioned: raw.detected_condition !== null,
    detectedCondition: raw.detected_condition,
    conditionEvidence: raw.condition_evidence,
    followUpStatus: raw.follow_up_status,
    hasReplied: raw.has_replied,
    lastMessageDirection: raw.last_message_direction,
    isBlocked: raw.is_blocked,
    blockedReason: raw.blocked_reason,
    cycle: raw.cycle_progress?.map((s) => ({ id: s.id, label: s.label, detail: s.detail, state: s.state })),
    medications: raw.medications?.map(
      (m): MedicationEntry => ({
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        status: m.status as MedicationEntry["status"],
      }),
    ),
  };
}

export async function getPatientDetail(id: string): Promise<Patient> {
  const raw = await request<RawPatientDetail>(`/admin/patients/${id}`);
  return mapPatientDetail(raw);
}

export async function updateFollowUpStatus(patientId: string, status: FollowUpStatus): Promise<FollowUpStatus> {
  const raw = await request<{ follow_up_status: FollowUpStatus }>(`/admin/patients/${patientId}/follow-up-status`, {
    method: "POST",
    body: JSON.stringify({ status }),
  });
  return raw.follow_up_status;
}

export async function setPatientBlocked(patientId: string, active: boolean, reason?: string): Promise<boolean> {
  const raw = await request<{ is_blocked: boolean }>(`/admin/patients/${patientId}/block`, {
    method: "POST",
    body: JSON.stringify({ active, reason }),
  });
  return raw.is_blocked;
}

// ── Calendar ─────────────────────────────────────────────────────────────

interface RawCalendarSlot {
  time: string;
  status: AppointmentSlotStatus;
  patient_name: string | null;
  appointment_id: string | null;
}

interface RawCalendarDay {
  day: string;
  date: string;
  closed: boolean;
  slots: RawCalendarSlot[];
}

interface RawCalendarWeek {
  doctor_id: string;
  doctor_name: string;
  week_start: string;
  week_end: string;
  days: RawCalendarDay[];
}

function mapCalendarWeek(raw: RawCalendarWeek): CalendarWeek {
  return {
    doctorId: raw.doctor_id,
    doctorName: raw.doctor_name,
    weekStart: raw.week_start,
    weekEnd: raw.week_end,
    days: raw.days.map((d) => ({
      day: d.day,
      date: new Date(`${d.date}T00:00:00`).getDate(),
      closed: d.closed,
      slots: d.slots.map((s, i) => ({
        id: `${d.date}-${i}`,
        time: s.time,
        status: s.status,
        patientName: s.patient_name,
        appointmentId: s.appointment_id,
      })),
    })),
  };
}

export async function getCalendarWeek(startDate: string, doctorId?: string): Promise<CalendarWeek> {
  const params = new URLSearchParams({ start_date: startDate });
  if (doctorId) params.set("doctor_id", doctorId);
  const raw = await request<RawCalendarWeek>(`/admin/calendar/week?${params.toString()}`);
  return mapCalendarWeek(raw);
}

// ── Escalations ──────────────────────────────────────────────────────────

interface RawEscalation {
  id: string;
  patient_id: string;
  patient_name: string | null;
  patient_phone: string;
  trigger_type: EscalationTrigger;
  severity: EscalationSeverity;
  status: EscalationStatusValue;
  after_hours: boolean;
  created_at: string;
  source_message: string | null;
}

function mapEscalation(raw: RawEscalation): Escalation {
  return {
    id: raw.id,
    patientId: raw.patient_id,
    patientName: raw.patient_name,
    patientPhone: raw.patient_phone,
    triggerType: raw.trigger_type,
    severity: raw.severity,
    status: raw.status,
    afterHours: raw.after_hours,
    createdAt: raw.created_at,
    sourceMessage: raw.source_message,
  };
}

export async function listEscalations(statusFilter?: EscalationStatusValue): Promise<Escalation[]> {
  const query = statusFilter ? `?status_filter=${statusFilter}` : "";
  const raw = await request<RawEscalation[]>(`/admin/escalations${query}`);
  return raw.map(mapEscalation);
}

export async function ackEscalation(id: string, notes?: string): Promise<Escalation> {
  const raw = await request<RawEscalation>(`/admin/escalations/${id}/ack`, {
    method: "POST",
    body: JSON.stringify({ notes: notes ?? null }),
  });
  return mapEscalation(raw);
}

export async function resolveEscalation(id: string, notes?: string): Promise<Escalation> {
  const raw = await request<RawEscalation>(`/admin/escalations/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify({ notes: notes ?? null }),
  });
  return mapEscalation(raw);
}

// ── Clinical Content Panel ──────────────────────────────────────────────

export async function createMedicationOrder(
  input: MedicationOrderInput,
): Promise<{ id: string; drugName: string; status: string }> {
  const raw = await request<{ id: string; drug_name: string; status: string }>("/admin/clinical/medications", {
    method: "POST",
    body: JSON.stringify({
      patient_id: input.patientId,
      cycle_id: input.cycleId ?? null,
      drug_name: input.drugName,
      dose_value: input.doseValue,
      dose_unit: input.doseUnit,
      route: input.route,
      time_of_day: input.timeOfDay,
      start_date: input.startDate,
      end_date: input.endDate ?? null,
      is_critical: input.isCritical ?? false,
    }),
  });
  return { id: raw.id, drugName: raw.drug_name, status: raw.status };
}

export async function createLabResult(
  input: LabResultInput,
): Promise<{ id: string; testType: string; deliveryStatus: string }> {
  const raw = await request<{ id: string; test_type: string; delivery_status: string }>(
    "/admin/clinical/lab-results",
    {
      method: "POST",
      body: JSON.stringify({
        patient_id: input.patientId,
        cycle_id: input.cycleId ?? null,
        test_type: input.testType,
        report_file_url: input.reportFileUrl,
        doctor_note: input.doctorNote ?? null,
        is_sensitive: input.isSensitive ?? true,
      }),
    },
  );
  return { id: raw.id, testType: raw.test_type, deliveryStatus: raw.delivery_status };
}

interface RawAuditLog {
  id: string;
  actor_type: string;
  actor_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  created_at: string;
  extra: Record<string, unknown>;
}

export async function getAuditLog(patientId: string): Promise<AuditLogEntry[]> {
  const raw = await request<RawAuditLog[]>(`/admin/clinical/audit-log?patient_id=${patientId}`);
  return raw.map((r) => ({
    id: r.id,
    actorType: r.actor_type,
    actorId: r.actor_id,
    action: r.action,
    resourceType: r.resource_type,
    resourceId: r.resource_id,
    createdAt: r.created_at,
    extra: r.extra,
  }));
}

// ── Analytics ────────────────────────────────────────────────────────────

interface RawAnalyticsOverview {
  period_days: number;
  kpis: { total_leads: number; avg_response_minutes: number | null; no_show_rate_percent: number };
  funnel: { id: string; label: string; value: number }[];
  channels: AcquisitionChannel[];
}

export async function getAnalyticsOverview(days = 30): Promise<AnalyticsOverview> {
  const raw = await request<RawAnalyticsOverview>(`/admin/analytics/overview?days=${days}`);
  return {
    periodDays: raw.period_days,
    kpis: {
      totalLeads: raw.kpis.total_leads,
      avgResponseMinutes: raw.kpis.avg_response_minutes,
      noShowRatePercent: raw.kpis.no_show_rate_percent,
    },
    funnel: raw.funnel,
    channels: raw.channels,
  };
}

// ── Doctor call booking ─────────────────────────────────────────────────

interface RawCallAvailabilitySummary {
  availability_id: string;
  slots_created: number;
  eligible_patients: number;
  invites_sent: number;
  invites_failed: number;
}

export async function setCallAvailability(payload: {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  doctorId?: string;
}): Promise<CallAvailabilitySummary> {
  const raw = await request<RawCallAvailabilitySummary>("/admin/calls/availability", {
    method: "POST",
    body: JSON.stringify({
      date: payload.date, start_time: payload.startTime, end_time: payload.endTime,
      ...(payload.doctorId ? { doctor_id: payload.doctorId } : {}),
    }),
  });
  return {
    availabilityId: raw.availability_id, slotsCreated: raw.slots_created, eligiblePatients: raw.eligible_patients,
    invitesSent: raw.invites_sent, invitesFailed: raw.invites_failed,
  };
}

interface RawCallBooking {
  id: string;
  patient_id: string;
  phone: string;
  name: string | null;
  date: string;
  start_time: string;
  end_time: string;
  is_time_elapsed: boolean;
  is_reminder_sent: boolean;
  booked_at: string | null;
}

function mapCallBooking(raw: RawCallBooking): CallBooking {
  return {
    id: raw.id, patientId: raw.patient_id, phone: raw.phone, name: raw.name,
    date: raw.date, startTime: raw.start_time, endTime: raw.end_time,
    isTimeElapsed: raw.is_time_elapsed, isReminderSent: raw.is_reminder_sent, bookedAt: raw.booked_at,
  };
}

export async function getCurrentCallBookings(): Promise<CallBooking[]> {
  const raw = await request<RawCallBooking[]>("/admin/calls/bookings");
  return raw.map(mapCallBooking);
}

export async function getCallBookingHistory(): Promise<CallBooking[]> {
  const raw = await request<RawCallBooking[]>("/admin/calls/history");
  return raw.map(mapCallBooking);
}
