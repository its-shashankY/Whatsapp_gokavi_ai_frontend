import type {
  AcquisitionChannel,
  AppointmentSlot,
  AuditLogEntry,
  Conversation,
  DayColumn,
  FunnelStage,
  LeadStatus,
  Patient,
  TriageCase,
} from "@/types";

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  cold_lead: "Cold Lead",
  warm_lead: "Warm Lead",
  booked: "Booked",
  existing_patient: "Existing",
  dormant: "Dormant",
};

// --- Patients -------------------------------------------------------------

export const patients: Patient[] = [
  {
    id: "P-84729",
    name: "Sarah Jenkins",
    age: 32,
    bloodGroup: "O+",
    cycleLabel: "IVF Cycle 2",
    status: "warm_lead",
    email: "sarah.j@example.com",
    phone: "+1 (555) 019-2834",
    language: "EN",
    consents: [
      {
        id: "personal-data",
        label: "Personal Data",
        description: "HIPAA compliant processing",
        granted: true,
      },
      {
        id: "clinical-photos",
        label: "Clinical Photos",
        description: "For medical records only",
        granted: true,
      },
      {
        id: "marketing",
        label: "Marketing",
        description: "Newsletters & updates",
        granted: false,
      },
    ],
    cycle: [
      { id: "stim", label: "Stimulation Phase", detail: "Completed Oct 12", state: "completed" },
      { id: "retrieval", label: "Egg Retrieval", detail: "Scheduled Today, 10:00 AM", state: "current" },
      { id: "transfer", label: "Embryo Transfer", detail: "Pending", state: "upcoming" },
    ],
    medications: [
      { id: "gonal-f", name: "Gonal-f RFF", dosage: "150 IU SubQ Daily", status: "Active", icon: "medication_liquid" },
      { id: "cetrotide", name: "Cetrotide", dosage: "0.25 mg SubQ Daily", status: "Completed", icon: "vaccines" },
    ],
    comms: [
      {
        id: "m1",
        sender: "system",
        text: "Automated reminder sent for Egg Retrieval appointment tomorrow at 10:00 AM.",
        timestamp: "Today",
      },
      {
        id: "m2",
        sender: "patient",
        text: "Hi Dr. Reynolds, I took my trigger shot exactly at 9:00 PM as instructed. I am feeling a bit bloated though, is that normal?",
        timestamp: "08:14 AM",
      },
      {
        id: "m3",
        sender: "staff",
        text: "Good morning Sarah. Yes, feeling bloated after the trigger shot is very common as your ovaries are enlarged. Try to rest today and drink plenty of fluids with electrolytes.",
        timestamp: "08:30 AM",
        read: true,
      },
      {
        id: "m4",
        sender: "staff",
        text: "Please remember no food or drink after midnight tonight in preparation for tomorrow.",
        timestamp: "08:31 AM",
        read: true,
      },
    ],
  },
  {
    id: "P-55210",
    name: "Priya Sharma",
    age: 27,
    bloodGroup: "B+",
    cycleLabel: "Antenatal - 12 weeks",
    status: "warm_lead",
    email: "priya.sharma@example.com",
    phone: "+91 98450 21837",
    language: "EN",
    consents: [
      { id: "personal-data", label: "Personal Data", description: "HIPAA compliant processing", granted: true },
      { id: "clinical-photos", label: "Clinical Photos", description: "For medical records only", granted: false },
      { id: "marketing", label: "Marketing", description: "Newsletters & updates", granted: true },
    ],
    cycle: [
      { id: "booking", label: "Antenatal Registration", detail: "Completed Sep 30", state: "completed" },
      { id: "scan", label: "Anomaly Scan", detail: "Scheduled Oct 28", state: "current" },
      { id: "delivery", label: "Delivery Planning", detail: "Pending", state: "upcoming" },
    ],
    medications: [
      { id: "folic-acid", name: "Folic Acid", dosage: "5 mg Once Daily", status: "Active", icon: "medication" },
      { id: "iron", name: "Iron + Vitamin C", dosage: "60 mg Once Daily", status: "Active", icon: "medication_liquid" },
    ],
    comms: [
      {
        id: "m1",
        sender: "patient",
        text: "Hi, I saw your ad for the antenatal care packages on Facebook. I'm currently 12 weeks pregnant and looking for options near Indiranagar.",
        timestamp: "10:30 AM",
      },
      {
        id: "m2",
        sender: "staff",
        text: "Hello Priya! Congratulations on your pregnancy. We would be happy to help you. We have a comprehensive 'Blissful Beginnings' package that covers everything from routine scans to delivery.",
        timestamp: "10:35 AM",
        read: true,
      },
      {
        id: "m3",
        sender: "staff",
        text: "Would you like me to share the brochure with the detailed inclusions and pricing?",
        timestamp: "10:35 AM",
        read: true,
      },
      {
        id: "m4",
        sender: "patient",
        text: "Yes, please. That would be helpful. Also, do you have lady doctors available for consultation on weekends?",
        timestamp: "10:42 AM",
      },
    ],
  },
  {
    id: "P-30981",
    name: "ರಾಧಿಕಾ ನಾಯ್ಕ (Radhika Naik)",
    age: 29,
    bloodGroup: "A+",
    cycleLabel: "IUI Cycle 1",
    status: "cold_lead",
    email: "radhika.naik@example.com",
    phone: "+91 90080 11223",
    language: "KN",
    consents: [
      { id: "personal-data", label: "Personal Data", description: "HIPAA compliant processing", granted: true },
      { id: "clinical-photos", label: "Clinical Photos", description: "For medical records only", granted: false },
      { id: "marketing", label: "Marketing", description: "Newsletters & updates", granted: false },
    ],
    cycle: [
      { id: "consult", label: "Initial Consultation", detail: "Requested Oct 20", state: "current" },
      { id: "workup", label: "Fertility Workup", detail: "Pending", state: "upcoming" },
      { id: "iui", label: "IUI Procedure", detail: "Pending", state: "upcoming" },
    ],
    medications: [],
    comms: [
      {
        id: "m1",
        sender: "patient",
        text: "ಸಮಾಲೋಚನೆಗೆ ಎಷ್ಟು ಖರ್ಚಾಗುತ್ತದೆ?",
        timestamp: "Yesterday",
        language: "KN",
      },
      {
        id: "m2",
        sender: "staff",
        text: "ನಮಸ್ಕಾರ! ಆರಂಭಿಕ ಸಮಾಲೋಚನೆ ಶುಲ್ಕ ₹800. ನಾವು ನಿಮಗೆ ಈ ವಾರಾಂತ್ಯದಲ್ಲಿ ಸ್ಲಾಟ್ ಒದಗಿಸಬಹುದು.",
        timestamp: "Yesterday",
        read: true,
      },
    ],
  },
  {
    id: "P-40218",
    name: "Rahul Desai",
    age: 35,
    bloodGroup: "AB+",
    cycleLabel: "Follow-up Care",
    status: "existing_patient",
    email: "rahul.desai@example.com",
    phone: "+91 99720 44561",
    language: "HI",
    consents: [
      { id: "personal-data", label: "Personal Data", description: "HIPAA compliant processing", granted: true },
      { id: "clinical-photos", label: "Clinical Photos", description: "For medical records only", granted: true },
      { id: "marketing", label: "Marketing", description: "Newsletters & updates", granted: true },
    ],
    cycle: [
      { id: "delivery", label: "Delivery", detail: "Completed Sep 02", state: "completed" },
      { id: "postnatal", label: "Postnatal Check-up", detail: "Completed Oct 05", state: "completed" },
      { id: "vaccination", label: "Newborn Vaccination", detail: "Scheduled Oct 24", state: "current" },
    ],
    medications: [
      { id: "multivitamin", name: "Postnatal Multivitamin", dosage: "1 tablet Daily", status: "Active", icon: "medication" },
    ],
    comms: [
      {
        id: "m1",
        sender: "staff",
        text: "आपकी अगली अपॉइंटमेंट कल सुबह 10 बजे है, कृपया समय पर पहुँचें।",
        timestamp: "Yesterday",
      },
      {
        id: "m2",
        sender: "patient",
        text: "धन्यवाद. See you tomorrow at 10.",
        timestamp: "Yesterday",
        read: true,
        language: "HI",
      },
    ],
  },
  {
    id: "P-27744",
    name: "Anitha Reddy",
    age: 31,
    bloodGroup: "B-",
    cycleLabel: "IVF Cycle 1",
    status: "booked",
    email: "anitha.reddy@example.com",
    phone: "+91 98867 33210",
    language: "EN",
    consents: [
      { id: "personal-data", label: "Personal Data", description: "HIPAA compliant processing", granted: true },
      { id: "clinical-photos", label: "Clinical Photos", description: "For medical records only", granted: true },
      { id: "marketing", label: "Marketing", description: "Newsletters & updates", granted: false },
    ],
    cycle: [
      { id: "docs", label: "Document Verification", detail: "Completed Oct 21", state: "completed" },
      { id: "baseline", label: "Baseline Scan", detail: "Scheduled Oct 25", state: "current" },
      { id: "stim", label: "Stimulation Phase", detail: "Pending", state: "upcoming" },
    ],
    medications: [],
    comms: [
      {
        id: "m1",
        sender: "patient",
        text: "Documents attached as requested.",
        timestamp: "Yesterday",
      },
      {
        id: "m2",
        sender: "staff",
        text: "Thank you Anitha, everything looks in order. We've booked your baseline scan for Oct 25, 9:00 AM.",
        timestamp: "Yesterday",
        read: true,
      },
    ],
  },
  {
    id: "P-19053",
    name: "Anonymous User",
    age: 0,
    bloodGroup: "-",
    cycleLabel: "Not registered",
    status: "cold_lead",
    email: "unknown@example.com",
    phone: "+91 90000 00000",
    language: "KN",
    consents: [
      { id: "personal-data", label: "Personal Data", description: "HIPAA compliant processing", granted: false },
      { id: "clinical-photos", label: "Clinical Photos", description: "For medical records only", granted: false },
      { id: "marketing", label: "Marketing", description: "Newsletters & updates", granted: false },
    ],
    cycle: [],
    medications: [],
    comms: [
      { id: "m1", sender: "patient", text: "Cost of consultation?", timestamp: "Yesterday", language: "KN" },
    ],
  },
  {
    id: "P-60119",
    name: "Meena Iyer",
    age: 38,
    bloodGroup: "O-",
    cycleLabel: "IVF - On hold",
    status: "dormant",
    email: "meena.iyer@example.com",
    phone: "+91 97401 22890",
    language: "EN",
    consents: [
      { id: "personal-data", label: "Personal Data", description: "HIPAA compliant processing", granted: true },
      { id: "clinical-photos", label: "Clinical Photos", description: "For medical records only", granted: false },
      { id: "marketing", label: "Marketing", description: "Newsletters & updates", granted: false },
    ],
    cycle: [
      { id: "consult", label: "Initial Consultation", detail: "Completed Aug 02", state: "completed" },
      { id: "hold", label: "Cycle Paused", detail: "Patient requested pause", state: "current" },
    ],
    medications: [],
    comms: [
      {
        id: "m1",
        sender: "patient",
        text: "We'd like to pause treatment for a couple of months, will reach out when ready.",
        timestamp: "3 weeks ago",
      },
    ],
  },
];

