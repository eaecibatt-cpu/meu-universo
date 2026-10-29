import { useEffect } from "react";
import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import AuthPage from "./features/auth/AuthPage";
import HomeCards from "./features/home/HomeCards";

const DEFAULT_ACCENT = "#0078d4";

const ACCENTS = [
  { name: "Azul Windows", value: "#0078d4" },
  { name: "Ciano", value: "#0891b2" },
  { name: "Verde", value: "#16a34a" },
  { name: "Laranja", value: "#ea580c" },
  { name: "Rosa", value: "#db2777" },
  { name: "Grafite", value: "#475569" },
];

function Home() {
  const { profile, updateProfile, signOut } = useAuth();

  const mode = profile?.theme_mode ?? "auto";
  const glass = profile?.glass_mode ?? "on";
  const accent = profile?.accent_color || DEFAULT_ACCENT;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = mode === "dark" || (mode === "auto" && media.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [mode]);

  useEffect(() => {
    document.documentElement.dataset.glass = glass;
  }, [glass]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    return () => document.documentElement.style.removeProperty("--accent");
  }, [accent]);

  return (
    <div className="app">
      <div className="topbar">
        <h1>Bem-vindo, {profile?.display_name || "você"}!</h1>
        <button onClick={signOut}>Sair</button>
      </div>

      <div className="settings">
        <label>
          Tema:
          <select
            value={mode}
            onChange={(e) => updateProfile({ theme_mode: e.target.value as "auto" | "light" | "dark" })}
          >
            <option value="auto">Automático</option>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </label>
        <label>
          Liquid Glass:
          <select
            value={glass}
            onChange={(e) => updateProfile({ glass_mode: e.target.value as "on" | "reduced" | "off" })}
          >
            <option value="on">Ativado</option>
            <option value="reduced">Reduzido</option>
            <option value="off">Desativado</option>
          </select>
        </label>
        <div className="swatches" role="group" aria-label="Cor de destaque">
          Cor:
          {ACCENTS.map((a) => (
            <button
              key={a.value}
              type="button"
              className="swatch"
              style={{ background: a.value }}
              title={a.name}
              aria-label={a.name}
              aria-pressed={accent.toLowerCase() === a.value}
              onClick={() => updateProfile({ accent_color: a.value })}
            />
          ))}
        </div>
      </div>

      <HomeCards />
    </div>
  );
}

function Gate() {
  const { session, loading } = useAuth();
  if (loading) return <div className="app"><p>Carregando...</p></div>;
  return session ? <Home /> : <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}