// Backend's real RBAC roles (app.models.enums.StaffRole in the API repo).
export type BackendRole =
  | "SUPERADMIN"
  | "DOCTOR"
  | "NURSE"
  | "COUNSELOR"
  | "FRONT_DESK"
  | "BILLING";

// Bucketed UI persona the sidebar/shell render around. DOCTOR/NURSE/SUPERADMIN
// get the "doctor" persona (Pharmacy/Clinical Content unlocked); COUNSELOR/
// FRONT_DESK/BILLING get "receptionist" (Pharmacy locked). See lib/auth.tsx.
export type StaffRole = "doctor" | "receptionist";

export type LeadStatus =
  | "cold_lead"
  | "warm_lead"
  | "booked"
  | "existing_patient"
  | "dormant";

export type LanguageCode = "en" | "hi" | "kn";

export interface ConsentItem {
  id: string;
  label: string;
  description: string;
  granted: boolean;
  updatedAt?: string | null;
}

export interface Message {
  id: string;
  sender: "patient" | "staff";
  text: string;
  timestamp: string;
  read?: boolean;
}

export interface Conversation {
  patientId: string;
  patientName: string | null;
  phone: string;
  status: LeadStatus;
  language: LanguageCode;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  unreadCount: number;
}

export interface MedicationEntry {
  id: string;
  name: string;
  dosage: string;
  status: "ACTIVE" | "SUPERSEDED" | "COMPLETED" | "CANCELLED";
}

export interface CycleStep {
  id: string;
  label: string;
  detail: string;
  state: "completed" | "current" | "upcoming";
}

export interface PatientReportEntry {
  id: string;
  mediaType: "image" | "document" | "audio" | "video";
  filename: string | null;
  createdAt: string;
  /** Time-limited signed URL — null if archiving wasn't configured or failed;
   * staff fall back to the WhatsApp conversation itself in that case. */
  downloadUrl: string | null;
}

export interface Patient {
  id: string;
  name: string | null;
  age: number | null;
  gender: string | null;
  bloodGroup: string | null;
  cycleLabel: string | null;
  status: LeadStatus;
  rawStatus: string;
  email?: string | null;
  phone: string;
  language: LanguageCode;
  consents: ConsentItem[];
  hasReports: boolean;
  reports?: PatientReportEntry[];
  /** True when app.services.condition_detection flagged a condition mentioned
   * in the patient's chat, in English or Kannada — see detectedCondition. */
  hasDiseaseMentioned: boolean;
  detectedCondition?: string | null;
  /** Verbatim patient message that led to the detection, for staff to verify. */
  conditionEvidence?: string | null;
  /** Staff's own manual "have I dealt with this one" tracking — independent
   * of status/rawStatus, which reflect the patient's own lead/clinical state. */
  followUpStatus: FollowUpStatus;
  /** Present only when the viewing role can see clinical notes (doctor/nurse/superadmin). */
  cycle?: CycleStep[];
  medications?: MedicationEntry[];
}

export type FollowUpStatus = "NOT_TOUCHED" | "ON_HOLD" | "COMPLETED";

export type AppointmentSlotStatus = "available" | "booked" | "blocked";

export interface AppointmentSlot {
  id: string;
  time: string;
  status: AppointmentSlotStatus;
  patientName?: string | null;
  appointmentId?: string | null;
}

export interface DayColumn {
  day: string;
  date: number;
  closed?: boolean;
  slots: AppointmentSlot[];
}

export interface CalendarWeek {
  doctorId: string;
  doctorName: string;
  weekStart: string;
  weekEnd: string;
  days: DayColumn[];
}

export type EscalationTrigger =
  | "RED_FLAG_SYMPTOM"
  | "MISSED_CRITICAL_DOSE"
  | "HUMAN_REQUEST"
  | "SENTIMENT_DISTRESS"
  | "CYCLE_CANCELLATION"
  | "NO_SHOW_PATTERN";

export type EscalationSeverity = "CRITICAL" | "HIGH" | "NORMAL";
export type EscalationStatusValue = "OPEN" | "ACKED" | "RESOLVED";

export interface Escalation {
  id: string;
  patientId: string;
  patientName: string | null;
  patientPhone: string;
  triggerType: EscalationTrigger;
  severity: EscalationSeverity;
  status: EscalationStatusValue;
  afterHours: boolean;
  createdAt: string;
  sourceMessage: string | null;
}

export interface AuditLogEntry {
  id: string;
  actorType: string;
  actorId: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  createdAt: string;
  extra: Record<string, unknown>;
}

export interface AcquisitionChannel {
  source: string;
  count: number;
  percent: number;
}

export interface FunnelStage {
  id: string;
  label: string;
  value: number;
}

export interface AnalyticsOverview {
  periodDays: number;
  kpis: {
    totalLeads: number;
    avgResponseMinutes: number | null;
    noShowRatePercent: number;
  };
  funnel: FunnelStage[];
  channels: AcquisitionChannel[];
}

export interface MedicationOrderInput {
  patientId: string;
  cycleId?: string | null;
  drugName: string;
  doseValue: number;
  doseUnit: string;
  route: string;
  timeOfDay: string; // "HH:MM:SS"
  startDate: string; // "YYYY-MM-DD"
  endDate?: string | null;
  isCritical?: boolean;
}

export interface LabResultInput {
  patientId: string;
  cycleId?: string | null;
  testType: string;
  reportFileUrl: string;
  doctorNote?: string | null;
  isSensitive?: boolean;
}