export const getPatientById = (id: string) => patients.find((p) => p.id === id);

// --- Inbox conversations ----------------------------------------------------

export const conversations: Conversation[] = [
  {
    id: "c1",
    patientId: "P-55210",
    patientName: "Priya Sharma",
    status: "warm_lead",
    language: "EN",
    lastMessageAt: "10:42 AM",
    online: true,
    channel: "WhatsApp",
    messages: patients[1].comms,
  },
  {
    id: "c2",
    patientId: "P-40218",
    patientName: "Rahul Desai",
    status: "existing_patient",
    language: "HI",
    lastMessageAt: "09:15 AM",
    channel: "WhatsApp",
    messages: patients[3].comms,
  },
  {
    id: "c3",
    patientId: "P-19053",
    patientName: "Anonymous User",
    status: "cold_lead",
    language: "KN",
    lastMessageAt: "Yesterday",
    channel: "WhatsApp",
    messages: patients[5].comms,
  },
  {
    id: "c4",
    patientId: "P-27744",
    patientName: "Anitha Reddy",
    status: "booked",
    language: "EN",
    lastMessageAt: "Yesterday",
    channel: "WhatsApp",
    messages: patients[4].comms,
  },
  {
    id: "c5",
    patientId: "P-30981",
    patientName: "ರಾಧಿಕಾ ನಾಯ್ಕ (Radhika Naik)",
    status: "cold_lead",
    language: "KN",
    lastMessageAt: "Yesterday",
    channel: "WhatsApp",
    messages: patients[2].comms,
  },
  {
    id: "c6",
    patientId: "P-60119",
    patientName: "Meena Iyer",
    status: "dormant",
    language: "EN",
    lastMessageAt: "3 weeks ago",
    channel: "WhatsApp",
    messages: patients[6].comms,
  },
];

