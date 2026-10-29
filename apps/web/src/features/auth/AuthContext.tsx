import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../data/supabase";

export type Profile = {
  id: string;
  display_name: string;
  theme_mode: "auto" | "light" | "dark";
  glass_mode: "on" | "reduced" | "off";
  accent_color: string;
};

type AuthState = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  updateProfile: (changes: Partial<Omit<Profile, "id">>) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;
    let active = true;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (!active) return;
        setProfile(data as Profile | null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  async function updateProfile(changes: Partial<Omit<Profile, "id">>) {
    if (!userId) return;
    setProfile((p) => (p ? { ...p, ...changes } : p));
    await supabase
      .from("profiles")
      .update({ ...changes, updated_at: new Date().toISOString() })
      .eq("id", userId);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading, updateProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return ctx;
}