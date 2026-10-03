"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ApiError, getToken, login as apiLogin, setToken } from "@/lib/api";
import type { BackendRole, StaffRole } from "@/types";

interface StaffUser {
  email: string;
  /** Bucketed UI persona — drives the sidebar/shell. */
  role: StaffRole;
  /** The real backend RBAC role (see app.models.enums.StaffRole in the API repo). */
  backendRole: BackendRole;
  title: string;
}

interface AuthContextValue {
  user: StaffUser | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const ROLE_KEY = "gokavi.auth.role";
const EMAIL_KEY = "gokavi.auth.email";

const ROLE_LABEL: Record<BackendRole, string> = {
  SUPERADMIN: "Super Admin",
  DOCTOR: "Doctor",
  NURSE: "Nurse",
  COUNSELOR: "Counselor",
  FRONT_DESK: "Front Desk",
  BILLING: "Billing",
};

// DOCTOR/NURSE/SUPERADMIN get the "doctor" persona (Pharmacy/Clinical
// Content unlocked); COUNSELOR/FRONT_DESK/BILLING get "receptionist"
// (Pharmacy locked). The backend enforces the real per-role permissions
// regardless — this bucketing only decides which sidebar/shell to render.
const CLINICAL_ROLES: BackendRole[] = ["DOCTOR", "NURSE", "SUPERADMIN"];

function personaFor(role: BackendRole): StaffRole {
  return CLINICAL_ROLES.includes(role) ? "doctor" : "receptionist";
}

function isBackendRole(value: string | null): value is BackendRole {
  return !!value && value in ROLE_LABEL;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = getToken();
      const storedRole = window.localStorage.getItem(ROLE_KEY);
      const storedEmail = window.localStorage.getItem(EMAIL_KEY);
      if (token && isBackendRole(storedRole) && storedEmail) {
        setUser({ email: storedEmail, role: personaFor(storedRole), backendRole: storedRole, title: ROLE_LABEL[storedRole] });
      }
    } catch {
      // localStorage unavailable — just start signed out.
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const result = await apiLogin(email, password);
      setToken(result.access_token);
      try {
        window.localStorage.setItem(ROLE_KEY, result.role);
        window.localStorage.setItem(EMAIL_KEY, email);
      } catch {
        // ignore — session just won't survive a refresh
      }
      setUser({ email, role: personaFor(result.role), backendRole: result.role, title: ROLE_LABEL[result.role] });
      return true;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to reach the Gokavi API. Check that the backend is running and NEXT_PUBLIC_API_URL is set.",
      );
      return false;
    }
  };

  const signOut = () => {
    setToken(null);
    try {
      window.localStorage.removeItem(ROLE_KEY);
      window.localStorage.removeItem(EMAIL_KEY);
    } catch {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