// --- Calendar ---------------------------------------------------------------

const slot = (
  id: string,
  time: string,
  status: AppointmentSlot["status"],
  patientName?: string,
): AppointmentSlot => ({ id, time, status, patientName });

export const calendarWeek: DayColumn[] = [
  {
    day: "MON",
    date: 23,
    slots: [
      slot("mon-9", "09:00 AM", "booked", "A. Gupta"),
      slot("mon-10", "10:00 AM", "available"),
      slot("mon-11", "11:00 AM", "blocked"),
    ],
  },
  {
    day: "TUE",
    date: 24,
    slots: [
      slot("tue-9", "09:00 AM", "available"),
      slot("tue-10", "10:00 AM", "booked", "R. Singh"),
    ],
  },
  {
    day: "WED",
    date: 25,
    slots: [slot("wed-9", "09:00 AM", "available")],
  },
  {
    day: "THU",
    date: 26,
    slots: [slot("thu-9", "09:00 AM", "booked", "M. Patel")],
  },
  {
    day: "FRI",
    date: 27,
    slots: [
      slot("fri-9", "09:00 AM", "available"),
      slot("fri-10", "10:00 AM", "booked", "ಸುನಿತಾ ರಾವ್"),
    ],
  },
  {
    day: "SAT",
    date: 28,
    slots: [slot("sat-9", "09:00 AM", "available")],
  },
  {
    day: "SUN",
    date: 29,
    closed: true,
    slots: [],
  },
];

