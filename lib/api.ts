import type {
  AcquisitionChannel,
  AnalyticsOverview,
  AppointmentSlotStatus,
  AuditLogEntry,
  BackendRole,
  CalendarWeek,
  Conversation,
  Escalation,
  EscalationSeverity,
  EscalationStatusValue,
  EscalationTrigger,
  LabResultInput,
  LanguageCode,
  LeadStatus,
  MedicationEntry,
  MedicationOrderInput,
  Message,
  Patient,
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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
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
}

function mapMessage(raw: RawMessage): Message {
  return {
    id: raw.id,
    sender: raw.direction === "IN" ? "patient" : "staff",
    text: raw.body ?? "",
    timestamp: raw.created_at,
    read: raw.direction === "OUT" ? raw.status === "READ" : undefined,
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

// ── Patients ─────────────────────────────────────────────────────────────

interface RawPatientSummary {
  id: string;
  phone: string;
  name: string | null;
  status: string;
  lead_status: LeadStatus;
  blood_group: string | null;
  preferred_language: LanguageCode;
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
  };
}

export async function listPatients(): Promise<Patient[]> {
  const raw = await request<RawPatientSummary[]>("/admin/patients");
  return raw.map(mapPatientSummary);
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
