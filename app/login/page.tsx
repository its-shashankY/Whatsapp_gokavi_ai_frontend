"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Icon } from "@/components/ui/Icon";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    const ok = await signIn(identifier, password);
    setSubmitting(false);
    if (ok) {
      router.push("/dashboard");
    } else {
      setFormError("Invalid credentials, or the Gokavi API isn't reachable. Please try again.");
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex items-center justify-center p-container-padding-mobile md:p-container-padding-desktop">
      <main className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgb(7,2,53,0.04)] border border-primary-fixed/20 overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-secondary-container to-primary-fixed" />
        <div className="p-8 md:p-10 flex flex-col gap-8 relative z-10">
          <header className="text-center flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-primary-fixed/30 flex items-center justify-center mb-2">
              <Icon name="health_and_safety" className="text-primary !text-3xl" filled />
            </div>
            <h1 className="font-headline-md text-headline-md text-primary m-0">Gokavi Hospital</h1>
            <p className="font-body-md text-body-md text-on-surface-variant m-0">
              Clinical Administration Portal
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-label-caps text-primary uppercase" htmlFor="identifier">
                Email
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <Icon name="person" className="!text-[20px]" />
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-transparent rounded-lg text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-lowest focus:border-primary-fixed focus:ring-2 focus:ring-primary-fixed/50 transition-all duration-200 outline-none font-body-md text-body-md"
                  id="identifier"
                  name="identifier"
                  placeholder="doctor@gokaviivf.example.com"
                  required
                  type="email"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-label-caps text-label-caps text-primary uppercase" htmlFor="password">
                  Password
                </label>
                <a className="font-body-md text-body-md text-secondary hover:text-secondary-container transition-colors text-sm" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <Icon name="lock" className="!text-[20px]" />
                </span>
                <input
                  className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-transparent rounded-lg text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-lowest focus:border-primary-fixed focus:ring-2 focus:ring-primary-fixed/50 transition-all duration-200 outline-none font-body-md text-body-md"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  aria-label="Toggle password visibility"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <Icon name={showPassword ? "visibility" : "visibility_off"} className="!text-[20px]" />
                </button>
              </div>
            </div>

            {formError && (
              <div className="bg-error-container text-on-error-container text-sm rounded-lg px-4 py-3 flex items-start gap-2">
                <Icon name="error" className="!text-[18px] mt-0.5 flex-shrink-0" />
                {formError}
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-fixed/50 bg-surface-container-low accent-primary cursor-pointer transition-colors"
                id="remember"
                name="remember"
                type="checkbox"
              />
              <label className="font-body-md text-body-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                Remember this device
              </label>
            </div>

            <button
              className="w-full py-3 px-6 mt-4 bg-primary text-on-primary rounded-lg font-button text-button shadow-[0_4px_14px_0_rgb(7,2,53,0.39)] hover:bg-primary-container hover:shadow-[0_6px_20px_rgb(7,2,53,0.23)] hover:-translate-y-[1px] active:translate-y-0 active:shadow-none transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign In"}
              {!submitting && <Icon name="arrow_forward" className="!text-[20px]" />}
            </button>
          </form>

          <div className="bg-surface-container-low rounded-lg p-4 text-xs text-on-surface-variant space-y-1">
            <p className="font-label-caps text-label-caps text-primary mb-2">Demo accounts (seed_demo.py)</p>
            <p>doctor@gokaviivf.example.com / DemoPass123! — Doctor</p>
            <p>frontdesk@gokaviivf.example.com / DemoPass123! — Front Desk</p>
          </div>

          <div className="text-center pt-2 border-t border-outline-variant/30">
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Need technical support?{" "}
              <a className="text-primary font-medium hover:underline decoration-primary-fixed underline-offset-4" href="#">
                Contact IT Helpdesk
              </a>
            </p>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary-fixed/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary-fixed/10 rounded-full blur-3xl pointer-events-none" />
      </main>
    </div>
  );
}