// --- Triage / Escalation queue ------------------------------------------

export const triageCases: TriageCase[] = [
  {
    id: "t1",
    patientName: "E. Montgomery",
    patientId: "882-901-A",
    age: 34,
    sex: "F",
    priority: "critical",
    levelLabel: "Level 1 Resus",
    waitTime: "04:12",
    complaint: "Severe abdominal pain, bleeding (32w gestation). BP dropping.",
    vitals: [
      { label: "BP", value: "85/50" },
      { label: "HR", value: "125" },
    ],
  },
  {
    id: "t2",
    patientName: "Kavya Menon",
    patientId: "882-902-B",
    age: 29,
    sex: "F",
    priority: "critical",
    levelLabel: "Level 1 Resus",
    waitTime: "07:48",
    complaint: "Reduced fetal movement reported for 6+ hours (36w gestation).",
    vitals: [
      { label: "BP", value: "142/92" },
      { label: "HR", value: "110" },
    ],
  },
  {
    id: "t3",
    patientName: "ಶ್ವೇತಾ ಹೆಗ್ಡೆ",
    patientId: "882-903-C",
    age: 26,
    sex: "F",
    priority: "urgent",
    levelLabel: "Level 2 Urgent",
    waitTime: "12:05",
    complaint: "OHSS symptoms after egg retrieval - bloating, nausea, low urine output.",
    vitals: [
      { label: "BP", value: "118/76" },
      { label: "HR", value: "98" },
    ],
  },
  {
    id: "t4",
    patientName: "Fatima Sheikh",
    patientId: "882-904-D",
    age: 33,
    sex: "F",
    priority: "urgent",
    levelLabel: "Level 2 Urgent",
    waitTime: "18:30",
    complaint: "Spotting at 9 weeks, patient anxious, requesting urgent scan.",
    vitals: [
      { label: "BP", value: "110/70" },
      { label: "HR", value: "88" },
    ],
  },
  {
    id: "t5",
    patientName: "Neha Kulkarni",
    patientId: "882-905-E",
    age: 30,
    sex: "F",
    priority: "urgent",
    levelLabel: "Level 2 Urgent",
    waitTime: "21:10",
    complaint: "Fever 101.5°F, 3 days post embryo transfer.",
    vitals: [
      { label: "BP", value: "116/74" },
      { label: "HR", value: "102" },
    ],
  },
  {
    id: "t6",
    patientName: "अंजलि वर्मा",
    patientId: "882-906-F",
    age: 28,
    sex: "F",
    priority: "standard",
    levelLabel: "Level 3 Standard",
    waitTime: "34:52",
    complaint: "Routine follow-up query on medication schedule, no red flags.",
    vitals: [
      { label: "BP", value: "112/72" },
      { label: "HR", value: "80" },
    ],
  },
];

