export type StaffRole = "doctor" | "receptionist";

export type LeadStatus =
  | "cold_lead"
  | "warm_lead"
  | "booked"
  | "existing_patient"
  | "dormant";

export type PriorityLevel = "critical" | "urgent" | "standard";

export type LanguageCode = "EN" | "HI" | "KN";

export interface ConsentItem {
  id: string;
  label: string;
  description: string;
  granted: boolean;
}

export interface Message {
  id: string;
  sender: "patient" | "staff" | "system";
  text: string;
  timestamp: string;
  language?: LanguageCode;
  read?: boolean;
}

export interface Conversation {
  id: string;
  patientId: string;
  patientName: string;
  avatarUrl?: string;
  status: LeadStatus;
  language: LanguageCode;
  lastMessageAt: string;
  online?: boolean;
  channel: "WhatsApp";
  messages: Message[];
}

export interface MedicationEntry {
  id: string;
  name: string;
  dosage: string;
  status: "Active" | "Completed";
  icon: string;
}

export interface CycleStep {
  id: string;
  label: string;
  detail: string;
  state: "completed" | "current" | "upcoming";
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  cycleLabel: string;
  status: LeadStatus;
  avatarUrl?: string;
  email: string;
  phone: string;
  language: LanguageCode;
  allergies?: string;
  consents: ConsentItem[];
  cycle: CycleStep[];
  medications: MedicationEntry[];
  comms: Message[];
}

export type AppointmentSlotStatus = "available" | "booked" | "blocked";

export interface AppointmentSlot {
  id: string;
  time: string;
  status: AppointmentSlotStatus;
  patientName?: string;
}

export interface DayColumn {
  day: string;
  date: number;
  closed?: boolean;
  slots: AppointmentSlot[];
}

export interface TriageCase {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  sex: "F" | "M";
  priority: PriorityLevel;
  levelLabel: string;
  waitTime: string;
  complaint: string;
  vitals: { label: string; value: string }[];
}

export interface AuditLogEntry {
  id: string;
  icon: string;
  text: string;
  meta: string;
  color?: string;
}

export interface AcquisitionChannel {
  id: string;
  label: string;
  icon: string;
  percent: number;
  colorClass: string;
}

export interface FunnelStage {
  id: string;
  label: string;
  icon: string;
  value: number;
  widthPercent: number;
  conversionLabel?: string;
  gradient: string;
  textClass: string;
}
