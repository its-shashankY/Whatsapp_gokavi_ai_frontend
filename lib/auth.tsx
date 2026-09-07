"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { StaffRole } from "@/types";

interface StaffUser {
  name: string;
  role: StaffRole;
  title: string;
}

interface AuthContextValue {
  user: StaffUser | null;
  isLoading: boolean;
  /**
   * Placeholder auth: accepts any identifier/password and signs the user
   * in as the selected role. Real authentication (credentials, sessions,
   * hospital SSO) is not implemented yet.
   */
  signIn: (identifier: string, role: StaffRole) => void;
  signOut: () => void;
}

const STORAGE_KEY = "gokavi.auth.session";

const ROLE_PROFILES: Record<StaffRole, StaffUser> = {
  doctor: { name: "Dr. A. Sharma", role: "doctor", title: "Clinical Administrator" },
  receptionist: { name: "A. Jensen", role: "receptionist", title: "Receptionist" },
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const role = JSON.parse(stored).role as StaffRole;
        if (role === "doctor" || role === "receptionist") {
          setUser(ROLE_PROFILES[role]);
        }
      }
    } catch {
      // ignore malformed/unavailable storage
    }
    setIsLoading(false);
  }, []);

  const signIn = (_identifier: string, role: StaffRole) => {
    const profile = ROLE_PROFILES[role];
    setUser(profile);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ role }));
    } catch {
      // ignore
    }
  };

  const signOut = () => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