export const triageSummary = {
  critical: triageCases.filter((c) => c.priority === "critical").length + 1,
  urgent: triageCases.filter((c) => c.priority === "urgent").length + 6,
};

// --- Clinical panel -----------------------------------------------------

export const clinicalPatient = {
  name: "Maya Lin",
  dob: "12-Oct-1985 (38Y)",
  mrn: "GH-2023-8891",
  cycleDay: "IVF Cycle: Day 14",
  allergies: "Allergies: Penicillin",
};

export const auditLog: AuditLogEntry[] = [
  { id: "a1", icon: "login", text: "Secure session initiated", meta: "10:42 AM - IP: 192.168.1.4" },
  { id: "a2", icon: "visibility", text: "Accessed patient record", meta: "10:43 AM - MRN: GH-2023-8891" },
  { id: "a3", icon: "prescriptions", text: "Draft medication order created", meta: "10:47 AM - Gonal-f RFF" },
];

// --- Analytics ------------------------------------------------------------

export const analyticsKpis = [
  {
    id: "leads",
    label: "Total Leads",
    value: "1,248",
    icon: "person_add",
    trend: "12.5%",
    trendDirection: "up" as const,
    trendGood: true,
    accent: "border-secondary-container",
    iconBg: "bg-secondary-fixed",
    iconColor: "text-on-secondary-container",
  },
  {
    id: "response",
    label: "Avg Response Time",
    value: "14",
    suffix: "mins",
    icon: "timer",
    trend: "2.3m",
    trendDirection: "down" as const,
    trendGood: true,
    accent: "border-primary-fixed-dim",
    iconBg: "bg-primary-fixed",
    iconColor: "text-on-primary-fixed",
  },
  {
    id: "noshow",
    label: "No-Show Rate",
    value: "8.4%",
    icon: "event_busy",
    trend: "1.1%",
    trendDirection: "up" as const,
    trendGood: false,
    accent: "border-error-container",
    iconBg: "bg-error-container",
    iconColor: "text-on-error-container",
  },
];

export const funnelStages: FunnelStage[] = [
  {
    id: "cold",
    label: "Cold Lead",
    icon: "public",
    value: 1248,
    widthPercent: 100,
    gradient: "linear-gradient(90deg, #1e1b4b 0%, #28006e 100%)",
    textClass: "text-on-primary",
  },
  {
    id: "warm",
    label: "Warm Lead",
    icon: "waving_hand",
    value: 890,
    widthPercent: 85,
    conversionLabel: "71%",
    gradient: "linear-gradient(90deg, #444173 0%, #4f319c 100%)",
    textClass: "text-on-primary",
  },
  {
    id: "booked",
    label: "Booked",
    icon: "event_available",
    value: 534,
    widthPercent: 60,
    conversionLabel: "60%",
    gradient: "linear-gradient(90deg, #8683ba 0%, #9377e4 100%)",
    textClass: "text-on-primary-fixed-variant",
  },
  {
    id: "converted",
    label: "Converted",
    icon: "favorite",
    value: 312,
    widthPercent: 40,
    conversionLabel: "58%",
    gradient: "#a93349",
    textClass: "text-on-secondary",
  },
];

export const acquisitionChannels: AcquisitionChannel[] = [
  { id: "organic", label: "Organic Search", icon: "search", percent: 45, colorClass: "bg-tertiary-container" },
  { id: "social", label: "Social Referral", icon: "share", percent: 30, colorClass: "bg-primary-container" },
  { id: "paid", label: "Paid Ads", icon: "campaign", percent: 25, colorClass: "bg-secondary" },
];
